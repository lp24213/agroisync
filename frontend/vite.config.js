import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

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
		sourcemap: process.env.NODE_ENV === 'development',
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
			},
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					router: ['react-router-dom'],
					ui: ['framer-motion', 'lucide-react'],
					i18n: ['i18next', 'react-i18next'],
					forms: ['react-hook-form', '@hookform/resolvers'],
					crypto: ['web3', 'ethers']
				}
			}
		},
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: process.env.NODE_ENV === 'production',
				drop_debugger: true
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


