import "../App.css"
import { useEffect, useState } from "react"
import { Tabs, Input, Tag } from "antd"
import ChatModal from "../components/ChatModal"
import useChatBox from "../hooks/useChatBox"
import useChat from "../hooks/useChat"

const { TabPane } = Tabs
const ChatRoom = ({ me, displayStatus }) => {
    const [activeKey, setActiveKey] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [messageInput, setMessageInput] = useState("")
    const [chatBoxes, createChatBox, removeChatBox, addChat] = useChatBox()
    // const [status, sendMessage] = useChat()
    
    const [server, setServer] = useState("")
    useEffect(() => {
        if(!server){
            let s = new WebSocket("ws://localhost:8080")
            if(s){
                s.onmessage = (m) => {
                    onEvent(JSON.parse(m.data));
                };
                setServer(s)
            }
            else{
            console.log("failed to connect to server")
            }
        }
        else{
            let s = server
            s.onmessage = (m) => {
                onEvent(JSON.parse(m.data));
            };
            setServer(s)
        }
    })
    const onEvent = (e) => {
        console.log("on", e)
        const { data, type } = e
        switch(type){
            case "CHAT":
                const { messages, friend } = data
                setActiveKey(createChatBox(friend, me, messages))
                setModalVisible(false)
                break
            case "MESSAGE":
                const { message } = data
                const { name, to, body } = message
                addChat(name, to, body)
        }
    };
    const sendEvent = (e) => {
        console.log("send", e)
        if(server){
            server.send(JSON.stringify(e))
        }
        else{
        console.log("failed to connect to server")
        }
    }
    const sendMessage = (msg) => {
        let index
        chatBoxes.forEach((chatBox, i) => {
            if(chatBox.key === activeKey) index = i
        })
        const { friend } = chatBoxes[index]
        sendEvent({
            type: "MESSAGE",
            data: {
                name: me,
                to: friend,
                body: msg
            }
        })
    }


    return(
        <>
            <div className="App-title"><h1>{me}'s Chat Room</h1></div>
            <div className="App-messages">
                <ChatModal
                    visible={modalVisible}
                    onCreate={({name}) => {
                        sendEvent({
                            type: "CHAT",
                            data: {
                                name: me,
                                to: name
                            }
                        })
                        // setActiveKey(createChatBox(name, me, []))
                        // setModalVisible(false)
                    }}
                    onCancel={() => {
                        setModalVisible(false)
                    }}
                />
                <Tabs 
                    type="editable-card"
                    activeKey={activeKey}
                    onChange={(key => setActiveKey(key))}
                    onEdit={(targetKey, action) => {
                        if(action === "add"){
                            setModalVisible(true)
                        }
                        else if(action === "remove"){
                            setActiveKey(removeChatBox(targetKey, activeKey))
                        }
                    }}
                >
                    {chatBoxes.map(({ friend, key, chatLog }) => {
                        return(
                            <TabPane tab={friend} key={key} closable={true}>
                                <p>{friend}'s chatbox.</p>
                                {chatLog.map((message, index)=>{
                                    const { name, body } = message
                                    return(
                                        name === me?
                                        <div key={index} className="App-message-right">
                                            <Tag color="blue">{name}</Tag>
                                            <p>
                                                {body}
                                            </p>
                                            
                                        </div>
                                        :
                                        <div key={index} className="App-message-left">
                                            <Tag color="blue">{name}</Tag>
                                            <p>
                                                {body}
                                            </p>
                                        </div>
                                    )
                                })}
                            </TabPane>
                        )
                    })}
                </Tabs>
            </div>
            <Input.Search
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                enterButton="Send"
                placeholder="Enter message here..."
                onSearch={(msg) => { 
                    if(!msg){
                        displayStatus({
                            type: "error",
                            msg: "Please enter message"
                        })
                        return
                    }
                    else if(activeKey === ""){
                        displayStatus({
                            type: 'error',
                            msg: "Please add a chatbox first"
                        })
                        setMessageInput("")
                        return
                    }
                    sendMessage(msg)
                    setMessageInput("")
                }}
            />
        </>
    )
}

export default ChatRoom