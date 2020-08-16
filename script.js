//API URL
// const API_CARDS = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
const API_CARD = 'https://deckofcardsapi.com/api/deck/new/draw/?count=1'

//global store
let flag = false
let players = []
let activePlayer
let id
const body = document.querySelector('body')
let container = document.querySelector('.menu')
const activePlayerView = document.querySelector('.active-player')
const heading = document.querySelector('h2')
const btnContainer = document.querySelector('.btn-container')
const message = document.querySelector('.message')

class Menu {
  //todo -> divide init to smaller methods
  init() {
    container = document.querySelector('.menu')
    this.div = createElement('div', 'menu__players-selection')
    this.label = createElement('label', 'label')
    setAttributes(this.label, { for: 'numOfPlayer' })
    createInnerText(this.label, 'Select number of players')
    this.select = createElement('select', 'select')

    setAttributes(this.select, { name: 'numOfPlayer', id: 'numOfPlayer' })
    this.div.appendChild(this.label)
    this.div.appendChild(this.select)

    this.options = [1, 2, 3, 4]
    this.options.forEach((option, index, arr) => {
      option = createElement('option', 'option')
      setAttributes(option, { value: arr[index] })
      createInnerText(option, arr[index])
      if (option.value === '1') {
        setAttributes(option, { selected: 'selected' })
      }
      this.select.appendChild(option)
    })

    this.select.addEventListener('click', () => {
      this.createNameInputs()
    })

    container.appendChild(this.div)

    this.div2 = createElement('div', 'menu__players-container')
    this.label2 = createElement('label', 'label2')
    setAttributes(this.label2, { for: 'players' })
    createInnerText(this.label2, 'Players')
    this.div3 = createElement('div', 'players')
    this.div2.appendChild(this.label2)
    this.div2.appendChild(this.div3)

    container.appendChild(this.div2)

    this.btn = createElement('button', 'menu__btn-rules')
    createInnerText(this.btn, 'INSTRUCTION')
    this.btnStart = createElement('button', 'menu__btn-start')
    createInnerText(this.btnStart, 'START')

    this.btnStart.addEventListener('click', () => {
      const game = new BlackjackGame()
      game.start()
      this.hideMenu()
    })

    this.btnExit = createElement('button', 'menu__btn-finish')
    createInnerText(this.btnExit, 'EXIT')

    container.appendChild(this.btn)
    container.appendChild(this.btnStart)
    container.appendChild(this.btnExit)
    this.createNameInputs()
  }

  createNameInputs() {
    removeChildren(this.div3)
    const numOfPlayers = Number(this.select.options[this.select.selectedIndex].value)
    for (let i = 0; i < numOfPlayers; i++) {
      const input = createElement('input', 'name')
      setAttributes(input, { type: 'text', id: Math.floor(Math.random() * 100), minlength: 1 })
      this.div3.append(input)
    }
  }

