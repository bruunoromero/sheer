export const preset = () => ({
  presets: [require("@babel/preset-env")],
  plugins: [require("babel-plugin-add-module-exports")]
});
