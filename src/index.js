import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    const className = 'square' + (props.highlight ? ' highlight' : '');
    return (
        <button
            className={className}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        const winLine = this.props.winLine;
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlight={winLine && winLine.includes(i)}
            />
        );
    }

    render() {
        const boardSize = 3;
        let squares = [];
            for (let i=0; i<boardSize; i++) {
                let row = [];
                for (let j=0; j<boardSize; j++) {
                    row.push(this.renderSquare(i*boardSize + j));
                }
                squares.push(<div key={i} className="board-row">{row}</div>);
            }

        return (
            <div>{squares}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            isAscending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                latestSquare: '(' + Math.floor(i/3) + ', ' + i%3 + ')',
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleSortToggle() {
        this.setState({
            isAscending: !this.state.isAscending,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' @ ' + history[move].latestSquare:
                'Go to game start';

            return (
                <li key={move}>
                    <button
                        className={move === this.state.stepNumber ? 'move-list-item-selected' : ''}
                        onClick={() => this.jumpTo(move)}>{desc}
                    </button>
                </li>
            );
        });

        const isAscending = this.state.isAscending;
        if (!isAscending) {
            moves.reverse();
        }

        let status;
        if (winner.winner != null) {
            status = "Winner: " + winner.winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
        }
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winLine={winner.line}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>

                    <button onClick={() => this.handleSortToggle()}>
                        {isAscending ? 'descending' : 'ascending'}
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: lines[i],
            }
        }
    }

    return {
        winner: null,
        line: null,
    };

}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

