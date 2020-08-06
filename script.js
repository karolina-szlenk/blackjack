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

//--------------------------------------helpers--------------------------------------
function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key])
  }
}

function removeChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}
//-------------------------------end-of-helpers--------------------------------------
