var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var createError = require('http-errors');
var exphbs  = require('express-handlebars');
var indexRouter = require('./routes/index');
require('dotenv').config();

var os = require( 'os' );
const PORT = process.env.SERVER_PORT;
var networkInterfaces = os.networkInterfaces( );
//console.log(Object.values(networkInterfaces)[1][0].address);

var ServerIPv4Address = Object.values(networkInterfaces)[1][0].address;  

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

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/views/index.html');
// });

io.on('connection', (socket) => {
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
  http.listen(PORT, () => {
  console.log(`Server running at http://${ServerIPv4Address}:${PORT}/`);
});


