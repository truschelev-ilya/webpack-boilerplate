const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const glob = require('glob');

const getFileNames = function () {
    let foundFiles = glob.sync(__dirname + '/**/*.html', {
        ignore: [
            '**/node_modules/**',
            '**/dist/**',
            '**/index.html'
        ],
    })

    return foundFiles.map(el => {
        let arr = el.substr(__dirname.length + 1).split('/')
        return {
            template: el.substr(__dirname.length + 1),
            filename: arr[arr.length - 1].replace('.html', '')
        }
    })
}

const multipleHtmlPlugins = getFileNames().map(name => {
    return new HtmlWebpackPlugin({
        template: name.template, // relative path to the HTML files
        filename: name.filename + '.html', // output HTML files
        chunks: [`${name.filename}`], // respective JS files
    })
});

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    plugins: [
        //Loading HTML
        new HtmlWebpackPlugin({
            title: 'test',
            template: path.join(__dirname, 'index.html'),
            chunks: ['main']
        }),
        new ESLintPlugin()
    ].concat(multipleHtmlPlugins),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            //Loading styles
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            //Loading images
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            //Loading fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            //Loading CSV
            {
                test: /\.(csv|tsv)$/i,
                use: ['csv-loader'],
            },
            //Loading XML
            {
                test: /\.xml$/i,
                use: ['xml-loader'],
            },
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
}