//JavaScript by Captinpast
var editor;
var content;
var view;
var curser;
var isWriting = false;

addEventListener("load", function() {
  editor = document.querySelector("#editor");
  content = document.querySelector("#editor .content");
  view = document.querySelector("#editor .view");
  curser = document.querySelector("#editor .curser");

  function textUpdate() {
    var pos = content.selectionStart;
    var posEnd = content.selectionEnd;
    var val = content.value;
    var tempObj = document.createElement("div");

    if (document.querySelector(":focus") == content) {
      editor.classList.add("focus")
    } else {
      editor.classList.remove("focus")
      curser.style.width = "1px";
      curser.classList.remove("selection");
    }

    tempObj.style.fontSize = "18px"; tempObj.style.letterSpacing = "1px"; tempObj.style.opacity = "0"; tempObj.style.width = "max-content";
    document.body.appendChild(tempObj);
    if (pos == posEnd) {
      curser.classList.remove("selection");

      tempObj.innerHTML = jsToHtmlString(val.substring(0, pos));
      curser.style.left = tempObj.offsetWidth+"px";
      curser.style.width = "1px";
    } else {
      curser.classList.add("selection");

      tempObj.innerText = val.substring(0, pos);
      curser.style.left = tempObj.offsetWidth+"px";

      tempObj.innerText = val.substring(pos, posEnd);
      curser.style.width = tempObj.offsetWidth+"px";
    }
    document.body.removeChild(tempObj);

    editor.scrollLeft = content.scrollLeft;

    view.innerHTML = text2Down(val, true);
  }

  content.addEventListener("input", function() {
    isWriting = true;
    textUpdate();
  })
  setInterval(textUpdate, 100)

  setInterval(function() {
    if (curser.classList.contains("visible") && !isWriting) {
      curser.classList.remove("visible");
    } else {
      curser.classList.add("visible");
      isWriting = false;
    }
  }, 800)
})

function jsToHtmlString(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "\xa0");
}

function text2Down(plainText, editmode) {
  var syntax = [
		['/\\[([^\\[]+)\\]\\(([^\\(]+)\\)/g', '<a href=\"\\2\">\\1</a>'], // link
		['/(\\_)(.*?)\\1/g', '<em>\\2</em>'], // emphasis
		['/(\\*\\*)(.*?)\\1/g', '<strong>\\2</strong>'], // bold
		['/(\\~\\~)(.*?)\\1/g', '<del>\\2</del>'], // strike
		['/(\\`)(.*?)\\1/g', '<code>\\2</code>'], // code
	]
  if (editmode == true) {
    var syntax = [
  		['/\\[([^\\[]+)\\]\\(([^\\(]+)\\)/g', '<span class="symbolicA">[\\1](\\2)</span>'], // link
  		['/(\\_)(.*?)\\1/g', '<span class="syntax">_</span><em>\\2</em><span class="syntax">_</span>'], // emphasis
  		['/(\\*\\*)(.*?)\\1/g', '<span class="syntax">**</span><strong>\\2</strong><span class="syntax">**</span>'], // bold
  		['/(\\~\\~)(.*?)\\1/g', '<span class="syntax">~~</span><del>\\2</del><span class="syntax">~~</span>'], // strike
  		['/(\\`)(.*?)\\1/g', '<span class="syntax">´</span><code>\\2</code><span class="syntax">´</span>'], // code
  	]
  }

  function replaceExpression(expression, mask, string){
    var flags = expression.substr(expression.lastIndexOf(expression[0]) + 1);
    var syntax = expression.substr(1, expression.lastIndexOf(expression[0]) - 1);
    var regexp = RegExp(syntax, flags);
    var i = [];
    var j = 0;
    var k = 0;
    var res = string;
    var m = [];

    do {
      m = regexp.exec(string);
      if (m != null) {
        i.push(m);
      }
    } while(m != null && flags.indexOf("g") != -1)

    for (j = i.length - 1; j > -1; j--) {
      for (m = mask, k = i[j].length; k>-1; k--) {
        m = m.replace("${"+k+"}",i[j][k]).replace("$"+k, i[j][k]).replace("\\"+k, i[j][k]);
      }
      res = res.replace(i[j][0], m)
    };

    return res
  };

  plainText = jsToHtmlString(plainText);

  function parseLine(plainText) {
    plainText = `\n${plainText/*.trim()*/}\n`;
    for (var i = 0; i < syntax.length; i++) {
      plainText = replaceExpression(syntax[i][0], syntax[i][1], plainText);
    }
    return plainText/*.trim()*/;
  }

  plainText = plainText.split('\n');
  let ret = [];
	for (var i = 0; i < plainText.length; i++) {
		ret.push(parseLine(plainText[i]));
	}
  ret = ret.join('\n');

  return ret;
}
