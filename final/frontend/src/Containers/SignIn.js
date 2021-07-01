import "../App.css";
import { Form, Input, Button, Checkbox, Row, Col } from "antd";
import { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";

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
        //setEventName("");
        //setEventCode("");
        break;
      }
      case 'EventCodeError': {
        displayStatus({
          type: "error",
          msg: "Invaild Invitation Code",
        });
        //setEventCode("");
        break;
      }
      case 'PasswordError': {
        displayStatus({
          type: "error",
          msg: "Invalid Password",
        });
        //setPassword("");
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
        setEventName("");
        setEventCode("");
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

  return (
    <>
      <div className="App-title"><h1>Login</h1></div>
      <Row>
        <Col span={8} offset={8}>
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
          label="Event Name"
          name="Event Name"
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
          label="Invitation Code"
          name="Invitation Code"
          rules={[
            {
              required: true,
              message: 'Please Input Invitation Code!',
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
          label="Password(Optional)"
          name="password"
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
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            style={{ width: 100, margin: 10 }}
            htmlType="Enter" 
            onClick={ () => {
              if ( userName!=="" && eventName!=="" && eventCode!=="") {
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
            }}
          >
            Enter
          </Button>
          <div>
            <nobr>Don't have a Event?</nobr>
            <Button 
              type="link"
              style={{ width: 100 }} 
              htmlType="Enter" 
              onClick={ () => {
                if ( userName!=="" && eventName!=="" && eventCode!=="") {
                  server.sendEvent({
                    type: 'Check-to-Create',
                      data: {
                        username: userName,
                        password: password,
                        eventName: eventName,
                        eventCode: eventCode, 
                      },
                  });
                }
              }}
            >
              New Event
            </Button>
          </div>
        </Form.Item>
      </Form></Col> 
      </Row>
      
    </>
  );
};

export default SignIn;
