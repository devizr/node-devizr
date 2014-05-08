/*!
 * Devizr Configuration (node-devizr test v0.0.5)
 * Dynamicaly generated with "node-devizr"
 * Thu May 08 2014 22:48:21 GMT+0200 (CEST)
*/
var breakpoints33 = [
  {
    width: 0,
    addons: {
      mobilenavigation: {
        script: "dest/mobile.min.js",
        complete: app.initMobileNavigation
      }
    }
  },
  {
    width: 767,
    addons: {
      animation: {
        script: "dest/animation.min.js",
        style: "dest/animation.min.css",
        tests: [
          "requestanimationframe",
          "!touch"
        ],
        complete: app.initAnimations
      }
    }
  }
]