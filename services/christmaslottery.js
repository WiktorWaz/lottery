const mailService = require("../services/MailService");
var hb = require('express-handlebars').create();

class Participant {
  constructor(name, mail, id, description) {
    this.name = name;
    this.mail = mail;
    this.id = id;
    this.recipientId = null;
    this.description = description;
  }
  setRecipientId(recipientId) {
    this.recipientId = recipientId;
  }
}


class ChristmasLottery {
  constructor() {
    this.participantsList = [];
    this.id = 0;
  }
  addParticipant(name, mail, description) {
    let tmp = new Participant(name, mail, this.id, description);
    this.participantsList.push(tmp);
    this.id++;
  }

  getParticipantsList() {
    return this.participantsList;
  }

  deleteParticipant(id) {
    //const searchIdFunction = function (element) { return element.id == id };
    const searchIdFunction = (element) => (element.id == id);
    const indexNum = this.participantsList.findIndex(searchIdFunction);
    //const indexNum = this.participantsList.findIndex(element => (element.id === id) );
    console.log("participantsList in method deleteParticipant: " + JSON.stringify(this.participantsList));
    console.log("id in  method deleteParticipant: " + id);
    console.log("indexNum: " + indexNum);
    if (indexNum >= 0) {
      this.participantsList.splice(indexNum, 1);
    }
  }

  runLottery() {
    //  let array = [1, 2, 3];
    //  1. Znając długość array wylosuj losową liczbę od 0 do array.legth 
    //  2. Dodaj tą liczbę do kontrolnego array, który później będzie poprzez pętle sprawdzać czy ta liczba była użyta 
    //  3. 
    //  Weź losowy element 
    //  2. wyjmij go i dodaj do innego array 

    //  1. Każde dziecko wrzuca do kapelusza karteczkę ze swoim imieniem 
    //  2. Karteczki są mieszane wewnątrz kapelusza 
    //  3. Każde dziecko wyciąga jedna karteczkę z kapelusza i zachowuje ją dla siebie 
    //  4. Sprawdzamy czy któreś z dzieci nie wylosowało samego siebie a jeśli wylosowało to powtarzamy losowanie 
    let validLottery = false;
    let participantsPairs = [];
    let possibleParticipants = [];
    //krok pierwszy 


    for (let i = 0; i < this.participantsList.length; i++) {
      possibleParticipants.push(this.participantsList[i].id);
    }


    do {
      //krok drugi 
      // Math.random  -> 0.1 0.343432 0.532     0.9        Nigdy: 1
      // * .length= 6 -> 0.6 ~2.06    ~3.192    5.4               6
      // Math.floor   ->  0    2         3       5                6
      //mieszanie karteczek w kapeluszu
      let randomizeIterations = possibleParticipants.length * possibleParticipants.length;
      for (let i = 0; i < randomizeIterations; i++) {
        let firstItem = Math.floor(Math.random() * possibleParticipants.length);
        let secondItem = Math.floor(Math.random() * possibleParticipants.length);
        let tmp = possibleParticipants[firstItem];
        possibleParticipants[firstItem] = possibleParticipants[secondItem];
        possibleParticipants[secondItem] = tmp;
      }

      //krok trzeci
      participantsPairs = [];
      for (let i = 0; i < this.participantsList.length; i++) {
        participantsPairs.push([this.participantsList[i].id, possibleParticipants[i]]);
      }


      //krok czwarty 
      validLottery = true;
      for (let i = 0; i < this.participantsList.length; i++) {
        if (participantsPairs[i][0] === participantsPairs[i][1]) {
          validLottery = false;
        }
      }


    } while (!validLottery);


    for (let i = 0; i < participantsPairs.length; i++) {
      let giverId = participantsPairs[i][0];
      let recipientId = participantsPairs[i][1];

      let giver = this.getParticipantById(giverId);
      giver.setRecipientId(recipientId);
    }

    this.distributeResults();
  }

  //zwróci usera bazując na id, nie na indexie w tablicy, array doc 
  getParticipantById(id) {
    const searchIdFunction = (element) => (element.id === id);
    const indexNum = this.participantsList.findIndex(searchIdFunction);
    return this.participantsList[indexNum];
  }

  async distributeResults() {
    for (let i = 0; i < this.participantsList.length; i++) {
      const giver = this.participantsList[i];
      let giverName = giver.name;
      console.log("imie dającego: " + giverName);

      let giverMail = giver.mail;
      let recipientId = giver.recipientId;
      let recipient = this.getParticipantById(recipientId);
      let recipientName = recipient.name;
      let recipienDescription = recipient.description;

      let mailContent = await this.renderMailContent(giverName, recipientName, recipienDescription);
      this.sendMail(mailContent.renderedHTML, mailContent.renderedText, giverMail);

    }
  }

  async renderMailContent(giverName, recipientName, recipienDescription) {
    const renderPromiseHTML = hb.render("./views/mailTemplate.hbs", { participantName: giverName, recipient: recipientName, recipienDescription: recipienDescription });
    const renderPromiseText = hb.render("./views/textTemplate.hbs", { participantName: giverName, recipient: recipientName, recipienDescription: recipienDescription });
    let renderedHTML = await renderPromiseHTML;
    let renderedText = await renderPromiseText;

    return { renderedHTML, renderedText }
  }

  sendMail(renderedHTMLContent, renderedTextContent, giverMail) {
    let htmlContent = renderedHTMLContent;
    let textContent = renderedTextContent;

    mailService.sendMail(giverMail, htmlContent, textContent)
      .then((data) => { console.log("success") })
      .catch((err) => { console.log("err: " + err) });

  }
}

christmasLottery = new ChristmasLottery();

module.exports = christmasLottery;