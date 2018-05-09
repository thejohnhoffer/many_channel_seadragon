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
    query_default = "0src=/minerva-test-images/png_tiles/C0-T0-Z0-L0-Y2-X4.png"
    + "&1src=/minerva-test-images/png_tiles/C1-T0-Z0-L0-Y2-X4.png";
  }

  return query_default;
};
