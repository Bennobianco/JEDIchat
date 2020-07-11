addEventListener("load", function() {
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
})

function toggleSidebar() {
  if (document.body.attributes.getNamedItem("sidebar") == null || document.body.attributes.getNamedItem("sidebar").value != "open") {
    document.body.setAttribute("sidebar", "open")
  } else {
    document.body.setAttribute("sidebar", "close")
  }
}
