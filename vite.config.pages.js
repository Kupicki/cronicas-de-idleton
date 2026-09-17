import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// ==========================================
// Vite config para build ESTÁTICO (GitHub Pages)
// ==========================================
// Gera um bundle em dist/ a partir do index.html na raiz,
// sem dependência do laravel-vite-plugin nem de PHP.
//
// Uso:  npm run build:pages

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    // Base relativa para funcionar em qualquer subpath do GitHub Pages
    base: './',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: 'index.html',
        },
    },
    // O diretório "public" é copiado automaticamente para o output
    publicDir: 'public',
});
