"use server"

import db from "./db";

export async function generateMessage(topicName: string, userInput: string, chatId:string, prompt:string) {
    try {
        const requestBody = {
            namespace: topicName,
            query: userInput,
            model: "gpt-3.5-turbo",
            openAIKey: process.env.NEXT_PUBLIC_DEFAULT_OPENAI__API_KEY,
            prompt: prompt,
            temperature: 0.5,
            maxTokens: 255,
        };
        console.log(requestBody)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        const data = await response.json()

        try {
            await db.message.create({
              data: { text: userInput, type: "user", chatId: chatId },
            });

            await db.message.create({
                data: { text: data.answer, type: "system", chatId: chatId },
            });
    
            return { success: true, message: "successful", data: data };
        } catch (error) {
            return { success: false, message: "error" };
        }
          
    } catch (e) {
        console.log(e);
        return { success: false, message: "error" };
    }
}

export async function createAChat(userId: string) {
    try {
        await db.chat.create({
          data: { userId: userId, name: "New Chat" },
        });

        return { success: true, message: "successful" };
    } catch (error) {
        return { success: false, message: "error" };
    }
}

export async function deleteAChat(chatId: string) {
    try {
        await db.message.deleteMany({
            where: {
                chatId: chatId,
            },
        });

        await db.chat.delete({
            where: {
                id: chatId,
            },
        });

        return { success: true, message: "Chat and associated messages deleted successfully" };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Error deleting chat and messages" };
    }
}

export async function getAllChats(userId: string) {
    const chats = await db.chat.findMany({
        where: { userId: userId },
    });
    return { success: true, message: "successful", data: chats };
}

export async function getAllTopics(userId: string) {
    const topics = await db.topic.findMany({
        where: { userId: userId },
    });
    return { success: true, message: "successful", data: topics };
}

export async function getAllMessages(chatId: string) {
    const messages = await db.message.findMany({
        where: { chatId: chatId },
    });
    return { success: true, message: "successful", data: messages };
}