'use client';
import React, { useState, useEffect } from "react";
import {useAuth} from "@/utils/AuthContext";

export default function Dashboard() {
    const [myFiles, setMyFiles] = useState([]);
    const { isLoggedIn } = useAuth();

    const fetchUserFiles = async () => {
        const token = localStorage.getItem("auth-token");
        if (!token) {
            return;
        }

        try {
            const response = await fetch("https://frozen-eliminate-cheap-video.trycloudflare.com/files", {
                method: "GET",
                headers: {
                    Authorization: `${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed to fetch files: ${errorText}`);
                return;
            }

            const files = await response.json();
            setMyFiles(files);

        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("auth-token");

        try {
            const response = await fetch("https://frozen-eliminate-cheap-video.trycloudflare.com/upload", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed to upload file: ${errorText}`);
            }

            fetchUserFiles();
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleFileDelete = async (fileID: number) => {
        const token = localStorage.getItem("auth-token");

        try {
            const response = await fetch(`https://frozen-eliminate-cheap-video.trycloudflare.com/delete?id=${fileID}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed to delete file: ${errorText}`);
                return;
            }

            fetchUserFiles();
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    useEffect(() => {
        fetchUserFiles();
    }, []);

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
                    onClick={() => document.getElementById("fileInput")?.click()}
                >
                    Upload a File
                </button>
                <input
                    id="fileInput"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                />
                <div className="flex flex-col gap-4">
                    {myFiles &&  myFiles.length > 0 ? (
                        <ul className="list-none">
                            {myFiles.map((file: { ID: number; FileName: string; FileURL: string }, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center border-b p-3 text-gray-700"
                                >
                                    <p>{file.FileName}</p>
                                    <div className="flex gap-4">
                                        <button
                                            className="text-purple-700 hover:underline"
                                            onClick={() => window.open(file.FileURL, "_blank")}
                                        >
                                            Download
                                        </button>
                                        <button
                                            className="text-red-700 hover:underline"
                                            onClick={() => handleFileDelete(file.ID)}
                                        >
                                            Delete
                                        </button>
                                    </div>
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
