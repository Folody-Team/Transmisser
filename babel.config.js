const presets = [];
const plugins = [
  [
    "@babel/plugin-transform-react-jsx",
    { runtime: "automatic", importSource: "@core",  },
  ],
  [
    "module-resolver",
    {
      "root": ["./src"],
      "alias": {
        "@components": "./src/components",
        "@core": "./src/core"
      }
    }
  ]
];

module.exports = {
  presets,
  plugins,
};