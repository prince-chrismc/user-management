const presets = [ "@babel/preset-react" ];
const plugins = [ 
  "react-hot-loader/babel",
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-class-properties"
 ];

if (process.env["ENV"] === "prod") {
  presets.push(["@babel/preset-env", { "modules": false }]);
}
else{
  presets.push("@babel/preset-env");
}

module.exports = { presets, plugins };
