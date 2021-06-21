import { useState } from "react"
const useChatBox = () => {
    const [chatBoxes, setChatBoxes] = useState([])
    const createChatBox = (friend, me, messages) => {
        console.log(friend, me, messages)
        console.log(chatBoxes)
        const newKey = me <= friend?`${me}_${friend}`:`${friend}_${me}`
        if(chatBoxes.some(({key}) => key === newKey)){
            throw new Error(friend + "'s chat box has already opened.")
        }
        const newChatBoxes = [...chatBoxes]
        const chatLog = messages
        newChatBoxes.push({friend, key: newKey, chatLog})
        console.log(newChatBoxes)
        setChatBoxes(newChatBoxes)
        return newKey
    }
    const removeChatBox = (targetKey, activeKey) => {
        console.log("remove")
        let newActiveKey = activeKey
        let lastIndex
        chatBoxes.forEach(({ key }, i) => {
            if (key === targetKey) { lastIndex = i - 1}})
        const newChatBoxes = chatBoxes.filter(

            (chatBox) => chatBox.key !== targetKey
        )
        if( newChatBoxes.length ){
            if (newActiveKey === targetKey) {
                if(lastIndex >= 0){
                    newActiveKey = newChatBoxes[lastIndex].key
                }
                else{
                    newActiveKey = newChatBoxes[0].key
                }
            }
        }
        else newActiveKey = "";
        setChatBoxes(newChatBoxes)
        return newActiveKey
    }
    const addChat = (name, to, body) => {
        const newKey = name <= to?`${name}_${to}`:`${to}_${name}`
        let index = -1
        chatBoxes.forEach((chatBox, i) => {
            if(chatBox.key === newKey) index = i
        })
        if(index === -1){
            console.log('error', chatBoxes, newKey)
        }
        else{
            const newChatBoxes = [...chatBoxes]
            newChatBoxes[index].chatLog.push({name, body})
            setChatBoxes(newChatBoxes)
        }
    }
    return [ chatBoxes, createChatBox, removeChatBox, addChat]
}

export default useChatBox