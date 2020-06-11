if (window.isRedy) {
  addEmojis();
} else {
  addEventListener("load" , addEmojis)
}

function addEmojis() {
  var emojis = {
    last: [
      "🙂","😎","👍"
    ],
    emotions: [
      "😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","☺","😚","😙","😋","😛","😜","🤪","😝","🤑","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂","🙂",
    ],
    animals: [

    ],
    food: [

    ],
    sports: [

    ],
    places: [

    ],
    symbols: [

    ],
    flags: [

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

  html += addToHTML("Last", emojis.last);
  html += addToHTML("Emotions", emojis.emotions);
  html += addToHTML("Animals", emojis.animals);
  html += addToHTML("Food", emojis.food);
  html += addToHTML("Sports", emojis.sports);
  html += addToHTML("Places", emojis.places);
  html += addToHTML("Symbols", emojis.symbols);
  html += addToHTML("Flags", emojis.flags);

  document.querySelector("#contend #chat #emojis .value").innerHTML = html;

}
