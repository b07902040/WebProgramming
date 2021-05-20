import { Router } from 'express';
import ScoreCard from '../../models/ScoreCard';

const router = Router();

router.post('/create-card', async function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    
    // TODO:
    // - Create card based on { name, subject, score } of req.xxx
    // - If {name, subject} exists,
    //     update score of that card in DB
    //     res.send({card, message}), where message is the text to print
    //   Else
    //     create a new card, save it to DB
    var card = new ScoreCard({
      name: req.name,
      subject: req.subject,
      score: req.score
    })
    var message = "mytest";
    res.send({card, message})
  } catch (e) {
    res.json({ message: 'Something went wrong...' });
  }
});

// TODO: delete the collection of the DB
router.delete('/DELETE', (req, res) => {
  console.log("hiii");

  res.json({ mag: 'Delete all Card' })
})

// TODO: implement the DB query
// route.xx(xxxx)

export default router;
