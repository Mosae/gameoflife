import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import RestoreIcon from '@material-ui/icons/Restore';
import StickyFooter from './footer';
function App() {
	//instance of - check prev value
	// 	//uses .current to give the latest value
	const canvas = useRef();
	const currentSq = useRef();
	const running = useRef();
	//Set the game state
	const [square, setSquare] = useState([]);
	const [square2, setSquare2] = useState([]);
	const [rows, setRows] = useState(25);
	const [columns, setColumns] = useState(25);
	const [generation, setGeneration] = useState(0);
	const [gameSpeed, setGameSpeed] = useState(0);
	// draw 2d canvas
	const drawBox = (blocks) => {
		const context = canvas.current.getContext('2d');
		//loop through to make canvas
		for (let i = 0; i < rows; i++) {
			for (let h = 0; h < columns; h++) {
				if (blocks[i][h].alive) {
					context.fillStyle = 'white';
				} else {
					context.fillStyle = 'black';
				}
				context.fillRect(i * 10, h * 10, 10, 10);
			}
		}
	};
	useEffect(() => {
		for (let i = 0; i < rows; i++) {
			square.push([]);
			square2.push([]);
			for (let h = 0; h < columns; h++) {
				const deadB = { alive: false };
				square[i].push(deadB);
				square2[i].push({ ...deadB });
			}
		}
		drawBox(square2);
		currentSq.current = '1';
		setSquare(square);
		setSquare2(square2);
	}, [rows, columns]);

	const click = (either) => {
		if (running.current) {
			return;
		}
		//this will draw the block onto the canvas when clicked
		let x = Math.floor((either.clientX - either.currentTarget.offsetLeft) / 10);
		let y = Math.floor((either.clientY - either.currentTarget.offsetTop) / 10);

		//toggle on dead and alive
		square[x][y].alive = !square[x][y].alive;
		drawBox(square);
	};

	const gameOfLife = () => {
		let gameBlock = square;
		let nextBlock = square2;
		//incorporate the rules
		if (currentSq.current === '2') {
			gameBlock = square2;
			nextBlock = square;
		}
		for (let i = 0; i < rows; i++) {
			for (let h = 0; h < columns; h++) {
				let liveBlocks = 0;
				for (let j = i - 1; j < i + 2; j++) {
					for (let k = h - 1; k < h + 2; k++) {
						if (j === i && k === h) {
							continue;
						}
						try {
							//if the square is alive we increase
							if (gameBlock[j][k] && gameBlock[j][k].alive) {
								liveBlocks++;
							}
						} catch (e) {
							console.log(e);
						}
					}
				}
				if (gameBlock[i][h].alive) {
					//if the neighbour has less than 2 or more than 3 = dead
					if (liveBlocks < 2 || liveBlocks > 3) {
						nextBlock[i][h].alive = false;
					} else {
						nextBlock[i][h].alive = true;
					}
				} else {
					if (liveBlocks === 3) {
						nextBlock[i][h].alive = true;
					} else {
						nextBlock[i][h].alive = false;
					}
				}
			}
		}
		drawBox(nextBlock);
		if (currentSq.current === '2') {
			currentSq.current = '1';
		} else {
			currentSq.current = '2';
		}
		//if the game is running, we are gonna animate
		if (running.current) {
			window.setTimeout(() => {
				requestAnimationFrame(gameOfLife);
			}, gameSpeed);
		}
		setGeneration((generation) => {
			return generation + 1;
		});
	};
	const changeBoard = (e) => {
		if (running.current) {
			return;
		}
		if (e.target.name === 'rows') {
			setRows(e.target.value);
		} else {
			setColumns(e.target.value);
		}
	};
	const startGame = () => {
		running.current = true;
		requestAnimationFrame(gameOfLife);
	};
	const stopGame = () => {
		running.current = false;
	};
	const clearBoard = () => {
		running.current = false;
		for (let i = 0; i < rows; i++) {
			for (let h = 0; h < rows; h++) {
				square[i][h].alive = false;
				square2[i][h].alive = false;
			}
		}
		drawBox(square);
		setGeneration(0);
	};
	const randomizeBoard = () => {
		for (let i = 0; i < rows; i++) {
			for (let h = 0; h < rows; h++) {
				if (Math.random() < 0.4) {
					square[i][h].alive = true;
				} else {
					square[i][h].alive = false;
				}
			}
		}
		drawBox(square);
		currentSq.current = '1';
	};
	const speed = (e) => {
		setGameSpeed(e.target.value);
	};

	return (
		<div className="worldContainer">
			<header className="headerContainer">
				<h1>Game of Life!</h1>
				<br />
				<div className="headerInnerContaine">
					<label className="label">
						<strong>These are the rules</strong>
						<br />
						<li>
							{' '}
							Any live cell with fewer than two live neighbours dies, as if by
							underpopulation.{' '}
						</li>
						<li>
							{' '}
							Any live cell with two or three live neighbours lives on to the
							next generation.{' '}
						</li>
						<li>
							{' '}
							Any live cell with more than three live neighbours dies, as if by
							overpopulation.{' '}
						</li>
						<li>
							{' '}
							Any dead cell with exactly three live neighbours becomes a live
							cell, as if by reproduction.
						</li>
					</label>
					<div className="board">
						<label className="boards">
							Rows:
							<input name={'rows'} value={rows} onChange={changeBoard} />
						</label>
						<br />
						<label className="boards">
							Columns:
							<input name={'col'} value={columns} onChange={changeBoard} />
						</label>
					</div>
					<div className={'Row'}>
						<label className="label">Game Speed:</label>
						<select className="speeds" value={gameSpeed} onChange={speed}>
							<option value={1000}>Slow</option>
							<option value={400}>Normal</option>
							<option value={20}>Fast</option>
						</select>
					</div>
					<h3>Generation: {generation}</h3>
					<div className="headerButtons">
						<Button variant="contained" onClick={randomizeBoard}>
							Randomize Board
						</Button>
						<Button
							variant="contained"
							color="primary"
							endIcon={<PlayArrowIcon />}
							className="start"
							onClick={startGame}>
							Start
						</Button>
						<Button
							variant="contained"
							color="secondary"
							className="stop"
							startIcon={<StopIcon />}
							onClick={stopGame}>
							Stop
						</Button>
						<Button
							variant="contained"
							endIcon={<RestoreIcon />}
							className="reset"
							onClick={clearBoard}>
							Reset
						</Button>
					</div>
					<canvas
						onClick={click}
						ref={canvas}
						width={columns * 10 + 'px'}
						height={rows * 10 + 'px'}
					/>
				</div>
			</header>
			<StickyFooter />
		</div>
	);
}

export default App;
