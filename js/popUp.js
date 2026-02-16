function closePop() {
  const pop = document.querySelector('.popNewGame')
  pop.style.display = 'none'
}
function openPop() {
  var pop = document.querySelector('.popNewGame')
  pop.style.display = 'grid'
  setTimeout(gemeTimer)
}
