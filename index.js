var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

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

app.get('/mama', (req, res) => {
  res.sendFile(__dirname + '/views/index.old.html');
});

app.get('/phili', (req, res) => {
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
    console.log(userlist);
    socket.emit('login', {
      numUsers: numUsers,
      userlist: userlist
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

         //Remove from array by value
        
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

http.listen(3000, () => {
  console.log('listening on *:3000');
});

//`<p>Hallo ${name}</p>`
//"<p>Hallo " + name + "</p>"

