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
var bodyParser = require('body-parser');
var os = require( 'os' );
//const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const sendMail = require('./public/javascript/sendm');

const loginUser = require('./controllers/loginController');
const session = require("express-session");

// check for dotenv errors
if (dotenv.error) {
  console.log("please check if you have created an '.env' file\n  more: https://github.com/Bennobianco/JEDIchat/blob/master/README.md");
  process.exit();
}
const PORT = process.env.SERVER_PORT;

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

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'Please_SET_session_SeCreT',
  resave: false,
  saveUninitialized: true
}));

app.engine('html', exphbs({
  extname: 'html',
  defaultLayout: null
}));

app.use('/', indexRouter);


var numUsers = 0;
var user;
var userlist = [];

function User(username, usercolor,userroom) {
  this.username = username;
  this.usercolor = usercolor;
  this.userroom = userroom;
}

var sender;
var receiver;


io.on('connection', (socket) => {
 
  var addedUser = false;
  console.log('a user conneted');
  //console.log(userlist);
  loginUser.getRoom(userlist);


  socket.on('add user', (username,usercolor,userroom)=> {
    if (addedUser) return;
    
    ++numUsers;
    
    addedUser = true;
    socket.username = username;
    user = new User(username, usercolor, userroom);
    socket.user = user;
    
    // if you are already logged in and skip the 
    //login page in the same browser by simply typing <server>/every/<room> 
    //then this will prevent the duplicate user in the userlist.
    if (userlist.filter(cuser => cuser.username == user.username).length <= 0){
      userlist.push(user);
    }
    
    console.log(userlist);
    socket.emit('login', {
      //numUsers: numUsers,
      userlist: userlist.filter(user => user.userroom == userroom),
      serverIPv4Address: ServerIPv4Address,
      port:PORT
    });
    
    socket.join(user.userroom);
   
    socket.to(socket.user.userroom).emit('user joined', {
      username: socket.username,
      //numUsers: numUsers,
      userlist: userlist.filter(user => user.userroom == userroom)
    });

  });
  
   // get the message from one client and sends it to the others
   socket.on('newMessage', (data) => {
    console.log( data);
    console.log(socket.user.userroom);
    socket.to(socket.user.userroom).emit("newMessage", {
      message: data,
      username:socket.username
    });
  });


  socket.on('sendmail', (msg) => {
    sender = msg.sender;
    receiver = msg.receiver;
    
     sendMail.sendm(sender, receiver, (info) => {
      socket.emit('messageStatus', {   // sends the message status to the client
        messageStatus: info
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

        // echo globally that this client has left
        socket.to(socket.user.userroom).emit('user left', {
          username: socket.username,
          //numUsers: numUsers,
          userlist: userlist.filter(user => user.userroom == socket.user.userroom)
        });
      }
    });

});

  //app.use('/private/*', authMiddleware);

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
