const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: '@nativescript/schematics-executor',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  optimization: {
    noEmitOnErrors: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'require.extensions': {
        '.js': 1,
        '.json': 2,
        '.node': 3,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.js/i,
        use: [
          {
            loader: './build-loader'
          }
        ]
      },
    ]
  }
};

