import "../App.css";
import { Table, Checkbox, Button, Input, Col } from "antd";
import { useState, useEffect, setState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { CheckCircleTwoTone } from '@ant-design/icons';

var first = true;

const PollDates = ({server, eventName, eventCode, currentUserName}) => {
  const [data, setData] = useState([{
    key: 0,
    username: "participant",
    toColumns: 0,
    isDisable: true,
    selected: [],
  }]);
  const [columns, setColumns] = useState([]);
  var dateNum = [];
  const [submitted, setSubmitted] = useState(false);

  if ( first ) {
    server.sendEvent({
      type: 'RequestEvent',
      data: { eventName: eventName, eventCode: eventCode },
    });
    first = false;
  };

  server.onmessage = (evt) => {
    var message = JSON.parse(evt.data);
    const { type } = message; 
    switch (type) {
      case 'allEvent': {
        const {
          data: { name,
            code,
            dates,
            times,
            result},
        } = message;
        var repeat = false;
        for ( let i = 0; i < result.length; i++ ) {
          if (result[i].username === currentUserName) {
            repeat = true;
            initData(result, dates, repeat);
            initColumns(dates, result, 1);
            setSubmitted(true);
          }
        }
        if ( !repeat ) {
          initData(result, dates, repeat);
          initColumns(dates, result, 0);
        }
        break;
      }
      case 'updateEvent': {
        const {
          data: { name,
            code,
            dates,
            times,
            result},
        } = message;
        updateData(result, dates);
        initColumns(dates, result, 1);
        break;
      }
      case 'resetEvent': {
        const {
          data: { name,
            code,
            dates,
            times,
            result},
        } = message;
        setSubmitted(false);
        resetData(result, dates);
        initColumns(dates, result, 0);
        break;
      }
      default: {}
    }
  };

  const handleCheckboxChangeFactory = (rowIndex, colIndex) => event => {
    var newData = data.slice(0);
    newData[rowIndex].selected[colIndex] = event.target.checked;
    setData(newData);
  };

  const initColumns = (dates, result, offest) => {
    console.log("initColumns");
    let newColumns = [];
    newColumns.push({
      title: '',
      dataIndex: 'username',
      key: 'username',
      render: (username, record) => {
        if ( record.toColumns === 0 ) {
          return {
            children: <p className="column-participant">{result.length} {username}</p>,
          };
        }
        else {
          return {
            children: <p className="column-name">{username}</p>,
          };
        }
      },
      fixed: 'left',
      align: 'center',
      width: 100,
    });
    for ( let i = 0; i < dates.length; i++ ) {
      newColumns.push({
        title: () => <div>
          <p className="column-month">{dates[i].month}</p>
          <p className="column-day">{dates[i].day}</p>
          <p className="column-week">{dates[i].week}</p>
          </div>,
        dataIndex: 'toColumns',
        render: (toColumns) =>  { return { 
          props: {
            style: ( (toColumns===0) || (toColumns-offest === result.length+1))? 
            {  }:
            {background: (data[toColumns].selected[i])? "#e0f8ce":"#f8d0ce"}
          },
          children:(toColumns)? (
            <Checkbox 
              defaultChecked={data[toColumns].selected[i]}
              onChange={handleCheckboxChangeFactory(toColumns, i)}
              disabled={(toColumns-offest <= result.length)}
            ></Checkbox>
        ) : (
          <nobr>
            <CheckCircleTwoTone twoToneColor="#52c41a"/><b>      {dateNum[i]}</b>
          </nobr>
        )}},
        key: 'toColumns',
        align: 'center',
      })
    }
    setColumns([...newColumns]);
    setData([...data]);
    console.log(submitted);
  }
  
  const initData = (result, dates, isRepeat) => {
    console.log("initData");
    var newData = data;
    for ( let j = 0; j < dates.length; j++ ) {
      dateNum[j] = 0;
    }
    for ( let i = 0; i < result.length; i++ ) {
      for ( let j = 0; j < result[i].dateIsValid.length; j++ ) {
        if ( result[i].dateIsValid[j] === true ) {
          dateNum[j] += 1;
        }
      }
      newData.push({
        key: i+1,
        username: result[i].username,
        toColumns: i+1,
        isDisable: true,
        selected: result[i].dateIsValid,
      })
    };
    if (!isRepeat) {
      var fillwithFalse = []
      for ( let i = 0; i < dates.length; i++ ) {
        fillwithFalse.push(false);
      }
      newData.push({
        key: result.length+1,
        username: currentUserName,
        toColumns: result.length+1,
        isDisable: false,
        selected: fillwithFalse,
      })
    }
    setData(newData);
  }

  const resetData = (result, dates) => {
    console.log("resetData");
    var newData = [];
    newData.push({
      key: 0,
      username: "Participant",
      toColumns: 0,
      isFirst: true,
      selected: [],
    });
    for ( let j = 0; j < dates.length; j++ ) {
      dateNum[j] = 0;
    }
    for ( let i = 0; i < result.length; i++ ) {
      for ( let j = 0; j < result[i].dateIsValid.length; j++ ) {
        if ( result[i].dateIsValid[j] === true ) {
          dateNum[j] += 1;
        }
      }
      newData.push({
        key: i+1,
        username: result[i].username,
        toColumns: i+1,
        isFirst: true,
        selected: result[i].dateIsValid,
      })
    };
    var fillwithFalse = []
    for ( let i = 0; i < dates.length; i++ ) {
      fillwithFalse.push(false);
    }
    newData.push({
      key: result.length+1,
      username: currentUserName,
      toColumns: result.length+1,
      isDisable: false,
      selected: fillwithFalse,
    });
    setData(newData);
  }

  const updateData = (result, dates) => {
    console.log("updateData");
    console.log(result);
    var newData = data;
    for ( let j = 0; j < dates.length; j++ ) {
      dateNum[j] = 0;
    }
    for ( let i = 0; i < result.length; i++ ) {
      for ( let j = 0; j < result[i].dateIsValid.length; j++ ) {
        if ( result[i].dateIsValid[j] === true ) {
          dateNum[j] += 1;
        }
      }
    };
    newData.push({ 
      key: result.length,
      username: currentUserName,
      toColumns: result.length,
      isDisable: false,
      selected: result[result.length-1].dateIsValid,
    })
    setData(newData);
  }
  
  return (
    <div>
      <div className="App-title"><h1>{eventName}</h1></div>
      <Col span={14} offset={5}>
        <Table columns={columns} dataSource={data} size="small" style={{ marginTop: 30 }} 
        scroll={{ x: 700, y: 500 }}
        pagination={{ pageSize: 100 }}
        rowKey={(record) => {return (record.id + Date.now()) }}/>
      </Col>
      <Button type="primary"
        style={{ width: 100, marginRight: 50 }}
        onClick = { (e) => {
          server.sendEvent({
            type: 'ResetResult',
            data: {
              name: eventName, 
              code: eventCode,
              username: currentUserName,
            },
          });
        }}
        disabled={!submitted}
      >Reset</Button>
      <Button type="primary"
        style={{ width: 100, marginLeft: 50 }}
        onClick = { (e) => {
          var isValid = data.pop().selected;
          console.log(isValid);
          server.sendEvent({
            type: 'UploadResult',
            data: {
              name: eventName,
              code: eventCode, 
              result:{
                username: currentUserName,
                dateIsValid: isValid,
              }
            },
          });
          var tr = true;
          setSubmitted(tr);
          console.log(submitted);
        }}
        disabled={submitted}
      >Submit</Button>
    </div>
  );
};

export default PollDates;
