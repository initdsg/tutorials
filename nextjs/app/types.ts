export interface Message {
    id: number;
    text: string;
    sender: "user" | "ai";
}

export interface Session {
    id: string;
    token: string;
    expiresAt: number;
    scope: string[];
    rate: { perMin: number; perDay: number };
    ai: { maxTokensPerDay: number; maxContext: number };
}

export interface WebsocketPayload {
    type: "receive_message";
    data: {
        id: string;
        content: { type: "text"; text: string }[];
        conversationId: string;
        type: "agent" | "human";
        timestamp: string;
    };
}
