import React, { useRef, useEffect, useState } from 'react';
// import './App.css';
import 'sriracha-ui/css/main.css';
import {
	Wrapper,
	AppWrapper,
	Flex,
	Box,
	Card,
	Input,
	Button,
	theme,
} from 'sriracha-ui';

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
		let y = Math.floor((either.clientY - either.currentTarget.offsetTop) / -35);

		//toggle on dead and alive
		console.log('x and y', x, y, square);
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
		<AppWrapper bg={theme.colors.green3}>
			<Wrapper>
				<Flex as="header" drape h="100vh">
					<h1>Game of Life!</h1>
					<br />
					<Flex col aiCenter jcAround>
						<label>
							<strong>These are the rules</strong>
							<Box h="2rem" />
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
								Any live cell with more than three live neighbours dies, as if
								by overpopulation.{' '}
							</li>
							<li>
								{' '}
								Any dead cell with exactly three live neighbours becomes a live
								cell, as if by reproduction.
							</li>
						</label>
						<Card w="30rem" radius="0.3rem" shade invert>
							<Flex
								as="label"
								m="2rem 0"
								h="3rem"
								visible
								aiCenter
								stretch
								jcBetween>
								Rows:
								<Input name={'rows'} value={rows} onChange={changeBoard} />
							</Flex>
							<Flex
								as="label"
								m="2rem 0"
								h="3rem"
								visible
								aiCenter
								stretch
								jcBetween>
								Columns:
								<Input name={'col'} value={columns} onChange={changeBoard} />
							</Flex>
							<div>
								<label>Game Speed:</label>
								<Box h="2rem" />
								<select value={gameSpeed} onChange={speed}>
									<option value={1000}>Slow</option>
									<option value={400}>Normal</option>
									<option value={20}>Fast</option>
								</select>
							</div>
						</Card>
						<Box h="2rem" />
						Generation: {generation}
						<Box h="2rem" />
						<Flex drape>
							<Button sink blue col rounded onClick={randomizeBoard}>
								<Box sqr="3rem" bg={theme.colors.red5} star /> Randomize Board
							</Button>
							<Button green sink rounded onClick={startGame}>
								<Box sqr="3rem" bg={theme.colors.red5} chevronRight />
								Start
							</Button>
							<Button red sink rounded onClick={stopGame}>
								Stop
							</Button>
							<Button amber rounded sink onClick={clearBoard}>
								Reset
							</Button>
						</Flex>
						<canvas
							onClick={click}
							ref={canvas}
							width={columns * 10 + 'px'}
							height={rows * 10 + 'px'}
						/>
					</Flex>
				</Flex>
			</Wrapper>
		</AppWrapper>
	);
}

export default App;
