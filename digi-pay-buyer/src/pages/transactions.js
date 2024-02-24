import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MyTransactions = () => {
    const router = useRouter()
    const [payments, setPayments] = useState([])
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

    const getmybookings = async () => {
        const user = JSON.parse(localStorage.getItem('user'))
        const token = localStorage.getItem('token');
        const mybooking = await axios.post(`/api/buyer/mypayments`, {
            id: user._id
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420"
            }
        })
        setPayments(mybooking.data.myPayments)
    }


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        let token = localStorage.getItem('token');
        if (!user || !token) {
            router.push('/login')
        }
        else if (!user.hasUserId) {
            router.push("/registerface")
        }
        else {
            getmybookings()
        }
        // eslint-disable-next-line
    }, [])

    const cancelPayment = async (id) => {
        let token = localStorage.getItem('token');
        const res = await axios.post(`/api/buyer/blockpayment`, {
            paymentid: id
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420"
            }
        })
        if (res.data.success) {
            setPayments(res.data.myPayments)
        }
        else {
            toast.error(res.data.message, toastconfig)
        }
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
            {payments.length === 0 ? <div className='flex flex-col justify-center'>
                <div className=' text-center p-0 md:p-10 text-xl font-bold'>
                    Coudn't find any payments from your account : &nbsp;&#40;
                </div>
            </div> : <div>
                <div className="container md:px-5 py-5 mx-auto">
                    <div className="flex flex-col text-center w-full mb-8 md:mb-20">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-100">Your Payments</h1>
                    </div>
                    <div className="flex flex-wrap -m-2">
                        {payments.map((payment, index) => {
                            return <div className="p-2 lg:w-1/3 md:w-1/2 w-full" key={index}>
                                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                                    <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src={payment.seller.picture} />
                                    <div className='flex flex-col md:flex-row'>
                                        <div className="flex-grow">
                                            <h2 className="title-font font-medium text-white">Rs.{payment.amount}{payment.hasFailed ? <span className='text-red-200'>&nbsp;&#40;Failed&#41;</span> : payment.hasConfirmed ? <span className='text-green-200'>&nbsp;&#40;Payed&#41;</span> : <span className='text-yellow-200'>&nbsp;&#40;Pending&#41;</span>}</h2>
                                            <p className="text-gray-500">Reason: {payment.reason}</p>
                                            <p className="text-gray-500">Seller: {payment.seller.name}</p>
                                        </div>
                                        {!payment.hasConfirmed && !payment.hasFailed && <button onClick={() => { cancelPayment(payment._id) }} id='toggleButton' className='border p-1 rounded-md text-center mt-2 md:ml-20 md:mt-0'>
                                            Cancel Payment
                                        </button>}
                                        {payment.hasConfirmed && !payment.hasFailed && <div className='p-1 rounded-md text-center mt-2 md:ml-20 md:mt-0'>
                                            Time Limit Exceeded
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>}
        </>
    )
}

export default MyTransactions