const express = require('express');
const router = express.Router();
const christmasLottery = require('../services/christmaslottery');
const tokenManagementService = require('../services/TokenManagementService');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
/* GET admin home page. */
router.get('/admin', function(req, res, next) {
  res.render('index', {admin: true}); 
});

// router.post('/list', function(req, res, next) {
  
//     res.render('index', req.body.name)
 
// });



router.post('/add', function(req, res, next) {
  // req.name;
  // req.mail;
  let valid = tokenManagementService.validateToken(req.body.token);
  if(valid) {
    christmasLottery.addParticipant(req.body.name, req.body.mail, req.body.description);
    res.send('ok'); //w momencie kiedy otrzymujemy zapytanie ze strony klienta musimy zakończyć ten proces poprzez odpowiedź na to zapytanie inaczej możemy dostać timeout 
  } else {
    res
      .status(401)
      .send({
        message: 'Invalid token'
      });
  }     
 
});

router.get('/list', function(req, res, next) {
  const participantsList = christmasLottery.getParticipantsList();
  res.send(participantsList);  
});

router.get('/delete/:id', function(req, res, next) {
  //console.log("req.params.id: " + req.params.id);
  const participantsList = christmasLottery.deleteParticipant(req.params.id);
  res.send(participantsList);   
});

router.get('/lottery', function(req, res, next) {
  //walidacja 
  const participantsList = christmasLottery.getParticipantsList();
  if(participantsList.length < 3)  {
    res.render('error', {message: 'Dodano zbyt małą liczbę uczestników. Proszę dodać przynajmniej trzy osoby'});
    return; 
  }
  //Wywołanie losowania
  christmasLottery.runLottery();
  //przesłanie wyników losowania 
  res.render('lottery',{participantsList: christmasLottery.getParticipantsList()});
  //error
});

// router.get('/sendMail', function(req, res, next)  {
//   christmasLottery.distributeResults(req.participantsPairs);
// })


module.exports = router;
