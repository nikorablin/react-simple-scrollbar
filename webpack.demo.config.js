const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'demo'),
  entry: {
    app: './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'demo')],
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: 1,
              localIdentName: '[name]__[local]'
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devServer: {
    open: false,
    contentBase: path.resolve(__dirname, 'demo')
  }
};
