import "../App.css";
import { useState, useEffect } from "react";
import { Tabs, Input, Tag, Badge } from "antd";
import ChatModal from "../Components/ChatModal";
import { MUTATION, QUERY, SUBSCRIPTION } from "../graphql/graphql"
const { TabPane } = Tabs;
var restoreTab = true;

const ChatRoom = ({me, displayStatus, server}) => {

  const lastChatBoxes=JSON.parse(localStorage.getItem(me));
  if(restoreTab===true && lastChatBoxes!==null){
    for(var chatBox of lastChatBoxes){
      var x=chatBox.split("_");
      var name=(x[0]===me)?x[1]:x[0];
      server.sendEvent({
        type: 'CHAT',
        data: { to: name, name: me },
      }); 
    }
    restoreTab=false;
  }

  const [chatBoxes, setChatBoxes] = useState([]);
  const [activeKey, setActiveKey] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const addChatBox = () => { setModalVisible(true); };

  server.onmessage = (evt) => {
    var msg = JSON.parse(evt.data);
    console.log(msg)
    
    switch (msg.type) {
      case 'CHAT': {
        createChatBox(msg.data.to, msg.data.messages);                
        break;
      }
      case 'MESSAGE': {
        var key=msg.data.key;
        var sender=msg.data.message.name;
        var to=msg.data.to;
        var body=msg.data.message.body;
        if ( sender !== me ) {
          updateChatBox(key, body, sender, to);
        }
        else {
          updateMyChatBox(key, body, sender, to)
        }
        break;
      }
      default: {}
    }
  };


  const updateChatBox = (key, body, sender, to) => {
    console.log("hi");
    const newChatBoxes = [...chatBoxes];
    for(var ChatBox of newChatBoxes){
        if(ChatBox.key===key) {
          ChatBox.msg.push({sender:sender, to:to, body:body});
          ChatBox.newMsg = ChatBox.newMsg+1;
          break;
        }
    }
    setChatBoxes(newChatBoxes);  
  }

  const updateMyChatBox = (key, body, sender, to) => {
    const newChatBoxes = [...chatBoxes];
    for(var ChatBox of newChatBoxes){
        if(ChatBox.key===key) {
          ChatBox.msg.push({sender:sender, to:to, body:body});
          ChatBox.newMsg = ChatBox.newMsg = 0;
          break;
        }
    }
    setChatBoxes(newChatBoxes);  
  }

  const updateBadge = (key) => {
    const newChatBoxes = [...chatBoxes];
    for(var ChatBox of newChatBoxes){
        if(ChatBox.key===key){
          ChatBox.newMsg = 0;
            break;
        }
    }
    setChatBoxes(newChatBoxes);  
  }
  
  const createChatBox = (friend, log) => {
    const newKey = me <= friend ?
          `${me}_${friend}` : `${friend}_${me}`;
    if (chatBoxes.some(({ key }) => key === newKey)) {
      displayStatus({
        type:"error",
        msg:friend +"'s ChatBox has already opened.",
      })
      return false;
    }
    const newChatBoxes = [...chatBoxes];
    const chatLog = [];
    for(var m of log){            
      var sender=m.name;
      var to=(sender===me)? friend:me;
      var body=m.body;
      chatLog.push({sender:sender, to:to, body:body});
    }
    newChatBoxes.push({ friend, key: newKey, msg:chatLog, newMsg: 0});
    setChatBoxes(newChatBoxes);
    setActiveKey(newKey);
  };

  const removeChatBox = (targetKey) => {
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
    setChatBoxes(newChatBoxes);
    setActiveKey(newActiveKey);
  };

  const sendMessage = (payload) => {    
    var users = payload.key.split("_");
    var to = ( me===users[1] )? users[0]:users[1];
    var body = payload.body
    server.sendEvent({
        type: 'MESSAGE',
        data: { to: to, name: me, body: body },
    });
  };

  useEffect(() => {
    var chatBoxList=[];
    for(var chatBox of chatBoxes){
      chatBoxList.push(chatBox.key);
    }
    localStorage.setItem(me, JSON.stringify(chatBoxList));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[chatBoxes]);
  // eslint-disable-next-line
  const sendMes = MUTATION();
  // eslint-disable-next-line
  const quary = QUERY();
  // eslint-disable-next-line
  const subscr = SUBSCRIPTION();  
  return (
    <> <div className="App-title">
         <h1>{me}'s Chat Room</h1> </div>
      <div className="App-messages">
        <Tabs 
          type="editable-card"
          activeKey={activeKey}
          onChange={
            (key) => { 
              setActiveKey(key);
              updateBadge(key);
            }
          } 
          onEdit={(targetKey, action) => {
            if (action === "add") addChatBox();
            else if (action === "remove") removeChatBox(targetKey);}}
        >
          {chatBoxes.map((
            { friend, key, msg, newMsg }) => {  
              return(         
                  <TabPane tab={<Badge count={newMsg} >{friend}</Badge> }                
                    key={key} closable={true}>                
                    <p  >{friend}'s chatbox.</p>
                      {msg.map((a,i)=>{
                        if(a.sender===me)
                        return(
                            <p key={i} style={{float: 'right',clear: 'both'}}> 
                              {a.body+'\u00A0'}                  
                            <Tag color="blue">{a.sender}</Tag>    
                            </p>
                        );
                        else
                        return(
                          <p key={i} style={{float: 'left',clear: 'both'}}>
                            <Tag color="blue">{a.sender}</Tag>
                            {'\u00A0'+a.body}
                          </p>);
                        }) }            
                  </TabPane>
              );
            })                                              
        } 
         </Tabs>
         <ChatModal
          visible = {modalVisible}
          onCreate = { ({ name }) => { 
            server.sendEvent({
              type: 'CHAT',
              data: { to: name, name: me },
            });       
            setModalVisible(false);
          }}
          onCancel={() => {
            setModalVisible(false);
          }}
        />

        </div>
        <Input.Search
          value={messageInput}
          onChange={(e) => 
            setMessageInput(e.target.value)}
          enterButton="Send"
          placeholder="Enter message here..."
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
            sendMessage({ key: activeKey, body: msg });
            setMessageInput("");
          }}
        ></Input.Search> 
    </>);
  };
  export default ChatRoom;