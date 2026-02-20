'use strict'

var gBoard = []
const MINE = '💣'
const Detected = '💩'
const EMPTY = ''
const EMPTYSLOT = '🔰'
const FLAG = '⛳️'

// timers
var gExplodeIntervalId
var gTimerIntervalId

// local storage
var statsTimeArr = localStorage.getItem('prevWinsTime')
var statsLeftMinesArr = localStorage.getItem('leftMines')
var statsLevelArr = localStorage.getItem('level')

const pointAudio = new Audio('audio/universfield-game-bonus-02-294436.mp3')

// imgssss
const happyImgUrl = 'img/soldiers/7.svg'
const winImgUrl = 'img/soldiers/8.svg'
const scaredImgUrl = 'img/soldiers/9.svg'
const lossImgUrl = 'img/soldiers/10.svg'

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
  hints: 1,
}

var gGame = {
  isStart: false,
  isManualMine: false,
  minesArr: [],
  revealedCount: 0,
  explodedMines: 0,
  markedCount: 0,
  secsPassed: 0,
}

function onInit(size = gLevel.size) {
  renderSoldierImg(happyImgUrl)
  resetSetting(size)
  renderLife()
  renderHint()
  buildBoard()
  renderBoard()
  setPrivStats()
}

function resetSetting(size) {
  const time = document.querySelector('.time')
  const headBoard = document.querySelector('.headBoard')

  headBoard.hidden = true
  time.innerText = '00:00'
  gGame = {
    isStart: true,
    isManualMine: false,
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
    hints: 1,
  }
  gBoard = []
  changeSize(size)
  clearInterval(gTimerIntervalId)
  clearInterval(gExplodeIntervalId)
}

function stepBoom(cellPos) {
  var elCell = document.querySelector(`.cell-${cellPos.i}-${cellPos.j}`)
  gLevel.lives--
  gGame.explodedMines++
  renderSoldierImg(scaredImgUrl)
  elCell.style.backgroundColor = '#c93e3eff'
  renderLife()

  if (gLevel.lives === 0) {
    gameOver()
  }
}

function checkWin() {
  const headBoard = document.querySelector('.headBoard')

  const revalCon = gGame.revealedCount
  const markedFlag = gGame.markedCount
  const leftMines = gLevel.mines - gGame.explodedMines

  if (revalCon === leftMines && revalCon === markedFlag && revalCon > 0) {
    renderSoldierImg(winImgUrl)
    clearInterval(gTimerIntervalId)

    headBoard.innerText = 'you Winn 🥇🏆🏅'
    headBoard.hidden = false

    // save stats
    // time
    const minutes = Math.floor(gGame.secsPassed / 60)
    const seconds = gGame.secsPassed % 60
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

    statsTimeArr += ',' + formatted
    statsLeftMinesArr += ',' + leftMines
    statsLevelArr += ',' + gLevel.size

    localStorage.setItem('prevWinsTime', statsTimeArr)
    localStorage.setItem('level', statsLevelArr)
    localStorage.setItem('leftMines', statsLeftMinesArr)
  }
}

function gameOver() {
  const headBoard = document.querySelector('.headBoard')

  headBoard.hidden = false
  headBoard.innerText = 'you loose 💩🤡'

  renderSoldierImg(lossImgUrl)
  clearInterval(gTimerIntervalId)

  gExplodeIntervalId = setInterval(oxplodeMine, 700)
}

function expandReveal(cell) {
  for (let i = cell.i - 1; i <= cell.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (let j = cell.j - 1; j <= cell.j + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      var currPos = { i, j }
      const currCell = gBoard[i][j]
      const boardMinesAr = currCell.minesAroundCound
      if (currCell.isMine) return

      if (boardMinesAr === 0 && !currCell.isRevealed) {
        currCell.isRevealed = true

        renderCell(currPos, EMPTYSLOT)
        expandReveal(currPos)
      } else if (boardMinesAr === 0) {
        renderCell(currPos, EMPTYSLOT)
        currCell.isRevealed = true
      } else {
        renderCell(currPos, boardMinesAr)
        currCell.isRevealed = true
      }
    }
  }
}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

function startTime(time) {
  gGame.secsPassed += 1
  const minutes = Math.floor(gGame.secsPassed / 60)
  const seconds = gGame.secsPassed % 60
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const elTime = document.querySelector('.time')
  if (elTime) elTime.innerText = formatted
  time = formatted
  return time
}
