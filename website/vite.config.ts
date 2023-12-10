import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }: { mode: string }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return defineConfig({
		plugins: [sveltekit()],
		server: {
			host: process.env.VITE_HOST ?? '0.0.0.0',
			port: parseInt(process.env.VITE_PORT ?? '3000')
		}
	});
};
