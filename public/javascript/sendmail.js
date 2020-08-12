"use strict";
addEventListener("load", function() {

  socket.on('messageStatus', function(status){
      $('#emailForm').hide();
      text += status.messageStatus.response + "<br>";
      console.log(status.messageStatus);

    if((status.messageStatus.rejected == undefined) &&
          (status.messageStatus.accpted == undefined)){
          console.log('no email was sent to the recipient');
    } else {

        if(status.messageStatus.accepted != undefined){

          for (let i = 0; i < status.messageStatus.accepted.length; i++) {
            text += "message send to: " + status.messageStatus.accepted[i] + "<br>" ;
            console.log('accepted: '+ status.messageStatus.accepted[i]);

          }

        }
        if(status.messageStatus.rejected != ""){
          status.messageStatus.rejected.forEach(myFunction);
          function myFunction(value, index, array) {
            text += "rejected: " + value + "<br>";
            console.log('rejected: ' + value);
          }
        }
    }

        //console.log(status.messageStatus);
        $('.messageInfo').html(text);
        $("#input").focus();
  });

  // EventListener
  $('#emailForm form').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    let sender = $('#m').val();
    let receiver =  $('#receiver').val();
    socket.emit('sendmail', {
        sender: sender,
        receiver: receiver
    });

    console.log(sender);
    console.log(receiver);
    text = "";
    return false;
  });

  $('#email').click(() => {
    console.log('click to email');
      $('#emailForm').show();
  });

  $(".cancel").click(function(){
    $('#emailForm').hide();
  });

})
