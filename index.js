var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
require('dotenv').config();

var os = require( 'os' );
const PORT = process.env.SERVER_PORT;
//var networkInterfaces = os.networkInterfaces( );
//console.log( networkInterfaces.wlo1[0].address );

// BUG: the networkInterfaces is different on PC
//var ServerIPv4Address = os.networkInterfaces().wlo1[0].address;   // 4 BennoBianco
var ServerIPv4Address = os.networkInterfaces().enp33s0[0].address;  // 4 Captainpast

//app.set('viewDir', 'views');
//app.set('view engine', 'html');
// Routing
app.use(express.static(path.join(__dirname, 'public')));

var numUsers = 0;
var user;
var userlist = [];
function User(username, usercolor) {
  this.username = username;
  this.usercolor = usercolor;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

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

http.listen(PORT, () => {
  console.log(`Server running at http://${ServerIPv4Address}:${PORT}/`);
});

// http.listen(3000, () => {
//   console.log('listening on *:3000');

// });
