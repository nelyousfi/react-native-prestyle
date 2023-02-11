module.exports = function (source) {
  const options = this.getOptions() || [];
  const ignore = options.ignore || [];
  const replace = options.replace || {};
  const keys = Object.keys(replace).join("|");
  const replacePattern = new RegExp(keys, "g");

  return source
    .split("\n")
    .filter((line) => {
      return !ignore.some((i) => line.includes(i));
    })
    .join("\n")
    .replace(replacePattern, (match) => replace[match]);
};
