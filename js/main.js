'use strict'

var gBoard = []
const MINE = '*'
const EMPTY = ''
const FLAG = '⛳️'

var gBoardStatic = {
  minesAroundCound: 4,
  isRevealed: false,
  isMine: false,
  isMark: false,
}

var gLevel = {
  size: 4,
  mines: 2,
}
var gGame = {
  isOn: false,
  revealedCount: 0,
  markedCount: 0,
  secsPassed: 0,
}

function onInit() {
  buildBoard()
  renderBoard()
  setMinesNegsCount()
}

function setMinesNegsCount() {
  for (let i = 0; i < gLevel.mines; i++) {
    var j = getRandomIntInclusive(0, gLevel.size - 1)
    var r = getRandomIntInclusive(0, gLevel.size - 1)
    while (gBoard[j][r] === EMPTY) {
      gBoard[j][r] = MINE
    }
    gBoard[j][r] = MINE
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
  const cellVal = gBoard[i][j]
  var celPos = {
    i,
    j,
  }
  elCell.innerText = cellVal
  if (cellVal === MINE) {
  } else if (cellVal === FLAG) {
  } else {
    neighborCount(celPos)
  }
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
  console.log('work', celPos, count)

  checkCell(celPos, count)
}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

function expandReveal(cell) {}

console.table(gBoard)

function checkCell(cell, countNeig) {
  var currCell = gBoard[cell.i][cell.j]

  if (currCell === MINE) {
    gameOver()
  } else if (countNeig > 0) {
    renderCell(cell, render)
  } else {
    expandReveal(cell)
  }
}

function renderCell(cell, render) {
  var elCell = document.querySelector(`.cell-${cell.i}-${cell.j}`)
  elCell.innerText = render
}

function expandReveal(cell) {
  for (let i = celPos.i - 1; i <= celPos.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (let j = celPos.j - 1; j <= celPos.j + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      var currCell = gBoard[i][j]

      renderCell(celPos, neighborCount(cell))
    }
  }
  console.log('work', celPos, count)
}
