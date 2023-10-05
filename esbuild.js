const path = require('path');
const { build } = require('esbuild');
const { esbuildDecorators } = require('@anatine/esbuild-decorators');

build({
	platform: 'node',
	target: 'node14',
	bundle: true,
	plugins: [esbuildDecorators()],
	tsconfig: path.join(__dirname, 'tsconfig.json'),
	entryPoints: [path.join(__dirname, 'src/index.ts')],
	outfile: path.join(__dirname, 'dist/index.js'),
});
