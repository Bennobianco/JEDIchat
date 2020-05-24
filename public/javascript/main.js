$(() => {
  var $usernameInput = $('#loginusername'); // user name input field
  var $loginPage = $('.loginform'); // The login page

  // Initialize variables
  // Prompt for setting a username
  var username;
  var usercolor;
  var userListread = [];
  var $currentInput = $usernameInput.focus();
  var connected = false;
  var socket = io();

  var COLORS = [
    '#311B92', '#6A1B9A', '#AD1457', '#B71C1C',
    '#673AB7', '#01579B', '#00838F', '#00695C',
    '#388E3C', '#827717', '#FF6F00', '#5D4037'
  ];

  Object.defineProperty(this, "userlist", {
    get: function () { return userListread; },
    set: function (v) {
      userListread = v;
      //console.log(userListread)
      // importand elements
      let objects = {}
      //objects.count = document.querySelector("#partnum");
      //objects.users = document.querySelector("#parts");
      objects.count = document.querySelector("#usercount");
      objects.users = document.querySelector("#users");
      // update list
      if (userlist.length ===1){
        objects.count.innerText = 'one user is online';
      }else{
        objects.count.innerText = userlist.length + " users are online:";
      }
      html = "";
      for (let i = 0; i < userlist.length; i++) {
        html += `<p class="part" style="color:${userlist[i].usercolor}">${userlist[i].username}</p>`
      }
      objects.users.innerHTML = html;
    }
  });

  // Sends a chat message
  const sendMessage = () => {
    var message = $('#message').val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $('#message').val("");
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('newMessage', 
          message
      );
    }
  }

  const addChatMessage = (data) => {

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(": "+ data.message);
    
    $('#chatlist').append(
      $("<li></li>").append(
        $usernameDiv, $messageBodyDiv
      )
    );
  }
 
   // Gets the color of a username through our hash function
   const getUsernameColor = (username) => {
    // Compute hash code
    var hash = 8;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    console.log('hash: ' + hash);
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  
  //function to display participants and number of participants
  const log = (message) => {
    $('#userlist').append(
      $("<li></li>").addClass('log').text(message)
    ); 
  }
           
  // Sets the client's username
  const setUsername = () => {
    username = cleanInput($usernameInput.val().trim());
    usercolor = getUsernameColor(username);
    // If the username is valid
    if (username) {
      $usernameInput.fadeOut(800);
      $loginPage.fadeOut(1000);
      //$chatPage.show();
      $loginPage.off('click');
      //$currentInput = $inputMessage.focus();

      // Tell the server your username an color
      socket.emit('add user', username, usercolor);
      // socket.on('add user', (user) => {
      //   username,
      //   usercolor
      // });

      
      $("#message").focus();

    }
  }

   // Prevents input from having injected markup
    const cleanInput = (input) => {
      return $('<div/>').text(input).html();
    }
    $usernameInput.keydown(event => {
      if (event.which === 13) {
        setUsername();
      }
    });

  // Click events

 // Focus input when clicking anywhere on login page
 $loginPage.click(() => {
    $currentInput.focus();
  }); 

    //socket events
    
   socket.on('login', (data) => {
      connected = true;
      // Display the welcome message
      console.log(data);
      
      //update user list
      userlist = data.userlist;
        log("Welcome to Socket.IO Chat – ");
    //   if (data.numUsers === 1) {
    //     log ("there's 1 participant");
    //   }else {
    //   $('#userlist').append(
    //     $("<li>").addClass('log').text('there are ' + data.numUsers + ' participants')
    //     ); 
    //   console.log('there are ' + data.numUsers + ' participants');
    //   }
    //   data.usernameList.forEach(item => {
    //     $('#userlist').append(
    //       $("<li>").addClass('log').text('participants online : ' + item)
    //     ); 
    //       console.log('participants online : ' + item);
    // });

  });
  
  socket.on('user joined', (data) => {
      
        log('user joined: ' + data.username);
      
      //update user lsit
      userlist = data.userlist;

      // data.usernameList.forEach(item => {
      //  $('#userlist').append(
      //       $("<li>").addClass('log').text('participants online : ' + item)
      //    ); 
      //         console.log('participants online : ' + item);
           
      //   });
      
  });


  socket.on('newMessage', (message) => {
    addChatMessage(message);
    // var $usernameDiv = $('<span class="username"/>')
    //   .text(message.username)
    //   .css('color', getUsernameColor(message.username));
    // var $messageBodyDiv = $('<span class="messageBody">')
    //   .text(": "+ message.message);
    
    // $('#chatlist').append(
    //   $("<li></li>").append(
    //     $usernameDiv, $messageBodyDiv
    //     //$("<span></span>").text(message.username).css("color", "red"),
    //     //$("<span></span>").text(": "+ message.message),
    //   )
    // );
  });

   
  socket.on('disconnect', () => {
    console.log('you have been disconnected');
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', (data) => {
    //update user lsit
    userlist = data.userlist;

    log(data.username + ' left');
    // $('#userlist').append(
    //   $("<li>").addClass('log').text(data.username + ' left')
    // ); 
    //console.log(data.numUsers);
    // data.usernameList.forEach(item => {
    //   $('#userlist').append(
    //       $("<li>").addClass('log').text('participants online : ' + item)
    //   ); 
    //        console.log('participants online : ' + item);
         
    //  });
  });

  socket.on('reconnect', () => {
    console.log('you have been reconnected');
    if (username) {
      //socket.emit('add user', username);
      //hallo
    }
  });

  $('form').submit((e) => {

    // var message = $('#message').val();
    e.preventDefault(); // prevents page reloading
    sendMessage();
    // if (message != "") {
      
    //   $('#message').val("");
      
    //   $('#chatlist').append(
    //     $("<li></li>").text(username + ': ' + message)
    //   ); 

    //   socket.emit('newMessage', 
    //       //username: username,
    //       message
    //   );
    // }
    
  });

});