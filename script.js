const gameboard = (function Gameboard() {
  let board = []
  for (let i = 0; i < 9; i++) {
    board.push(Cell())
  }

  const getBoard = () => board.map(cell => cell.getValue())

  const printBoard = () => console.log(getBoard());

  const placeMark = (index, mark) => {
    if (board[index].getValue() !== " ") return

    board[index].setValue(mark)
  }   

  const resetBoard = () => {
    board.forEach(cell => cell.setValue(" "))
  }

  return { getBoard, printBoard, placeMark, resetBoard }
})()


function Cell(){
  let value = " ";

  const getValue = () => value

  const setValue = (newValue) => value = newValue

  return { getValue, setValue }
}

function GameController(playerOne, playerTwo) {
  let result 

  const getResult = () => result

  const players = [
    {
      name: playerOne,
      mark: "✖️"
    },
    {
      name: playerTwo,
      mark: "⭕"
    }
  ]

  let activePlayer = players[0]

  const getActivePlayer = () => activePlayer

  const switchPlayerTurn = () => {
    activePlayer = getActivePlayer() === players[0] ? players[1] : players[0]
    console.log(`${getActivePlayer().name}'s turn.`);
  }

  const playRound = (index) => {
    if (gameboard.getBoard()[index] !== " ") {
      console.log("That square is already taken!");
      return 
    }

    gameboard.placeMark(index, getActivePlayer().mark)

    gameboard.printBoard()

    // Check for winner or tie
    const board = gameboard.getBoard()
    const mark = getActivePlayer().mark

    const winConditions = [
      (
       board[0] === mark &&
       board[1] === mark &&
       board[2] === mark 
      ),
      (
       board[3] === mark &&
       board[4] === mark &&
       board[5] === mark 
      ),
      (
       board[6] === mark &&
       board[7] === mark &&
       board[8] === mark 
      ),
      (
       board[0] === mark &&
       board[3] === mark &&
       board[6] === mark 
      ),
      (
       board[1] === mark &&
       board[4] === mark &&
       board[7] === mark 
      ),
      (
       board[2] === mark &&
       board[5] === mark &&
       board[8] === mark 
      ),
      (
       board[0] === mark &&
       board[4] === mark &&
       board[8] === mark 
      ),
      (
       board[2] === mark &&
       board[4] === mark &&
       board[6] === mark 
      ),
    ]

    if (winConditions.filter(condition => condition).length) {
      console.log(`${getActivePlayer().name} won.`);
      result = getActivePlayer().name
    }

    const availableCells = board.filter(cell => cell === " ")

    if (!availableCells.length) {
      console.log("It's a tie!");
      result = "Tie"
    }

    switchPlayerTurn()
  }

  const restart = () => {
    gameboard.resetBoard()
    result = undefined
    activePlayer = players[0]
  }

  gameboard.printBoard()
  console.log(`${getActivePlayer().name}'s turn.`);

  return { playRound, getActivePlayer, getResult, restart }
}

function DisplayController(playerOne, playerTwo) {
  const form = document.querySelector("form")
  form.style.display = "none"
  
  let game = GameController(playerOne, playerTwo)

  const boardDiv = document.createElement("div")
  boardDiv.classList.add("board")
  document.body.appendChild(boardDiv)

  const playerTurnDiv = document.createElement("div")
  playerTurnDiv.classList.add("player-turn")
  document.body.appendChild(playerTurnDiv)

  function restartGame() {
    restartButton.style.display = "none";
    game.restart()
    displayUpdate()
  }

  const restartButton = document.createElement("button")
  restartButton.classList.add("restart")
  restartButton.textContent = "RESTART"
  restartButton.addEventListener("click", restartGame)

  const displayUpdate = () => {
    boardDiv.textContent = ""
    const board = gameboard.getBoard()

    board.forEach((cell, index) => {
      const cellButton = document.createElement("button")
      cellButton.classList.add("cell")
      cellButton.textContent = cell 
      cellButton.dataset.index = index
      boardDiv.appendChild(cellButton)
      boardDiv.addEventListener("click", displayUpdate)
    })

    if (game.getResult() === "Tie") {
      console.log("It's a tie");
      playerTurnDiv.textContent = "It's a tie!"
      restartButton.style.display = "block"
      document.body.append(restartButton)
      return
    }

    if (game.getResult()) {
      console.log(`${game.getResult()} won!`);
      playerTurnDiv.textContent = `${game.getResult()} won!`
      restartButton.style.display = "block"
      document.body.append(restartButton)
      return
    }

    playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn`
  }

    
  function clickHandler(e)   {
    if (game.getResult()) return

    const selectedIndex = e.target.dataset.index

    if (!selectedIndex) return

    game.playRound(selectedIndex)
    displayUpdate()
  }

  boardDiv.addEventListener("click", clickHandler)
  
  displayUpdate()

}

function startClickHandler(e) {
  e.preventDefault()
  const playerOne = document.querySelector("#player_one_name").value
  const playerTwo = document.querySelector("#player_two_name").value

  if (!playerOne || !playerTwo) return

  DisplayController(playerOne, playerTwo)
}

const startButton = document.querySelector("#start")
startButton.addEventListener("click", startClickHandler)