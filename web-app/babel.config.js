const presets = ["@babel/preset-react"];
const plugins = [
  "react-hot-loader/babel",
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-class-properties"
];

if (process.env["ENV"] === "prod") {
  presets.push(["@babel/preset-env", { modules: false }]);
} else {
  presets.push(["@babel/preset-env", { useBuiltIns: "usage", corejs: { version: "3.8", proposals: true } }]);
  plugins.push("@babel/plugin-transform-runtime")
}

module.exports = { presets, plugins };
