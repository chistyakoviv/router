const path = require('path');

module.exports = {
    entry: './src/Router.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    output: {
        filename: 'router.js',
        path: path.resolve(__dirname, '../dist'),
    }
};
