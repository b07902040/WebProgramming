import "../App.css";
import { useEffect, useState } from "react";
import { Tag,Tabs, Input, message } from "antd";
import ChatModal from './ChatModal'
import useChatBox from '../hooks/useChatBox'
import useChat from '../hooks/useChat'

const {TabPane} = Tabs;
const ChatRoom = ({me})=>{

    const [messageInput, setMessageInput] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [activeKey, setActiveKey] = useState("")
    const addChatBox = ()=>{
        setModalVisible(true)
    }

    const {chatBoxes,createChatBox, removeChatBox} = useChatBox(me,activeKey)


    const {status, messages, sendMessage} = useChat()
    useEffect(()=>{
        console.log('CHAT')
        if(activeKey !== "")
            sendMessage({type: 'CHAT', data:{ name: me, to: activeKey.split('_')[1]}})
    },[activeKey])

    return (
        <>  
            <div className="App-title">
                <h1>
                    {me}'s chatRoom
                </h1>
            </div>
            <div className="App-messages">
                <ChatModal
                    onCreate={({name})=>{
                        const new_key = createChatBox(name)
                        console.log('Name;'+name)
                        setActiveKey(new_key)
                        // sendMessage({type: 'CHAT', data:{ name: me, to: name}})
                        setModalVisible(false)
                    }}
                    onCancel={()=>setModalVisible(false)}
                    visible={modalVisible}
                >


                </ChatModal>
                <Tabs 
                    type="editable-card" 
                    onEdit={(targetKey, action)=>{
                        if (action==='add') addChatBox()
                        else if (action==='remove') {
                            const new_key = removeChatBox(targetKey)
                            setActiveKey(new_key)
                        }
                    }}
                    activeKey={activeKey}
                    onChange={(key) => {setActiveKey(key)}}
                >
                    {chatBoxes.map((
                        {friend, key, chatLog} 
                    )=>(
                        <TabPane tab={friend} key={key} closable={true} >
                            <p> {friend}'s chatbox </p>
                        </TabPane>
                    ))}
                </Tabs>
                <div className="App-messages">
                    {console.log('asd', messages) || messages.length === 0 ? ``: (
                        messages.map(({name,body},i) => (
                        <p key={i} align={name==me?'right':'left'}>
                            <Tag color="blue">
                            {name}</Tag> {body}
                        </p>)))}
                </div>

                <Input.Search 
                    value={messageInput}
                    onChange={(e)=>setMessageInput(e.target.value)}
                    enterButton="Send"
                    placeholder="Enter message .."
                    onSearch={(msg)=>{
                        if(!msg) {
                            message.error('add meesage!')
                            return
                        }else if(activeKey === ''){
                            message.error('No created chatroom')
                            setMessageInput("")
                            return
                        }
                        sendMessage({type: 'MESSAGE', data:{ name: me, to:activeKey.split('_')[1], body:msg}})
                        setMessageInput("")
                    }}
                ></Input.Search>
            </div>
        </>
    )

}

export default ChatRoom