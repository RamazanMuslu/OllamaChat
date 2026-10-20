const esbuild = require("esbuild");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

const fs = require('fs');
const path = require('path');

async function main() {
	if (!fs.existsSync('dist')) {
		fs.mkdirSync('dist', { recursive: true });
	}

	const extCtx = await esbuild.context({
		entryPoints: ['src/extension.ts'],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outfile: 'dist/extension.js',
		external: ['vscode'],
		logLevel: 'silent',
		plugins: [esbuildProblemMatcherPlugin],
	});

	const webviewCtx = await esbuild.context({
		entryPoints: ['src/webview/main.ts'],
		bundle: true,
		format: 'iife',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'browser',
		outfile: 'dist/webview.js',
		logLevel: 'silent',
		plugins: [esbuildProblemMatcherPlugin],
	});

	const copyAssets = () => {
		const cssSrc = path.join(__dirname, 'src/webview/style.css');
		const cssDest = path.join(__dirname, 'dist/webview.css');
		if (fs.existsSync(cssSrc)) {
			fs.copyFileSync(cssSrc, cssDest);
		}
	};

	copyAssets();

	if (watch) {
		await extCtx.watch();
		await webviewCtx.watch();
		fs.watch(path.join(__dirname, 'src/webview/style.css'), () => {
			copyAssets();
			console.log('CSS updated');
		});
	} else {
		await extCtx.rebuild();
		await webviewCtx.rebuild();
		await extCtx.dispose();
		await webviewCtx.dispose();
	}
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
