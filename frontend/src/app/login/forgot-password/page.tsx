'use client'
import React, { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";


const ForgotPasswordPage = () => {
    const [resetEmail, setResetEmail] = useState<string>("")
    const [submissionMessage, setSubmissionMessage] = useState<[string, boolean]>(["", false]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(0);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setResetEmail(e.target.value)
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true)

        try {
            // TODO: CHANGE TO CORRECT BACKEND ENDPOINT
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: resetEmail})
            });

            if (response.ok) {
                const responseData = await response.json();
                setSubmissionMessage(['A link to reset your password has been sent to your email.', true])
                setCountdown(15);
                const timer = setInterval(() => {
                    setCountdown((prevCountdown) => {
                        if (prevCountdown && prevCountdown > 1) {
                            return prevCountdown - 1;
                        } else {
                            clearInterval(timer);
                            setIsSubmitting(false);
                            return 0;
                        }
                    });
                }, 1000);
                console.log("Login successful:", responseData);
            } else {
                setSubmissionMessage(['Request failed. Please check provided email and try again.', false]);
                setIsSubmitting(false)
            }
        } catch (error) {
            setSubmissionMessage(['An unexpected error occurred. Please try again later.', false]);
            setIsSubmitting(false)
            console.error(error);
        }
    };

    return(
        <div className="dark-purple-bg flex flex-col justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Forgot Password
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">
                            Account Email
                        </label>
                        <input id="email"
                               value={resetEmail}
                               onChange={handleInputChange}
                               className="p-3 border rounded-md focus:outline-none focus:border-purple-500"
                               required pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                               title="Invalid email address"/>
                    </div>
                    <button type="submit"
                            disabled={isSubmitting}
                            className={`text-white px-4 py-2 rounded-md mt-4 
                            ${isSubmitting ? 'bg-purple-400 cursor-not-allowed'
                                           : 'bg-purple-700 hover:bg-purple-800'}`}
                    >
                        Submit
                    </button>

                    {countdown !== 0 && (
                        <div className="text-xs text-center text-gray-500 mt-0">
                            Didn&apos;t get the email? You can resend your request in {countdown} seconds.
                        </div>)}
                    {submissionMessage && !submissionMessage[1] && <div className="text-red-500">{submissionMessage}</div>}
                    {submissionMessage && submissionMessage[1] && <div>{submissionMessage}</div>}
                    {submissionMessage && submissionMessage[1] && <div className="flex justify-center mt-1">
                        <Link href={"/login"}>
                            <button type="button" className="text-purple-700 hover:underline">
                                Return to login
                            </button>
                        </Link>
                    </div>}
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
