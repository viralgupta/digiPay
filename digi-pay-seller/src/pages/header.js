import React, { useEffect, useState } from 'react'
import Link from "next/link";

const Header = () => {
    const [user, setUser] = useState({})
    const getUser = () => {
        const u = JSON.parse(localStorage.getItem("user"))
        setUser(u)
    }
    
    useEffect(() => {
        getUser()
    }, [])


    return (
        <header className="text-white body-font bg-gray-800">
            <div className="container mx-auto flex justify-between align-middle md:p-5 p-2 items-center ">
                {user ?
                    <div className='flex flex-col md:space-x-2 lg:w-2/5 justify-start text-base md:ml-auto w-16'>
                        <img src={user.picture} alt="" className='h-8 rounded-full mr-auto ml-1 md:ml-3'/>
                        <div className='text-gray-50'>{user.name}</div>
                    </div>
                    :
                    <div className='flex flex-col md:space-x-2 lg:w-2/5 justify-start text-base md:ml-auto w-16'>
                        <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E" alt="" className='ml-4 md:ml-12 h-8 rounded-full mr-auto' />
                        <div className='text-gray-50 text-center md:text-start'>No Account Info</div>
                    </div>
                }
                <Link href='/' className="flex lg:order-none lg:w-1/5 title-font font-medium  items-center text-gray-900 lg:items-center cursor-pointer lg:justify-center mb-4 md:mb-0">
                    <img className='hidden md:block' src="https://www.chess.com/favicon.ico" alt="" />
                    <span className=" text-xl text-gray-50">DigiPay Seller</span>
                </Link>
                <Link href="/logout" className="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0">
                    <div className="inline-flex items-center border-2 border-gray-400 py-1 px-3 focus:outline-none rounded-lg text-gray-50 cursor-pointer text-base">
                        <div className='hidden md:block'>
                            {user ? "Logout" : "Login/Signup"}
                        </div>
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </div>
                </Link>
            </div>
        </header>
    )
}

export default Header