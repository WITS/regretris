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

	// Touch events
	let touchStartX = 0;
	let touchStartY = 0;
	let touchX = 0;
	let touchY = 0;
	window.on('touchstart', e => {
		if (e.touches.length === 1) {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			e.preventDefault();
		}
	}, {
		passive: false
	});
	window.on('touchmove', e => {
		touchX = e.touches[0].clientX;
		touchY = e.touches[0].clientY;
	});
	window.on('touchend', e => {
		if (e.touches.length === 0) {
			// If the user swiped
			const dist = Math.sqrt(
				Math.pow(touchX - touchStartX, 2) +
				Math.pow(touchY - touchStartY, 2)
			);
			if (dist >= 8) {
				// Detect axis
				if (Math.abs(touchX - touchStartX) >
					Math.abs(touchY - touchStartY)) { // Hor
					if (touchX < touchStartX) { // Left
						GRID.move(-1, 0);
					} else { // Right
						GRID.move(1, 0);
					}
				} else { // Vert
					if (touchY < touchStartY) { // Up
						GRID.move(0, -1);
					} else { // Down
						GRID.move(0, 1);
					}
				}
			}
		}
	});

	const resize = () => {
		const size =
			Math.min(
				window.innerWidth / (GRID_W + 0.1) / 10,
				window.innerHeight / (GRID_H + 0.1) / 10
			);
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

function sleep(n) {
	return new Promise(r => setTimeout(() => r(), n));
}