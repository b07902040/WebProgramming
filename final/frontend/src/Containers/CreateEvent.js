import "../App.css";
import { useState, useEffect } from "react";
import { Button, Input, TimePicker, Col, Row, List, Form, Checkbox } from "antd";
import MultipleDatePicker from "./MultipleDatePicker";
import { RightOutlined } from '@ant-design/icons';

const CreateEvent = ({displayStatus, setNewEvent, setPollDates, server,
  eventName,
  getEventCode,
  currentUserName,
  password}) => {

  server.onmessage = (evt) => {
    var msg = JSON.parse(evt.data);
    switch (msg.type) {
      case 'CreateEventSuccess': {
        setDates([]);
        setTimeInterval(null);
        setPollDates(true);
        break;
      }
      default: {} 
    }
  };

  const [dates, setDates] = useState([]);
  const [timeInterval, setTimeInterval] = useState(null);
  const [datePre, setDatePre] = useState([]);
  const [addButton, setAddButton] = useState(true);
  const [OKButton, setOKButton] = useState(true);
  const [docs] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [eventCode, setEventCode] = useState(getEventCode);

  useEffect(() => {
    if ( timeInterval !== null ) {
      if ( dates.length !== 0 && timeInterval.length >= 1 ) {
        setAddButton(false);
      }
      else {
        setAddButton(true);
      }
    }
    else {
      setAddButton(true);
    }
  },[dates, timeInterval]);

  useEffect(() => {
    if ( eventCode === "" || eventCode === null ) {
      setOKButton(true);
      return;
    }
    if ( datePre !== null ) {
      if ( datePre.length !== 0 ) {
        setOKButton(false);
      }
      else {
        setOKButton(true);
      }
    }
    else {
      setOKButton(true);
    }
  },[datePre, eventCode]);

  function isItemInArray (arr, ele) {
    for ( var k = 0; k < arr.length; k++ ) {
      if (arr[k][0] === ele[0]) {
        return true;
      } 
    }
    console.log(ele[0]);
    return false;
  }

  return (
    <div>
      <div className="App-title" style={{ marginBottom:30 }}><h1>{eventName}</h1></div>
      <div className="App-subtitle">
        <Row>
          <Col span={5} offset={8}>
            <Form
              layout="Inline"
            >
            <Form.Item
              label="Invite code :"
              name="Invite code :"
              rules={[
                {
                  required: true,
                  message: 'Please Input Invite code!',
                },
              ]}
            >
              <Input 
                value={eventCode}
                placeholder={eventCode}
                size="small"
                onChange={ (e) => {setEventCode(e.target.value)} }
              />
            </Form.Item>
            </Form>
          </Col>
          <Col span={4}>
            <Checkbox 
              onChange={(e) => {
                setIsHidden(!isHidden);
              }}
              className="Checkbox-isHidden"
              style={{color: "white" }}
            >Hidden poll</Checkbox>
          </Col>
        </Row>
        </div>
        <Row>
          <Col span={4} offset={2}>
            <TimePicker.RangePicker 
              className="time-picker" 
              minuteStep={10}
              size="medium"
              justify="center" 
              align="middle"
              format="HH:mm"
              value={timeInterval} 
              onChange={(time) => {
                setTimeInterval(time);
              }}
            />
          </Col>
          <Col span={8}>
            <MultipleDatePicker value={dates} onChange={setDates} />
          </Col>
          <Col span={1}>
            <Button 
            type="default"
            className="button_add"
            justify="center" 
            align="middle"
            disabled={addButton}
            onClick={(e) => {
              var newDatePre = [...datePre];
              var arrDates = [];
              setDates(dates.sort((a,b) => a.format('YYYYMMDD') - b.format('YYYYMMDD')));
              dates.forEach( (date) => {
                var arrdate = [];
                arrdate[0] = date.format('YYYY/MM/DD'); //for present
                arrdate[1] = date.format('YYYY');
                arrdate[2] = date.format('MMM');
                arrdate[3] = date.format('D');
                arrdate[4] = date.format('ddd');
                arrDates.push(arrdate); 
              });
              if ( datePre.length !== 0 ) {
                const timeExist1 = datePre.findIndex(ele => ele[0][0]===timeInterval[0].format('HH:mm') && ele[0][1]===timeInterval[1].format('HH:mm'));
                console.log(timeExist1);
                if ( (timeExist1 !== -1)) {
                  datePre[timeExist1][1].forEach( (date) => {
                    if(!isItemInArray(arrDates, date)) {
                      arrDates.push(date); 
                    }
                  });
                  arrDates = arrDates.sort((a,b) => a[0] - b[0]);
                  newDatePre[timeExist1][1] = arrDates;
                  setDatePre(newDatePre);
                  return;
                }
              }
              var arrTime = [];
              timeInterval.forEach( (time) => arrTime.push(time.format('HH:mm')));
              var pushItem = [];
              pushItem[0] = arrTime;
              pushItem[1] = arrDates;
              newDatePre.push(pushItem);
              setDatePre([...newDatePre]);
            }}
            ><RightOutlined /></Button>
          </Col>
          <Col span={8}>
          <List
              bordered="false"
              dataSource={datePre}
              className="Had-add-dates"
              size="small"
              renderItem={(item) => (
                <List.Item >
                  <List.Item.Meta
                    className="Had-add-content"
                    avatar={<Button
                    danger
                    type="dashed" 
                    size="small"
                    className="delete-list-item"
                    onClick = { () => {
                      console.log("delete");
                      console.log(item)
                      const timeExist1 = datePre.findIndex(ele => ele[0][0]===item[0][0] && ele[0][1]===item[0][1]);
                      if ( (timeExist1 !== -1) ) {
                        var newDatePre = [...datePre];
                        newDatePre.splice(timeExist1, 1);
                        setDatePre([...newDatePre]);
                      }
                    }} 
                    >X</Button>}
                    title={<p className="Had-add-title">{item[0][0]}~{item[0][1]}</p>}
                    description={
                      item[1].map( (it, idx) => { 
                          return <span>{it[0]} | </span>
                      } )
                    }
                  />
                </List.Item>
              )}
          />
          </Col>
        </Row>
        <Button 
          type=""
          style={{ width: 150, margin: 75 }}
          justify="center" 
          align="middle"
          onClick={(e) => {
            setNewEvent(false);
          }}
        >Back</Button>
        <Button 
          type="primary"
          style={{ width: 150, margin: 75, marginTop: 150 }}
          justify="center" 
          align="middle"
          disabled={OKButton}
          onClick={(e) => {
            var dateUp = [];
            datePre.forEach( (time_dates) => {
              time_dates[1].forEach( (date) => {
                dateUp.push({
                  year: date[1],
                  month: date[2],
                  day: date[3],
                  week: date[4],
                  time_s: time_dates[0][0],
                  time_end: time_dates[0][1],
                  forSort: date[0]+time_dates[0][0]+time_dates[0][1]  
                })
              })
            })
            dateUp = dateUp.sort((a,b) => {
              return ('' + a.forSort).localeCompare(b.forSort);
            });
            console.log(isHidden);
            server.sendEvent({
              type: 'CreateEvent-and-User',
              data: {
                eventName: eventName,
                eventCode: eventCode,
                userName: currentUserName,
                password: password,
                dates: dateUp,
                docs: docs,
                isHidden: isHidden,
                creater: currentUserName,
              }
            });
          }}
        >OK</Button>
        
    </div>
  );
  
};
export default CreateEvent;