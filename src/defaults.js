'use strict';

/**
 * Get default query path by pathname
 * @param {string} pathname
 * @return {string}
 */
module.exports = function(pathname) {
  var query_default = "0src=images/bw_red.png&1src=images/bw_green.png"
  var root_path = pathname.split('/')[1];

  // Different defaults by root path
  if (root_path == 'many-channel-osd') {
    query_default = "src=/minerva-test-images/png_tiles";
  }

  return query_default;
};
