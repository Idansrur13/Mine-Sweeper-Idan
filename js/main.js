'use strict'

var gBoard = []
const MINE = '💣'
const EMPTY = ''
const EMPTYSLOT = '🔰'

const FLAG = '⛳️'
var gemeTimer

var gBoardStatic = {
  minesAroundCound: 4,
  isRevealed: false,
  isMine: false,
  isMark: false,
}

var gLevel = {
  size: 4,
  mines: 2,
  lives: 1,
}
var gGame = {
  isStart: false,
  lives: 3,
  revealedCount: 0,
  markedCount: 0,
  secsPassed: 0,
}

function onInit() {
  gGame = {
    isStart: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
  }
  renderLife()
  gBoard = []
  buildBoard()
  renderBoard()
}

function changeSize(size) {
  closePop()
  var lives = 1
  if (size >= 8) lives += 1
  if (size >= 12) lives += 1

  gLevel = {
    size: size,
    mines: size / 2,
    lives: lives,
  }
  onInit()
}

function setMinesNegsCount(celPos) {
  for (let i = 0; i < gLevel.mines; i++) {
    var j = getRandomIntInclusive(0, gLevel.size - 1)
    var r = getRandomIntInclusive(0, gLevel.size - 1)
    while (j === celPos.i && r === celPos.j) {
      gBoard[j][r] = MINE
      j = getRandomIntInclusive(0, gLevel.size - 1)
      r = getRandomIntInclusive(0, gLevel.size - 1)
    }
    gBoard[j][r] = MINE
    console.log('i-j', j, r)
  }
}

function buildBoard() {
  for (let i = 0; i < gLevel.size; i++) {
    gBoard[i] = []
    for (let j = 0; j < gLevel.size; j++) {
      gBoard[i][j] = EMPTY
    }
  }

  console.log(gBoard)
}

function renderBoard() {
  const elBoard = document.querySelector('.mainBoard')
  var strHtml = '<table><tbody>'
  for (let i = 0; i < gBoard.length; i++) {
    strHtml += '<tr>'
    for (let j = 0; j < gBoard[i].length; j++) {
      const elCell = gBoard[i][j]

      strHtml += `<td onclick="onCellClicked(this, ${i}, ${j})" class="cell cell-${i}-${j}">${elCell}</td>`
    }

    strHtml += '</tr>'
  }

  strHtml += '</tbody></table>'
  elBoard.innerHTML = strHtml
}

function onCellClicked(elCell, i, j) {
  var celPos = {
    i,
    j,
  }
  if (!gGame.isStart) {
    gGame.isStart = true
    setMinesNegsCount(celPos)
    gemeTimer = setInterval(startTime, 1000)
  }
  console.log(gGame.isStart, gBoard)

  const cellVal = gBoard[i][j]

  elCell.innerText = cellVal

  checkCell(celPos)
}

function neighborCount(celPos) {
  var count = 0
  for (let i = celPos.i - 1; i <= celPos.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (let j = celPos.j - 1; j <= celPos.j + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      var currCell = gBoard[i][j]

      if (currCell === MINE) {
        count++
      }
    }
  }
  return count
}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

console.table(gBoard)

function checkCell(cellPos) {
  var currCell = gBoard[cellPos.i][cellPos.j]
  var countNeig = neighborCount(cellPos)

  if (currCell === MINE) {
    renderCell(cellPos, MINE)
    stepBoom(cellPos)
  } else if (countNeig > 0) {
    renderCell(cellPos, countNeig)
  } else {
    expandReveal(cellPos)
  }
}

function stepBoom(cellPos) {
  var elCell = document.querySelector(`.cell-${cellPos.i}-${cellPos.j}`)
  gLevel.lives--
  elCell.style.backgroundColor = '#c93e3eff'
  renderLife()

  if (gLevel.lives === 0) {
    gameOver()
  }
}
function gameOver() {
  openPop()
}

function renderLife() {
  var shild = document.querySelector('.shilds')
  shild.innerHTML = ''
  console.log(gLevel.lives)
  for (let i = 0; i < gLevel.lives; i++) {
    shild.innerHTML += '<div class="life"></div>'
  }
}

function renderCell(cell, render) {
  var elCell = document.querySelector(`.cell-${cell.i}-${cell.j}`)
  elCell.innerText = render
}

function expandReveal(cell) {
  for (let i = cell.i - 1; i <= cell.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (let j = cell.j - 1; j <= cell.j + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      var currCell = { i, j }
      var countNeig = neighborCount(currCell)
      if (countNeig === 0) {
        renderCell(currCell, EMPTYSLOT)
      } else {
        renderCell(currCell, countNeig)
      }
    }
  }
}
console.log(gBoard)

function clickedRender() {
  console.log('ddd')
}
function startTime() {
  gGame.secsPassed += 1
  const minutes = Math.floor(gGame.secsPassed / 60)
  const seconds = gGame.secsPassed % 60
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const elTime = document.querySelector('.time')
  if (elTime) elTime.innerText = formatted
}

function closePop() {
  const pop = document.querySelector('.popNewGame')
  pop.style.display = 'none'
  console.log(pop, 'pop')
  setInterval(startTime, 1000)
}
function openPop() {
  var pop = document.querySelector('.popNewGame')
  pop.style.display = 'grid'
  setTimeout(gemeTimer)
}
