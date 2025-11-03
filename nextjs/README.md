# initd.ai Next.js Tutorial

## Getting started

To get started with this project, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/initd-ai/tutorials.git
    cd tutorials/nextjs
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add the following variables. You will need to obtain `NEXT_PUBLIC_INITDAI_PUBLIC_ACCESS_TOKEN` from your initd.ai dashboard.

    ```
    NEXT_PUBLIC_INITDAI_GUEST_SESSION_URL=https://j74oaemotd.execute-api.ap-southeast-1.amazonaws.com/prod/webapp
    NEXT_PUBLIC_INITDAI_HTTP_URL=https://b4c12rdlz8.execute-api.ap-southeast-1.amazonaws.com/prod
    NEXT_PUBLIC_INITDAI_WS_URL=wss://84xkhsyda9.execute-api.ap-southeast-1.amazonaws.com/prod
    NEXT_PUBLIC_INITDAI_PUBLIC_ACCESS_TOKEN=YOUR_PUBLIC_ACCESS_TOKEN
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Documentation

This project interacts with the InitD AI platform through a few key API endpoints.

### 1. Guest Session Creation

-   `POST /guest`
-   **URL:** https://j74oaemotd.execute-api.ap-southeast-1.amazonaws.com/prod/webapp
-   **Description:** Creates a guest session, returning a `userId`, `token`, and `conversationId`. This is essential for subsequent API calls.
-   **Request Body:**
    ```json
    {
        "deviceId": "string", // Unique identifier for the device
        "publicAccessToken": "string" // Obtained from initd.ai dashboard
    }
    ```
-   **Response Body (Example):**
    ```json
    {
        "conversationId": "string",
        "session": {
            "id": "string",
            "expiresAt": "number",
            "scope": ["string"],
            "rate": { "perMin": "number", "perDay": "number" },
            "ai": { "maxTokensPerDay": "number", "maxContext": "number" }
        },
        "token": "string"
    }
    ```

### 2. Send Message to AI Agent

-   `POST /platforms/webapp/message`
-   **URL:** https://b4c12rdlz8.execute-api.ap-southeast-1.amazonaws.com/prod
-   **Description:** Sends a user message to the InitD AI agent within a specific conversation.
-   **Request Body:**
    ```json
    {
        "publicAccessToken": "string", // Obtained from initd.ai dashboard
        "content": [
            {
                "type": "text",
                "text": "string" // The user's message
            }
        ],
        "endUserId": "string", // From guest session (session.id)
        "conversationId": "string" // From guest session
    }
    ```
-   **Response:** (Typically a 200 OK status, messages are received via WebSocket)

### 3. WebSocket for Receiving Messages

-   **URL:** wss://84xkhsyda9.execute-api.ap-southeast-1.amazonaws.com/prod
-   **Description:** Used to receive real-time messages from the AI agent. The `useWebsocket` hook handles this connection.
-   **Payload (Example - `receive_message` type):**
    ```json
    {
        "type": "receive_message",
        "data": {
            "id": "string",
            "content": [{ "type": "text", "text": "string" }],
            "conversationId": "string",
            "type": "agent" | "human",
            "timestamp": "string"
        }
    }
