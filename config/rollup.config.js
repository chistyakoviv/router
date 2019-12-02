import path from 'path';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: path.resolve(__dirname, '../src//Router.ts'),
    output: {
        file: path.resolve(__dirname, '../dist/router.js'),
        format: 'cjs'
    },
    plugins: [
        resolve(),
        typescript()
    ]
};
