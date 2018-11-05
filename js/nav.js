class Nav {

	constructor() {
		this._score = 0;
		this._best = +(localStorage.getItem('regretris-best-score') || 0);
	}

	set score(n) {
		this._score = n;
		this.element.$child.score.attr('data-number', n);
		// Update best?
		if (n > this.best) {
			this.best = n;
		}
	}
	get score() {
		return this._score;
	}

	set best(n) {
		this._best = n;
		localStorage.setItem('regretris-best-score', n);
		this.element.$child.best.attr('data-number', n);
	}
	get best() {
		return this._best;
	}

	createElement() {
		return $new('nav')
			.append(
				$new('header')
					.attr('data-text', 'Regretris'),
				$new('.score.number')
					.attr('data-label', 'score')
					.name('score')
					.attr('data-number', this.score),
				$new('.best.number')
					.attr('data-label', 'best')
					.name('best')
					.attr('data-number', this.best)
			)
			.element();
	}

	get element() {
		if (!this._element) {
			this._element = this.createElement();
		}
		return this._element;
	}
}