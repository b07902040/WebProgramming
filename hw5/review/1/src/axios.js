import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000/api/guess' })

const startGame = async () => {
  try{
    const {
      data: { msg }
    } = await instance.post('/start')
    return msg
  }catch(err){
    return 'server down'
  }
}

const guess = async (number) => {
  // TODO: Change this to catch error
  // The error message should be: Error: "xx" is not a valid number (1 - 100)
  try{
    const {
      data: { msg }
    } = await instance.get('/guess', { params: { number } })
    return msg
  }catch(err){
    return 'server down'
  }  
}

const restart = async () => {
  try{
    const {
      data: { msg }
    } = await instance.post('/restart')
    return msg
  }catch(err){
    return 'server down'
  }  
}

export { startGame, guess, restart }
