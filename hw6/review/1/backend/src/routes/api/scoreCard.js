import { Router } from 'express';
import ScoreCard from '../../models/ScoreCard';

const router = Router();

router.post('/create-card', async function (req, res) {
  try {
    const card = await ScoreCard.findOne({
      name:req.body.name,
      subject:req.body.subject
    })
    if(card) {
      card.score = req.body.score
      card.save()
      res.json({
        message:`Updating (${req.body.name}, ${req.body.subject}, ${req.body.score})`,
        card:card
      })
    }
    else {
      console.log(req.body.name)
      const newCard = new ScoreCard({
        name:req.body.name,
        subject:req.body.subject,
        score  : req.body.score
      })
      res.json({
        message:`Adding (${req.body.name}, ${req.body.subject}, ${req.body.score})`,
        card:newCard
      })
      newCard.save()
    }
  } catch (e) {
    console.log(e)
    res.json({ message: 'Something went wrong...' });
  }
});

router.delete('/score-cards', async function (req, res) {
  try {
    await ScoreCard.deleteMany({})
    console.log("deleted")
    res.json({message:"Database cleared"})
  } catch (e) {
    res.json({ message: 'Delete went wrong' });
  }
});


router.get('/card-query', async function (req, res) {
  try {
    // console.log(req)
    console.log(req.query.type, req.query.string)
    const cards = await ScoreCard.find({
        [req.query.type]:req.query.string
      }
    )
    if(cards.length > 0) {
      var messages = []
      for(let i = 0; i < cards.length; i++) {
        messages.push(`(${cards[i].name}, ${cards[i].subject}, ${cards[i].score})`)
      }
      // cards.map(card => {
      //     messages.push(`(${card.name}, ${card.subject}, ${card.score})`)
      // })
      res.json({messages:messages})
    }
    else {
      res.json({
        message:`${req.query.type} (${req.query.string}) not found!`
      })
    }
  }
  catch(e) {
    console.log(e)
    res.json({ message: 'Query went wrong' });
  }
});

export default router;
