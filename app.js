var express = require("express");
var app = express();
var http = require("http");
var https = require("https");
var fs = require("fs");
var server;
var io;
var path = require("path");
var createError = require("http-errors");
var exphbs  = require("express-handlebars");
var indexRouter = require("./routes/index");
var os = require( 'os' );
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

// check for dotenv errors
if (dotenv.error) {
  console.log("please check if you have created an '.env' file\n  more: https://github.com/Bennobianco/JEDIchat/blob/master/README.md");
  process.exit();
}
const PORT = process.env.SERVER_PORT;
// const e sending mail
const HOST = process.env.EMAIL_HOST;
const E_PORT = process.env.EMAIL_PORT;
const E_USER = process.env.EMAIL_USER;
const E_PASS = process.env.EMAIL_PASS;
// const for https
const HTTPS = process.env.HTTPS;
const HTTPS_KEY = process.env.HTTPS_KEY;
const HTTPS_CERT = process.env.HTTPS_CERT;

var networkInterfaces = os.networkInterfaces( );
//console.log(Object.values(networkInterfaces)[1][0].address);

var ServerIPv4Address = Object.values(networkInterfaces)[1][0].address;

//http or https
if (HTTPS == "true") {
  let = options = {
    key: fs.readFileSync(HTTPS_KEY),
    cert: fs.readFileSync(HTTPS_CERT)
  }
  server = https.createServer(options ,app)
} else {
  server = http.createServer(app)
}
io = require("socket.io")(server);


app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', exphbs({
  extname: 'html',
  defaultLayout: null
}));

app.use('/', indexRouter);


var numUsers = 0;
var user;
var userlist = [];
function User(username, usercolor) {
  this.username = username;
  this.usercolor = usercolor;
}

//var socket;
var sender;
var receiver;
var messageStatus;

// async..await is not allowed in global scope, must use a wrapper
async function sendm(socket) {
  // Take test SMTP service account from ionos bennobianco.

  let name = sender.split('@');
  let senderName = name[0] + '<' + sender + '>'
  receiver = receiver.trim() ;
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
    html: "<b>Follow the link to enter the chatroom </b> " + '' + ServerIPv4Address + ':' + PORT, // html body
  };

  let info = await transporter.sendMail(mailOptions);

  //console.log("Message sent: %s", info.response);
  console.log(info.response);
  messageStatus = info;
    //console.log(messageStatus);
  //console.log('sender: ' +  sender);
   //console.log('receiver: ' + receiver);
   socket.emit('messageStatus', {
    messageStatus: messageStatus
  });

}


io.on('connection', (socket) => {
  //socket = s;
  var addedUser = false;
  console.log('a user conneted');

  socket.on('newMessage', (data) => {
    //console.log( data);
    socket.broadcast.emit("newMessage", {
      message: data,
      username:socket.username
    });
  });


  socket.on('add user', (username,usercolor)=> {
    if (addedUser) return;
    ++numUsers;
    addedUser = true;
    socket.username = username;
    user = new User(username, usercolor);
    socket.user = user;
    userlist.push(user) ;
    //console.log(userlist);
    socket.emit('login', {
      numUsers: numUsers,
      userlist: userlist,
      serverIPv4Address: ServerIPv4Address,
      port:PORT

    });
    //usernameList.push(username) ;
    console.log(user);

      // echo globally (all clients expect you) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
      userlist: userlist
    });

  });

  socket.on('sendmail', (msg) => {

    sender = msg.sender;
    receiver = msg.receiver;

    sendm(socket).catch((error)  =>{
      socket.emit('messageStatus', {
        messageStatus: error
      })
    });


  });
    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
      console.log('a user disconnect');
      if (addedUser) {
        --numUsers;

         //Remove disconnected user from userlist array by value

        userlist.splice(userlist.indexOf(socket.user), 1);
        //console.log(usernameList);

        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers,
          userlist: userlist
        });
      }
    });

});

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
  next(createError(404));
  });

  //error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  module.exports = app;

//start server
server.listen(PORT, () => {
  let protocol = "http"
  if (HTTPS == "true") {protocol = "https"}
  console.log(`Server running at ${protocol}://${ServerIPv4Address}:${PORT}/`);
});
