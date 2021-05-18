import Station from '../models/station'

const tidyUpData = (data, result) => {
  var line1 = data[0].station_type;
  var line2 = "test";
  for ( let i = 1; i < data.length; i++ ) {
    if ( line1 !== data[i].station_type ) {
      line2 = data[i].station_type;
      break;
    }
  }
  var l1 = [];
  var l2 = [];
  for ( let i = 0; i < data.length; i++ ) {
    if ( data[i].station_type === line1 ) {
      l1.push(data[i]);
    }
    else {
      l2.push(data[i]);
    }
  }
  l1.sort(function(a, b) {return a.station_order>b.station_order? 1:-1;})
  l2.sort(function(a, b) {return a.station_order>b.station_order? 1:-1;})
  var result = new Object();
  result[line1] = l1;
  result[line2] = l2;
  return result
}

const calculate = (data, start, end) => {
  let startLine = start[0]
  let endLine = end[0]
  let startInd = parseInt(start.slice(1, start.length)) - 1
  let endInd = parseInt(end.slice(1, end.length)) - 1
  let intersection = data[startLine].filter(s => data[endLine].some(a => a.station_name === s.station_name))[0]
  let intersection_ano = data[endLine].filter(s => data[startLine].some(a => a.station_name === s.station_name))[0]
  let dis = 0

  if (startLine !== endLine && start === intersection) {  // if start from intersection
    startLine = endLine
    startInd = intersection_ano.station_order - 1
  }

  if (startInd > endInd && startLine === endLine) { // check end order > start order
    return -1
  }
  else if (endInd === startInd && startLine === endLine) { // check whether same station
    return 0
  }
  else if (startLine !== endLine && startInd === intersection.station_order - 1 && endInd === intersection_ano.station_order - 1) { // check whether intersection
    return 0
  }
  else if (startLine !== endLine && startInd < intersection.station_order - 1 && endInd < intersection_ano.station_order - 1) { // check invalid route passing through intersection (end with smaller station order)
    return -1
  }
  else if (startLine !== endLine && startInd > intersection.station_order - 1) { // check invalid route passing through intersection (begin beyond intersection)
    return -1
  }
  
  if (startLine === endLine) { // same line (R -> R or G -> G)
    for (let i = startInd; i < endInd; i++) {
      dis += data[startLine][i].distance_to_next
    }
    return dis
  }
  else { // R -> G or G -> R
    for (let i = startInd; i < intersection.station_order - 1; i++) {
      dis += data[startLine][i].distance_to_next
    }

    for (let i = intersection_ano.station_order - 1; i < endInd; i++) {
      dis += data[endLine][i].distance_to_next
    }

    return dis
  }
}

// 1st API
const GetStations = async (req, res) => {
  let data = []
  let result = {}

  try {
    // fetch data from mongo
    data = await Station.find();
    result = tidyUpData(data, result)  

    if (Object.keys(result).length) {
      // return correct response here ...
      res.status(200).send({ message: 'success', data: result })
    }
    else {
      res.status(403).send({ message: 'error', data: [] })
      throw new Error('Something Wrong !')
    }
  } catch (err) {
    console.error(err.name + ' ' + err.message)
    // return correct response here ...
  }
}

// 2nd API
const CalculateDistance = async (req, res) => {
  let data = []
  let result = {}
  let answer = -1

  try {
    const start = '' // get parameter from frontend
    const end = '' // get parameter from frontend

    // fetch data from mongo
    // coding here ...
    
    result = tidyUpData(data, result)
    answer = calculate(result, start, end)

    if (Object.keys(result).length) {
      // return correct response here ...
    }
    else {
      throw new Error('Something Wrong !')
    }
  } catch (err) {
    console.error(err.name + ' ' + err.message)
    // return correct response here ...
  } 
}

export { GetStations, CalculateDistance }
