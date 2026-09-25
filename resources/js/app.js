import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/module.esm.js';
import { gameData } from './game/index.js';

window.Alpine = Alpine;

document.addEventListener('alpine:init', () => {
    Alpine.data('gameData', gameData);
});

Alpine.start();
