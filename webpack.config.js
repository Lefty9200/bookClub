const path = require('path');
const webpack = require('webpack');

const config = {
  context: __dirname,
  entry: './client/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/build')
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  devServer: {
      contentBase: "./client",
  },
  module: {
    loaders: [
      {
        test: /\.js$/, 
        loader: 'babel-loader'
      },
      {
        test: /\.css$/, 
        loader: 'style-loader!css-loader'
      },
      { 
        test: /\.png$/, 
        loader: "url-loader?limit=100000" 
      },
      { 
        test: /\.jpg$/, 
        loader: "file-loader" 
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  }
};

module.exports = config;
