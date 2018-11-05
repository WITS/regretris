const GRID_W = 8;
const GRID_H = 10;
let NAV_H = 2;

class Grid {

	constructor() {
		this.pieces = [];
		this.moveQueue = [];
		this.canMove = true;
	}

	// Adds a random piece to the grid
	async addPiece() {
		// Helper
		let wasPlaced = false;
		const helper = (piece, x, y) => {
			if (this.canPlace(piece, x, y)) {
				piece.x = x;
				piece.y = y;
				// NAV.score += 5;
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
				top: for (let x = 0; x < GRID_W; ++ x) {
					if (irandom(100) < 50) {
						for (let y = 0; y < GRID_H; ++ y) {
							if (helper(piece, x, y)) {
								break top;
							}
						}
					} else {
						for (let y = GRID_H; y --; ) {
							if (helper(piece, x, y)) {
								break top;
							}
						}
					}
				}
			} else {
				top: for (let x = GRID_W; x --; ) {
					if (irandom(100) < 50) {
						for (let y = 0; y < GRID_H; ++ y) {
							if (helper(piece, x, y)) {
								break top;
							}
						}
					} else {
						for (let y = GRID_H; y --; ) {
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
				// Animate in
				Transition.animate(piece.element, {
					from: {
						opacity: 0,
						transform: 'scale(0.5)'
					},
					to: {
						opacity: 1,
						transform: 'scale(1)'
					}
				}, 250);
				// Wait a bit
				await sleep(250);
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
			if (tx < 0 || ty < 0 || tx >= GRID_W || ty >= GRID_H) {
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
	async move(x = 0, y = 0) {
		// If moving is disabled
		if (!this.canMove) {
			// Queue up move
			this.moveQueue.push([x, y]);
			// Stop here
			return;
		}
		const moved = new Map();
		top: for (;;) {
			// Loop through each piece
			for (let piece of this.pieces) {
				if (piece.move(x, y)) {
					// Keep track of starting snapshot
					if (!moved.has(piece)) {
						piece.x -= x;
						piece.y -= y;
						moved.set(piece, Transition.snapshot(piece.element));
						piece.x += x;
						piece.y += y;
					}
					continue top;
				}
			}
			// Nothing happened :(
			break;
		}
		// If no pieces actually moved
		if (moved.size === 0) {
			// Stop here
			return;
		}
		const duration = 250;
		this.canMove = false;
		// Animations
		for (let [piece, snapshot] of moved.entries()) {
			Transition.from(piece.element, snapshot, duration, {
				aspectRatio: 'none'
			});
		}
		await sleep(duration);
		// Check for lines
		this.check();
		// Add new piece
		await this.addPiece();
		// Renable moving
		this.canMove = true;
		// If there's something in the move queue
		if (this.moveQueue.length !== 0) {
			const [ x, y ] = this.moveQueue.splice(0, 1)[0];
			this.move(x, y);
		}
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
		let count = 0;
		// Hor
		top: for (let y = 0; y < GRID_H; ++ y) {
			for (let x = 0; x < GRID_W; ++ x) {
				if (!this.tileAt(x, y)) {
					continue top;
				}
			}
			// Clear line
			this.clearY(y);
			++ count;
		}
		// // Vert
		// top: for (let x = 0; x < GRID_W; ++ x) {
		// 	for (let y = 0; y < GRID_H; ++ y) {
		// 		if (!this.tileAt(x, y)) {
		// 			continue top;
		// 		}
		// 	}
		// 	// Clear line
		// 	this.clearX(x);
		//		++ count;
		// }

		// Update score
		switch(count) {
			case 0: break;
			case 1: NAV.score += 4; break;
			case 2: NAV.score += 10; break;
			case 3: NAV.score += 30; break;
			case 4: NAV.score += 120; break;
			default: NAV.score += 150; break;
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
		// // Update score
		// NAV.score += 10;
		// Animate out
		GRID.element.append($new('.cleared-line')
			.style({
				top: `${y * TILE_SIZE}em`,
				width: `${GRID_W * TILE_SIZE}em`
			})
			.init(el => {
				Transition.animate(el, {
					from: {
						opacity: 0.87,
						transform: `scale(1)`
					},
					to: {
						opacity: 0,
						transform: `scale(1.12)`
					}
				}, 250).then(() => {
					el.remove();
				});
			})
		);
	}

	createElement() {
		return $new('.grid')
			.init(el => {
				// Create hints
				for (let x = 0; x < GRID_W; ++ x) {
					for (let y = 0; y < GRID_H; ++ y) {
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
	// J
	[
		[0, 0],
		[0, 1],
		[1, 1],
		[2, 1]
	],
	[
		[1, 0],
		[1, 1],
		[1, 2],
		[0, 2]
	],
	[
		[0, 0],
		[1, 0],
		[2, 0],
		[2, 1]
	],
	[
		[0, 0],
		[0, 1],
		[0, 2],
		[1, 0]
	],
	// L
	[
		[0, 1],
		[1, 1],
		[2, 1],
		[2, 0]
	],
	[
		[0, 0],
		[0, 1],
		[0, 2],
		[1, 2]
	],
	[
		[0, 1],
		[0, 0],
		[1, 0],
		[2, 0]
	],
	[
		[0, 0],
		[1, 0],
		[1, 1],
		[1, 2]
	]
];