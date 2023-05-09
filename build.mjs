import * as esbuild from 'esbuild';
import fs from 'node:fs';
import UglifyJS, { minify } from 'uglify-js';
import { ScssModulesPlugin } from 'esbuild-scss-modules-plugin';


let miniUgly = {
    name: 'miniUgly',
    setup(build) {
        build.onEnd(async result => {
            let mainJS = fs.readFileSync('./dist/browser/index.js', 'utf8');
            mainJS = UglifyJS.minify(mainJS, {
                compress: false,
                mangle: true,
            }).code;
            fs.writeFileSync('./dist/browser/index.minified.js', mainJS, 'utf8', (err) => {
                if (err) throw err;
            });
        });
    },
}

await esbuild.build({
    entryPoints: ['./index.ts'],
    tsconfig: './tsconfig.json',
    bundle: true,
    outfile: './dist/browser/index.js',
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    format: 'iife',
    plugins: [ScssModulesPlugin({
        minify: true,
    }), miniUgly],
});

await esbuild.build({
    entryPoints: ['./index.ts'],
    tsconfig: './tsconfig.json',
    bundle: true,
    outfile: './dist/esm/index.js',
    target: ['es2015'],
    format: 'esm',
    sourcemap: true,
    plugins: [ScssModulesPlugin({
        minify: true,
    })],
});