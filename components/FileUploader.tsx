"use client";

import React, { useRef, useState } from "react";
import { useChatStore } from '@/stores/ChatStore'

const FileUploader = () => {

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [showFileUploader, toggleShowFileUploader] = useChatStore((state) => [state.showFileUploader, state.toggleShowFileUploader])
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prevFiles) => {
      if (!prevFiles) return null;
      const updatedFiles = Array.from(prevFiles);
      updatedFiles.splice(indexToRemove, 1);
      return updatedFiles.length > 0 ? (updatedFiles as unknown as FileList) : null;
    });
  };  

  const UploadFiles = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!topic || !selectedFiles) return;
    setUploading(true)

    const requestBody = {
        namespace: topic,
        metadata: {
            type: "fileURL",
            link: selectedFiles[0]
        },
        fileURL: selectedFiles[0],
        openAIKey: process.env.NEXT_PUBLIC_DEFAULT_OPENAI__API_KEY,
    }
  
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/embeddings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setTopic('')
      setSelectedFiles(null)
      setUploading(false);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    <div className="absolute inset-0 backdrop-blur-sm bg-opacity-75 backdrop-filter flex items-center justify-center">

        <form onSubmit={UploadFiles} className="absolute bg-gray-800 p-4 rounded-2xl w-1/3 flex flex-col space-y-6 items-center justify-center left-1/3 top-1/4 z-10">

            <div className="text-2xl hover:bg-white/10 rounded-full p-1 cursor-pointer absolute right-4 top-4" onClick={toggleShowFileUploader}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
            </div>

            <h2 className="m-0 text-2xl font-bold border-b border-grey pb-3">
                Add New Brain
            </h2>

            <div className="flex items-center justify-center w-full space-x-4 px-10">
                <label>Topic</label>
                <input
                    className="bg-[#00121f] border border-black/10 dark:border-white/25 rounded-md p-2 w-full focus:outline-none"
                    placeholder="Please enter a topic"
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    disabled={uploading}
                    required
                    />
            </div>

            <section className="flex flex-col items-center justify-center w-full gap-10 px-6 py-3 outline-none">
                <div className="flex flex-col items-center w-full max-w-3xl gap-5 sm:flex-row">
                <div className="flex-1 w-full">
                    <div className="shadow-md dark:shadow-primary/25 hover:shadow-xl transition-shadow rounded-xl overflow-hidden bg-white dark:bg-black border border-black/10 dark:border-white/25 flex flex-col items-center justify-center h-52">
                    <input
                        type="file"
                        className="hidden"
                        ref={inputFileRef}
                        onChange={handleFileChange}
                        disabled={uploading}
                        multiple
                        required
                    />
                    <label
                        htmlFor="fileInput"
                        className="transition-opacity opacity-50 cursor-pointer hover:opacity-100 hover:underline"
                        onClick={() => inputFileRef.current?.click()}
                        >
                        Drag and drop files here, or click to browse
                    </label>
                    {selectedFiles && (
                    <div className="flex items-center justify-center space-x-2 w-full px-4 mt-4">
                        <h3 className="flex items-end">Selected Files:</h3>
                        <ul className="flex items-center justify-center gap-x-4 gap-y-2 flex-wrap">
                            {Array.from(selectedFiles).map((file, index) => (
                                <li key={index} className="flex flex-co items-end">
                                    <span>{file.name}</span>
                                    <button className="text-red-500 hover:bg-white/10 px-2 rounded-full text-center w-fit" onClick={() => removeFile(index)}>x</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    )}
                    </div>
                </div>
                </div>
                <div className="flex flex-col items-center justify-center mb-6">
                    <button type="submit" disabled={uploading} className="px-8 py-3 text-sm disabled:opacity-80 text-center font-medium rounded-md focus:ring ring-primary/10 outline-none flex items-center justify-center gap-2 bg-black border border-black dark:border-white disabled:bg-gray-500 disabled:hover:bg-gray-500 text-white dark:bg-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors">
                        { uploading ? 'Uploading...' : 'Upload' } {" "}
                    </button>
                </div>
            </section>

        </form>

    </div>
  );
};

export default FileUploader;
