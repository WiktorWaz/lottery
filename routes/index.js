const express = require('express');
const router = express.Router();
const christmasLottery = require('../services/christmaslottery');
const tokenManagementService = require('../services/TokenManagementService');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});
/* GET admin home page. */
router.get('/admin', function (req, res, next) {
  res.render('index', { admin: true });
});

router.post('/add', function (req, res, next) {

  let valid = tokenManagementService.validateToken(req.body.token);
  if (valid) {
    christmasLottery.addParticipant(req.body.name, req.body.mail, req.body.description);
    res.send('ok');
  } else {
    res
      .status(401)
      .send({
        message: 'Invalid token'
      });
  }

});

router.get('/list', function (req, res, next) {
  const participantsList = christmasLottery.getParticipantsList();
  res.send(participantsList);
});

router.get('/delete/:id', function (req, res, next) {
  const participantsList = christmasLottery.deleteParticipant(req.params.id);
  res.send(participantsList);
});

router.get('/lottery', function (req, res, next) {

  const participantsList = christmasLottery.getParticipantsList();
  let isAnyTokenAvailable = tokenManagementService.isAnyTokenAvailable();
  if (participantsList.length < 3) {
    res.render('error', { message: 'Dodano zbyt małą liczbę uczestników. Proszę dodać przynajmniej trzy osoby' });
    return;
  } else if (isAnyTokenAvailable) {
    res.render('error', { message: 'Hej! Hej! Poczekaj na wszystkich zanim zaczniemy losowanie! Nie wszyscy jeszcze zdążyli dołączyć' });
    return;
  }

  christmasLottery.runLottery();
  


  res.render('lottery', { participantsList: christmasLottery.getParticipantsList() });

  // let participantsNumber = participantsList.length;
  // console.log(participantsNumber);
  // participantsNumber -= 1; 
  // if(participantsNumber === 0)  {
  //   christmasLottery.deleteAllParticipants();
  // } 

});

module.exports = router;
