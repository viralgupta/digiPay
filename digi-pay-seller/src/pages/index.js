import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

function Home() {
    const router = useRouter()
    const [payments, setPayments] = useState([])
    const [balance, setBalance] = useState(0)

    const getPayments = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        const token = localStorage.getItem('token');
        const response = await axios.post("/api/buyer/mypayments", {
            id: user._id,
            seller: true
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420"
            }
        })
        setPayments(response.data.myPayments)
    }

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
            router.push('/login')
        }
        else {
            getBalance()
            getPayments()
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className='bg-gray-700 h-full p-5' >
            {payments.length === 0 ? <div className='flex flex-col justify-center text-white border border-white p-5 rounded-lg md:mx-auto'>
                <div className=' text-center text-md font-bold mb-3'>
                    Coudn't find Transactions :&nbsp;&#40;
                </div>
                <button onClick={() => { router.push('/getpayment') }} className='text-center mx-auto text-xl text-white bg-blue-400 border-2 rounded-md p-2'>
                    Start Getting Payments
                </button>
            </div> : <div>
                <div className="container mx-auto">
                    <div className="flex flex-col text-center w-full mb-8 md:mb-20">
                        <h1 className="sm:text-3xl font-medium title-font mb-4 text-gray-100 text-3xl">Your Transactions</h1>
                    </div>
                    <div className="flex flex-wrap -m-2">
                        <div className="p-2 w-full">
                            <div className="flex items-center justify-center h-full border-gray-200 border p-4 rounded-lg">
                                <button id='toggleButton' className='border p-1 rounded-md text-center md:ml-20 md:mt-0 text-white bg-gray-800'>
                                    <Link href={`/getpayment`} >Get New Payment +</Link>
                                </button>
                            </div>
                        </div>
                        <div className="p-2 w-full">
                            <div className="flex items-center h-full justify-around border-gray-200 border p-4 rounded-lg">
                                <div className=' text-white'>
                                    Account Balance:
                                </div>
                                <div id='toggleButton' className='border p-1 rounded-md text-center md:ml-20 md:mt-0 text-white bg-gray-800'>
                                    {balance}
                                </div>
                            </div>
                        </div>
                        {payments.map((payment, index) => {
                            return <div className="p-2 lg:w-1/3 md:w-1/2 w-full" key={index}>
                                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                                    <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src={payment.buyer.picture} />
                                    <div className='flex flex-col md:flex-row'>
                                        <div className="flex-grow">
                                            <h2 className="title-font font-medium text-white">Rs.{payment.amount}{payment.hasFailed ? <span className='text-red-200'>&nbsp;&#40;Failed&#41;</span> : payment.hasConfirmed ? <span className='text-green-200'>&nbsp;&#40;Received&#41;</span> : <span className='text-yellow-200'>&nbsp;&#40;Pending&#41;</span>}</h2>
                                            <p className="text-gray-500">Reason: {payment.reason}</p>
                                            <p className="text-gray-500">Buyer: {payment.buyer.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>}
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
    )
}

export default Home