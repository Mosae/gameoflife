export default class Universe {
	constructor(generation = 0, liveCells = new Map()) {
		this.generation = generation;
		this.liveCells = liveCells;
		this.nextGeneration = new Map();
		this.deadCells = new Map();
	}
	//give us the current generation we are in
	getGeneration() {
		return this.generation;
	}
	//will give us a map of the live cells in each generation
	getLiveCells() {
		return this.liveCells;
	}
	//takes in a position - add cell to Map of live Cells
	addCell(position) {
		return this.liveCells.set(position.x + ' , ' + position.y, {
			x: position.x,
			y: position.y,
		}); //object to know the position of a cell
	}
	//remove cell from map of Live Cells
	removeCell(position) {
		this.liveCells.delete(position);
	}
	//takes in a position and lets us know if a cell is alive or dead
	isCellAlive(position) {
		return this.liveCells.has(position);
	}
	//takes in a position will be used in the behaviour of the cell.
	storeCell(position) {
		if (this.isCellAlive(position.x + ' , ' + position.y)) {
			this.removeCell(position.x + ' , ' + position.y);
		} else {
			this.addCell(position);
		}
		//return new uni to re-render the board on the App.js component
		return new Universe(this.generation, this.liveCells);
	}
	//in each  gen, this will calculate the new live and dead cells and new Universe - part of the rules
	addGeneration() {
		this.liveCells.forEach((item) => {
			this.calculateLiveCellsNeighbors(item);
		});
		this.deadCells.forEach((item) => {
			this.calculateDeadCellsNeighbors(item);
		});

		this.generation++;
		return new Universe(this.generation, this.nextGeneration);
	}
	//takes in a position - calc live cells for next generation - takes into account the neighbors that each live cell has
	calculateLiveCellsNeighbors(position) {
		//we don't know how many live neighbors are there
		var liveNeghbors = 0;
		//check the state of the all the neighbor cells - apply the rules
		for (var i = position.x - 1; i <= position.x + 1; i++) {
			for (var j = position.y - 1; j <= position.y + 1; j++) {
				//make sure that current cell is not counted as a live cell
				if (i === position.x && j === position.y) continue;
				//if the neighbour = alive add to the liveNeighbour else add to dead cell defined in constructor
				if (this.isCellAlive(i + ' , ' + j)) {
					liveNeghbors++;
				} else {
					this.deadCells.set(i + ' , ' + j, { x: i, y: j });
				}
			}
		}
		//if there are 2 or 3 live neighbors = cell lives and goes to next generation
		if (liveNeghbors === 2 || liveNeghbors === 3)
			this.nextGeneration.set(position.x + ' , ' + position.y, {
				x: position.x,
				y: position.y,
			});
	}
	//takes in a position - calc dead cells - stay dead or respawn
	calculateDeadCellsNeighbors(position) {
		var liveNeghbors = 0;
		for (var i = position.x - 1; i <= position.x + 1; i++) {
			for (var j = position.y - 1; j <= position.y + 1; j++) {
				if (i === position.x && j === position.y) continue;
				if (this.isCellAlive(i + ' , ' + j)) {
					liveNeghbors++;
				}
			}
		}
		//rules = if dead cell has 3 neighbors the it respawns
		if (liveNeghbors === 3)
			this.nextGeneration.set(position.x + ' , ' + position.y, {
				x: position.x,
				y: position.y,
			});
	}
}
