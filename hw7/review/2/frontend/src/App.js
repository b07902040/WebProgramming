import './App.css';
import { useState, useEffect } from "react";
import ChatRoom from './Containers/ChatRoom';
import SignIn from './Containers/SignIn';
import { message } from 'antd';

const LOCALSTORAGE_KEY = "save-me"
function App() {
  const savedMe = localStorage.getItem(LOCALSTORAGE_KEY)
  const [signedIn, setSignedIn] = useState(false)
  const [me, setMe] = useState(savedMe || "")
  
  useEffect(() => {
    if(signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, me)
    }
  }, [signedIn, me])

  const displayStatus = (payload) => {
    if(payload.msg) {
      const {type, msg} = payload
      const content = {
        content: msg, duration: 0.5
      }
      switch (type){
        case 'success':
          message.success(content)
          break
        case "error":
        default:
          message.error(content)
          break
      }
    }
  }
  return (
    <div className="App">
      {signedIn? (<ChatRoom me={me} displayStatus={displayStatus}/>) : (<SignIn me={me} setMe={setMe} setSignedIn={setSignedIn} displayStatus={displayStatus}/>)}
    </div>
  );
}

export default App;
