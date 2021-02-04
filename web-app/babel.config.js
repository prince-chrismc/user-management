const presets = ["@babel/preset-react", "@babel/preset-env"];
const plugins = [
  "react-hot-loader/babel",
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-class-properties"
];

if (process.env["ENV"] === "prod") {
  presets.push({ "modules": false });
}

module.exports = { presets, plugins };
