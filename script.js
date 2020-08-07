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
  console.log(numOfPlayers)
  for (let i = 0; i < numOfPlayers; i++) {
    const input = document.createElement('input')
    setAttributes(input, { type: 'text', id: Math.floor(Math.random() * 100), minlength: 1 })
    input.classList.add('name')
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
})

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
        })
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
}
