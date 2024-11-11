'use client'
import React from "react"

const SignUpPage = () => {

    const handleSubmit = () => {
        //TODO: SIGN UP LOGIC / ERROR CHECKING!!!!
    };

    return(
        <div className="dark-purple-bg flex flex-col justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Sign Up
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">
                            First Name
                        </label>
                        <input id="firstName"
                               className="p-3 border rounded-md focus:outline-none focus:border-purple-500"
                               required/>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">
                            Last Name
                        </label>
                        <input id="lastName"
                               className="p-3 border rounded-md focus:outline-none focus:border-purple-500"
                               required/>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">
                            Email
                        </label>
                        <input id="email"
                               className="p-3 border rounded-md focus:outline-none focus:border-purple-500"
                               required pattern="[^@\s]+@[^@\s]+\.[^@\s]+"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">
                            Password
                        </label>
                        <input id="password"
                               className="p-3 border rounded-md focus:outline-none focus:border-purple-500"
                               pattern=".{8,64}" title="Password must be between 8 and 64 characters long"/>
                    </div>
                    <button type="submit"
                            className="bg-purple-700 text-white px-4 py-2 rounded-md mt-4 hover:bg-purple-800">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage
