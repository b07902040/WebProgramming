import {useState, useEffect} from 'react'
import { message } from "antd";
const client = new WebSocket('ws://localhost:8080')

const useChat = ()=>{
    const [status, setStatus] = useState({})
    const [messages, setMessages] = useState([])
    // const displayStatus = (payload) => {
    //     if (payload.msg) {
    //       const { type, msg } = payload
    //       const content = {
    //         content: msg, duration: 0.5 }
    //       switch (type) {
    //         case 'success':
    //           message.success(content)
    //           break
    //         case 'error':
    //         default:
    //           message.error(content)
    //           break1
    //   }}}
    //   useEffect(() => {
    //     displayStatus(status)}, [status]
    //     )

    client.onmessage = (message) => {
        let payload = message.data
        console.log('message!')
        console.log(payload)
        const {type, data} = JSON.parse(payload)
        console.log(type,data)
        switch(type) {
            case 'output':
                break;
            case 'MESSAGE':
                console.log('Message')
                console.log(messages)
                setMessages(()=>[...messages, data.message])
                break;
            case 'CHAT':
                console.log('CHAT')
                setMessages(()=>[...data.messages])
                break;
            case 'status':
                setStatus(data)
                break;
            default:
                console.log('default')
        }
    }
    const sendMessage = async (payload) =>{
        console.log(payload)
        
        await client.send(JSON.stringify(payload))
        
    }

    return {status, sendMessage, messages}
}


export default useChat



