// Create grid
document.on('DOMContentLoaded', () => {
	GRID = new Grid();
	document.body.appendChild(GRID.element);
	GRID.addPiece();

	// Keyboard input
	document.on('keyup', e => {
		switch (e.which) {
			// Left
			case 37:
				GRID.move(-1, 0);
				break;
			// Right
			case 39:
				GRID.move(1, 0);
				break;
			// Up
			case 38:
				GRID.move(0, -1);
				break;
			// Down
			case 40:
				GRID.move(0, 1);
				break;
		}
	});

	const resize = () => {
		const size =
			Math.min(window.innerWidth, window.innerHeight)
			/ (GRID_SIZE + 0.1)
			/ 10;
		GRID.element.style.fontSize = `${size}px`;
	};

	window.on('resize', resize);
	resize();
});

function irandom(n) {
	return Math.floor(Math.random() * n);
}

function choose(...args) {
	return args[irandom(args.length)];
}