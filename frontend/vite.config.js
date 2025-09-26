import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: { port: 3000, host: true },
	preview: { port: 4173, host: true },
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		sourcemap: false
	},
	esbuild: {
		jsx: 'automatic',
		loader: 'jsx',
		include: /src\/.*\.(js|jsx)$/,
		exclude: []
	}
});


