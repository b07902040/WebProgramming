import "../App.css";
import { useState, useEffect } from "react";
import { Button, Input, TimePicker, Col, Row, List } from "antd";
import MultipleDatePicker from "./MultipleDatePicker";
import moment from "moment";

const CreateEvent = ({displayStatus, setNewEvent, setPollDates, server,
  eventName,
  eventCode,
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
  const [seldb, setSeldb] = useState([]);

  const onChange = time => {
    setTimeInterval(time);
  };

  useEffect(() => {
    var newSeldb = [];
    for ( let i = 0; i < dates.length; i++ ) {
      newSeldb.push(dates[i].format('YYYYMMDD'));
    }
    setSeldb(newSeldb);
    console.log(seldb);
  },[dates]);

  return (
    <div>
      <div className="App-title"><h1>{eventName}</h1></div>
      <p className="App-subtitle">Invitation Code : {eventCode}</p>
        <Row>
          <Col span={8} offset={3}>
            <MultipleDatePicker value={dates} onChange={setDates} />
          </Col>
          <Col span={8} offset={3}>
          <List
              size="large"
              bordered
              dataSource={seldb}
              renderItem={(item) => (
                <List.Item extra={<Button size="small">Remove</Button>}>
                  {item}
                </List.Item>
              )}
          />
          </Col>
        </Row>
        <Button 
          type="primary"
          style={{ width: 50, margin: 50 }}
          justify="center" 
          align="middle"
          onClick={(e) => {
            setNewEvent(false);
          }}
        >=></Button>
        <Row>
          <Col span={8} offset={3}>
            <TimePicker.RangePicker 
              className="time-picker" 
              minuteStep={30}
              size="medium"
              justify="center" 
              align="middle"
              format="HH:mm"
              value={timeInterval} 
              onChange={onChange}
            />
          </Col>
        </Row>
        <Button 
          type="primary"
          style={{ width: 150, margin: 50 }}
          justify="center" 
          align="middle"
          onClick={(e) => {
            setNewEvent(false);
          }}
        >Back</Button>
        <Button 
          type="primary"
          style={{ width: 150, margin: 50 }}
          justify="center" 
          align="middle"
          onClick={(e) => {
            setDates(dates.sort((a,b) => a.format('YYYYMMDD') - b.format('YYYYMMDD')))
            var trueDates = [];
            dates.forEach( (date) => trueDates.push({
              year: date.format('YYYY'),
              month: date.format('MMM'),
              day: date.format('D'),
              week: date.format('ddd'),
            }));
            console.log(timeInterval);
            var startt = moment(timeInterval[0]).format('HH:mm');
            var endt = moment(timeInterval[1]).format('HH:mm');
            var numbert = [];
            numbert.push(2*parseInt(startt.toString().slice(0, 2)));
            if ( startt.toString().slice(3) === '30' ) numbert[0]++;
            numbert.push(2*parseInt(endt.slice(0, 2)));
            if ( endt.toString().slice(3) === '30' ) numbert[1]++;
            server.sendEvent({
              type: 'CreateEvent-and-User',
              data: {
                eventName: eventName,
                eventCode: eventCode,
                userName: currentUserName,
                password: password,
                dates: trueDates,
                times: numbert,
                rawtimes: timeInterval,
              }
            });
          }}
        >OK</Button>
        
    </div>
  );
  
};
export default CreateEvent;