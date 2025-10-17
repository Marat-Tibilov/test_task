import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { fileURLToPath } from "url";
import { dirname } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import type { Configuration as WebpackConfiguration } from "webpack";
import type { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
    mode: "development",

    entry: path.resolve(__dirname, "src", "index.tsx"),

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.[contenthash].js",
        publicPath: "/",
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.module\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[name]__[local]--[hash:base64:5]",
                            },
                            importLoaders: 2,
                        },
                    },
                    "postcss-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.s?css$/,
                exclude: /\.module\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: "asset/resource",
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "index.html"),
        }),
        new MiniCssExtractPlugin({
            filename: "styles.[contenthash].css",
        }),
    ],

    devtool: "source-map",

    devServer: {
        static: {
            directory: path.resolve(__dirname, "public"),
        },
        open: true,
        hot: true,
        port: 3000,
        historyApiFallback: true,
    },
};

export default config;
