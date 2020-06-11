window.isRedy = false;
$(() => {
  var $usernameInput = $('#loginusername'); // user name input field
  var $loginPage = $('.loginform'); // The login page

  // Initialize variables

  var username;
  var usercolor;
  var userListread = [];
  var $currentInput = $usernameInput.focus();
  var connected = false;
  var socket = io();
  var serverIPv4Address;
  var port
  var copyHttpLinkAndPort;
  window.isRedy = true;

  var COLORS = [
    '#311B92', '#6A1B9A', '#AD1457', '#B71C1C',
    '#673AB7', '#01579B', '#00838F', '#00695C',
    '#388E3C', '#827717', '#FF6F00', '#5D4037'
  ];

  Object.defineProperty(this, "userlist", {
    get: function () { return userListread; },
    set: function (v) {
      userListread = v;

      // importand elements
      let objects = {}
      objects.count = document.querySelector("#partnum");
      objects.users = document.querySelector("#parts");

      // update list
      if (userlist.length ===1){
        objects.count.innerText = 'one user is online';
      }else{
        objects.count.innerText = userlist.length + " users are online:";
      }
      html = "";
      for (let i = 0; i < userlist.length; i++) {
        if (userlist[i].username == username) {
          html += `<p class="part" style="color:${userlist[i].usercolor}">${userlist[i].username}(you)</p>`
        } else {
          html += `<p class="part" style="color:${userlist[i].usercolor}">${userlist[i].username}</p>`
        }
      }
      objects.users.innerHTML = html;
    }
  });

  // Send a chat message
  const sendMessage = () => {
    var message = $('#input').val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $('#input').val("");
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

    var $usernameDiv = $('<span class="user"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="text">')
      .text(data.message);

    // checking for user wants autoscroll (is scrolled down)
    let autoscroll = false;
    if (document.querySelector("#contend #chat #messages").scrollTop == document.querySelector("#contend #chat #messages").scrollTopMax) {
      autoscroll = true;
    }
    // add new message
    $('#messages').append(
      $("<div class='message'></div>").append(
        $usernameDiv, $messageBodyDiv
      )
    );
    // is autoscroll aktive
    if (autoscroll) {
      document.querySelector("#contend #chat #messages").scrollTop = document.querySelector("#contend #chat #messages").scrollTopMax;
    }
  }

   // Gets the color of a username through our hash function
   const getUsernameColor = (username) => {
    // Compute hash code
    var hash = 8;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    //console.log('hash: ' + hash);
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

      $("#input").attr("placeholder", `Type here...(as ${username})`)

      $("#input").focus();

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

    function copyTextToClipboard(text) {
      if (!navigator.clipboard) {
        console.log('does not work without https');
        return;
      }
      navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "Copied: " + text;
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });
    }

    function showMessageAfterCopiedLink() {
      var tooltip = document.getElementById("myTooltip");
      tooltip.innerHTML = "Copy Jed link to clipboard";
    }

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(() => {
    $currentInput.focus();
  });

  $("#share").on({
    click: ()=> {
      copyTextToClipboard(copyHttpLinkAndPort);
    },
    mouseleave: ()=> {
      showMessageAfterCopiedLink();
    }
  })

    //socket events

   socket.on('login', (data) => {
      connected = true;

      serverIPv4Address = data.serverIPv4Address;
      port = data.port;
      copyHttpLinkAndPort = serverIPv4Address + ":" + port;
      console.log(copyHttpLinkAndPort);
      //update user list
      userlist = data.userlist;

      //Display wellcome message
      log("Welcome to Socket.IO Chat – ");

  });

  socket.on('user joined', (data) => {

      //log('user joined: ' + data.username);

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

  $('form').submit((e) => {

    e.preventDefault(); // prevents page reloading
    sendMessage();

  });

  // sidebar EventListener
  document.querySelector("#toolbar #menu").addEventListener("click" , toggleSidebar)
  document.querySelector("#contend #overlay").addEventListener("touchstart" , toggleSidebar)

  var sideTouch = {}
  sideTouch.x = false
  document.body.addEventListener("touchstart" , function(e) {
    if ((document.body.offsetWidth - e.touches[0].pageX) < 10) {
      sideTouch.is = true
    }
  })
  document.body.addEventListener("touchmove" , function(e) {
    if (sideTouch.is) {
      sideTouch.x = document.body.offsetWidth - e.touches[0].pageX
    }
  })
  document.body.addEventListener("touchend" , function(e) {
    if (sideTouch.is && sideTouch.x > 50) {
      sideTouch.is = false
      toggleSidebar();
    }
  })

  // sidebar event
  function toggleSidebar() {
    if (document.body.attributes.getNamedItem("sidebar") == null || document.body.attributes.getNamedItem("sidebar").value != "open") {
      document.body.setAttribute("sidebar", "open")
    } else {
      document.body.setAttribute("sidebar", "close")
    }
  }

  // emoji's
  document.querySelector("#contend #chat form #spezialinput svg").addEventListener("click", function() {
    if (document.querySelector("#contend #chat").attributes.getNamedItem("emojis") == null || document.querySelector("#contend #chat").attributes.getNamedItem("emojis").value != "open") {
      document.querySelector("#contend #chat").setAttribute("emojis", "open")
    } else {
      document.querySelector("#contend #chat").setAttribute("emojis", "close")
    }
  })

  for (var i = 0; i < document.querySelectorAll("#contend #chat #emojis .heder .item").length; i++) {
    let obj = document.querySelectorAll("#contend #chat #emojis .heder .item")[i]
    obj.addEventListener("click", function(event) {
      for (var i = 0; i < document.querySelectorAll("#contend #chat #emojis .heder .item").length; i++) {
        document.querySelectorAll("#contend #chat #emojis .heder .item")[i].classList.remove("selected")
      }
      document.querySelector("#contend #chat #emojis .value p#"+obj.id).scrollIntoView({behavior: "smooth"})
      obj.classList.add("selected")
    })
  }

  for (var i = 0; i < document.querySelectorAll("#contend #chat #emojis .value span").length; i++) {
    document.querySelectorAll("#contend #chat #emojis .value span")[i].addEventListener("click", function(event) {
      document.querySelector("#contend #chat form #input").value += event.target.innerText;
      $("#input").focus();
    })
  }


});
