//initialize variables
window.isRedy = false;
var username;           // name of the current user
var usercolor;          // display color of the current user
var userListread = [];  // list of all connected users
var $currentInput;
var connected = false;
var socket;             // socket io main prosses
var serverIPv4Address;  // the IPv4 address of the used server
var port;               // the port of the used server
var copyHttpLinkAndPort;
var text = "";
var $usernameInput;     // user name input field
var $loginPage;         // The login page
const COLORS = [
  "#311B92", "#6A1B9A", "#AD1457", "#B71C1C",
  "#673AB7", "#01579B", "#00838F", "#00695C",
  "#388E3C", "#827717", "#FF6F00", "#5D4037"
];

addEventListener("load", function() {
  //runs when html, css, javascript and other sources are loaded
  window.isRedy = true;

  $usernameInput = $("#loginusername");
  $loginPage = $(".loginform");
  socket = io();
  $currentInput = $usernameInput.focus();


  // EventListener
  $usernameInput.keydown(event => {
    if (event.which === 13) {
      setUsername();
    }
  });
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
  });

  $('form').submit((e) => {
    e.preventDefault(); // prevents page reloading
    sendMessage();
  });

})

// creating spezialvariables for userlist
Object.defineProperty(this, "userlist", {
  get: function () { return userListread; },
  set: function (v) {
    userListread = v;

    // importand elements
    let objects = {}
    objects.count = document.querySelector("#partnum");
    objects.users = document.querySelector("#parts");

    // update list
    if (userlist.length === 1){
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
function sendMessage() {
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

// Prevents input from having injected markup
function cleanInput(input) {
  return $('<div/>').text(input).html();
}

//add a message to htmlchat
function addChatMessage(data) {
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
function getUsernameColor(username) {
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

// Sets the client's username
function setUsername() {
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

//used to copy text to clipboard if user using an https address
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
