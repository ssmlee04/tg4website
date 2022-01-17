const webpack = require('webpack');
const dev = process.env.NODE_ENV !== "production";
const path = require( "path" );
const glob = require( "glob" );
const LoadablePlugin = require('@loadable/webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const { BundleAnalyzerPlugin } = require( "webpack-bundle-analyzer" );
const FriendlyErrorsWebpackPlugin = require( "friendly-errors-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const PurgecssPlugin = require('purgecss-webpack-plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const GoogleFontsPlugin = require("@beyonk/google-fonts-webpack-plugin")

const plugins = [
    new GitRevisionPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            REACT_APP_TG_API_URL: JSON.stringify(process.env.REACT_APP_TG_API_URL),
            REACT_APP_TG_CHANNEL_USERNAME: JSON.stringify(process.env.REACT_APP_TG_CHANNEL_USERNAME),
            REACT_APP_TG_API_ID: JSON.stringify(process.env.REACT_APP_TG_API_ID),
            REACT_APP_TG_API_HASH: JSON.stringify(process.env.REACT_APP_TG_API_HASH),
        }
    }),
    new LoadablePlugin(),
    // Ignore all locale files of moment.js
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin({
        filename: "[name].css",
    }),
    new OptimizeCssAssetsPlugin(),
    // new GoogleFontsPlugin({
    //   fonts: [
    //     { family: "Montserrat", variants: [ "400", "600" ] }
    //   ]
    // })

];

if ( !dev ) {
    plugins.push( new BundleAnalyzerPlugin( {
        analyzerMode: "static",
        reportFilename: "webpack-report.html",
        openAnalyzer: false,
    } ) );
}

module.exports = {
    mode: dev ? "development" : "production",
    context: path.join( __dirname, "src" ),
    devtool: dev ? "none" : "",
    entry: {
        app: "./client.js",
    },
    resolve: {
        modules: [
            path.resolve( "./src" ),
            "node_modules",
        ],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'initial'
          }
        }
      }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
            }, {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                ],
                // exclude: /node_modules/,
                sideEffects: true
            }, {
              test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                  }
                }
              ]
            }
        ],
    },
    output: {
        path: path.resolve( __dirname, "dist" ),
        filename: "[name].bundle.js",
        publicPath: '/'
    },
    plugins,
};
