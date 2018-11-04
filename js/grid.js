const GRID_SIZE = 10;

class Grid {

	constructor() {
		this.pieces = [];
	}

	// Adds a random piece to the grid
	addPiece() {
		// Helper
		let wasPlaced = false;
		const helper = (piece, x, y) => {
			if (this.canPlace(piece, x, y)) {
				piece.x = x;
				piece.y = y;
				wasPlaced = true;
				return true;
			}
			return false;
		};
		// Index of first shape to try
		const index = irandom(PIECES.length);
		// Attempt to determine a possible shape and place it
		for (let i = 0; i < PIECES.length; ++ i) {
			// Create a piece using this shape
			const piece = new Piece(PIECES[(index + i) % PIECES.length]);
			// Look for a place to put this
			if (irandom(100) < 50) {
				top: for (let x = 0; x < GRID_SIZE; ++ x) {
					if (irandom(100) < 50) {
						for (let y = 0; y < GRID_SIZE; ++ y) {
							if (helper(piece, x, y)) {
								break top;
							}
						}
					} else {
						for (let y = GRID_SIZE; y --; ) {
							if (helper(piece, x, y)) {
								break top;
							}
						}
					}
				}
			} else {
				top: for (let x = GRID_SIZE; x --; ) {
					if (irandom(100) < 50) {
						for (let y = 0; y < GRID_SIZE; ++ y) {
							if (helper(piece, x, y)) {
								break top;
							}
						}
					} else {
						for (let y = GRID_SIZE; y --; ) {
							if (helper(piece, x, y)) {
								break top;
							}
						}
					}
				}
			}
			// We found somewhere to place this
			if (wasPlaced) {
				this.pieces.push(piece);
				piece.grid = this;
				this.element.append(piece.element);
				// Check whether this completes any lines
				this.check();
				// Success!
				return true;
			}
		}
		// // Game over
		alert('Game over');
		location.reload();
	}

	// Determines whether a piece can be placed at a given location
	canPlace(piece, x, y) {
		for (let tile of piece.tiles) {
			const tx = x + tile.relX;
			const ty = y + tile.relY;
			// Check in bounds
			if (tx < 0 || ty < 0 || tx >= GRID_SIZE || ty >= GRID_SIZE) {
				return false;
			}
			// Check current tiles
			if (this.tileAt(tx, ty, piece)) {
				return false;
			}
		}
		// No issue!
		return true;
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
	// TODO: L/J
];