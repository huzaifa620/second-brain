"use server"

import db from "./db";

export async function uploadCrawler(id: string, topicName: string, email: string, webUrlInput:string) {
    try {
        const requestBody = {
            namespace: `${email}-${topicName.replaceAll(' ', '-')}`,
            metadata: {
              type: "webpage",
              link: webUrlInput
            },
            webpage: webUrlInput,
            openAIKey: process.env.NEXT_PUBLIC_DEFAULT_OPENAI__API_KEY,
          }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/embeddings/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        const data = await response.json()

        try {
            await db.topic.create({
              data: { name: `${email}-${topicName.replaceAll(' ', '-')}`, userId: id },
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

// export async function check(id:string) {
//     const response = await db.user.findUnique({
//         where: { id: id }
//     })
//     console.log(response)
//     return response
// }