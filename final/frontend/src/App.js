import "./App.css";
import { useState, useEffect } from "react";
import CreateEvent from './Containers/CreateEvent';
import SignIn from './Containers/SignIn';
import PollDates from './Containers/PollDates';
import { message } from "antd";
import Background from "./beach.jpg";
const LOCALSTORAGE_KEY = "save-me";

const server = new WebSocket('ws://localhost:5050');
server.onopen = () => console.log('Connect server scucess.');
server.sendEvent = (e) => server.send(JSON.stringify(e));

const App = () => {
  const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);
  
  const [eventName, setEventName] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [password, setPassword] = useState("");

  const [pollDates, setPollDates] = useState(false);
  const [newEvent, setNewEvent] = useState(false);
  const [me, setMe] = useState(savedMe || "");
  useEffect(() => {
    if (newEvent) {
      localStorage.setItem(LOCALSTORAGE_KEY, me);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newEvent]);
  const displayStatus = (payload) => {
    if ( payload.msg ) {
      const { type, msg } = payload;
      const content = {
        content: msg, duration:1 }
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
    <div className="App" style={{backgroundImage: `url(${Background})`}}>
      { (pollDates)?  (
        <PollDates 
          server={server}
          eventName={eventName}
          eventCode={eventCode}
          currentUserName={currentUserName}
          displayStatus={displayStatus}
          setNewEvent={setNewEvent}
          setPollDates={setPollDates}
        />) : ( (newEvent)? (
        <CreateEvent 
          displayStatus={displayStatus}
          setPollDates={setPollDates} 
          server={server}
          eventName={eventName}
          getEventCode={eventCode}
          currentUserName={currentUserName}
          password={password}
          setsendEventName={setEventName}
          setNewEvent={setNewEvent}
        />) : (
          <SignIn
          me={me}
          setMe={setMe}
          setNewEvent={setNewEvent}
          setPollDates={setPollDates} 
          displayStatus={displayStatus}
          server={server}
          setsendEventName={setEventName}
          setsendEventCode={setEventCode}
          setsendPassword={setPassword}
          setCurrentUserName={setCurrentUserName}
        />)
        )}
    </div>
  );
};

export default App;