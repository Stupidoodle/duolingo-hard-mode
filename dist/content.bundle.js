(()=>{"use strict";function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,o(r.key),r)}}function o(e){var o=function(e){if("object"!=t(e)||!e)return e;var o=e[Symbol.toPrimitive];if(void 0!==o){var n=o.call(e,"string");if("object"!=t(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==t(o)?o:o+""}var n=function(){return t=function t(e){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),(this instanceof t?this.constructor:void 0)===t)throw new Error("Cannot instantiate abstract class");if(!e)throw new Error("Challenge div not found");this.challengeDiv=e,this.challengeType=e.getAttribute("data-test").replace("challenge challenge-","")},(o=[{key:"cleanup",value:function(){throw new Error("Method not implemented")}},{key:"extractChoices",value:function(t){throw new Error("Method not implemented")}},{key:"extractElements",value:function(){throw new Error("Method not implemented")}},{key:"enforceTyping",value:function(){throw new Error("Method not implemented")}},{key:"injectTypingInput",value:function(){throw new Error("Method not implemented")}},{key:"handleSubmit",value:function(){throw new Error("Method not implemented")}}])&&e(t.prototype,o),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,o}();function r(t){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(t)}function l(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,a(n.key),n)}}function a(t){var e=function(t){if("object"!=r(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var o=e.call(t,"string");if("object"!=r(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==r(e)?e:e+""}var c,i,s,u=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}return e=t,o=[{key:"register",value:function(e,o){if(!(o.prototype instanceof n))throw new Error("Class ".concat(o.name," must extend Challenge"));t.registry.set(e,o)}},{key:"create",value:function(e,o){var n=t.registry.get(e);if(!n)throw new Error("Challenge type ".concat(e," not found"));return new n(o)}}],null&&l(e.prototype,null),o&&l(e,o),Object.defineProperty(e,"prototype",{writable:!1}),e;var e,o}();function d(t){return d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},d(t)}function g(t){return function(t){if(Array.isArray(t))return p(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return p(t,e);var o={}.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?p(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(t,e){(null==e||e>t.length)&&(e=t.length);for(var o=0,n=Array(e);o<e;o++)n[o]=t[o];return n}function f(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,h(n.key),n)}}function h(t){var e=function(t){if("object"!=d(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var o=e.call(t,"string");if("object"!=d(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==d(e)?e:e+""}function y(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(y=function(){return!!t})()}function b(t){return b=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},b(t)}function m(t,e){return m=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},m(t,e)}c=u,i="registry",s=new Map,(i=a(i))in c?Object.defineProperty(c,i,{value:s,enumerable:!0,configurable:!0,writable:!0}):c[i]=s;var w=function(t){function e(t){var o;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(o=function(t,e,o){return e=b(e),function(t,e){if(e&&("object"==d(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}(t,y()?Reflect.construct(e,o||[],b(t).constructor):e.apply(t,o))}(this,e,[t])).elements=o.extractElements(),o}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&m(t,e)}(e,t),function(t,e){return e&&f(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t}(e,[{key:"extractChoices",value:function(t){if(!t)throw new Error("Word bank not found");return g(t.querySelectorAll("button[data-test*='challenge-tap-token']")).reduce((function(t,e){return t[e.querySelector("[data-test='challenge-tap-token-text']").textContent.trim().toLowerCase()]=e,t}),{})}},{key:"extractElements",value:function(){var t;return{question:(null===(t=this.challengeDiv.querySelector("h1[data-test='challenge-header']"))||void 0===t?void 0:t.textContent.trim())||"",choices:this.extractChoices(this.challengeDiv.querySelector("div[data-test='word-bank']"))||{},submitButton:document.querySelector('button[data-test="player-next"]')}}},{key:"enforceTyping",value:function(){this.elements.choices.length>0&&(console.debug("Enforcing typing for ".concat(this.challengeType)),this.injectTypingInput())}},{key:"injectTypingInput",value:function(){var t=this,e=this.challengeDiv.querySelector("div[data-test='word-bank']");if(!e)return console.error("Word bank not found");e.style.display="none",this.elements.wordBank=e;var o=document.createElement("textarea");o.setAttribute("autocapitalize","off"),o.setAttribute("autocomplete","off"),o.setAttribute("spellcheck","false"),o.setAttribute("placeholder","Type here..."),o.setAttribute("data-extension","true"),o.style.cssText='\n\t\t-webkit-text-size-adjust: 100%;\n\t\t--viewport-height: 100dvh;\n\t\t--web-ui_button-border-radius: 16px;\n\t\t--rtl-sign: 1;\n\t\t--text-pageTitle-casing-large: none;\n\t\t--text-pageTitle-letter-spacing-large: 0;\n\t\t--text-pageTitle-line-height-large: 2.75rem;\n\t\t--text-pageTitle-size-large: 2.5rem;\n\t\t--text-pageTitle-weight-large: 700;\n\t\t--text-pageTitle-casing-small: none;\n\t\t--text-pageTitle-letter-spacing-small: 0;\n\t\t--text-pageTitle-line-height-small: 2.25rem;\n\t\t--text-pageTitle-size-small: 2rem;\n\t\t--text-pageTitle-weight-small: 700;\n\t\t--text-heading-casing-large: none;\n\t\t--text-heading-letter-spacing-large: 0;\n\t\t--text-heading-line-height-large: 2rem;\n\t\t--text-heading-size-large: 1.75rem;\n\t\t--text-heading-weight-large: 700;\n\t\t--text-heading-casing-medium: none;\n\t\t--text-heading-letter-spacing-medium: 0;\n\t\t--text-heading-line-height-medium: 2rem;\n\t\t--text-heading-size-medium: 1.5rem;\n\t\t--text-heading-weight-medium: 700;\n\t\t--text-heading-casing-small: none;\n\t\t--text-heading-letter-spacing-small: 0;\n\t\t--text-heading-line-height-small: 1.5rem;\n\t\t--text-heading-size-small: 1.25rem;\n\t\t--text-heading-weight-small: 700;\n\t\t--text-heading-casing-xsmall: none;\n\t\t--text-heading-letter-spacing-xsmall: 0;\n\t\t--text-heading-line-height-xsmall: 1.25rem;\n\t\t--text-heading-size-xsmall: 1rem;\n\t\t--text-heading-weight-xsmall: 700;\n\t\t--text-body-casing: none;\n\t\t--text-body-letter-spacing: 0;\n\t\t--text-body-line-height: 1.75rem;\n\t\t--text-body-size: 1.25rem;\n\t\t--text-body-weight: 500;\n\t\t--text-body-weight-bold: 700;\n\t\t--text-body-casing-spacious: none;\n\t\t--text-body-letter-spacing-spacious: 0;\n\t\t--text-body-line-height-spacious: 2rem;\n\t\t--text-body-size-spacious: 1.25rem;\n\t\t--text-body-weight-spacious: 500;\n\t\t--text-body-weight-spacious-bold: 700;\n\t\t--text-caption-casing: none;\n\t\t--text-caption-letter-spacing: 0;\n\t\t--text-caption-line-height: 1.5rem;\n\t\t--text-caption-size: 1rem;\n\t\t--text-caption-weight: 500;\n\t\t--text-caption-weight-bold: 700;\n\t\t--text-label-casing-large: uppercase;\n\t\t--text-label-letter-spacing-large: 0.04em;\n\t\t--text-label-line-height-large: 1.5rem;\n\t\t--text-label-size-large: 1.5rem;\n\t\t--text-label-weight-large: 700;\n\t\t--text-label-casing-medium: uppercase;\n\t\t--text-label-letter-spacing-medium: 0.04em;\n\t\t--text-label-line-height-medium: 1rem;\n\t\t--text-label-size-medium: 1rem;\n\t\t--text-label-weight-medium: 700;\n\t\t--color-snow: 19, 31, 36;\n\t\t--color-snow-always-light: 255, 255, 255;\n\t\t--color-snow-always-dark: 19, 31, 36;\n\t\t--color-polar: 32, 47, 54;\n\t\t--color-swan: 55, 70, 79;\n\t\t--color-swan-always-light: 229, 229, 229;\n\t\t--color-swan-always-dark: 55, 70, 79;\n\t\t--color-hare: 82, 101, 109;\n\t\t--color-hare-always-light: 175, 175, 175;\n\t\t--color-wolf: 220, 230, 236;\n\t\t--color-eel: 241, 247, 251;\n\t\t--color-squid: 235, 227, 227;\n\t\t--color-walking-fish: 32, 47, 54;\n\t\t--color-flamingo: 148, 81, 81;\n\t\t--color-pig: 245, 164, 164;\n\t\t--color-crab: 255, 120, 120;\n\t\t--color-cardinal: 238, 85, 85;\n\t\t--color-fire-ant: 216, 72, 72;\n\t\t--color-canary: 32, 47, 54;\n\t\t--color-duck: 251, 229, 109;\n\t\t--color-bee: 255, 199, 0;\n\t\t--color-bee-always-dark: 255, 199, 0;\n\t\t--color-lion: 255, 177, 0;\n\t\t--color-fox: 255, 171, 51;\n\t\t--color-cheetah: 32, 47, 54;\n\t\t--color-monkey: 229, 162, 89;\n\t\t--color-camel: 231, 166, 1;\n\t\t--color-guinea-pig: 215, 148, 51;\n\t\t--color-grizzly: 187, 113, 73;\n\t\t--color-sea-sponge: 32, 47, 54;\n\t\t--color-turtle: 95, 132, 40;\n\t\t--color-owl: 147, 211, 51;\n\t\t--color-tree-frog: 121, 185, 51;\n\t\t--color-peacock: 0, 205, 156;\n\t\t--color-iguana: 32, 47, 54;\n\t\t--color-anchovy: 210, 228, 232;\n\t\t--color-beluga: 187, 242, 255;\n\t\t--color-moon-jelly: 122, 240, 242;\n\t\t--color-blue-jay: 63, 133, 167;\n\t\t--color-macaw: 73, 192, 248;\n\t\t--color-whale: 24, 153, 214;\n\t\t--color-humpback: 43, 112, 201;\n\t\t--color-narwhal: 20, 83, 163;\n\t\t--color-manta-ray: 4, 44, 96;\n\t\t--color-starfish: 255, 134, 208;\n\t\t--color-beetle: 206, 130, 255;\n\t\t--color-betta: 144, 105, 205;\n\t\t--color-butterfly: 111, 78, 161;\n\t\t--color-dragon: 204, 52, 141;\n\t\t--color-starling: 92, 108, 252;\n\t\t--color-martin: 71, 85, 223;\n\t\t--color-grackle: 167, 160, 255;\n\t\t--color-honeycreeper: 193, 187, 255;\n\t\t--color-deep-starling: 34, 33, 81;\n\t\t--color-deep-martin: 16, 15, 62;\n\t\t--color-legendary-foreground: 140, 65, 3;\n\t\t--color-stardust: 199, 255, 254;\n\t\t--color-cosmos: 60, 77, 255;\n\t\t--color-nebula: 63, 34, 236;\n\t\t--color-nova: 207, 23, 200;\n\t\t--color-gamma: 38, 246, 99;\n\t\t--color-starlight: 38, 138, 255;\n\t\t--color-quasar: 252, 85, 255;\n\t\t--color-celestia: 255, 255, 255;\n\t\t--color-eclipse: 0, 4, 55;\n\t\t--color-black: 0, 0, 0;\n\t\t--color-aqua: 43, 164, 176;\n\t\t--color-aqua-always-light: 56, 238, 255;\n\t\t--color-ocean: 56, 238, 255;\n\t\t--color-seafoam: 30, 89, 97;\n\t\t--color-ice: 23, 52, 58;\n\t\t--color-max-shadow: 20, 208, 225;\n\t\t--color-black-white: 255, 255, 255;\n\t\t--color-diamond-stat: 86, 219, 226;\n\t\t--color-mask-green: 144, 220, 72;\n\t\t--color-pearl-stat: 255, 170, 222;\n\t\t--color-snow-dark-swan: 55, 70, 79;\n\t\t--color-black-text: 241, 247, 251;\n\t\t--color-blue-space: 11, 62, 113;\n\t\t--color-juicy-blue-space: 10, 74, 130;\n\t\t--color-juicy-blue-space-light: 35, 83, 144;\n\t\t--color-gold: 250, 169, 25;\n\t\t--color-gray-text: 220, 230, 236;\n\t\t--color-orange: 255, 157, 0;\n\t\t--color-diamond-highlight: 231, 251, 251;\n\t\t--color-diamond: 56, 208, 208;\n\t\t--color-banana: 255, 176, 32;\n\t\t--color-cloud: 207, 207, 207;\n\t\t--color-cloud-light: 221, 221, 221;\n\t\t--color-cloud-lightest: 240, 240, 240;\n\t\t--color-kiwi: 122, 199, 12;\n\t\t--color-kiwi-dark: 93, 151, 9;\n\t\t--color-kiwi-light: 142, 224, 0;\n\t\t--color-facebook: 59, 89, 152;\n\t\t--color-facebook-dark: 45, 67, 115;\n\t\t--color-google: 66, 133, 244;\n\t\t--color-twitter: 29, 161, 242;\n\t\t--color-hv-light-peach: 241, 218, 179;\n\t\t--color-hv-peach: 219, 186, 131;\n\t\t--color-hv-light-orange: 255, 177, 64;\n\t\t--color-hv-orange: 204, 121, 0;\n\t\t--color-hv-brown: 140, 90, 17;\n\t\t--color-streak-panel-extended-background: 205, 121, 0;\n\t\t--color-streak-panel-friend-background: 255, 95, 0;\n\t\t--color-streak-panel-frozen-background: 43, 112, 201;\n\t\t--color-streak-panel-frozen-flair-background: 73, 192, 248;\n\t\t--color-streak-panel-frozen-subtitle: 255, 255, 255;\n\t\t--color-streak-panel-frozen-text: 255, 255, 255;\n\t\t--color-streak-panel-frozen-topbar-text: 255, 255, 255;\n\t\t--color-streak-panel-streak-society-background: 215, 148, 51;\n\t\t--color-streak-panel-streak-society-background-always-dark: 215, 148, 51;\n\t\t--color-streak-panel-streak-society-text: 255, 255, 255;\n\t\t--color-streak-panel-unextended-heading-text: 82, 101, 109;\n\t\t--color-streak-panel-unextended-heading-background: 32, 47, 54;\n\t\t--color-streak-panel-unextended-topbar-text: 255, 255, 255;\n\t\t--color-streak-panel-milestone-gradient-start: 255, 147, 58;\n\t\t--color-streak-panel-milestone-gradient-end: 255, 200, 0;\n\t\t--color-streak-society-dark-orange: 255, 151, 1;\n\t\t--color-streak-society-light-orange: 255, 179, 1;\n\t\t--color-friends-quest-own-incomplete: 111, 139, 157;\n\t\t--color-friends-quest-friend-incomplete: 79, 100, 113;\n\t\t--color-black-text-always-light: 60, 60, 60;\n\t\t--color-cardinal-always-light: 255, 75, 75;\n\t\t--color-cowbird: 174, 104, 2;\n\t\t--color-eel-always-light: 75, 75, 75;\n\t\t--color-fox-always-light: 255, 150, 0;\n\t\t--color-fire-ant-always-light: 234, 43, 43;\n\t\t--color-grizzly-lite: 220, 143, 71;\n\t\t--color-guinea-pig-always-light: 205, 121, 0;\n\t\t--color-iguana-always-light: 221, 244, 255;\n\t\t--color-macaw-always-light: 28, 176, 246;\n\t\t--color-owl-always-light: 88, 204, 2;\n\t\t--color-polar-always-light: 247, 247, 247;\n\t\t--color-sea-sponge-always-light: 215, 255, 184;\n\t\t--color-tree-frog-always-light: 88, 167, 0;\n\t\t--color-turtle-always-light: 165, 237, 110;\n\t\t--color-walking-fish-always-light: 255, 223, 224;\n\t\t--color-wolf-always-light: 119, 119, 119;\n\t\t--color-cardinal-always-dark: 238, 85, 85;\n\t\t--color-eel-always-dark: 241, 247, 251;\n\t\t--color-hare-always-dark: 82, 101, 109;\n\t\t--color-macaw-always-dark: 73, 192, 248;\n\t\t--color-owl-always-dark: 147, 211, 51;\n\t\t--color-polar-always-dark: 32, 47, 54;\n\t\t--color-wolf-always-dark: 220, 230, 236;\n\t\t--color-rookie: 0, 175, 133;\n\t\t--color-explorer: 255, 100, 191;\n\t\t--color-traveler: 255, 145, 83;\n\t\t--color-trailblazer: 154, 143, 232;\n\t\t--color-adventurer: 96, 12, 199;\n\t\t--color-discoverer: 111, 44, 57;\n\t\t--color-daredevil: 46, 83, 138;\n\t\t--color-navigator: 9, 47, 119;\n\t\t--color-champion: 255, 110, 53;\n\t\t--color-daily_refresh: 0, 148, 255;\n\t\t--color-dark-mode-locked-path-section-text-color: 82, 101, 109;\n\t\t--color-rookie-progress-bar: 0, 198, 150;\n\t\t--color-explorer-progress-bar: 255, 138, 207;\n\t\t--color-traveler-progress-bar: 255, 167, 106;\n\t\t--color-trailblazer-progress-bar: 169, 157, 254;\n\t\t--color-adventurer-progress-bar: 122, 13, 199;\n\t\t--color-discoverer-progress-bar: 131, 50, 65;\n\t\t--color-daredevil-progress-bar: 54, 98, 165;\n\t\t--color-navigator-progress-bar: 12, 57, 141;\n\t\t--color-champion-progress-bar: 255, 129, 80;\n\t\t--color-daily_refresh-progress-bar: 28, 160, 255;\n\t\t--color-course-complete-cta: 120, 219, 224;\n\t\t--color-course-complete-cta-border: 94, 201, 204;\n\t\t--color-bea-secondary: 24, 153, 214;\n\t\t--color-eddy-secondary: 234, 43, 43;\n\t\t--color-gilded-secondary: 231, 166, 1;\n\t\t--color-lily-secondary: 165, 104, 204;\n\t\t--color-vikram-secondary: 163, 42, 113;\n\t\t--color-zari-secondary: 204, 107, 166;\n\t\t--color-oscar-secondary: 0, 164, 125;\n\t\t--color-falstaff-secondary: 150, 90, 58;\n\t\t--color-bea-radio: 20, 123, 172;\n\t\t--color-duo-radio: 62, 143, 1;\n\t\t--color-eddy-radio: 179, 53, 53;\n\t\t--color-falstaff-radio: 131, 79, 51;\n\t\t--color-lin-lucy-radio: 179, 105, 0;\n\t\t--color-lily-radio: 144, 91, 179;\n\t\t--color-vikram-radio: 143, 36, 99;\n\t\t--color-zari-radio: 179, 94, 146;\n\t\t--color-oscar-radio: 0, 144, 109;\n\t\t--color-bea-junior-shine: 67, 190, 248;\n\t\t--color-duo-shine: 114, 214, 39;\n\t\t--color-eddy-shine: 255, 105, 105;\n\t\t--color-falstaff-shine: 227, 165, 108;\n\t\t--color-lily-shine: 214, 150, 255;\n\t\t--color-lin-lucy-shine: 255, 168, 44;\n\t\t--color-oscar-shine: 63, 217, 181;\n\t\t--color-vikram-shine: 214, 90, 162;\n\t\t--color-zari-shine: 255, 158, 217;\n\t\t--color-super-background-secondary: 26, 30, 76;\n\t\t--color-super-gradient-background: 12, 47, 113;\n\t\t--color-super-gradient-top-halo: 12, 76, 70;\n\t\t--color-super-gradient-bottom-halo: 76, 29, 115;\n\t\t--color-gold-shine: 255, 231, 0;\n\t\t--color-legendary-dark-background: 24, 24, 24;\n\t\t--color-roseate: 223, 75, 162;\n\t\t--color-rosefinch: 180, 28, 117;\n\t\t--color-bluebird: 3, 144, 211;\n\t\t--color-cotinga: 121, 58, 227;\n\t\t--color-sabrewing: 165, 112, 255;\n\t\t--color-blueberry: 17, 82, 167;\n\t\t--color-ether: 60, 89, 141;\n\t\t--color-diamond-tournament-purple: 161, 161, 238;\n\t\t--color-diamond-tournament-reaction: 118, 163, 231;\n\t\t--color-yir-page0: 221, 244, 255;\n\t\t--color-yir-page1: 227, 255, 235;\n\t\t--color-yir-page1-shadow: 19, 31, 36;\n\t\t--color-yir-page3-shadow: 187, 172, 252;\n\t\t--color-yir-page4-shadow: 143, 219, 255;\n\t\t--color-yir-page5-shadow: 255, 183, 80;\n\t\t--color-super-gradient-green-variant1: 38, 255, 85;\n\t\t--color-super-gradient-blue-variant1: 38, 139, 255;\n\t\t--color-super-gradient-pink-variant1: 252, 85, 255;\n\t\t--color-super-gradient-purple-variant1: 17, 34, 181;\n\t\t--color-unknown-001e2d: 0, 30, 45;\n\t\t--color-unknown-0047a4: 0, 71, 164;\n\t\t--color-unknown-0087d0: 0, 135, 208;\n\t\t--color-unknown-00aff9: 0, 175, 249;\n\t\t--color-unknown-013047: 1, 48, 71;\n\t\t--color-unknown-048fd1: 4, 143, 209;\n\t\t--color-unknown-0e0f10: 14, 15, 16;\n\t\t--color-unknown-0e3d79: 14, 61, 121;\n\t\t--color-unknown-172071: 23, 32, 113;\n\t\t--color-unknown-280378: 40, 3, 120;\n\t\t--color-unknown-3ebbf6: 62, 187, 246;\n\t\t--color-unknown-655ebb: 101, 94, 187;\n\t\t--color-unknown-696cee: 105, 108, 238;\n\t\t--color-unknown-7c0000: 124, 0, 0;\n\t\t--color-unknown-89e219: 137, 226, 25;\n\t\t--color-unknown-935051: 147, 80, 81;\n\t\t--color-unknown-959595: 149, 149, 149;\n\t\t--color-unknown-a2a2a2: 162, 162, 162;\n\t\t--color-unknown-a3dbeb: 163, 219, 235;\n\t\t--color-unknown-a4dffb: 164, 223, 251;\n\t\t--color-unknown-aaa: 170, 170, 170;\n\t\t--color-unknown-d087ff: 208, 135, 255;\n\t\t--color-unknown-d9d9d9: 217, 217, 217;\n\t\t--color-unknown-ddd: 221, 221, 221;\n\t\t--color-unknown-de8029: 222, 128, 41;\n\t\t--color-unknown-e3e3e3: 227, 227, 227;\n\t\t--color-unknown-e4ffff: 228, 255, 255;\n\t\t--color-unknown-ed8c01: 237, 140, 1;\n\t\t--color-unknown-f3484e: 243, 72, 78;\n\t\t--color-unknown-f4fafe: 244, 250, 254;\n\t\t--color-unknown-fbdec5: 251, 222, 197;\n\t\t--color-unknown-ffc700: 255, 199, 0;\n\t\t--color-unknown-fff2aa: 255, 242, 170;\n\t\t--color-unknown-fffbef: 255, 251, 239;\n\t\t--app-offset: 0px;\n\t\t-webkit-font-smoothing: antialiased;\n\t\tdirection: ltr;\n\t\t-webkit-locale: "es";\n\t\tfont-size: 100%;\n\t\tmargin: 0;\n\t\toverflow: auto;\n\t\t-webkit-tap-highlight-color: transparent;\n\t\tbox-sizing: inherit;\n\t\tfont-family: din-round,sans-serif;\n\t\toutline: none;\n\t\tuser-select: auto;\n\t\tbackground: rgb(var(--color-snow));\n\t\tborder: 2px solid rgb(var(--color-swan));\n\t\tcolor: rgb(var(--color-black-text));\n\t\ttext-align: initial;\n\t\tline-height: 24px;\n\t\tbackground-color: rgb(var(--color-polar));\n\t\tborder-color: rgb(var(--color-swan));\n\t\tborder-radius: 10px;\n\t\tpadding: 10px 12px;\n\t\tappearance: none;\n\t\twidth: 100%;\n\t\tflex-grow: 1;\n\t\tresize: none;\n\t\t',e.parentNode.insertBefore(o,e);var n=new Set;o.addEventListener("keydown",(function(e){if(" "===e.key){e.preventDefault();var r=o.value.trim().split(" ").pop().toLowerCase();if(!r)return;r in t.elements.choices&&!n.has(r)?(console.debug("Selected ".concat(r)),t.elements.choices[r].click(),n.add(r),o.value+=" "):(console.warn("Word not found."),o.style.border="2px solid red",o.style.animation="shake 0.3s",setTimeout((function(){o.style.border="2px solid rgb(var(--color-swan))",o.style.animation=""}),300))}else if("Backspace"===e.key){var l=o.value.trim().split(" ").pop();if(!l)return;if(n.delete(l),l in t.elements.choices){console.debug("Removed ".concat(l));var a=t.elements.choices[l].getAttribute("data-test"),c=g(document.querySelectorAll("button[data-test='".concat(a,"']"))).find((function(t){return"false"===t.getAttribute("aria-disabled")}));c&&c.click()}}else"Enter"===e.key&&t.handleSubmit()})),o.focus(),this.elements.inputField=o}},{key:"handleSubmit",value:function(){this.elements.submitButton.click()}},{key:"cleanup",value:function(){var t;null!==(t=this.elements)&&void 0!==t&&t.inputField&&(this.elements.inputField.remove(),this.elements.inputField=null,this.elements.wordBank.style.display="flex")}}])}(n);u.register("translate",w);var k=null;function v(){var t,e,o=document.querySelector("div[data-test^='challenge challenge-']");if(!k||o&&o===k.challengeDiv||(null===(t=(e=k).cleanup)||void 0===t||t.call(e),k=null),o&&!o.hasAttribute("data-extension-processed")){var n=o.getAttribute("data-test").replace("challenge challenge-","");console.debug(n);try{o.setAttribute("data-extension-processed","true"),(k=u.create(n,o)).enforceTyping()}catch(t){console.error(t.message)}}}new MutationObserver(v).observe(document.body,{childList:!0,subtree:!0}),v()})();