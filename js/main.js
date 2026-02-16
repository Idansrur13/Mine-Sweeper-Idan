'use strict'

var gBoard = []
const MINE = '💣'
const Detected = '💩'
const EMPTY = ''
const EMPTYSLOT = '🔰'
const FLAG = '⛳️'

const pointAudio = new Audio('audio/universfield-game-bonus-02-294436.mp3')

// imgssss
const happySrc = 'img/soldiers/7.svg'
const winSrc = 'img/soldiers/8.svg'
const scaredSrc = 'img/soldiers/9.svg'
const lossSrc = 'img/soldiers/10.svg'

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
  minesArr: [],
  revealedCount: 0,
  explodedMines: 0,
  markedCount: 0,
  secsPassed: 0,
}

function onInit(size = 4) {
  renderSoldierPic(happySrc)
  resetSetting(size)
  renderLife()
  buildBoard()
  renderBoard()
}

function resetSetting(size = 4) {
  const time = document.querySelector('.time')
  time.innerText = '00:00'
  gGame = {
    isStart: true,
    minesArr: [],
    revealedCount: 0,
    markedCount: 0,
    explodedMines: 0,
    secsPassed: 0,
  }

  gLevel = {
    size: 4,
    mines: 2,
    lives: 1,
  }
  gBoard = []
  changeSize(size)
  clearInterval(gemeTimer)
}

function stepBoom(cellPos) {
  var elCell = document.querySelector(`.cell-${cellPos.i}-${cellPos.j}`)
  gLevel.lives--
  gGame.explodedMines++
  elCell.style.backgroundColor = '#c93e3eff'
  renderLife()

  if (gLevel.lives === 0) {
    gameOver()
  }
}

function expandReveal(cell) {
  for (let i = cell.i - 1; i <= cell.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (let j = cell.j - 1; j <= cell.j + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      var currCell = { i, j }
      const currBoard = gBoard[i][j]
      const boardMinesAr = currBoard.minesAroundCound
      if (currBoard.isMine) return

      if (boardMinesAr === 0 && !currBoard.isRevealed) {
        currBoard.isRevealed = true

        renderCell(currCell, EMPTYSLOT)
        expandReveal(currCell)
      } else if (boardMinesAr === 0) {
        renderCell(currCell, EMPTYSLOT)
      } else {
        renderCell(currCell, boardMinesAr)
      }
    }
  }
}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}
