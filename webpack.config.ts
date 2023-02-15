import { Configuration, EnvironmentPlugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';

const envs = {
  PORT          : parseInt('5432', 10),
  HOST          : 'localhost',
  DATABASE      : 'lazoexpresscore',
  PASS          : '$2y$12$UWpxiZi3UaF7ZyKeySCpB.5Z5FfRtAAkgYuQz.m4qnLUFR7CmTOu',
  USER          : 'pilotico',
  LAST_COMPILED : new Date().toLocaleString(),
  SERVER_PORT   : 8015,
};

const config: Configuration = {
  entry  : path.join(__dirname, 'src/index.ts'),
  output : {
    path     : path.join(__dirname, 'build'),
    filename : 'serviceGateBridge.js',
  },
  mode      : 'production',
  target    : 'node',
  externals : [ nodeExternals() as any ],
  resolve   : {
    extensions: [ '.ts' ],
  },
  plugins: [
    new EnvironmentPlugin(envs),
    new CopyPlugin({
      patterns: [ { from: 'package.json', to: '.' } ],
    }),
  ],
  module: {
    rules: [
      {
        test    : /\.ts$/,
        include : /src/,
        use     : [ { loader: 'ts-loader' } ],
      },
    ],
  },
};

export default config;
