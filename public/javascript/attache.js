addEventListener("load" , function() {
  var action = {};
  action.file = function() {
    console.log("file");
  }
  action.image = function() {
    console.log("image");
  }
  action.audio = function() {
    console.log("audio");
  }
  action.map = function() {
    console.log("map");
  }


  action.file()

  // EventListener
  document.querySelector("#contend #chat form #spezialinput svg.attache").addEventListener("click", function() {
    if (document.querySelector("#contend #chat").attributes.getNamedItem("attache") == null ||
        document.querySelector("#contend #chat").attributes.getNamedItem("attache").value != "open") {
      document.querySelector("#contend #chat").setAttribute("attache", "open")
    } else {
      document.querySelector("#contend #chat").setAttribute("attache", "close")
    }
  })

  for (var i = 0; i < document.querySelectorAll("#contend #chat #attache .heder .item").length; i++) {
    let obj = document.querySelectorAll("#contend #chat #attache .heder .item")[i]
    obj.addEventListener("click", function(event) {
      // select
      for (var i = 0; i < document.querySelectorAll("#contend #chat #attache .heder .item").length; i++) {
        document.querySelectorAll("#contend #chat #attache .heder .item")[i].classList.remove("selected")
      }
      obj.classList.add("selected")

      // action
      action[obj.id]();
    })
  }

})
