// 这是项目发布阶段需要用到的babel插件;
const prodPlugins = [];
// 判断发布运行
if (process.env.NODE_ENV === "production") {
  // prodPlugins.push("transform-remove-console");
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
    // 发布时插件
    ...prodPlugins,
    "@babel/plugin-syntax-dynamic-import",
  ],
};
