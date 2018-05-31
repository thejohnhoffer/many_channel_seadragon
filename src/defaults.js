'use strict';

/**
 * Get default query path by pathname
 * @param {string} pathname
 * @return {string}
 */
module.exports = function(pathname) {
  var debug = false;
  var maxZoomPixelRatio = 2;
  var query = "type=image&0src=images/2x2.png";

  // Different defaults by root path
  var root_path = pathname.split('/')[1];
  var suffix = root_path.split('-').pop();

  if (root_path.indexOf('many-channel-osd') == 0) {
    query = "src=/minerva-test-images/png_tiles";
  }
  if (suffix == 'build' || suffix == 'dev') {
    maxZoomPixelRatio = 1000;
    debug = true;
  }

  return {
    'query': query,
    'debug': debug,
    'maxZoomPixelRatio': maxZoomPixelRatio
  }
};
