import { useState } from "react"
const useChat = () => {
    const [status, setStatus] = useState({})
    const sendMessage = (payload) => {
        const { key, body, sendEvent } = payload

    }
    return [ status, sendMessage ]
}

export default useChat