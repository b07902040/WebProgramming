import express from 'express'
import getNumber from '../core/getNumber'
import * as fs from 'fs';

Date.prototype.format = function (format) {
  var args = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
      "S": this.getMilliseconds()
  };
  if (/(y+)/.test(format))
      format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var i in args) {
      var n = args[i];
      if (new RegExp("(" + i + ")").test(format))
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
  }
  return format;
};

const router = express.Router()
let logFileName = `./server/log/${new Date().format("yyyy-MM-dd-hh-mm")}.log`
console.log(logFileName)
  
fs.open(logFileName, 'w+', function (err1, fd) {
  try{
    if(err1){
      throw new Error(`no file at ${logFileName}`);
    }
  }catch(err){
    console.error(err)
  }
});

function roughScale(x, base) {
  const parsed = parseInt(x, base)
  if (isNaN(parsed)) {
    return 0
  }
  return parsed
}

// Just call getNumber(true) to generate a random number for guessing game
router.post('/start', (_, res) => {
  const number = getNumber(true)
  
  
  // fs.open(logFileName, 'w+', function (err1, fd) {
  //   try{
  //     if(err1){
  //       throw new Error(`no file at ${logFileName}`);
  //     }
  //     fs.writeFile(fd, `start number=${number} ${new Date().format("yyyy-MM-dd-hh-mm")}\n`, function(err2) {
  //       // if(err) console.log('error', err);
  //     });
  //     res.json({ msg: 'The game has started.' })
  //   }catch(err){
  //     console.error(err)
  //   }
  // });
  try{
    fs.writeFile(logFileName, `start number=${number} ${new Date().format("yyyy-MM-dd-hh-mm")}\n`, function(err2) {
      // if(err) console.log('error', err);
    });
  }catch(err){
    console.error(err.message)
  }
  res.json({ msg: 'The game has started.' })
})

router.get('/guess', (req, res) => {
  const number = getNumber()
  const guessed = roughScale(req.query.number, 10)
  try{
    fs.appendFile(logFileName, `guess ${guessed} ${new Date().format("yyyy-MM-dd-hh-mm")}\n`, function(err2) {
    });
  }catch(err){
    console.error(err.message)
  }
  

  // check if NOT a num or not in range [1,100]
  if (!guessed || guessed < 1 || guessed > 100) {
    res.status(200).send({ msg: 'Not a legal number.' })
  }
  else {
    // TODO: check if number and guessed are the same,
    // and response with some hint "Equal", "Bigger", "Smaller"
    if (number === guessed) {
      res.status(200).send({ msg: 'Equal'})
      try{
        fs.appendFile(logFileName, `end-game\n`, function(err2) {
        });
      }catch(err){
        console.error(err)
      }
    }
    else if (guessed > number) {
      res.status(200).send({ msg: 'Smaller' })
    }
    else if (guessed < number) {
      res.status(200).send({ msg: 'Bigger' })
    }
  }
})

// TODO: add router.post('/restart',...)
router.post('/restart', (_, res) => {
  const number = getNumber(true);
  try{
    fs.appendFile(logFileName, `restart number=${number}\n`, function(err2) {
    });
  }catch(err){
    console.error(err)
  }

  res.json({ msg: 'The game has restarted.' })
})

export default router
