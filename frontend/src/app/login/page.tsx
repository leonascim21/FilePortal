'use client'
import React from "react"
import Link from "next/link";

const LoginPage = () => {

    const handleSubmit = () => {
        //TODO: LOGIN LOGIC / ERROR CHECKING!!!!
    };

    return(
        <div className="dark-purple-bg flex flex-col justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Login
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">
                            Email
                        </label>
                        <input id="email"
                               className="p-3 border rounded-md focus:outline-none focus:border-purple-500"
                               required pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                               title="Invalid email address" />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">
                            Password
                        </label>
                        <input id="password"
                               className="p-3 border rounded-md focus:outline-none focus:border-purple-500"
                               required/>
                    </div>
                    <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded-md mt-4 hover:bg-purple-800">
                        Login
                    </button>
                    <div className="flex justify-between mt-4">
                        <button type="button" className="text-purple-700 hover:underline">Forgot Password?</button>
                        <Link href={"/login/signup"}>
                            <button type="button" className="text-purple-700 hover:underline">Sign Up</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
