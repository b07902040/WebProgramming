import { Router } from 'express';
import ScoreCard from '../../models/ScoreCard.js';
//let ScoreCard = require('../../models/ScoreCard');
const router = Router();
//const scoreCardRouter = Router();
router.post('/create-card', async function (req, res) {
  try {
    console.log("here is route/scoreCard");
    //res.json({ message: 'just try' });
    //const newScoreCard = new ScoreCard({name, subject, score});
    //console.log("Created ScoreCard", newScoreCard)

    //const newCard = {name: req.name, subject: req.subject, score: req.score};
    const data = req.body;
    const newCard = new ScoreCard(data);
    await newCard.save();
    //const message = "successfully add";
    res.send({
      "card" : newCard,
      "message" : "Adding (" + data.name +", " + data.subject + ", " + data.score + ")"
    });
    /*newCard.save((error)=>{
      if (error) {
        res.status(500).json({ msg: "sorry, internal server errors" });
        return;
      }
      return res.json({
        msg: "Your data has been saved!!!"
      });
    });*/

    // TODO:
    // - Create card based on { name, subject, score } of req.xxx
    // - If {name, subject} exists,
    //     update score of that card in DB
    //     res.send({card, message}), where message is the text to print
    //   Else
    //     create a new card, save it to DB
    //     res.send({card, message}), where message is the text to print
  } catch (e) {
    res.json({ message: 'Something went wrong...' });
  }
});

router.delete('/create-card', async function (req, res) {
  try {
    await ScoreCard.deleteMany({});
    console.log("Database deleted");
    res.send({
      "message" : "Database cleared"
    });
  } catch (e) {
    res.json({ message: "Database deletion failed" });
  }
} );

// TODO: delete the collection of the DB
// router.delete(...)

router.get('/create-card', async function (req, res) {
  try {
    //await ScoreCard.find({ 'name': "Mary"});
    const data = req.body;
    const querytypee = data.queryType;
    console.log(querytypee);
    console.log(req.queryString);
    console.log(req.body.queryString);
    const query = await ScoreCard.find().where('name').equals("Mary").select("name subject score").exec();
    //const query = ScoreCard.find({ name: 'Mary' });
    //console.log(query);
    const strQuery = JSON.stringify(query);
    res.send({
      "message" : strQuery
    });
  } catch (e) {
    res.json({ message: "Failed to query" });
  }
});

// TODO: implement the DB query
// route.xx(xxxx)

export default router;
