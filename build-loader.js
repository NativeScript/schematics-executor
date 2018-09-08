module.exports = function (source) {
  const path = this.request;

  if (path.endsWith('@angular-devkit/schematics/tools/node-module-engine-host.js')) {
    source = source.replace(`require(packageJsonPath)['schematics']`, `eval("require(packageJsonPath)['schematics']")`);
  }

  if (path.endsWith('@angular-devkit/schematics/tools/file-system-engine-host.js')) {
    source = source.replace(`require.resolve(path_1.join(this._root, name + '.json'))`, `eval("require.resolve(path_1.join(this._root, name + '.json'))")`);
    source = source.replace(`require.resolve(path_1.join(this._root, name, 'collection.json'))`, `eval("require.resolve(path_1.join(this._root, name, 'collection.json'))")`);
  }

  if (path.endsWith('@angular-devkit/schematics/tools/export-ref.js')) {
    source = source.replace(`require.resolve(this._module)`, `eval("require.resolve(this._module)")`);
    source = source.replace(`require(this._module)[name || 'default'];`, `eval("require(this._module)[name || 'default']");`);
    source = source.replace(`require(this._module);`, `eval("require(this._module)");`);
  }

  return source;
}
