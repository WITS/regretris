/*
 * Generic Service Worker - enables offline access
 * Copyright (c) 2018 Ian Jones
 */

const CACHE_VERSION = 'beta.002';

this.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_VERSION).then(cache => {
			return cache.addAll([
				'https://fonts.googleapis.com/css?family=Comfortaa:400,700',
				'index.html',
				'css/style.css',
				'img/fixed-tile.svg',
				'img/undo.svg',
				'img/new.svg',
				'js/q.js',
				'js/blueprint.js',
				'js/transition.js',
				'js/nav.js',
				'js/grid.js',
				'js/piece.js',
				'js/main.js'
			]);
		})
	);
});

const url_scope = location.origin.toLowerCase();
this.addEventListener('fetch', event => {
	if (event.request.method === 'GET') {
		// Attempt to locate the file in the cache
		event.respondWith(caches.open(CACHE_VERSION).then(cache => {
			let url = event.request.url;
			return cache.match(url).then(res => {
				// If it's found
				if (res) {
					// Check for an updated version
					fetch(event.request).then(res => {
						cache.put(url, res);
					});
					// Return the cached version
					return res.clone();
				} else {
					// Fetch it from the network now
					return fetch(event.request).then(res => {
						// Cache it
						cache.put(url, res.clone());
						// And return it
						return res;
					});
				}
			});
		}));
	}
});