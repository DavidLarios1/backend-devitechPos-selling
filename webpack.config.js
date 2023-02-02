"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const path_1 = __importDefault(require("path"));
const envs = {
    PORT: parseInt('5432', 10),
    HOST: 'localhost',
    DATABASE: 'lazoexpresscore',
    PASS: '$2y$12$UWpxiZi3UaF7ZyKeySCpB.5Z5FfRtAAkgYuQz.m4qnLUFR7CmTOu',
    USER: 'pilotico',
    LAST_COMPILED: new Date().toLocaleString(),
    SERVER_PORT: 8015,
};
const config = {
    entry: path_1.default.join(__dirname, 'src/index.ts'),
    output: {
        path: path_1.default.join(__dirname, 'build'),
        filename: 'pos-selling.js',
    },
    mode: 'production',
    target: 'node',
    externals: [(0, webpack_node_externals_1.default)()],
    resolve: {
        extensions: ['.ts'],
    },
    plugins: [
        new webpack_1.EnvironmentPlugin(envs),
        new copy_webpack_plugin_1.default({
            patterns: [{ from: 'package.json', to: '.' }],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }],
            },
        ],
    },
};
exports.default = config;
