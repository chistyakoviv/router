const path = require('path');

module.exports = {
    entry: './examples/app.js',
    mode: 'development',
    devServer: {
        static: {
          directory: path.join(__dirname, '../examples'),
        },
        compress: true,
        port: 9000,
    },
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
        filename: 'app.js',
        path: path.resolve(__dirname, 'js'),
        publicPath: '/js/'
    }
};
