"use client";
import { useEffect, useState } from "react";
import { getDeviceId } from "./deviceId";
import { Message, Session, WebsocketPayload } from "./types";
import { useWebsocket } from "./useWebsocket";

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hello! I'm your AI assistant. How can I help you today?",
            sender: "ai",
        },
    ]);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState("");
    const [session, setSession] = useState<Session>();
    const { lastJsonMessage } = useWebsocket(session);

    useEffect(() => {
        if (lastJsonMessage) {
            const message = lastJsonMessage as WebsocketPayload;

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    text: message.data.content[0].text,
                    sender: "ai",
                },
            ]);
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        (async () => {
            // Create a guest session. Guest session allows you to retrieve
            // userId and token which is important for you to access the rest of
            // the endpoints including listening to websocket event and send
            // message to agent.
            const url = process.env.NEXT_PUBLIC_INITDAI_GUEST_SESSION_URL;
            const res = await fetch(`${url}/guest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Origin: window.location.origin,
                },
                credentials: "include",
                body: JSON.stringify({
                    deviceId: getDeviceId(),
                    publicAccessToken:
                        process.env.NEXT_PUBLIC_INITDAI_PUBLIC_ACCESS_TOKEN,
                }),
            });

            // Store the returned conversation id. This will be used to send
            // messages to the agent.
            const data = await res.json();
            setConversationId(data.conversationId);

            // Store the session info including userId and token.
            const session: Session = {
                id: data.session.id,
                token: data.token,
                expiresAt: data.session.expiresAt,
                scope: data.session.scope,
                rate: data.session.rate,
                ai: data.session.ai,
            };
            setSession(session);
        })();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const content = input.trim();

        if (!content) return;

        const userMessage: Message = {
            id: Date.now(),
            text: content,
            sender: "user",
        };
        setInput("");
        setMessages((prev) => [...prev, userMessage]);

        //  Send the message to InitD AI platform. There are 2 fields that can
        //  be retrieved from stored guest session which are `endUserId` and
        //  `conversationId`. Another important field you have to supply is the
        //  `publicAccessToken`, this can only be retrieved from initd.ai
        //  dashboard (https://dashboard.initd.ai).
        const url = process.env.NEXT_PUBLIC_INITDAI_HTTP_URL;
        await fetch(`${url}/platforms/webapp/message`, {
            method: "POST",
            body: JSON.stringify({
                publicAccessToken:
                    process.env.NEXT_PUBLIC_INITDAI_PUBLIC_ACCESS_TOKEN!,
                content: [{ type: "text", text: content }],
                endUserId: session?.id,
                conversationId,
            }),
        });
    };

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.sender === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded ${
                                message.sender === "user"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-black"
                            }`}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded px-3 py-2"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
