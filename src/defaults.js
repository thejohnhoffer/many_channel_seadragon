'use strict';

/**
 * Get default query path by pathname
 * @param {string} pathname
 * @return {string}
 */
module.exports = function(pathname) {
  var debug = false;
  var query = "type=image&0src=images/bw_red.png&1src=images/bw_green.png";
  var root_path = pathname.split('/')[1];

  // Different defaults by root path
  if (root_path.indexOf('many-channel-osd') == 0) {
    query = "src=/minerva-test-images/png_tiles";
  }
  if (root_path.split('-').pop() == 'dev') {
    debug = true;
  }

  return {
    'query': query,
    'debug': debug,
  }
};