  hideMenu() {
    container.classList.add('hide')
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------

class Player {
  constructor(id, name, arr, isVisible) {
    this.id = id
    this.name = name
    this.arr = arr
    this.isVisible = isVisible
  }

  async getCards() {
    try {
      let response = await fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`)
      let data = await response.json()
      data.cards.map((el) => {
        const card = new Card(el.value, el.image)
        const value = card.getValue()
        this.getScore(value)
        this.showHand(el.image)
        return card
      })
      this.printPoints()
    } catch (err) {
      console.log(err)
    }
  }

  async getSingleCard() {
    try {
      let response = await fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
      let data = await response.json()
      data.cards.map((el) => {
        const card = new Card(el.value, el.image)
        const value = card.getValue()
        this.getScore(value)
        this.showHand(el.image)
        return card
      })
      this.printPoints()
    } catch (err) {
      console.log(err)
    }
  }

  showHand(image) {
    const cardContainer = createElement('div', 'card-container')
    const img = createElement('img', 'cards__img')
    setAttributes(img, { src: image })
    cardContainer.appendChild(img)
    activePlayerView.appendChild(cardContainer)
  }

  printName() {
    this.nameContainer = createElement('div', 'name-container')

    const label = createElement('p', 'name-label')
    createInnerText(label, 'Player')
    this.nameContainer.appendChild(label)

    const name = createElement('p', 'name-player')
    createInnerText(name, this.name)
    this.nameContainer.appendChild(name)

    activePlayerView.appendChild(this.nameContainer)
  }

  getScore(value) {
    this.arr.push(value)
  }

  countPoints() {
    const sumOfPoints = this.arr.reduce((x1, x2) => x1 + x2, 0)
    console.log(sumOfPoints)
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
    createInnerText(points, this.countPoints())
    this.pointsContainer.appendChild(points)

    activePlayerView.appendChild(this.pointsContainer)
  }
}

class Deck {
  constructor() {
    this.url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
  }

  async init() {
    try {
      let response = await fetch(this.url)
      let deck = await response.json()
      return deck
    } catch (err) {
      console.log(err)
    }
  }
}

class Card {
  constructor(value, img) {
    this.value = value
    this.img = img
  }

  getValue() {
    let num = Number(this.value)
    if (this.value === 'JACK') {
      num = 2
    }
    if (this.value === 'QUEEN') {
      num = 3
    }
    if (this.value === 'KING') {
      num = 4
    }
    if (this.value === 'ACE') {
      num = 11
    }
    return num
  }
}

class BlackjackGame {
  start() {
    if (flag) {
      return
    }
    flag = true
    const deck = new Deck().init()
    deck
      .then((data) => {
        id = data.deck_id
      })
      .then(() => this.createPlayers())
    console.log(players)
  }

  createPlayers() {
    const inputs = document.querySelectorAll('.name')
    inputs.forEach((input) => {
      const inputId = input.id
      const inputValue = input.value
      const player = new Player(inputId, inputValue, [], false)
      players.push(player)
    })
    this.updatePlayer()
  }

  createButtonsContainer() {
    this.createTakingCardBtn(btnContainer)
    this.createPasBtn(btnContainer)
  }

  createTakingCardBtn(el) {
    const btn = createElement('button', 'btn-takeCard')
    createInnerText(btn, 'TAKE CARD')
    el.appendChild(btn)
    btn.addEventListener('click', () => {
      activePlayer.getSingleCard().then(() => this.checkIsLosing(activePlayer))
    })
  }

  createPasBtn(el) {
    const btn = createElement('button', 'btn-Pas')
    createInnerText(btn, 'PAS')
    el.appendChild(btn)
    btn.addEventListener('click', () => {
      this.updatePlayer()
    })
  }

  updatePlayer() {
    if (btnContainer.querySelector('.btn-takeCard') === null) {
      this.createButtonsContainer()
    }
    const newPlayer = players.find((el) => el.isVisible === false)
    if (newPlayer) {
      removeChildren(activePlayerView)
      removeChildren(message)
      activePlayer = newPlayer
      activePlayer.isVisible = true
      activePlayer.printName()
      activePlayer.getCards().then(() => this.checkIsWinning(activePlayer))
    } else {
      this.getScore()
    }
  }

  checkIsLosing(activePlayer) {
    const sumOfPoints = activePlayer.arr.reduce((x1, x2) => x1 + x2, 0)
    if (sumOfPoints >= 22) {
      removeChildren(activePlayerView)
      removeChildren(btnContainer)
      sendMessage('You lost!')
      setTimeout(() => this.updatePlayer(), 3000)
    }
  }

  checkIsWinning(activePlayer) {
    if (activePlayer.arr[0] === 11 && activePlayer.arr[1] === 11) {
      sendMessage('Lucky you!!!')
      setTimeout(() => this.updatePlayer(), 3000)
    } else {
      return
    }
  }

  getScore() {
    removeChildren(activePlayerView)
    removeChildren(btnContainer)
    const score = document.querySelector('.score')
    score.innerHTML = 'SCORE'
  }
}

const menu = new Menu().init()

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

function sendMessage(msg) {
  message.innerText = msg
}

//-------------------------------end-of-helpers--------------------------------------

//test for case with 2 aces when player starts
function testWith2ACES() {
  try {
    let data = [
      { value: 'ACE', image: 'https://deckofcardsapi.com/static/img/AS.png' },
      { value: 'ACE', image: 'https://deckofcardsapi.com/static/img/AS.png' },
    ]
    data.map((el) => {
      const card = new Card(el.value, el.image)
      const value = card.getValue()
      this.getScore(value)
      this.showHand(el.image)
      return card
    })
    this.printPoints()
  } catch (err) {
    console.log(err)
  }
}
