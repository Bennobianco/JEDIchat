"use strict";

$(document).ready(function(){
    
   
  $('#email').click(() => {
    console.log('click to email');
      $('#emailForm').show();
  });

  $(".cancel").click(function(){
    $('#emailForm').hide();
  });


});