'use strict';

/**
 * API description
 *
 * @param {type} name/name=default_value description 
 * @return {String} description
 * @example
 *     any example
 *     
 * @other description
 */

exports.createDOC = function* (controller, path, markdown) {
  try {
    const routes     = yield asyncFunc.getRoutes(controller), 
          files      = yield asyncFunc.getAllFiles(path), 
          doxObjs    = yield asyncFunc.buildDoxObjs(routes, files), 
          mergerObjs = Object.assign(routes, doxObjs);
    markdownBuild.apibuild(mergerObjs, markdown);
  } catch (err) {
    console.log(err);
  }
};
