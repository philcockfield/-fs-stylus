import chokidar from "chokidar";
import fsCache from "./fs-cache";


export default (paths) => {

  console.log("watch", paths);

  const onFileChanged = (path) => {
    path = libPath(fsPath.resolve(path));
    fs.remove(path);
  };
  chokidar.watch(".", { ignored: /[\/\\]\./ })
    .on("change", path => {
      // if (_.endsWith(path, ".styl")) { onFileChanged(path); }
      console.log("changed", path);
    });

  console.log("-------------------------------------------");

};
