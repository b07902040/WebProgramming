import '../App.css';
import { useState, useEffect } from 'react';
import { Tabs, Input, message, Tag } from 'antd';
import ChatModal from '../components/ChatModal'
import useChatBox from '../hooks/useChatBox'
import useChat from '../hooks/useChat'
const { TabPane } = Tabs;

const ChatRoom = ({ me }) => {
    const { createChatBox, removeChatBox, chatBoxes } = useChatBox() ;
    const { status, sendMessage } = useChat();
    const [messageInput, setMessageInput] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [activeKey, setActiveKey] = useState("");

    const addChatBox = () => { setModalVisible(true); };

    const displayStatus = (payload) => {
        if (payload.msg) {
            const { type, msg } = payload
            const content = {
            content: msg, duration: 0.5 }
            switch (type) {
            case 'success':
                message.success(content)
                break
            case 'error':
            default:
               message.error(content)
                break
    }}}

    useEffect(() => {
        displayStatus(status)}, [status])
    
    const style = {
        display: 'flex',
        justifyContent: "flex-end",
    }
    return(
        <>
            <div className="App-title"><h1>{me}'s Chat Room</h1></div>
            <div className="App-messages">
                <ChatModal
                      visible={modalVisible}
                      onCreate={({ name }) => {
                        if (!name){
                            displayStatus({
                                type: "error",
                                msg: "Missing your name"
                            })
                        }
                        else{
                            var newKey = createChatBox(me, name);
                            setModalVisible(false);
                            setActiveKey(newKey)
                        }
                      }}
                      onCancel={() => {
                        setModalVisible(false);
                      }}
                />
                <Tabs 
                    type="editable-card"
                    onEdit={(targetKey, action) => {
                        if (action === "add") addChatBox();
                        else if (action === "remove"){
                            var newKey = removeChatBox(targetKey, activeKey);
                            setActiveKey(newKey)
                        } 
                    }}
                    activeKey={activeKey}
                    onChange={(key) => { setActiveKey(key); }}
                >
                    {chatBoxes.map(({friend, key, chatlog}) =>
                        {
                            return(
                                <TabPane tab={friend} key={key} closable={true}>
                                    <p>{friend}'s chatbox</p>
                                    {chatlog.map((message) => {
                                        return(
                                            <p>
                                                {message.name === me?
                                                    <div style={style}>
                                                        <Tag color="#BEBEBE" style={{textOverflow: 'ellipsis'}}>{message.body}</Tag>
                                                        <span>{message.name}</span>
                                                    </div>
                                                    :
                                                    <div>
                                                        <span style={{marginRight: "0.5rem"}}>{message.name}</span>
                                                        <Tag color="#BEBEBE">{message.body}</Tag>
                                                    </div>
                                                }
                                                
                                            </p>
                                        )
                                    })}
                                </TabPane>
                            )
                        }
                    )}
                </Tabs>
                
            </div>
            <Input.Search
                value = {messageInput}
                onChange = {(e) => setMessageInput(e.target.value)}
                enterButtton = "Send"
                placeholder = "Enter message here ..."
                onSearch={(msg) => {
                    if (!msg) {
                      displayStatus({
                        type: "error",
                        msg: "Please enter message.",
                      });
                      return;
                    } else if (activeKey === "") {
                      displayStatus({
                        type: "error",
                        msg: "Please add a chatbox first.",
                      });
                      setMessageInput("");
                      return;
                    }
                    var friend = chatBoxes.find((chatBox) => chatBox.key === activeKey).friend
                    sendMessage({ name: me, to: friend, body: msg });
                    setMessageInput("");
                  }}         
            >    
            </Input.Search>
        </>

    )
}

export default ChatRoom ;