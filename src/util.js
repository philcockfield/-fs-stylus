import fsPath from "path";


export const isMixin = (path) => {
    const name = fsPath.basename(path, ".styl");
    if (name === "mixin") { return true; }
    if (name.endsWith(".mixin")) { return true; }
    return false;
  };
