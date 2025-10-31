import { Session } from "./types";
import useBaseWebSocket from "react-use-websocket";

const WS_ENDPOINT = process.env.NEXT_PUBLIC_INITDAI_WS_URL!;

// Generally you can use whatever websocket library you prefer, but in this
// example we want to handle reconnection so 'react-use-websocket' is the best
// at this. In order to listen to response from agent you will have to connect
// to a websocket connection
// wss://webapp.api.initd.ai?token=<token>&userId=<userId>
// You have to retrieve token and userId from guest session endpoint.
export function useWebsocket(session?: Session) {
    const wsEndpoint = session
        ? `${WS_ENDPOINT}?token=${encodeURIComponent(
              session?.token
          )}&userId=${encodeURIComponent(session?.id)}`
        : "wss://";

    const websocket = useBaseWebSocket(
        wsEndpoint,
        {
            share: true,
            reconnectAttempts: 10,
            reconnectInterval: 3000,
        },
        !!session
    );

    return websocket;
}
