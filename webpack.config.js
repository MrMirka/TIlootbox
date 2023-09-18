const path = require('path');

module.exports = {
  mode: 'development', // или 'production'
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gltf|bin)$/,
        type: 'asset/resource',
        generator: {
            filename: 'models/[name][hash][ext]'
        }
    }
    ]
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000,
  },
  performance: {
    hints: false, // Отключение предупреждений о производительности
  },
};
