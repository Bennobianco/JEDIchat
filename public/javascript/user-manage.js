addEventListener("load", function() {
  socket.on('login', (data) => {
     connected = true;

     serverIPv4Address = data.serverIPv4Address;
     port = data.port;
     copyHttpLinkAndPort = serverIPv4Address + ":" + port;
     console.log(copyHttpLinkAndPort);
     //update user list
     userlist = data.userlist;
 });

 socket.on('user joined', (data) => {
     userlist = data.userlist;
 });


 socket.on('newMessage', (message) => {
   addChatMessage(message);

 });


 socket.on('disconnect', () => {
   console.log('you have been disconnected');
 });

 // Whenever the server emits 'user left', log it in the chat body
 socket.on('user left', (data) => {
   //update user lsit
   userlist = data.userlist;
   log(data.username + ' left');

 });

 socket.on('reconnect', () => {
   console.log('you have been reconnected');
   if (username) {
     //socket.emit('add user', username);

   }
 });
})
