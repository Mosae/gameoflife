import React, { Component } from 'react';
import './App.css';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			size: [90, 20],
		};
		this.handleColumnChange = this.handleColumnChange.bind(this);
		this.handleRowChange = this.handleRowChange.bind(this);
		this.startGame = this.startGame.bind(this);
		this.stopGame = this.stopGame.bind(this);
		this.renderBoard = this.renderBoard.bind(this);
	}
	handleColumnChange(event) {}
	handleRowChange(event) {}
	startGame() {}
	stopGame() {}
	runGame() {}
	renderBoard() {}

	render() {
		return (
			<div className="worldContainer">
				<div className="headerContainer">
					<div className="headerInnerContaner">
						<label className="label">
							Rows:
							<input
								className="input"
								type="text"
								value={this.state.size[1]}
								onChange={this.handleRowChange}
							/>
						</label>
					</div>
				</div>
			</div>
		);
	}
}
