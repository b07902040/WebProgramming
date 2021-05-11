import axios from 'axios'

const instance = axios.create({baseURL: 'http://localhost:4000/api/guess'})

const startGame = async () => {
    let success = false;
    await instance.post('/start')
        .then(res => {
            success = true;
        })
        .catch(err => {
            success = false;
        })
    return success
}

const guess = async (number) => {
    // TODO: Change this to catch error
    // The error message should be: Error: "xx" is not a valid number (1 - 100)
    // const res = await instance.get('/guess', {params: {number}})
    // console.log("res: ", res)

    let msg = ""

    await instance.get('/guess', {params: {number}})
        .then(res => {
            msg = res.data.msg;
        })
        .catch(err => {
            if (err.response){
                alert(`Error: ${number} is not a valid number (1 - 100)`)
            }
            else{
                alert("Server NOT responding");
            }
        })

    return msg;
}

const restart = async () => {
    const {
        data: {msg}
    } = await instance.post('/restart')

    return msg
}

export {startGame, guess, restart}
