const GRID_SIZE = 10;

class Grid {

	constructor() {
		this.pieces = [];
	}

	// Adds a random piece to the grid
	addPiece() {
		let index = irandom(PIECES.length);
		// TODO: confirm that this piece will fit on the board,
		// else try next index
		const piece = new Piece(PIECES[index]);
		this.pieces.push(piece);
		piece.grid = this;
		this.element.append(piece.element);
		// Check whether this completes any lines
		this.check();
	}

	// Move the pieces on the board in a direction
	move(x = 0, y = 0) {
		top: for (;;) {
			// Loop through each piece
			for (let piece of this.pieces) {
				if (piece.move(x, y)) {
					continue top;
				}
			}
			// Nothing happened :(
			break;
		}
		// Check for lines
		this.check();
		// Add new piece
		this.addPiece();
	}

	// Check whether any tile exists at (x, y)
	tileAt(x, y, skip = null) {
		for (let piece of this.pieces) {
			if (piece === skip) {
				continue;
			}
			if (piece.tileAt(x, y)) {
				return true;
			}
		}
		return false;
	}

	// Check for completed lines
	check() {
		// Hor
		top: for (let y = 0; y < GRID_SIZE; ++ y) {
			for (let x = 0; x < GRID_SIZE; ++ x) {
				if (!this.tileAt(x, y)) {
					continue top;
				}
			}
			// Clear line
			this.clearY(y);
		}
		// Vert
		top: for (let x = 0; x < GRID_SIZE; ++ x) {
			for (let y = 0; y < GRID_SIZE; ++ y) {
				if (!this.tileAt(x, y)) {
					continue top;
				}
			}
			// Clear line
			this.clearX(x);
		}
	}

	clearX(x) {
		let res = [];
		for (let piece of this.pieces) {
			piece.element.remove();
			res = res.concat(piece.clearX(x));
		}
		this.pieces = res;
		for (let piece of this.pieces) {
			piece.grid = this;
			this.element.append(piece.element);
		}
	}

	clearY(y) {
		let res = [];
		for (let piece of this.pieces) {
			piece.element.remove();
			res = res.concat(piece.clearY(y));
		}
		this.pieces = res;
		for (let piece of this.pieces) {
			piece.grid = this;
			this.element.append(piece.element);
		}
	}

	createElement() {
		return $new('.grid')
			.init(el => {
				// Create hints
				for (let x = 0; x < GRID_SIZE; ++ x) {
					for (let y = 0; y < GRID_SIZE; ++ y) {
						el.append($new('.empty')
							.style({
								left: `${TILE_SIZE * x}em`,
								top: `${TILE_SIZE * y}em`
							})
						);
					}
				}
			})
			.element();
	}

	get element() {
		if (!this._element) {
			this._element = this.createElement();
		}
		return this._element;
	}
}

const PIECES = [
	// I
	[
		[0, 0],
		[1, 0],
		[2, 0],
		[3, 0]
	],
	[
		[0, 0],
		[0, 1],
		[0, 2],
		[0, 3]
	],
	// O
	[
		[0, 0],
		[0, 1],
		[1, 0],
		[1, 1]
	],
	// T
	[
		[1, 0],
		[0, 1],
		[1, 1],
		[2, 1]
	],
	[
		[1, 1],
		[0, 0],
		[1, 0],
		[2, 0]
	],
	[
		[0, 0],
		[0, 1],
		[0, 2],
		[1, 1]
	],
	[
		[1, 0],
		[1, 1],
		[1, 2],
		[0, 1]
	],
	// S
	[
		[0, 1],
		[1, 1],
		[1, 0],
		[2, 0]
	],
	[
		[0, 0],
		[0, 1],
		[1, 1],
		[1, 2]
	],
	// Z
	[
		[0, 0],
		[1, 0],
		[1, 1],
		[2, 1]
	],
	[
		[1, 0],
		[1, 1],
		[0, 1],
		[0, 2]
	],
];

function irandom(n) {
	return Math.floor(Math.random() * n);
}

function choose(...args) {
	return args[irandom(args.length)];
}