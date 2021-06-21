import "./App.css";
import { useState, useEffect } from "react";
import ChatRoom from './Containers/ChatRoom';
import SignIn from './Containers/SignIn';
import { message } from "antd";

const LOCALSTORAGE_KEY = "save-me";

const server = new WebSocket('ws://localhost:8080');
server.onopen = () => console.log('Connect server scucess.');
server.sendEvent = (e) => server.send(JSON.stringify(e));


const App = () => {
  const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);
  const [signedIn, setSignedIn] = useState(false);
  const [me, setMe] = useState(savedMe || "");
  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, me);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn]);
  const displayStatus = (payload) => {
    if ( payload.msg ) {
      const { type, msg } = payload;
      const content = {
        content: msg, duration:0.5 }
      switch(type) {
        case 'success':
          message.success(content)
          break
        case 'error':
        default:
          message.error(content)
          break
      }
    }
  }

  return (
    <div className="App">
      {signedIn? (<ChatRoom me={me} displayStatus={displayStatus} server={server}/>) : (
        <SignIn
          me={me}
          setMe={setMe}
          setSignedIn={setSignedIn}
          displayStatus={displayStatus}
        />)}
    </div>
  );
};

export default App;