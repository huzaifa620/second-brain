"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  createAChat,
  deleteAChat,
  getAllChats,
  getAllTopics,
  getAllMessages,
  generateMessage,
} from "@/lib/chat";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Chat, Message, Topic } from "@prisma/client";
import { usePathname } from "next/navigation";

type Props = {};

const Chats = (props: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [userTopics, setUserTopics] = useState<Topic[]>([]);
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [userInput, setUserInput] = useState("");
  const [chatId, setChatId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptUpdate, setPromptUpdate] = useState(false);
  const [topicName, setTopicName] = useState<string>("");
  const [thinking, setThinking] = useState(false);
  const [showPromptUpdater, setShowPromptUpdater] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [chatIdToDelete, setChatIdToDelete] = useState<string>("");

  useEffect(() => {
    console.log(userChats);
    if (userChats.length !== 0) {
      router.push(`/chat/${userChats[0].id}`);
    }
  }, [userChats]);

  const createChat = async () => {
    const response = await createAChat(session.data?.user.id || "");
    getChats();
  };

  const getChats = async () => {
    const response = await getAllChats(session.data?.user.id || "");
    setUserChats(response.data);
    return response;
  };

  const getTopics = async () => {
    const response = await getAllTopics(session.data?.user.id || "");
    setUserTopics(response.data);
    return response;
  };

  const getMessages = async (chatId: string) => {
    const response = await getAllMessages(chatId);
    setMessages(response.data);
    return response;
  };

  useEffect(() => {
    if (userTopics) {
      setTopicName(userTopics[0]?.name);
    }
  }, [userTopics]);

  useEffect(() => {
    if (session.data) {
      getChats();
      getTopics();
    }
  }, [session]);

  useEffect(() => {
    if (pathname) {
      setChatId(pathname.replace("/chat/", ""));
      getMessages(pathname.replace("/chat/", ""));
    }
  }, [pathname]);

  const getAnswer = async () => {
    if (!userInput) return;
    setThinking(true);
    await generateMessage(
      topicName,
      userInput,
      chatId,
      promptUpdate ? prompt : ""
    );
    setUserInput("");
    setThinking(false);
    getMessages(pathname.replace("/chat/", ""));
  };

  const updatePrompt = () => {
    setPromptUpdate(true);
    setShowPromptUpdater(false);
  };

  const confirmDeletion = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chatId: string
  ) => {
    setShowDeletePopup(true);
    console.log(chatId);
    setChatIdToDelete(chatId);
  };

  const deleteChat = async () => {
    if (!chatIdToDelete) return;
    await deleteAChat(chatIdToDelete);
    setShowDeletePopup(false);
    setChatIdToDelete("");
    getChats();
  };

  return (
    <div className="flex items-center h-screen">
      <div className="flex w-[20vw] flex-col space-y-4 items-center left-0 bottom-0 h-screen overflow-visible z-30 border-r border-black/10 dark:border-white/25 bg-white dark:bg-[#00121f] pt-4">
        <div
          onClick={createChat}
          className="p-2 w-1/2 border border-primary bg-white dark:bg-[#00121f] hover:bg-white/20 hover:bg-primary shadow-lg rounded-lg flex items-center justify-center z-20 cursor-pointer"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            className="h-6 w-6 mr-2"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
          </svg>{" "}
          New Chat
        </div>

        {userChats?.map((chat, ind) => (
          <div
            key={ind}
            className={`w-full border-b border-black/10 dark:border-white/25 last:border-none relative group flex overflow-x-hidden hover:bg-gray-100 dark:hover:bg-gray-800 ${
              chat.id === chatId &&
              "bg-gradient-to-r from-white dark:from-black to-transparent"
            }`}
          >
            <Link
              className="flex flex-col flex-1 min-w-0 p-4"
              href={`/chat/${chat.id}`}
            >
              <div className="flex items-center gap-2">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="text-xl"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0V0z"></path>
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"></path>
                </svg>
                <p> Chat {ind + 1} </p>
              </div>
              <div className="grid-cols-2 text-xs opacity-50 whitespace-nowrap">
                {chat.id}
              </div>
            </Link>
            <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center bg-gradient-to-l from-white dark:from-black to-transparent z-10 transition-opacity">
              <div className="p-0 hover:text-blue-300 cursor-pointer">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <div
                className="p-5 hover:text-red-700 cursor-pointer"
                onClick={(event) => confirmDeletion(event, chat.id)}
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </div>
            </div>
          </div>
        ))}

        {showDeletePopup && (
          <div className="fixed inset-0 z-50 flex justify-center py-25 overflow-auto cursor-pointer md:z-40 bg-black/50 backdrop-blur-sm">
            <div className="relative w-[90vw] my-auto flex flex-col items-center justify-center space-y-4 h-fit max-w-lg rounded-xl bg-white dark:bg-[#00121f] border border-black/10 dark:border-white/25 shadow-xl dark:shadow-primary/50 focus:outline-none cursor-auto">
              <div className="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 dark:border-white/10 w-full">
                <div className="flex">
                  <div className="flex items-center">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
                        Delete chat ?
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 items-center justify-center text-center">
                This will delete <strong>Chat 1</strong>.
                <div className="mt-5 sm:mt-4">
                  <div className="mt-5 flex flex-col gap-3 sm:mt-4 sm:flex-row-reverse">
                    <div
                      onClick={deleteChat}
                      className="flex w-full gap-2 items-center justify-center hover:bg-red-500 py-2 px-6 border border-red-400 rounded-md cursor-pointer"
                    >
                      Delete
                    </div>
                    <div
                      onClick={() => setShowDeletePopup(false)}
                      className="flex w-full gap-2 items-center justify-center hover:bg-gray-500 py-2 px-6 border border-gray-400 rounded-md cursor-pointer"
                    >
                      Cancel
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="flex flex-col flex-1 items-center w-full max-w-7xl h-full lg:min-h-[70vh] pt-5 2xl:pt-20 2xl:pl-32 px-10 2xl:px-0">
        <div className="flex items-center justify-center w-full">
          <div className="w-1/4">
            <select
              required
              className="text-white bg-[#00121f] border p-2 rounded-md w-full"
              value={topicName}
              onChange={(event) => setTopicName(event.target.value)}
            >
              <option value="" disabled>
                Select Topic
              </option>
              {userTopics.map((item) => (
                <option key={item.id} value={item.name}>
                  {" "}
                  {item.name
                    .replace(session.data?.user?.email || "", "")
                    .replaceAll("-", " ")
                    .trim()}{" "}
                </option>
              ))}
            </select>
          </div>
          <h1 className="text-2xl font-bold text-center w-2/4">
            <div>
              <span>
                Chat with your Digital Twin -{" "}
                <span className="text-purple-500">Default brain</span>{" "}
              </span>
            </div>
            <div>
              Upload files in a <span className="text-purple-500">brain</span>{" "}
              and chat with them
            </div>
          </h1>
          <div className="flex items-center justify-center w-1/4">
            <button className="text-sm text-center font-medium rounded-md focus:ring ring-primary/10 outline-none flex items-center justify-center gap-2 text-black dark:text-white bg-transparent disabled:opacity-25 gap-x-10 group-hover:visible hover:text-red-500 transition-[colors,opacity] p-1">
              <p className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-center text-white transition-colors bg-black border border-black rounded-md outline-none disabled:opacity-80 focus:ring ring-primary/10 dark:border-white disabled:bg-gray-500 disabled:hover:bg-gray-500 dark:bg-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 sm:px-4 sm:py-2">
                Share
              </p>{" "}
            </button>

            <button
              onClick={() => setShowPromptUpdater(true)}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-center text-white transition-colors bg-black border border-black rounded-md outline-none disabled:opacity-80 focus:ring ring-primary/10 dark:border-white disabled:bg-gray-500 disabled:hover:bg-gray-500 dark:bg-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 sm:px-4 sm:py-2"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0v1.829Zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707L14 2.707ZM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707L7.293 4Zm-.621 2.5a.5.5 0 1 0 0-1H4.843a.5.5 0 1 0 0 1h1.829Zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1h1.829ZM13.293 10A.5.5 0 1 0 14 9.293L12.707 8a.5.5 0 1 0-.707.707L13.293 10ZM9.5 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0v1.829Zm1.854-5.097a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L8.646 5.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0l1.293-1.293Zm-3 3a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L.646 13.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0L8.354 9.06Z"></path>
              </svg>
              Customize
            </button>

            {showPromptUpdater && (
              <div className="fixed inset-0 z-50 flex justify-center py-25 overflow-auto cursor-pointer md:z-40 bg-black/50 backdrop-blur-sm">
                <div className="relative w-[90vw] my-auto flex flex-col items-center justify-center space-y-4 h-fit max-w-2xl rounded-xl bg-white dark:bg-[#00121f] border border-black/10 dark:border-white/25 p-10 shadow-xl dark:shadow-primary/50 focus:outline-none cursor-auto">
                  <div
                    className="text-2xl hover:bg-white/10 rounded-full p-1 cursor-pointer absolute right-4 top-4"
                    onClick={() => setShowPromptUpdater(false)}
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    </svg>
                  </div>
                  <h2 className="m-0 text-2xl font-bold border-b border-grey">
                    Customize your brain
                  </h2>
                  <p className="">Edit Base Prompt Here</p>
                  <textarea
                    className="w-full min-h-[200px] max-h-[500px] px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-900 border-black/10 dark:border-white/25 p-auto"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                  />
                  <div className="flex justify-between gap-3">
                    <button
                      onClick={updatePrompt}
                      className="disabled:opacity-80 text-center font-medium focus:ring ring-primary/10 outline-none gap-2 dark:border-white text-black dark:text-white focus:bg-black dark:focus:bg-white dark:hover:bg-white dark:hover:text-black focus:text-white dark:focus:text-black transition-colors z-20 flex items-center grow justify-center px-4 py-2 text-xl bg-white border rounded-lg shadow-lg align-center border-primary dark:bg-black hover:text-white hover:bg-black top-1"
                    >
                      <p>Apply</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col mt-8 w-full shadow-md dark:shadow-primary/25 hover:shadow-xl transition-shadow rounded-xl overflow-hidden bg-white dark:bg-[#00121f] border border-black/10 dark:border-white/25 p-12 pt-10 max-h-[70vh]">
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="flex flex-col gap-3 p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-${
                      message.type === "user" ? "end" : "start"
                    }`}
                  >
                    <div
                      className={`py-3 px-5 w-fit bg-opacity-60 max-w-[60%] text-black items-${
                        message.type === "user" ? "start" : "end"
                      } rounded-md flex flex-col overflow-hidden scroll-pb-32 ${
                        message.type === "user"
                          ? "dark:bg-white"
                          : "bg-opacity-60 dark:bg-purple-100"
                      }`}
                    >
                      <div>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center w-full justify-center relative">
            <textarea
              className="bg-[#00121f] p-4 border border-black/10 dark:border-white/25 rounded-xl w-full max-h-[8vh] min-h-[8vh] overflow-y-auto focus:outline-none pr-44 pl-6"
              placeholder="Ask a question, or describe a task."
              rows={2}
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
            />

            <div className="flex flex-row items-end right-4 absolute 2xl:bottom-6">
              <button
                disabled={thinking}
                onClick={getAnswer}
                className="text-sm disabled:opacity-80 text-center font-medium rounded-md focus:ring ring-primary/10 outline-none flex items-center justify-center gap-2 bg-black border border-black dark:border-white disabled:bg-gray-500 disabled:hover:bg-gray-500 text-white dark:bg-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors px-3 py-2 sm:px-4 sm:py-2 cursor-pointer"
              >
                {thinking ? "Thinking..." : "Chat"}{" "}
              </button>

              <div className="text-sm text-center font-medium rounded-md focus:ring ring-primary/10 outline-none flex items-center justify-center gap-2 transition-opacity text-black dark:text-white bg-transparent disabled:opacity-25 p-2 sm:px-3 cursor-pointer">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="text-lg sm:text-xl lg:text-2xl"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path>
                </svg>{" "}
              </div>

              <div className="text-center font-medium rounded-md focus:ring ring-primary/10 outline-none flex items-center justify-center gap-2 transition-opacity text-black dark:text-white bg-transparent py-2 px-2 disabled:opacity-25 focus:outline-none text-2xl cursor-pointer">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0V0z"></path>
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"></path>
                </svg>{" "}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chats;
