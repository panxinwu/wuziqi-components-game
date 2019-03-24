import React from 'react'
import Board from 'wuziqi-components-board'

const DIM = 10

class Game extends React.Component {
  constructor(props) {
    super(props)
    let doubleSquares = []
    for (let i = 0; i < DIM; i++) {
      doubleSquares.push(Array(DIM).fill(null))
    }
    this.state = {
      history: [{
        squares: doubleSquares,
        lastStep_horizontal: null,
        lastStep_vertical: null
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  checkWinnerOneDirection = (squares, startX, startY, deltaX, deltaY) => {
    let player = squares[startX][startY]
    let xPos = startX
    let Ypos = startY
    let counter = 1
    while (xPos >= 0 && xPos < DIM && Ypos >= 0 && Ypos < DIM) {
      xPos += deltaX
      Ypos += deltaY
      if (squares[xPos][Ypos] !== player || counter === 5) {
        break
      }
      counter += 1
    }
    return counter === 5
  }

  calculateWinner() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const h = current.lastStep_horizontal
    if (h == null) return null
    const s = current.squares
    const v = current.lastStep_vertical
    const directions = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 0], [-1, 1], [-1, -1]]
    for (let i = 0; i < 8; i++) {
      let deltaX = directions[i][0]
      let deltaY = directions[i][1]
      if (this.checkWinnerOneDirection(s, h, v, deltaX, deltaY)) {
        return s[h][v]
      }
    }
    return null
  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = []
    for (let i = 0; i < current.squares.length; i++) {
      let squareRowCopy = current.squares[i].slice()
      squares.push(squareRowCopy)
    }
    if (squares[i][j] || this.calculateWinner()) {
      return
    }
    squares[i][j] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        lastStep_horizontal: i,
        lastStep_vertical: j
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = this.calculateWinner()
    const moves = history.map((step, move) => {
      const h = step.lastStep_horizontal
      const v = step.lastStep_vertical
      const desc = move
        ? 'Go to move #' + move + `(${h}, ${v})`
        : 'Go to game start'
      const buttonClass = this.state.stepNumber === move ? 'button_bold' : 'button_normal'
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={buttonClass}>{desc}</button>
        </li>
      )
    })

    let status
    if (winner) {
      status = 'Winner: ' + winner
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

export default Game
