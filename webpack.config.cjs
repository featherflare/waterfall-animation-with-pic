const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: {
    main: './src/js/index.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the dist folder on each build
  },

  devServer: {
    static: path.join(__dirname, 'dist'),
    hot: true,
    port: 3000, // Webpack Dev Server will run on port 3000
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/, // SCSS handling
        use: [
          'style-loader', // Inject CSS into DOM
          'css-loader', // Resolve CSS imports
          'sass-loader', // Compile SCSS to CSS
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // Handle assets like images
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      favicon: 'src/favicon.ico',
      chunks: ['main'],
    }),
  ],
  devtool: 'source-map', // Enable source maps for easier debugging
}
