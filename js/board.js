function setMinesNegsCount(celPos) {
  for (let i = 0; i < gLevel.mines; i++) {
    var newCellPos = getEmptyCell(celPos)
    const currBoard = gBoard[newCellPos.i][newCellPos.j]
    currBoard.isMine = true
    const minesAround = neighborCount(newCellPos)
    currBoard.minesAroundCound += minesAround
    gGame.minesArr.push(newCellPos)
  }
}

function oxplodeMine() {
  var currMinePos = gGame.minesArr.shift()
  renderCell(currMinePos, MINE)
  if (gGame.minesArr.length === 0) {
    clearInterval(explodeInt)
    // openPop()
  }
}

function getEmptyCell(celPos) {
  var m = getRandomIntInclusive(0, gLevel.size - 1)
  var r = getRandomIntInclusive(0, gLevel.size - 1)
  while (gBoard[m][r].isMine === true || gBoard[m][r].isRevealed === true) {
    m = getRandomIntInclusive(0, gLevel.size - 1)
    r = getRandomIntInclusive(0, gLevel.size - 1)
  }
  var newCellPos = { i: m, j: r }
  return newCellPos
}

function buildBoard() {
  for (let i = 0; i < gLevel.size; i++) {
    gBoard[i] = []
    for (let j = 0; j < gLevel.size; j++) {
      gBoard[i][j] = {
        minesAroundCound: 0,
        isRevealed: false,
        isMine: false,
        isMark: false,
      }
    }
  }
}

function renderBoard() {
  const elBoard = document.querySelector('.mainBoard')
  var strHtml = '<table><tbody>'
  for (let i = 0; i < gBoard.length; i++) {
    strHtml += '<tr>'
    for (let j = 0; j < gBoard[i].length; j++) {
      // const currBoard = gBoard[i][j]
      let elCell = EMPTY

      strHtml += `<td oncontextmenu="onCellRightClicked(${i}, ${j})" onclick="onCellClicked(this, ${i}, ${j})" class="cell cell-${i}-${j}">${elCell}</td>`
    }

    strHtml += '</tr>'
  }

  strHtml += '</tbody></table>'
  elBoard.innerHTML = strHtml
}

function neighborCount(celPos) {
  var count = 0
  for (let i = celPos.i - 1; i <= celPos.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (let j = celPos.j - 1; j <= celPos.j + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      var currCell = gBoard[i][j]

      if (!currCell.isMine) {
        currCell.minesAroundCound++
      }
    }
  }
  return count
}

function setPrivStats() {
  var trStats = document.querySelector('.trStats')

  trStats.innerHTML = ''

  if (!StatsTimeArr) return
  var stlitTime = StatsTimeArr.split(',')
  var splitLevel = StatsLevelArr.split(',')
  var splitMines = StatsLeftMinesArr.split(',')

  for (let i = 0; i < stlitTime.length; i++) {
    if (stlitTime[i] === 'null') continue
    if (stlitTime[i] === '') continue

    trStats.innerHTML += `<td >${stlitTime[i]}</td>
    <td >${splitLevel[i]}</td>
    <td >${splitMines[i]}</td>`
  }
}

function renderLife() {
  var shild = document.querySelector('.shilds')
  shild.innerHTML = ''
  for (let i = 0; i < gLevel.lives; i++) {
    shild.innerHTML += '<div class="life"></div>'
  }
}

function renderHint() {
  var hintsLeft = document.querySelector('.hintsLeft')
  hintsLeft.innerHTML = ''
  for (let i = 0; i < gLevel.hints; i++) {
    hintsLeft.innerHTML += '<div class="hint"></div>'
  }
}

function renderCell(cell, render) {
  var elCell = document.querySelector(`.cell-${cell.i}-${cell.j}`)
  elCell.innerText = render
}

function renderSoldierPic(type) {
  const pic = document.querySelector('.soldier')
  pic.innerHTML = `<img class="soldierPic" src=${type} alt=${type}>`
}
