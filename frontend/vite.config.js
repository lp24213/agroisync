import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		host: true,
		historyApiFallback: true
	},
	preview: {
		port: 4173,
		host: true,
		historyApiFallback: true
	},
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					router: ['react-router-dom'],
					ui: ['framer-motion', 'lucide-react']
				}
			}
		}
	},
	esbuild: {
		jsx: 'automatic',
		loader: 'jsx',
		include: /src\/.*\.(js|jsx)$/,
		exclude: []
	}
});


