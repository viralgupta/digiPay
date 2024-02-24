import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useRouter } from 'next/router';
import Userverify from './userverify';

const Verify = () => {
  const router = useRouter()
  const videoRef = useRef(null);
  const photoref = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [booked, setBooked] = useState(false)
  const [user, setUserdetails] = useState(null)
  const [amount, setAmount] = useState(100)
  const [reason, setReason] = useState("Rice Payment")
  const toastconfig = {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark"
  }

  const getVideo = () => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: 'environment', width: 720, height: 720 },
          audio: false
        })
        .then((stream) => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
          };
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      toast.error('getUserMedia is not supported in this browser.', toastconfig);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const photo = photoref.current;

    let ctx = photo.getContext('2d');
    const aspectRatio = video.videoWidth / video.videoHeight;

    const canvasWidth = 720;
    const canvasHeight = canvasWidth / aspectRatio;

    photo.width = canvasWidth;
    photo.height = canvasHeight;

    ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);

    setHasPhoto(true);
    getUser()
  };

  const clearCanvas = () => {
    setBooked(false)
    setAmount(100)
    setReason("")
    setUserdetails(null)
    const photo = photoref.current;
    let ctx = photo.getContext('2d');
    ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
    getVideo();
  };


  const getUser = async () => {
    if (booked) {
      toast.error("Please wait...", toastconfig);
      return;
    }
    try {
      setBooked(true)
      const photoCanvas = photoref.current;
      const formData = new FormData();
      formData.append("fileContent", dataURLtoFile(photoCanvas.toDataURL()));

      const headers = {
        Accept: "application/json",
      };

      const response = await axios.post("/api/seller/finduser", formData, {
        headers: headers,
      });

      if (response.data.success === true) {
        setUserdetails(response.data.user)
      }
      else if (response.data.success === false) {
        toast.info(response.data.message, toastconfig)
        clearCanvas()
      }
      else {
        toast.error("Could not find a User!", toastconfig);
        clearCanvas()
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while verifying. Please try again later.", toastconfig);
      clearCanvas()
    }
  };

  function dataURLtoFile(dataURL) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "userPhoto.png", { type: mime });
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    let token = localStorage.getItem('token');
    if (!user || !token) {
      router.push('/login')
    }
    else {
      clearCanvas()
    }
    // eslint-disable-next-line
  }, [])

  const confirmPayment = async () => {
    const token = localStorage.getItem('token');

    const u = JSON.parse(localStorage.getItem("user"))
    const res = await axios.post("/api/seller/createpayment", {
      id: u._id,
      buyerId: user._id,
      amount: amount,
      reason
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "69420"
    }
    })
    if (res.status === 200) {
      toast.success(`Transaction Complete! Thankyou ${user.name}`, toastconfig)
      setUserdetails(null)
      clearCanvas()
    }

  }
  const cancelBooking = async () => {
    clearCanvas()
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {user && <Userverify name={user.name} setAmount={setAmount} amount={amount} setReason={setReason} reason={reason} confirm={confirmPayment} cancel={cancelBooking} />}
      <div className="bg-gray-700 h-screen w-full">
        <div className="font-extrabold text-xl text-center text-white p-5 md:mb-16">Get Payment</div>
        <div className="md:flex md:justify-center">
          <div className="border-8 border-[#8c8273] rounded-md">
            <div className="aspect-square md:h-96 overflow-hidden">
              {!hasPhoto && <video ref={videoRef}></video>}
              <canvas ref={photoref} className="w-full h-auto"></canvas>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4">
            <button className="p-2 text-white bg-gray-500 rounded-md mr-2" onClick={takePhoto}>Snap!</button>
            <button onClick={clearCanvas} disabled={!hasPhoto} className="p-2 disabled:bg-gray-100 rounded-md text-white bg-gray-500">Retake</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verify;