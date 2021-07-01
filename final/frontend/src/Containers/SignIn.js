import "../App.css";
import { Form, Input, Button, Checkbox, Row, Col } from "antd";
import { useState } from "react";


const SignIn = ({ me, setMe, setNewEvent, setPollDates, 
  displayStatus, server, setsendEventName, setCurrentUserName, 
  setsendEventCode, setsendPassword}) => {
  
  server.onmessage = (evt) => {
    var msg = JSON.parse(evt.data);
    console.log(msg.type);
    switch (msg.type) {
      case "EventNotFound": {
        displayStatus({
          type: "error",
          msg: "Event doesn't exist.",
        });
        break;
      }
      case 'EventCodeError': {
        displayStatus({
          type: "error",
          msg: "Invaild Invite Code",
        });
        break;
      }
      case 'PasswordError': {
        displayStatus({
          type: "error",
          msg: "Invalid Password",
        });
        break;
      }
      case 'Check-OK-Login': {
        setsendEventName(eventName);
        setsendEventCode(eventCode);
        setCurrentUserName(userName);
        setsendPassword(password);
        setPollDates(true);
        break;
      }

      case 'EventHad': {
        displayStatus({
          type: "error",
          msg: "Event Already Exists",
        });
        break;
      }

      case 'Check-OK-Create': {
        setsendEventName(eventName);
        setsendEventCode(eventCode);
        setCurrentUserName(userName);
        setsendPassword(password);
        setNewEvent(true);
        break;
      }
      default: {}
    }
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [isNewEvent, setIsNewEvent] = useState(false);

  return (
    <div >
      <div className="App-title" style={{ marginBottom:45 }}><h1>Polling Events</h1></div>
      <Row>
        <Col span={6} offset={9}>
          <Form
            name="basic"
            layout="vertical"  
            initialValues={{
              remember: true,
            }}
            
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
        <Form.Item
          label="Event name"
          name="Event Name"
          style={{ color: "white" }}
          rules={[
            {
              required: true,
              message: 'Please Input Event Name!',
            },
          ]}
        >
          <Input 
            value={eventName}
            onChange={ (e) => {setEventName(e.target.value)} }/>
        </Form.Item>
        <Form.Item
          label="Invite code"
          name="Invite Code"
          rules={[
            {
              required: true,
              message: 'Please Input Invite Code!',
            },
          ]}
        >
          <Input 
            value={eventCode}
            onChange={ (e) => {setEventCode(e.target.value)} }/>
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please Input your username!',
            },
          ]}
        >
          <Input 
            value={userName}
            onChange={ (e) => {setUserName(e.target.value)} }/>
        </Form.Item>

        <Form.Item
          label="Password (Only for this event)"
          name="Password (Only for this event)"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input.Password 
          value={password}
          onChange={ (e) => {setPassword(e.target.value)} }/>
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
        >
          <Checkbox style={{color: "white" }}>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <div>
            <nobr style={{color: "white" }}>Don't have a Event?  </nobr>
              <Checkbox
                style={{ marginBottom: 20, marginLeft: 20, color: "white" }} 
                onChange={(e) => {
                  setIsNewEvent(!isNewEvent);
                }}
              >
                New Event
              </Checkbox>
          </div>
          <Button 
            type="primary" 
            style={{ width: 100, margin: 10 }}
            htmlType="Enter" 
            onClick={ () => {
              if ( userName!=="" && eventName!=="" && eventCode!=="") {
                if (isNewEvent) {
                  server.sendEvent({
                    type: 'Check-to-Create',
                      data:{
                        username: userName,
                        password: password,
                        eventName: eventName,
                        eventCode: eventCode, 
                      },
                  });
                }
                else {
                  server.sendEvent({
                    type: 'UserLogin',
                    data: {
                      username: userName,
                      password: password,
                      eventName: eventName,
                      eventCode: eventCode, 
                    },
                  });
                }
              }
            }}
          >
            Enter
          </Button>
        </Form.Item>
      </Form></Col> 
      </Row> 
    </div>
  );
};

export default SignIn;
