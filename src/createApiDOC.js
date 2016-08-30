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

const markdownBuild = require('./MarkdownBuild'),
  asyncfunc = require('./../common/asyncfunc');

exports.createDOC = function* (controller, path, markdown) {
  try {
    const routes = yield asyncfunc.getRoutes(controller);
    const files = yield asyncfunc.getAllFiles(path);

    const doxObjs = yield asyncfunc.buildDoxObjs(routes, files);
    const mergerObjs = Object.assign(routes, doxObjs);

    markdownBuild.apibuild(mergerObjs, markdown);
  } catch (err) {
    console.log(err);
  }
};
