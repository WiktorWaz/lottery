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
    this.participanNumber = 0;
  }
  addParticipant(name, mail, description) {
    let tmp = new Participant(name, mail, this.id, description);
    this.participantsList.push(tmp);
    this.id++;
    this.participanNumber++;
  }

  getParticipantsList() {
    return this.participantsList;
  }

  deleteParticipant(id) {
    const searchIdFunction = (element) => (element.id == id);
    const indexNum = this.participantsList.findIndex(searchIdFunction);
    console.log("participantsList in method deleteParticipant: " + JSON.stringify(this.participantsList));
    console.log("id in  method deleteParticipant: " + id);
    console.log("indexNum: " + indexNum);
    if (indexNum >= 0) {
      this.participantsList.splice(indexNum, 1);
    }
  }

  runLottery() {

    let validLottery = false;
    let participantsPairs = [];
    let possibleParticipants = [];


    for (let i = 0; i < this.participantsList.length; i++) {
      possibleParticipants.push(this.participantsList[i].id);
    }


    do {
      let randomizeIterations = possibleParticipants.length * possibleParticipants.length;
      for (let i = 0; i < randomizeIterations; i++) {
        let firstItem = Math.floor(Math.random() * possibleParticipants.length);
        let secondItem = Math.floor(Math.random() * possibleParticipants.length);
        let tmp = possibleParticipants[firstItem];
        possibleParticipants[firstItem] = possibleParticipants[secondItem];
        possibleParticipants[secondItem] = tmp;
      }

      participantsPairs = [];
      for (let i = 0; i < this.participantsList.length; i++) {
        participantsPairs.push([this.participantsList[i].id, possibleParticipants[i]]);
      }

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
      this.deleteAllParticipants(1);
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

  deleteAllParticipants(counter) {
    this.participanNumber -= counter;
    if(this.participanNumber === 0 )  {
      this.participantsList = [];
    }    
  }

}

christmasLottery = new ChristmasLottery();

module.exports = christmasLottery;