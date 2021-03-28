const nodemailer = require("nodemailer");

class MailService {
    constructor() {

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '', //Data unavailable on public repository
                pass: ''  //Data unavailable on public repository
            }
        });

    }
    async sendMail(mailTo, htmlContent, textContent) {

        let info = await this.transporter.sendMail({
            from: '"Mikołajkowe losowanie" <wiktorbim@gmail.com>', // sender address
            to: mailTo, // list of receivers 
            subject: "Zostałeś dodany do mikołajkowego losowania ✔", // Subject line
            text: textContent, // plain text body
            html: htmlContent, // html body 
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
}

module.exports = new MailService();