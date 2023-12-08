const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './index.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Cluml',
            filename: 'index.html',
            template: 'src/html/index.html',
            inject: 'head',
            scriptLoading: 'blocking'
        }),
        new HtmlWebpackPlugin({
            title: 'Cluml SingleSave demo',
            filename: 'single.html',
            template: 'src/html/single.html',
            inject: 'head',
            scriptLoading: 'blocking'
        }),
        new HtmlWebpackPlugin({
            title: 'Cluml Inline demo',
            filename: 'inline.html',
            template: 'src/html/inline.html',
            inject: 'head',
            scriptLoading: 'blocking'
        }),
        new HtmlWebpackPlugin({
            title: 'Cluml full screen demo',
            filename: 'full.html',
            template: 'src/html/full.html',
            inject: 'head',
            scriptLoading: 'blocking'
        }),
        new HtmlWebpackPlugin({
            title: 'Cluml DOM install test page',
            filename: 'dom-install.html',
            template: 'src/html/dom-install.html',
            inject: 'head',
            scriptLoading: 'blocking'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/img/*.png',
                    to: 'cluml/img/[name][ext]'
                },
                {
                    from: 'src/img/*.ico',
                    to: 'cluml/img/[name][ext]'
                },
                {
                    from: 'src/img/*.svg',
                    to: 'cluml/img/[name][ext]'
                },
                {
                    from: 'src/help',
                    to: 'cluml/help'
                }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader:"file-loader",
                options: {
                    name:'[name].[ext]',
                    outputPath:'img/'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'resolve-url-loader',
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
