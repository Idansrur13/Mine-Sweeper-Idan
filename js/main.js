'use strict'

var gBoard = []
const MINE = '💣'
const Detected = '💩'
const EMPTY = ''
const EMPTYSLOT = '🔰'
const FLAG = '⛳️'

// settings
var isHitsOn = true

// timers
var explodeInt
var gemeTimer

// local storage
var StatsTimeArr = localStorage.getItem('prevWinsTime')
var StatsLeftMinesArr = localStorage.getItem('leftMines')
var StatsLevelArr = localStorage.getItem('level')

const pointAudio = new Audio('audio/universfield-game-bonus-02-294436.mp3')

// imgssss
const happySrc = 'img/soldiers/7.svg'
const winSrc = 'img/soldiers/8.svg'
const scaredSrc = 'img/soldiers/9.svg'
const lossSrc = 'img/soldiers/10.svg'

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
  renderHint()
  buildBoard()
  renderBoard()
  setPrivStats()
}

function setPrivStats() {
  var tdStats = document.querySelector('.tdStats')

  tdStats.innerHTML = ''

  if (!StatsTimeArr) return
  var stlitTime = StatsTimeArr.split(',')
  var splitLevel = StatsLevelArr.split(',')
  var splitMines = StatsLeftMinesArr.split(',')

  for (let i = 0; i < stlitTime.length; i++) {
    if (stlitTime[i] === 'null') continue
    if (stlitTime[i] === '') continue
    console.log(stlitTime[i], 'time', splitLevel, 'level', splitMines, 'mines')

    tdStats.innerHTML += `<td>${stlitTime[i]}</td>
    <td>${splitLevel[i]}</td>
    <td>${splitMines[i]}</td>`
  }
}

function resetSetting(size = 4) {
  const time = document.querySelector('.time')
  const headBoard = document.querySelector('.headBoard')

  headBoard.hidden = true
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
    hints: 1,
  }
  gBoard = []
  changeSize(size)
  clearInterval(gemeTimer)
  clearInterval(explodeInt)
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

function checkWin() {
  const headBoard = document.querySelector('.headBoard')
  const totalMines = document.querySelector('.totalMinesTd')
  const level = document.querySelector('.levelTd')
  const time = document.querySelector('.timeTd')
  var timeFormated = startTime(gGame.secsPassed)

  const revalCon = gGame.revealedCount
  const markedFlag = gGame.markedCount
  const leftMines = gLevel.mines - gGame.explodedMines
  console.log(
    'revalCon',
    revalCon,
    'markedFlag',
    markedFlag,
    'leftMines',
    leftMines,
  )

  if (revalCon === leftMines && revalCon === markedFlag && revalCon > 0) {
    renderSoldierPic(winSrc)

    headBoard.innerText = 'you Winn 🥇🏆🏅'
    headBoard.hidden = false
    totalMines.innerText = gLevel.mines
    level.innerText = gLevel.size
    time.innerText = timeFormated

    // save stats
    // save stats
    var timeFormated = startTime(gGame.secsPassed)
    StatsTimeArr += ',' + timeFormated
    StatsLeftMinesArr += ',' + leftMines
    StatsLevelArr += ',' + gLevel.size

    localStorage.setItem('prevWinsTime', StatsTimeArr)
    localStorage.setItem('level', StatsLevelArr)
    localStorage.setItem('leftMines', StatsLeftMinesArr)
  }
}

function gameOver() {
  const headBoard = document.querySelector('.headBoard')
  const totalMines = document.querySelector('.totalMinesTd')
  const leftMine = document.querySelector('.levelTd')
  const leftMines = gLevel.mines - gGame.explodedMines

  headBoard.hidden = false
  headBoard.innerText = 'you loose 💩🤡'
  totalMines.innerText = gLevel.mines
  leftMine.innerText = leftMines

  renderSoldierPic(lossSrc)

  explodeInt = setInterval(oxplodeMine, 700)
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
