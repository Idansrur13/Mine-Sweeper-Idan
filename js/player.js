function onCellClicked(elCell, i, j) {
  if (gLevel.lives === 0) return
  var celPos = { i, j }
  gBoard[i][j].isRevealed = true

  if (gGame.isStart) {
    gGame.isStart = false
    setMinesNegsCount(celPos)
    gemeTimer = setInterval(startTime, 1000)
  }
  checkCell(celPos)
  console.log(gBoard)
}

function onCellRightClicked(i, j) {
  console.log(i, j, 'asdgasrg')
  if (gLevel.lives === 0 || gGame.isStar) return

  event.preventDefault()
  var celPos = { i, j }

  var cellVal = gBoard[i][j]

  if (!cellVal.isMark) {
    gGame.markedCount++
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
  } else if (minesCount > 0) {
    renderCell(cellPos, minesCount)
    renderSoldierPic(happySrc)
    // pointAudio.play()
  } else {
    expandReveal(cellPos)
    renderCell(cellPos, EMPTYSLOT)
    renderSoldierPic(happySrc)
  }
  checkWin()
}

function useHint() {
  if (gLevel.hints === 0 || gGame.isStart) return
  gLevel.hints--

  var freeCell = getEmptyCell()
  var currBoard = gBoard[freeCell.i][freeCell.j]
  renderCell(freeCell, currBoard.minesAroundCound)

  renderHint()
  currBoard.isRevealed = true
  setTimeout(() => renderCell(freeCell, EMPTY), 1000)
}

function changeSize(size) {
  closePop()
  var lives = 1
  if (size >= 8) lives += 1
  if (size >= 12) lives += 1

  var hints = 1
  if (size >= 8) hints += 1
  if (size >= 12) hints += 1

  gLevel = {
    size,
    mines: size,
    lives,
    hints,
  }
}
