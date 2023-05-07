import * as esbuild from 'esbuild';
import fs from 'node:fs';
import UglifyJS from 'uglify-js';
import sassPlugin from 'esbuild-sass-plugin';
import { ScssModulesPlugin } from 'esbuild-scss-modules-plugin';


let miniUgly = {
    name: 'miniUgly',
    setup(build) {
        build.onEnd(async result => {
            let mainJS = fs.readFileSync('./dist/index.js', 'utf8');
            mainJS = UglifyJS.minify(mainJS, {
                compress: false,
                mangle: true,
            }).code;
            fs.writeFileSync('./dist/index.minified.js', mainJS, 'utf8', (err) => {
                if (err) throw err;
            });
        });
    },
}

await esbuild.build({
    entryPoints: ['./index.ts'],
    tsconfig: './tsconfig.json',
    bundle: true,
    outfile: './dist/index.js',
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    format: 'esm',
    external: ['@fortawesome/fontawesome-free'],
    plugins: [ScssModulesPlugin({
        minify: true,
    }), miniUgly],
});