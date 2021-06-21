import {useState} from 'react'


const useChatBox = (me,activeKey)=>{
    const [chatBoxes, setChatBoxes] = useState([
        // {friend: "Mary", key: "MaryChatBox", chatLog:[]},
        // {friend: "Peter", key: "PeterChatBox", chatLog: []},
    ])
    const createChatBox = (friend)=>{
        const new_key = `chat_${friend}`
        if(chatBoxes.some(({key})=> key === new_key)) {
            throw Error(`${friend}'s chatBox opened`)
        }
        const newChatBoxes = [...chatBoxes]
        const chatLog = []
        console.log(newChatBoxes)
        newChatBoxes.push({friend, key:new_key, chatLog})
        setChatBoxes(newChatBoxes)
        return new_key
    }
    const removeChatBox = (targetKey)=> {
        let newActiveKey=activeKey
        let lastIndex
        let newChatBoxes

        chatBoxes.forEach(({key}, i)=>{
            if(key === targetKey) lastIndex = i-1
        })
        newChatBoxes = chatBoxes.filter(({key})=>(key !== targetKey))
        if(newChatBoxes.length) {
            if(newActiveKey === targetKey) {
                newActiveKey = newChatBoxes[lastIndex>=0?lastIndex:0].key
            }
        }else{
            newActiveKey = ''
        }
        setChatBoxes(newChatBoxes)
        return newActiveKey
    }
    return {chatBoxes,createChatBox,removeChatBox}
}


export default useChatBox





