var emojis = {
  emotions: [
    "😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇",
    "🥰","😍","🤩","😘","😗","😚","😙",
    "😋","😛","😜","🤪","😝","🤑",
    "🤗","🤭","🤫","🤔",
    "🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥",
    "😌","😔","😪","🤤","😴",
    "😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯",
    "🤠","🥳",
    "😎","🤓","🧐",
    "😕","😟","🙁","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞",
    "😓","😩","😫","🥱",
    "😤","😡","😠","🤬","😈","👿","💀","☠",
    "💩","🤡","👹","👺","👻","👽","👾","🤖",
    "😺","😸","😹","😻","😼","😽","🙀","😿","😾",
    "🙈","🙉","🙊"
  ],
  animals: [
    "x",
  ],
  food: [
    "x",
  ],
  sports: [
    "x",
  ],
  places: [
    "x",
  ],
  symbols: [
    "x",
  ],
  flags: [
    "🏁","🚩","🎌","🏴","🏳","🏳️‍🌈","🏴‍☠️"
  ]
}

addEventListener("load" , function() {
  var html = "";
  function addToHTML(title, data) {
    let html = `<p id="${title.toLocaleLowerCase()}">${title}</p>`
    for (var i = 0; i < data.length; i++) {
      html += `<span>${data[i]}</span>`
    }
    return html;
  }

  function updateListener() {
    for (var i = 0; i < document.querySelectorAll("#contend #chat #emojis .value span").length; i++) {
      document.querySelectorAll("#contend #chat #emojis .value span")[i].addEventListener("click", function(event) {
        document.querySelector("#contend #chat form #input").value += event.target.innerText;
        $("#input").focus();
      })
    }
  }

  html += addToHTML("Emotions", emojis.emotions);
  html += addToHTML("Animals", emojis.animals);
  html += addToHTML("Food", emojis.food);
  html += addToHTML("Sports", emojis.sports);
  html += addToHTML("Places", emojis.places);
  html += addToHTML("Symbols", emojis.symbols);
  html += addToHTML("Flags", emojis.flags);

  document.querySelector("#contend #chat #emojis .value").innerHTML = html;
  updateListener();

  // EventListener
  document.querySelector("#contend #chat form #spezialinput svg.emojis").addEventListener("click", function() {
    if (document.querySelector("#contend #chat").attributes.getNamedItem("emojis") == null ||
        document.querySelector("#contend #chat").attributes.getNamedItem("emojis").value != "open") {
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

})
// emojis from https://unicode.org/emoji/charts/full-emoji-list.html
