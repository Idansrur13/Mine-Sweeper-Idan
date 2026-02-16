function setMinesNegsCount(celPos) {
  for (let i = 0; i < gLevel.mines; i++) {
    var newCellPos = getEmptyCell(celPos)
    const currBoard = gBoard[newCellPos.i][newCellPos.j]
    currBoard.isMine = true
    const minesAround = neighborCount(newCellPos)
    currBoard.minesAroundCound += minesAround

    console.log(gBoard)
  }
}

function getEmptyCell(celPos) {
  var m = getRandomIntInclusive(0, gLevel.size - 1)
  var r = getRandomIntInclusive(0, gLevel.size - 1)
  while (m === celPos.i && r === celPos.j) {
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

      strHtml += `<td oncontextmenu="onCellRightClicked(this, ${i}, ${j})" onclick="onCellClicked(this, ${i}, ${j})" class="cell cell-${i}-${j}">${elCell}</td>`
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

function startTime() {
  gGame.secsPassed += 1
  const minutes = Math.floor(gGame.secsPassed / 60)
  const seconds = gGame.secsPassed % 60
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const elTime = document.querySelector('.time')
  if (elTime) elTime.innerText = formatted
}

function renderSoldierPic(type) {
  const pic = document.querySelector('.soldier')
  pic.innerHTML = `<img class="soldierPic" src=${type} alt=${type}>`
}
