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

  return { getBoard, printBoard, placeMark }
})()


function Cell(){
  let value = " ";

  const getValue = () => value

  const setValue = (newValue) => value = newValue

  return { getValue, setValue }
}

function GameController(playerOne, playerTwo) {
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

    const winConditions = [
      (
       board[0] === getActivePlayer().mark &&
       board[1] === getActivePlayer().mark &&
       board[2] === getActivePlayer().mark 
      ),
      (
       board[3] === getActivePlayer().mark &&
       board[4] === getActivePlayer().mark &&
       board[5] === getActivePlayer().mark 
      ),
      (
       board[6] === getActivePlayer().mark &&
       board[7] === getActivePlayer().mark &&
       board[8] === getActivePlayer().mark 
      ),
      (
       board[0] === getActivePlayer().mark &&
       board[3] === getActivePlayer().mark &&
       board[6] === getActivePlayer().mark 
      ),
      (
       board[1] === getActivePlayer().mark &&
       board[4] === getActivePlayer().mark &&
       board[7] === getActivePlayer().mark 
      ),
      (
       board[2] === getActivePlayer().mark &&
       board[5] === getActivePlayer().mark &&
       board[8] === getActivePlayer().mark 
      ),
      (
       board[0] === getActivePlayer().mark &&
       board[4] === getActivePlayer().mark &&
       board[8] === getActivePlayer().mark 
      ),
      (
       board[2] === getActivePlayer().mark &&
       board[4] === getActivePlayer().mark &&
       board[6] === getActivePlayer().mark 
      ),
    ]

    if (winConditions.filter(condition => condition).length) {
      console.log(`${getActivePlayer().name} won.`);
      return getActivePlayer().name
    }

    const availableCells = board.filter(cell => cell === " ")

    if (!availableCells.length) {
      console.log("It's a tie!");
      return "Tie"
    }

    switchPlayerTurn()
  }

  gameboard.printBoard()
  console.log(`${getActivePlayer().name}'s turn.`);

  return { playRound, getActivePlayer }
}

function DisplayController() {
  const game = GameController("Alice", "Bob")
  const boardDiv = document.querySelector(".board")
  const playerTurnDiv = document.querySelector(".player-turn")

  const displayUpdate = (result) => {
    boardDiv.textContent = ""
    const board = gameboard.getBoard()

    board.forEach((cell, index) => {
      const cellButton = document.createElement("button")
      cellButton.classList.add("cell")
      cellButton.textContent = cell 
      cellButton.dataset.index = index
      boardDiv.appendChild(cellButton)
    })

    if (result) {

      if (result === "Tie") {
        playerTurnDiv.textContent = `It's a tie!`
        return
      }

      playerTurnDiv.textContent = `${game.getActivePlayer().name} won!`
      return
    }

    playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn`
    
  }

  function clickHandler(e)   {
    const selectedIndex = e.target.dataset.index

    if (!selectedIndex) return

    const result = game.playRound(selectedIndex)
    displayUpdate(result)
  }

  boardDiv.addEventListener("click", clickHandler)

  displayUpdate()
}

DisplayController()