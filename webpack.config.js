const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


// path.resolve - склейка двух путей, __dirname - абсолютная текущая дериктория, 'dist' - конечная
// path.resolve(__dirname, 'dist')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
    // Чтобы не делать дубликаты библиотек(например jquery и в alalytics и index)
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      // минификация css
      new CssMinimizerPlugin(),
      // иминификация html
      new TerserPlugin()
    ]
  }

  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

module.exports = {
  context: path.resolve(__dirname, 'src'),
  // минификация кода mode: 'production'
  // без минификации mode: 'development'
  // Объекты входа
  entry: {
    main: ['@babel/polyfill', './script/index.jsx'],
    analytics: ['@babel/polyfill', './script/models/analytics.ts'],
  },
  // Куда собираются
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    // extendsions: ['.js', '.json', '.png'] - чтобы не писать расширения в импортах, пишем все тут
    // alias - короткая запись для путей, обычно применяют @final_dir
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@models': path.resolve(__dirname, 'src/script/models'),
      '@db': path.resolve(__dirname, 'src/db'),
    }
  },
  // для оптимизации сборки кода (в тч минификации)
  optimization: optimization(),
  // для запуска webpack-dev-server
  devServer: {
    port: 4200,
    hot: isDev,
  },
  devtool: isDev ? 'source-map' : false,
  plugins: [
    // Плагин для сборки html, автоматически собирает все js файлы
    new HTMLWebpackPlugin({
      title: 'Webpack Course',
      template: './views/index.html',
      collapseWhitespace: isProd,
    }),
    // для сжатой сборки css в одиночный фаил
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    // Плагин для копирования фаилов в бандл
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/icons/favicon.png'),
          to: path.resolve(__dirname, 'dist/favicon.png'),
        },
      ],
    }),
    // Плагин для удаления всех фалов в папкете dist, чтобы не было дубликатов при новых сборках
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      // css
      {
        test: /.s?css$/,
        // style-loader - создает link в head, css(sass)-loader - собирает все фаилы в одиночный фаил
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      // Babel, JS
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          },
        }
      },
      // Babel, TS
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
            plugins: ['@babel/plugin-proposal-class-properties']
          },
        }
      },
      // Babel, REACT-JSX
      {
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
          },
        }
      },
      // file-loader сохраняет пути файлов для использования в других файлах
      {
        test: /\.(png|jpg|svg|gif|webp)$/i,
        use: ['file-loader']
      },
      // шрифты
      {
        test: /\.(woff(2)?|ttf|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: './fonts/[name][ext]',
        },
      },
      // xml
      {
        test: /\.xml$/i,
        use: ['xml-loader']
      },
      // csv
      {
        test: /\.csv$/i,
        use: ['csv-loader']
      },
    ]
  }
}
