const mailService = require("../services/MailService");
mailService.sendMail( "wiktor.wazniewski@gmail.com", "Wiktor")
    .then((data)=>{console.log("success")})
    .catch((err)=>{console.log("err: "+ err)});

