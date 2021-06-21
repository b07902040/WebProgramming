import { useState } from "react"; 
const client = new WebSocket('ws://localhost:4000')
const sendData = async (data) => {
    await client.send(
        JSON.stringify(data));
}
const useChatBox = () => {

    const [chatBoxes, setChatBoxes] = useState([]);

    const createChatBox = (me, friend) => {
        const newKey = me <= friend ?
                `${me}_${friend}` : `${friend}_${me}`;
        if (chatBoxes.some(({ key }) => key === newKey)) {
            throw new Error(friend +
                            "'s chat box has already opened.");
        }
        var newChatBoxes = [...chatBoxes]
        sendData(["CHAT", {name: me, to: friend}]);
        client.onmessage = (byteString) => {
            const { data } = byteString
            const { type, payload } = JSON.parse(data)
            //console.log(type)
            switch(type){
                case 'CHAT' : {
                    var newChatBox = { friend: friend, key: newKey, chatlog: payload.messages };
                    newChatBoxes.push(newChatBox)
                    setChatBoxes(newChatBoxes)
                    break;
                }
                case 'MESSAGE':{
                    console.log(newChatBoxes)
                    var id = newChatBoxes.findIndex((chatBox) => chatBox.key === payload.chatBox)
                    console.log(newChatBoxes[id].chatlog)
                    var newChatlog = [...newChatBoxes[id].chatlog]
                    // console.log(newMessage)
                    newChatlog.push(payload.message)
                    newChatBoxes[id].chatlog = newChatlog
                    setChatBoxes(chatBoxes => [...newChatBoxes])
                    break;
                }
                default: break;        
            }
        }
        //console.log(newKey)
        return newKey
    };

    const removeChatBox = (targetKey, activeKey) => {
        let newActiveKey = activeKey;
        let lastIndex;
        chatBoxes.forEach(({ key }, i) => {
            if (key === targetKey) { lastIndex = i - 1; }});
        const newChatBoxes = chatBoxes.filter(
            (chatBox) => chatBox.key !== targetKey);
        if (newChatBoxes.length) {
            if (newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newChatBoxes[lastIndex].key;
            } else { newActiveKey = newChatBoxes[0].key; }
            }
        } else newActiveKey = ""; // No chatBox left
        ;

        setChatBoxes(newChatBoxes)
        return newActiveKey;
    };

    return { createChatBox, removeChatBox, chatBoxes };
};
export default useChatBox;