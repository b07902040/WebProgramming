import "../App.css";
import { Table, Checkbox, Button, Col } from "antd";
import { useState, useEffect } from "react";
import { CheckCircleTwoTone } from '@ant-design/icons';

var first = true;

const PollDates = ({server, eventName, eventCode, currentUserName, 
  displayStatus, setNewEvent, setPollDates}) => {
  const [data, setData] = useState([{
    key: 0,
    username: "Participant",
    toColumns: 0,
    isDisable: true,
    selected: [],
  }]);
  const [columns, setColumns] = useState([]);
  var dateNum = [];
  const [submitted, setSubmitted] = useState(false);
  const [lastSelect, setLastSelect] = useState([]);

  
  useEffect(() => {
    console.log("Effect", data);
  },[data]);
  
  if ( first ) {
    console.log("Polldate: ", eventCode);
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
          data: {
            dates,
            result,
            isHidden,
            creater,
          },
        } = message;
        var repeat = false;
        for ( let i = 0; i < result.length; i++ ) {
          if (result[i].username === currentUserName) {
            repeat = true;
            initData(result, dates, repeat);
            initColumns(dates, result, 1, isHidden, creater);
            setData([...data]);
            setSubmitted(true);
          }
        }
        if ( !repeat ) {
          initData(result, dates, repeat);
          initColumns(dates, result, 0, isHidden, creater);
          setData([...data]);
        }
        break;
      }
      case 'updateEvent': {
        const {
          data: {
            dates,
            result,
            isHidden,
            creater,
          },
        } = message;
        updateData(result, dates);
        initColumns(dates, result, 1, isHidden, creater);
        setData([...data]);
        break;
      }
      case 'resetEvent': {
        const {
          data: {
            dates,
            result,
            isHidden,
            creater,
          },
        } = message;
        setSubmitted(false);
        resetData(result, dates);
        initColumns(dates, result, -1, isHidden, creater);
        //setData([...data]);
        break;
      }
      default: {}
    }
  };

  const handleCheckboxChangeFactory = (rowIndex, colIndex) => event => {
    var newData = data.slice(0);
    newData[rowIndex].selected[colIndex] = event.target.checked;
    var newLastSelect = lastSelect;
    newLastSelect[colIndex] =  event.target.checked;
    setLastSelect(newLastSelect);
    setData([...newData]);
  };

  const initColumns = (dates, result, offest, isHidden, creater) => {
    console.log("initColumns");
    let newColumns = [];
    let notShow = isHidden && (creater !== currentUserName);
    console.log(isHidden);
    console.log(creater);
    newColumns.push({
      title: '',
      dataIndex: 'username',
      key: 'username',
      render: (username, record) => {
        if ( record.toColumns === 0 ) {
          return {
            children: (offest === -1)?
              <p className="column-participant">{result.length-1} {username}</p>:
              <p className="column-participant">{result.length} {username}</p>
          };
        }
        else {
          if ( notShow ) {
            return {
              children: (username===currentUserName)? 
              <p className="column-name">{username}</p> : <p className="column-name">********</p>
            };
          }
          else {
            return {
              children: <p className="column-name">{username}</p>
            };
          } 
        }
      },
      fixed: 'left',
      align: 'center',
      width: 105,
    });
    for ( let i = 0; i < dates.length; i++ ) {
      newColumns.push({
        title: () => <div>
          <p className="column-month">{dates[i].month}</p>
          <p className="column-day">{dates[i].day}</p>
          <p className="column-week">{dates[i].week}</p>
          <p className="column-time">{dates[i].time_s}</p>
          <p className="column-time">{dates[i].time_end}</p>
          </div>,
        dataIndex: 'toColumns',
        render: (toColumns) =>  { return { 
          props: {
            style: ( (toColumns===0) || (toColumns-offest === result.length+1))? 
            {  }:
            {background: (data[toColumns].selected[i])? "#c8ffa185":"#f8d0ce85"}
          },
          children:(toColumns)? (
            <Checkbox 
              defaultChecked={data[toColumns].selected[i]}
              onChange={handleCheckboxChangeFactory(toColumns, i)}
              disabled={(toColumns-offest <= result.length)}
            ></Checkbox>
        ) : (
          <nobr className="column-sum">
            <CheckCircleTwoTone twoToneColor="#52c41a" /><b>      {dateNum[i]}</b>
          </nobr>
        )}},
        key: i+1,
        align: 'center',
        width: 80,
      })
    }
    setColumns(newColumns);
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
    var newData = data;
    newData = [];
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
    var savei = -1;
    for ( let i = 0 , cnt=0; i < result.length; i++, cnt++ ) {
      for ( let j = 0; j < result[i].dateIsValid.length; j++ ) {
        if ( result[i].dateIsValid[j] === true ) {
          dateNum[j] += 1;
        }
      }
      if ( result[i].username !== currentUserName) {
        console.log("push", result[i].username);
        newData.push({
          key: cnt+1,
          username: result[i].username,
          toColumns: cnt+1,
          isFirst: true,
          selected: result[i].dateIsValid,
        })
      }
      else {
        savei = i;
        cnt--;
      }
    };
    /*
    var newLastSelect = [];
    var fillwithFalse = []
    for ( let i = 0; i < dates.length; i++ ) {
      fillwithFalse.push(false);
      if ( lastSelect[i] === true ) {
        newLastSelect.push(true);
      }
      else {
        newLastSelect.push(false);
      }
    }
    */
    console.log("push", currentUserName);
    newData.push({
      key: result.length,
      username: currentUserName,
      toColumns: result.length,
      isDisable: false,
      selected: result[savei].dateIsValid,
    });
    console.log("new", newData);
    setData(newData);
  }

  const updateData = (result, dates) => {
    console.log("updateData");
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
      <div className="App-title" style={{ marginBottom:45, marginTop:-40  }}><h1>{eventName}</h1></div>
      <Col span={14} offset={5}>
        <Table columns={columns} dataSource={data} size="small" style={{ marginTop: 30 }} 
        scroll={{ x: 900, y: 500 }}
        pagination={{ pageSize: 100 }}
        rowKey={(record) => {return (record.id + Date.now()) }}/>
      </Col>
      <Button type="primary"
        style={{ width: 100, marginRight: 100 }}
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
      >Edit</Button>
      <Button type="primary"
        style={{ width: 100 }}
        onClick = { (e) => {
          var isValid = data.pop().selected;
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
          displayStatus({
            type: "success",
            msg: "Poll success",
          });
        }}
        disabled={submitted}
      >Submit</Button>
      
    </div>
  );
};

export default PollDates;
