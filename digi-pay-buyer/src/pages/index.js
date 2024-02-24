import axios from "axios";
import { useEffect, useState } from "react";
import MyTransactions from "./transactions";

export default function Home() {
  const [balance, setBalance] = useState(0)

  const getBalance = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token');
    const res = await axios.post(`/api/buyer/getbalance`, {
      id: user._id
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "69420"
      }
    })
    setBalance(res.data.balance)
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    let token = localStorage.getItem('token');
    if (!user || !token) {
      window.location = '/login'
    }
    else if (!user.hasUserId) {
      window.location = '/registerface'
    }
    else {
      getBalance()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <section className="text-white body-font bg-gray-800 h-full">
        <div className="container px-5 md:py-12 pb-24 mx-auto flex flex-col">
          <div className="rounded-md border-2 m-5 border-white p-3 text-md md:text-2xl font-mono w-min">Your&nbsp;Account&nbsp;Balance:&nbsp;{balance}</div>
          <MyTransactions />
          <div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </section>
    </>
  )
}
