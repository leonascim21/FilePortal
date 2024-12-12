'use client';
import React, { useState } from "react";
import {useAuth} from "@/utils/AuthContext";

export default function FileManagementPage() {
    //placeholders to test design
    const [myFiles ] = useState<string[]>(["test.pdf", "placeholder.jpg"]);

    const { isLoggedIn } = useAuth();

    if (isLoggedIn === null) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        return null;
    }

    return (
        <div className="dark-purple-bg flex flex-col items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
                <h1 className="text-2xl font-bold text-center mb-6">My Files</h1>
                <button
                    className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 mb-6"
                >
                    Upload a File
                </button>
                <div className="flex flex-col gap-4">
                    {myFiles.length > 0 ? (
                        <ul className="list-none">
                            {myFiles.map((file, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center border-b p-3 text-gray-700"
                                >
                                    <p>{file}</p>
                                    <button
                                        className="text-purple-700 hover:underline"
                                    >
                                        Download
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center">No files available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
