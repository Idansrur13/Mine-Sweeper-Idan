var explodeInt

function onCellClicked(elCell, i, j) {
  if (gLevel.lives === 0) return
  var celPos = { i, j }
  if (gGame.isStart) {
    gGame.isStart = false
    setMinesNegsCount(celPos)
    gemeTimer = setInterval(startTime, 1000)
  }
  checkCell(celPos)
}

function onCellRightClicked(i, j) {
  if (gLevel.lives === 0) return

  const alDetectedMine = document.querySelector('.Detected')
  event.preventDefault()
  var celPos = { i, j }
  var cellVal = gBoard[i][j]

  if (gGame.isStart) {
    return
  }

  if (!cellVal.isMark) {
    gGame.markedCount++
    alDetectedMine.innerText = gGame.markedCount
    renderCell(celPos, FLAG)
    cellVal.isMark = true
    renderSoldierPic(scaredSrc)
  } else {
    gGame.markedCount--
    alDetectedMine.innerText = gGame.markedCount
    renderCell(celPos, EMPTY)
    cellVal.isMark = false
  }

  if (cellVal.isMine) {
    gGame.revealedCount++
  }
  checkWin()
}

function checkCell(cellPos) {
  var currCell = gBoard[cellPos.i][cellPos.j]
  const minesCount = currCell.minesAroundCound

  if (currCell.isMark) {
    gGame.markedCount--
    currCell.isMark = false
  }

  if (currCell.isMine) {
    renderCell(cellPos, MINE)
    stepBoom(cellPos)
    renderSoldierPic(scaredSrc)
  } else if (minesCount > 0) {
    renderCell(cellPos, minesCount)
    renderSoldierPic(happySrc)
    // pointAudio.play()
    return
  } else {
    expandReveal(cellPos)
    renderCell(cellPos, EMPTYSLOT)
    renderSoldierPic(happySrc)
  }
  checkWin()
}

function checkWin() {
  const headingPop = document.querySelector('.headPop')
  const totalMines = document.querySelector('.totalMines')
  const leftMine = document.querySelector('.leftMine')

  const revalCon = gGame.revealedCount
  const markedFlag = gGame.markedCount
  const leftMines = gGame.explodedMines - gLevel.mines

  if (revalCon === leftMines && revalCon === markedFlag && revalCon > 0) {
    setTimeout(openPop, 4000)
    renderSoldierPic(winSrc)

    headingPop.innerText = 'you Winn 🥇🏆🏅'
    totalMines.innerText = gLevel.mines
    leftMine.innerText = leftMines
  }
}

function gameOver() {
  const headingPop = document.querySelector('.headPop')
  const totalMines = document.querySelector('.totalMines')
  const leftMine = document.querySelector('.leftMine')
  const leftMines = gGame.explodedMines - gLevel.mines

  headingPop.innerText = 'you loose 💩🤡'
  totalMines.innerText = gLevel.mines
  leftMine.innerText = leftMines

  renderSoldierPic(lossSrc)

  explodeInt = setInterval(oxplodeMine, 700)
}

function oxplodeMine() {
  var currMinePos = gGame.minesArr.shift()
  renderCell(currMinePos, MINE)
  if (gGame.minesArr.length === 0) {
    console.log(gGame.minesArr)
    clearInterval(explodeInt)
    openPop()
  }
}

function changeSize(size) {
  closePop()
  var lives = 1
  if (size >= 8) lives += 1
  if (size >= 12) lives += 1

  gLevel = {
    size: size,
    mines: size,
    minesArr: [],
    lives: lives,
  }
}
