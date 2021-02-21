const presets = ["@babel/preset-react", "@babel/preset-typescript"];
const plugins = [
  "react-hot-loader/babel",
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-class-properties"
];

if (process.env["NODE_ENV"] === "production") {
  presets.push(["@babel/preset-env", { modules: false }]);
  plugins.push(["transform-react-remove-prop-types", { mode: 'remove', ignoreFilenames: ['node_modules'], }])
} else {
  presets.push(["@babel/preset-env", { useBuiltIns: "usage", corejs: { version: "3.8", proposals: true } }]);
  plugins.push("@babel/plugin-transform-runtime")
}

module.exports = { presets, plugins };
