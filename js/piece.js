const TILE_SIZE = 10;

class Piece {

	constructor(tiles, x = 0, y = 0, color = null, isFixed = false) {
		// Set x & y
		this._x = x;
		this._y = y;
		this._color = color || choose(
			'#C62828',
			'#AD1457',
			'#4527A0',
			'#2E7D32',
			'#00695C',
			'#283593',
			'#00695C',
			'#FF6F00',
			'#4E342E',
			'#37474F'
		);
		this.isFixed = isFixed || false;
		// Create tile instances
		this.tiles = tiles.map(t => new Tile(this, t[0], t[1]));
		// Determine edges
		for (let tile of this.tiles) {
			if (tile.top === null) {
				const other = this.relTileAt(tile.relX, tile.relY - 1);
				if (other) {
					tile.top = other;
					other.bottom = tile;
				}
			}
			if (tile.bottom === null) {
				const other = this.relTileAt(tile.relX, tile.relY + 1);
				if (other) {
					tile.bottom = other;
					other.top = tile;
				}
			}
			if (tile.left === null) {
				const other = this.relTileAt(tile.relX - 1, tile.relY);
				if (other) {
					tile.left = other;
					other.right = tile;
				}
			}
			if (tile.right === null) {
				const other = this.relTileAt(tile.relX + 1, tile.relY);
				if (other) {
					tile.right = other;
					other.left = tile;
				}
			}
		}
	}

	set x(n) {
		this._x = n;
		this.element.style.left = `${TILE_SIZE * n}em`;
	}

	get x() {
		return this._x;
	}

	set y(n) {
		this._y = n;
		this.element.style.top = `${TILE_SIZE * n}em`;
	}

	get y() {
		return this._y;
	}

	// The farthest left index that this piece occupies
	get left() {
		return this.tiles.reduce((x, t) => Math.min(t.x, x), GRID_W);
	}

	// The farthest right index that this piece occupies
	get right() {
		return this.tiles.reduce((x, t) => Math.max(t.x, x), -1);
	}

	// The farthest up index that this piece occupies
	get top() {
		return this.tiles.reduce((y, t) => Math.min(t.y, y), GRID_H);
	}

	// The farthest down index that this piece occupies
	get bottom() {
		return this.tiles.reduce((y, t) => Math.min(t.y, y), -1);
	}

	set color(c) {
		this._color = c;
		this.element.style.background = c;
	}

	get color() {
		return this._color;
	}

	relTileAt(x, y) {
		for (let tile of this.tiles) {
			if (tile.relX === x && tile.relY === y) {
				return tile;
			}
		}
		return null;
	}

	tileAt(x, y) {
		for (let tile of this.tiles) {
			if (tile.x === x && tile.y === y) {
				return tile;
			}
		}
		return null;
	}

	// Attempt to move in a direction, return true if successful
	move(x = 0, y = 0) {
		// If this piece is fixed
		if (this.isFixed) {
			return false;
		}

		const px = this.x;
		const py = this.y;
		this.x += x;
		this.y += y;

		// Check whether each tile is still valid
		for (let tile of this.tiles) {
			if (tile.x < 0 || tile.y < 0 ||
				tile.x >= GRID_W || tile.y >= GRID_H ||
				this.grid.tileAt(tile.x, tile.y, this)) {
				// Failed to move
				this.x = px;
				this.y = py;
				return false;
			}
		}

		// Success!
		return true;
	}

	// Clears line
	clearX(x) {
		const tiles = [];
		for (let tile of this.tiles) {
			if (tile.x === x) {
				// Remove links
				if (tile.left) {
					tile.left.right = null;
				}
				if (tile.right) {
					tile.right.left = null;
				}
			} else {
				tiles.push(tile);
			}
		}

		if (tiles.length === this.tiles.length) {
			return [this];
		}

		const res = [];
		const helper = (tile, piece = []) => {
			const index = tiles.indexOf(tile);
			if (index !== -1) {
				tiles.splice(index, 1);
			}
			piece.push(tile);
			if (tile.left && tiles.includes(tile.left)) {
				helper(tile.left, piece);
			}
			if (tile.right && tiles.includes(tile.right)) {
				helper(tile.right, piece);
			}
			if (tile.top && tiles.includes(tile.top)) {
				helper(tile.top, piece);
			}
			if (tile.bottom && tiles.includes(tile.bottom)) {
				helper(tile.bottom, piece);
			}
			return piece;
		}
		while (tiles.length !== 0) {
			res.push(helper(tiles[0]));
		}
		return res.map(p => new Piece(
			p.map(t => [t.relX, t.relY]),
			this.x,
			this.y,
			this.color,
			this.isFixed
		));
	}

	clearY(y) {
		const tiles = [];
		for (let tile of this.tiles) {
			if (tile.y === y) {
				// Remove links
				if (tile.top) {
					tile.top.bottom = null;
				}
				if (tile.bottom) {
					tile.bottom.top = null;
				}
			} else {
				tiles.push(tile);
			}
		}

		if (tiles.length === this.tiles.length) {
			return [this];
		}

		const res = [];
		const helper = (tile, piece = []) => {
			const index = tiles.indexOf(tile);
			if (index !== -1) {
				tiles.splice(index, 1);
			}
			piece.push(tile);
			if (tile.left && tiles.includes(tile.left)) {
				helper(tile.left, piece);
			}
			if (tile.right && tiles.includes(tile.right)) {
				helper(tile.right, piece);
			}
			if (tile.top && tiles.includes(tile.top)) {
				helper(tile.top, piece);
			}
			if (tile.bottom && tiles.includes(tile.bottom)) {
				helper(tile.bottom, piece);
			}
			return piece;
		}
		while (tiles.length !== 0) {
			res.push(helper(tiles[0]));
		}
		return res.map(p => new Piece(
			p.map(t => [t.relX, t.relY]),
			this.x,
			this.y,
			this.color,
			this.isFixed
		));
	}

	// Whether this piece overlaps a given x coordinate
	overlapsX(x) {
		return this.tiles.some(t => t.x === x);
	}

	// Whether this piece overlaps a given y coordinate
	overlapsY(y) {
		return this.tiles.some(t => t.y === y);
	}

	createElement() {
		return $new('.piece')
			.style({
				left: `${TILE_SIZE * this.x}em`,
				top: `${TILE_SIZE * this.y}em`,
				background: this._color
			})
			.init(el => {
				if (this.isFixed) {
					el.addClass('fixed');
				}
				for (let tile of this.tiles) {
					el.append(tile.element);
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

	get state() {
		return {
			tiles: this.tiles.map(t => [t.relX, t.relY]),
			x: this.x,
			y: this.y,
			color: this.color,
			isFixed: this.isFixed
		}
	}
}

class Tile {

	constructor(parent, x, y) {
		this.parent = parent;
		this.relX = x;
		this.relY = y;
		// Edges
		this.top = null;
		this.bottom = null;
		this.left = null;
		this.right = null;
	}

	get x() {
		return this.relX + this.parent.x;
	}

	get y() {
		return this.relY + this.parent.y;
	}

	createElement() {
		return $new('.tile')
			.style({
				left: `${TILE_SIZE * this.relX}em`,
				top: `${TILE_SIZE * this.relY}em`
			})
			.init(el => {
				// Edges
				if (this.top) {
					el.addClass('border-top');
					el.append($new('.top'));
				}
				if (this.bottom) {
					el.addClass('border-bottom');
					el.append($new('.bottom'));
				}
				if (this.left) {
					el.addClass('border-left');
					el.append($new('.left'));
				}
				if (this.right) {
					el.addClass('border-right');
					el.append($new('.right'));
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