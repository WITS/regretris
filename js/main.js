// Detect touch devices
const IS_TOUCH_DEVICE = !!(('ontouchstart' in window) ||
	window.DocumentTouch && document instanceof DocumentTouch);

// Create grid
document.on('DOMContentLoaded', () => {
	NAV = new Nav();
	document.body.appendChild(NAV.element);
	GRID = new Grid();
	document.body.appendChild(GRID.element);
	// Attempt to restore previous session
	if (!GRID.restore()) {
		// If that fails, start a new session
		GRID.addPiece();
		GRID.hint();
	}

	// Keyboard input
	document.on('keyup', e => {
		switch (e.which) {
			// Left
			case 37:
			case 65:
				GRID.move(-1, 0);
				break;
			// Right
			case 39:
			case 68:
				GRID.move(1, 0);
				break;
			// Up
			case 38:
			case 87:
				GRID.move(0, -1);
				break;
			// Down
			case 40:
			case 83:
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
		// If the game is over
		if (GRID.hasEnded === true) {
			// Stop here
			return;
		}
		// Otherwise, listen for swipes
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
				window.innerWidth / (GRID_W + 0.1) / TILE_SIZE,
				window.innerHeight / (NAV_H + GRID_H + 0.1) / TILE_SIZE
			);
		document.body.style.fontSize = `${size}px`;
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

/// Service Worker
// If this browser supports service workers
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js', {
		scope: location.pathname || '/'
	}).then(function(reg) {
		// Registration worked
		console.log('Registration succeeded. Scope is ', reg.scope);
		// // Attempt to update
		// reg.update();
	}).catch(function(error) {
		// Registration failed
		console.log('Registration failed with ' + error);
	});
}