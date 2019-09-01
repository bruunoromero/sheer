module.exports = () => ({
  presets: [require("@babel/preset-env")],
  plugins: [require("babel-plugin-add-module-exports")]
});
