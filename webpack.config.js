import * as path from 'path';

const rules = [
  {
    test:/\.tsx?/,
    exclude: /node_modules/,
    loader:'ts-loader'
  }
]
const config =  {
  target:'web',
  mode:'development',
  entry:'./src/index.tsx',
  output: {
    path:path.resolve(".", 'dist'),
    filename:'bundle.js'
  },
  module: {rules},
  resolve:{
    extensions:['.ts', '.tsx', '.js'],
    fallback: { "crypto": false, "stream": path.resolve("stream-browserify")  }
  },
  devServer: {
    contentBase:'./',
    port: 5000
  }
}
export default config;