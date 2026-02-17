function closePop() {
  const pop = document.querySelector('.popNewGame')
  pop.style.display = 'none'
}
function openPop() {
  var pop = document.querySelector('.popNewGame')
  pop.style.display = 'grid'
  setTimeout(gemeTimer)
}

function hintToggle() {
  isHitsOn = localStorage.getItem('withHints')

  if (isHitsOn) {
    isHitsOn = false
    gLevel.hints = false
  } else isHitsOn = true

  localStorage.setItem('withHints', isHitsOn)
}

function timeToggle() {}
