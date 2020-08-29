const nodemailer = require("nodemailer");
const { callbackPromise } = require("nodemailer/lib/shared");
// const e sending mail
const HOST = process.env.EMAIL_HOST;
const E_PORT = process.env.EMAIL_PORT;
const E_USER = process.env.EMAIL_USER;
const E_PASS = process.env.EMAIL_PASS;
const ServerName = process.env.SERVER_NAME;

var sendm = async(sender, receiver, callback) => {
    let name = sender.split('@');
    let senderName = name[0] + '<' + sender + '>'
    receiver = receiver.trim();
    console.log(senderName);
    receiver = (receiver.replace(/,/g, ", "));

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: HOST,
        port: E_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: E_USER,
            pass: E_PASS
        }
    });

  var mailOptions = {
        from: senderName,
        to: receiver, // list of receivers
        subject: "Invitation to chat with JediChat", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Follow the link to enter the chatroom </b> " + '' + ServerName + ':' , // html body
  };

  //let info = await transporter.sendMail(mailOptions);
  let info = await transporter.sendMail(mailOptions)
    .then((info) => callback(info));

  //console.log("Message sent: %s", info.response);
  //console.log(info.response);
  //messageStatus = info;
  //console.log(messageStatus);
  //return info;
  
  
};

module.exports = {
    sendm
}