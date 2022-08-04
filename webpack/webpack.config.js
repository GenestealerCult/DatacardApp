const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Datacard App — Get printable Kill Team 2021 datacards',
      meta: {
        // Generic
        'viewport': { name: 'viewport', content: 'width=1320' },
        'title': { name: 'title', content: 'Datacard App — Get printable Kill Team 2021 datacards' },
        'description': { name: 'description', content: 'This tool creates printable Kill Team 2021 datacards from your BattleScribe roster file in your browser.' },
        'keyword': { name: 'keywords', content: 'Kill Team, Octarius, Warhammer, 40000, 40k, Games Workshop, Roster, Battle Scribe, Printable, Card, Datacard, Template' },

        // Offline
        'http-equiv': { 'http-equiv': 'Cache-control', content: 'public' },

        // Open graph
        'og:title': { property: 'og:title', content: 'Datacard App — Get printable Kill Team 2021 datacards' },
        'og:description': { property: 'og:description', content: 'This tool creates printable Kill Team 2021 datacards from your BattleScribe roster file in your browser.' },
        'og:type': { property: 'og:type', content: 'website' },
        'og:url': { property: 'og:url', content: 'https://datacard.app/' },
        'og:image': { property: 'og:image', content: 'https://datacard.app/share.jpg' },

        // Twitter
        'twitter:card': { name: 'twitter:card', content: 'summary_large_image' },
        'twitter:title': { name: 'twitter:title', content: 'Datacard App — Get printable Kill Team 2021 datacards' },
        'twitter:description': { name: 'twitter:description', content: 'This tool creates printable Kill Team 2021 datacards from your BattleScribe roster file in your browser.' },
        'twitter:image': { name: 'twitter:image', content: 'https://datacard.app/share.jpg' },
        'twitter:site': { name: 'twitter:site', content: '@GenestealerCult' }
      }
    }),
    new CopyPlugin({
      patterns: [
        { from: "static", to: "" },
      ],
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      JSZip: 'jszip',
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      { 
        test: /\.handlebars$/, 
        loader: "handlebars-loader",
        options: {
          precompileOptions: {
            knownHelpersOnly: false,
          },
        },
      }
    ],
  },
  devServer: {
	client: {
		overlay: false,
	},
},
};