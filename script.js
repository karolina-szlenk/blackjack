//API URL
const API_CARDS = 'https://deckofcardsapi.com/api/deck/new/draw/?count=2'

//variables
let flag = false
let players = []
const btnStart = document.querySelector('.menu__btn-start')
const activePlayer = document.querySelector('.active-player')

//create inputs
const numOfPlayersSelection = document.getElementById('numOfPlayer')
const inputsContainer = document.querySelector('.players')

function createNameInputs() {
  removeChildren(inputsContainer)
  const numOfPlayers = Number(
    numOfPlayersSelection.options[numOfPlayersSelection.selectedIndex].value
  )
  for (let i = 0; i < numOfPlayers; i++) {
    const input = createElement("input", 'name')
    setAttributes(input, { type: 'text', id: Math.floor(Math.random() * 100), minlength: 1 })
    inputsContainer.append(input)
  }
}

createNameInputs()

numOfPlayersSelection.addEventListener('click', function () {
  createNameInputs()
})

//create players
function createPlayers() {
  if (flag) {
    return
  }
  flag = true
  const inputs = document.querySelectorAll('.name')
  inputs.forEach((input) => {
    const inputId = input.id
    const inputValue = input.value
    const obj = new Player(inputId, inputValue, [], false, true)
    players.push(obj)
  })
  console.log(players)
}

btnStart.addEventListener('click', function () {
  createPlayers()
  players[0].isVisible = true
  players[0].getCards()
  const div = createElement('div', 'cards')
  activePlayer.append(div)
  players[0].printName()
  createButtonsContainer()
})

//create buttons
function createTakingCardBtn(el) {
  const btn = createElement('button', 'btn-takeCard')
  createInnerText(btn, 'TAKE CARD')
  el.appendChild(btn)
}

function createPasBtn(el) {
  const btn = createElement('button', 'btn-Pas')
  createInnerText(btn, 'PAS')
  el.appendChild(btn)
}

function createButtonsContainer() {
  const div = createElement('div', 'btn-container')
  createTakingCardBtn(div)
  createPasBtn(div)
  activePlayer.appendChild(div)
}

//--------------------------------------helpers--------------------------------------
function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key])
  }
}

function createElement(el, className) {
  const htmlEl = document.createElement(el)
  htmlEl.classList.add(className)
  return htmlEl
}

function createInnerText(el, txt) {
  el.innerText = txt
}

function removeChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}
//-------------------------------end-of-helpers--------------------------------------

class Player {
  constructor(id, name, arr, isVisible, status) {
    this.id = id
    this.name = name
    this.arr = arr
    this.isVisible = isVisible
    this.status = status
  }

  getCards() {
    fetch(API_CARDS, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data.cards)
        data.cards.map((el) => {
          this.drawCards(el)
          this.makeArrayOfNums(el)
        })
      })
      .then((data) => {
        this.countPoints(), this.printPoints()
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  drawCards(card) {
    const cards = document.querySelector('.cards')
    const img = createElement('img', 'cards__img')
    setAttributes(img, { src: card.image })
    cards.appendChild(img)
  }

  printName() {
    this.nameContainer = createElement('div', 'name-container')

    const label = createElement('p', 'name-label')
    createInnerText(label, 'Player')
    this.nameContainer.appendChild(label)

    const name = createElement('p', 'name-player')
    createInnerText(name, this.name)
    this.nameContainer.appendChild(name)

    activePlayer.appendChild(this.nameContainer)
  }

  getValue(value) {
    let num = Number(value)
    if (value === 'JACK') {
      num = 2
    }
    if (value === 'QUEEN') {
      num = 3
    }
    if (value === 'KING') {
      num = 4
    }
    if (value === 'ACE') {
      num = 11
    }
    return num
  }

  makeArrayOfNums(card) {
    const value = this.getValue(card.value)
    this.arr.push(value)
    if (this.arr[0] === 11 && this.arr[1] === 11) {
      console.log('Lucky you!!!')
    }
  }

  countPoints() {
    const sumOfPoints = this.arr.reduce((x1, x2) => x1 + x2, 0)
    this.points = sumOfPoints
    return sumOfPoints
  }

  printPoints() {
    console.log('test')
    const pointsWrapper = document.querySelector('.points-container')
    if (pointsWrapper) {
      removeChildren(pointsWrapper)
    } else {
      this.pointsContainer = createElement('div', 'points-container')
      this.pointsContainer.classList.add('points-container')
    }

    const label = createElement('p', 'points-label')
    createInnerText(label, 'Points')
    this.pointsContainer.appendChild(label)

    const points = createElement('p', 'points')
    createInnerText(points, this.points)
    this.pointsContainer.appendChild(points)

    activePlayer.appendChild(this.pointsContainer)
  }
}
