if (window.isRedy) {
  addEmojis();
} else {
  addEventListener("load" , addEmojis)
}

function addEmojis() {
  this.emojis = {
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

  html += addToHTML("Emotions", this.emojis.emotions);
  html += addToHTML("Animals", this.emojis.animals);
  html += addToHTML("Food", this.emojis.food);
  html += addToHTML("Sports", this.emojis.sports);
  html += addToHTML("Places", this.emojis.places);
  html += addToHTML("Symbols", this.emojis.symbols);
  html += addToHTML("Flags", this.emojis.flags);

  document.querySelector("#contend #chat #emojis .value").innerHTML = html;
  updateListener();

}
// emojis from https://unicode.org/emoji/charts/full-emoji-list.html
