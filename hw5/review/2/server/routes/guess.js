import express from "express"
import getNumber from '../core/getNumber'
import {guess} from "../../src/axios";
import path from "path";

String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

function getTime(isFileName=false){
    let date = new Date();
    if (!isFileName) {
        return [
            String(date.getFullYear()).lpad("0", 4),
            String(date.getMonth()).lpad("0", 2),
            String(date.getDay()).lpad("0", 2),
            String(date.getHours()).lpad("0", 2),
            String(date.getMinutes()).lpad("0", 2),
            String(date.getSeconds()).lpad("0", 2)
        ].join('-');
    }
    else {
        return [
            String(date.getFullYear()).lpad("0", 4),
            String(date.getMonth()).lpad("0", 2),
            String(date.getDay()).lpad("0", 2),
            String(date.getHours()).lpad("0", 2),
            String(date.getMinutes()).lpad("0", 2),
        ].join('-');
    }
}

const fs = require('fs');
if (!fs.existsSync(path.join('server', 'log'))){
    fs.mkdirSync(path.join('server', 'log'));
}

const filename = path.join('server', 'log', `${getTime(true)}.log`);
function writeFile(data=""){
    fs.appendFile(
        filename, data,
        (err) => {
            if (err) {
                console.log(`Write log error:\n${err}`);
            }
        });
}
writeFile();

const router = express.Router()

function roughScale(x, base) {
    const parsed = parseInt(x, base)
    if (isNaN(parsed)) {
        return 0
    }
    return parsed
}

// Just call getNumber(true) to generate a random number for guessing game
router.post('/start', (_, res) => {
    const number = getNumber(true);
    writeFile(`start number=${number} ${getTime()}\n`)
    res.json({msg: 'The game has started.'})
})

router.get('/guess', (req, res) => {
    const number = getNumber()
    const guessed = roughScale(req.query.number, 10)

    writeFile(`guess ${guessed} ${getTime()}\n`)

    // check if NOT a num or not in range [1,100]
    if (!guessed || guessed < 1 || guessed > 100) {
        res.status(400).json({msg: 'Not a legal number.'})
    }
    else {
        // TODO: check if number and guessed are the same,
        // and response with some hint "Equal", "Bigger", "Smaller"
        if (guessed < number) {
            res.json({msg: 'Bigger'})
        }
        else if (guessed > number){
            res.json({msg: 'Smaller'})
        }
        else {
            res.json({msg: 'Equal'})
            writeFile(`end-game\n`)
        }
    }
})

// TODO: add router.post('/restart',...)
router.post('/restart', (_, res) => {
    const number = getNumber(true)
    writeFile(`restart number=${number} ${getTime()}\n`)
    res.json({msg: 'The game has started.'})
})

export default router
