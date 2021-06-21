import { useState } from "react";  

const client = new WebSocket('ws://localhost:4000')

const sendData = async (data) => {
    await client.send(
        JSON.stringify(data));
}

const useChat = () => {
    const [status, setStatus] = useState({}); // { type, msg }
    const sendMessage = (payload) => {
        sendData(["MESSAGE", payload]);
    }; // { key, msg }
    
    return { status, sendMessage };
};
export default useChat;