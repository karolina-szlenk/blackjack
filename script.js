//API URL
// const API_CARDS = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
const API_CARD = 'https://deckofcardsapi.com/api/deck/new/draw/?count=1'

//global store
let flag = false
let players = []
let id
let container = document.querySelector('.menu')
const activePlayer = document.querySelector('.active-player')

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

class Player {
  constructor(id, name, arr, isVisible, status, deckId) {
    this.id = id
    this.name = name
    this.arr = arr
    this.isVisible = isVisible
    this.status = status
    this.deckId = deckId
  }

  //todo -> correct url and data receive
  getCards() {
    fetch(`https://deckofcardsapi.com/api/deck/<<${this.deckId}>>/draw/?count=2`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data.cards, data.deck_id)
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

  //todo -> correct url and data receive
  getSingleCard() {
    fetch(API_CARD, {
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

  //todo -> remove this method, because game draws card
  drawCards(card) {
    const cards = document.querySelector('.cards')
    const img = createElement('img', 'cards__img')
    setAttributes(img, { src: card.image })
    cards.appendChild(img)
  }

  //todo -> remove this method, because game prints name
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

  //todo -> remove this method, because card gets value, not player
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

  //todo -> remove this method, because game or card should make array from cards
  makeArrayOfNums(card) {
    const value = this.getValue(card.value)
    this.arr.push(value)
    if (this.arr[0] === 11 && this.arr[1] === 11) {
      console.log('Lucky you!!!')
    }
  }

  //todo -> remove this method, because game should count points
  countPoints() {
    const sumOfPoints = this.arr.reduce((x1, x2) => x1 + x2, 0)
    this.points = sumOfPoints
    return sumOfPoints
  }

  //todo -> remove this method, because game should print points
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

class Deck {
  constructor() {
    this.url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
  }

  init() {
    return fetch(this.url)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject({ status: response.status, statusText: response.statusText })
        }
      })
      .catch((error) => {
        if (error.status === 404) {
          console.log(error.status)
        }
      })
  }
}

class Card {
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
    this.createButtonsContainer()
  }

  createPlayers() {
    const inputs = document.querySelectorAll('.name')
    inputs.forEach((input) => {
      const inputId = input.id
      const inputValue = input.value
      const player = new Player(inputId, inputValue, [], false, true, id)
      players.push(player)
    })
    console.log(players)
  }

  createButtonsContainer() {
    const div = createElement('div', 'btn-container')
    this.createTakingCardBtn(div)
    this.createPasBtn(div)
    activePlayer.appendChild(div)
  }

  createTakingCardBtn(el) {
    const btn = createElement('button', 'btn-takeCard')
    createInnerText(btn, 'TAKE CARD')
    el.appendChild(btn)
    btn.addEventListener('click', () => {
      console.log('one card')
    })
  }

  createPasBtn(el) {
    const btn = createElement('button', 'btn-Pas')
    createInnerText(btn, 'PAS')
    el.appendChild(btn)
    btn.addEventListener('click', () => {
      console.log('pas!')
    })
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

const mapObjectToArray = (obj) =>
  Object.entries(obj || {}).map(([key, value]) =>
    typeof value === 'object' ? { ...value, key } : { key, value }
  )
//-------------------------------end-of-helpers--------------------------------------
