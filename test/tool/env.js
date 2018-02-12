'use strict';

function isPhantomJs() {
  if (typeof xslet !== 'undefined' && typeof xslet.platform !== 'undefined') {
    var ua = xslet.platform.ua;
    if (ua.PHANTOMJS) {
      return true;
    }
  }
  return false;
}

if (typeof window !== 'undefined') {
  window.isPhantomJs = isPhantomJs;
} else if (typeof module !== 'undefined') {
  module.exports.isPhantomJs = isPhantomJs;
}
