/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Challenge.js":
/*!**************************!*\
  !*** ./src/Challenge.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Challenge: () => (/* binding */ Challenge)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Abstract class for all challenges
 * @abstract
 */
var Challenge = /*#__PURE__*/function () {
  /**
   *
   * @param {HTMLElement} challengeDiv
   * @throws {Error} If challengeDiv is not found or if the class is instantiated directly
   */
  function Challenge(challengeDiv) {
    _classCallCheck(this, Challenge);
    if ((this instanceof Challenge ? this.constructor : void 0) === Challenge) throw new Error("Cannot instantiate abstract class");
    if (!challengeDiv) throw new Error("Challenge div not found");

    /** @type {HTMLElement} */
    this.challengeDiv = challengeDiv;

    /** @type {String} */
    this.challengeType = challengeDiv.getAttribute("data-test").replace("challenge challenge-", "");
  }

  /**
   * TODO
   * @abstract
   */
  return _createClass(Challenge, [{
    key: "cleanup",
    value: function cleanup() {
      throw new Error("Method not implemented");
    }

    /**
     * Extracts challenge-specific elements
     * Subclasses MUST override this method
     * @abstract
     * @returns {Object} Object containing challenge-specific elements
     * @throws {Error} If not implemented
     */
  }, {
    key: "extractElements",
    value: function extractElements() {
      throw new Error("Method not implemented");
    }

    /**
     * TODO
     * @abstract
     */
  }, {
    key: "enforceTyping",
    value: function enforceTyping() {
      throw new Error("Method not implemented");
    }

    /**
     * TODO
     * @abstract
     */
  }, {
    key: "injectTypingInput",
    value: function injectTypingInput() {
      throw new Error("Method not implemented");
    }

    /**
     * TODO
     * @abstract
     */
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      throw new Error("Method not implemented");
    }
  }]);
}();

/***/ }),

/***/ "./src/ChallengeFactory.js":
/*!*********************************!*\
  !*** ./src/ChallengeFactory.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChallengeFactory: () => (/* binding */ ChallengeFactory)
/* harmony export */ });
/* harmony import */ var _Challenge_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Challenge.js */ "./src/Challenge.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/**
 * Factory class for creating challenges
 */
var ChallengeFactory = /*#__PURE__*/function () {
  function ChallengeFactory() {
    _classCallCheck(this, ChallengeFactory);
  }
  return _createClass(ChallengeFactory, null, [{
    key: "register",
    value:
    /**
     * Registers a challenge class
     * @param {String} challengeType
     * @param {Class} challengeClass
     * @throws {Error} If challengeType is already registered
     * @throws {Error} If challengeClass is not a subclass of Challenge
     */
    function register(challengeType, challengeClass) {
      if (!(challengeClass.prototype instanceof _Challenge_js__WEBPACK_IMPORTED_MODULE_0__.Challenge)) {
        throw new Error("Class ".concat(challengeClass.name, " must extend Challenge"));
      }
      ChallengeFactory.registry.set(challengeType, challengeClass);
    }

    /**
     * Creates an instance of a Challenge
     * @param {String} challengeType
     * @param {HTMLElement} challengeDiv
     * @param {ExtensionEventManager} eventManager
     * @returns {Challenge}
     * @throws {Error} If challengeType is not registered
     */
  }, {
    key: "create",
    value: function create(challengeType, challengeDiv, eventManager) {
      var ChallengeClass = ChallengeFactory.registry.get(challengeType);
      if (!ChallengeClass) {
        throw new Error("Challenge type ".concat(challengeType, " not found"));
      }
      return new ChallengeClass(challengeDiv, eventManager);
    }
  }]);
}();
_defineProperty(ChallengeFactory, "registry", new Map());

/***/ }),

/***/ "./src/ChallengeTapComplete.js":
/*!*************************************!*\
  !*** ./src/ChallengeTapComplete.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChallengeTapComplete: () => (/* binding */ ChallengeTapComplete)
/* harmony export */ });
/* harmony import */ var _Challenge_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Challenge.js */ "./src/Challenge.js");
/* harmony import */ var _ExtensionEventManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ExtensionEventManager.js */ "./src/ExtensionEventManager.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }



/**
 * Challenge type: tapComplete
 * @extends Challenge
 */
var ChallengeTapComplete = /*#__PURE__*/function (_Challenge) {
  /**
   * @param {HTMLElement} challengeDiv
   * @param {ExtensionEventManager} eventManager
   * @throws {Error} If challengeDiv is not found
   */
  function ChallengeTapComplete(challengeDiv, eventManager) {
    var _this;
    _classCallCheck(this, ChallengeTapComplete);
    _this = _callSuper(this, ChallengeTapComplete, [challengeDiv]);
    _this.challengeId = _this.challengeType + "-" + Date.now();

    /** @type {ExtensionEventManager} */
    _this.eventManager = eventManager;

    /** @type {Object} */
    _this.elements = _this.extractElements();
    console.debug(_this.elements);
    _this.eventManager.registerChallenge(_this.challengeId, _this);
    return _this;
  }

  /**
   * Extracts choices mapped to the corresponding buttons from the word bank
   * TODO: Implement button class
   * @override
   * @param {HTMLElement} wordBankDiv
   * @returns {Object} Object containing choices mapped to the corresponding buttons
   * @throws {Error} If word bank is not found
   */
  _inherits(ChallengeTapComplete, _Challenge);
  return _createClass(ChallengeTapComplete, [{
    key: "extractChoices",
    value: function extractChoices(wordBankDiv) {
      if (!wordBankDiv) throw new Error("Word bank not found");
      var wordButtons = _toConsumableArray(wordBankDiv.querySelectorAll("button[data-test*='challenge-tap-token']"));
      return wordButtons.reduce(function (dict, btn) {
        var word = btn.querySelector("[data-test='challenge-tap-token-text']").textContent.trim().toLowerCase();
        dict[word] = btn;
        return dict;
      }, {});
    }

    /**
     * Extracts challenge-specific elements
     * @override
     * @returns {{question: (string|string), choices: {}, submitButton: HTMLButtonElement, inputField: HTMLTextAreaElement, wordBank: HTMLElement}} Object containing challenge-specific elements
     */
  }, {
    key: "extractElements",
    value: function extractElements() {
      var _this$challengeDiv$qu;
      // noinspection JSValidateTypes
      return {
        question: ((_this$challengeDiv$qu = this.challengeDiv.querySelector("h1[data-test='challenge-header']")) === null || _this$challengeDiv$qu === void 0 ? void 0 : _this$challengeDiv$qu.textContent.trim()) || "",
        choices: this.extractChoices(this.challengeDiv.querySelector("div[data-test='word-bank']")) || {},
        submitButton: document.querySelector('button[data-test="player-next"]'),
        inputField: null,
        wordBank: null
      };
    }

    /**
     * Enforces typing by injecting a textarea element
     * @override
     */
  }, {
    key: "enforceTyping",
    value: function enforceTyping() {
      if (Object.keys(this.elements.choices).length > 0) {
        console.debug("Enforcing typing for ".concat(this.challengeType));
        this.injectTypingInput();
      }
    }

    /**
     * Injects a textarea element for typing input
     * @override
     * @throws {Error} FIXME If word bank is not found
     */
  }, {
    key: "injectTypingInput",
    value: function injectTypingInput() {
      var _this2 = this;
      var wordBank = this.challengeDiv.querySelector("div[data-test='word-bank']");
      if (!wordBank) return console.error("Word bank not found");
      wordBank.style.display = "none";
      this.elements.wordBank = wordBank;
      this.elements.inputField = document.createElement("textarea");
      this.elements.inputField.dataset.extension = "true";
      this.elements.inputField.dataset.challengeId = this.challengeId;
      this.elements.inputField.setAttribute("autocapitalize", "off");
      this.elements.inputField.setAttribute("autocomplete", "off");
      this.elements.inputField.setAttribute("spellcheck", "false");
      this.elements.inputField.setAttribute("placeholder", "Type here...");
      this.elements.inputField.setAttribute("data-extension", "true");
      this.elements.inputField.style.cssText = "\n\t\t-webkit-text-size-adjust: 100%;\n\t\t--viewport-height: 100dvh;\n\t\t--web-ui_button-border-radius: 16px;\n\t\t--rtl-sign: 1;\n\t\t--text-pageTitle-casing-large: none;\n\t\t--text-pageTitle-letter-spacing-large: 0;\n\t\t--text-pageTitle-line-height-large: 2.75rem;\n\t\t--text-pageTitle-size-large: 2.5rem;\n\t\t--text-pageTitle-weight-large: 700;\n\t\t--text-pageTitle-casing-small: none;\n\t\t--text-pageTitle-letter-spacing-small: 0;\n\t\t--text-pageTitle-line-height-small: 2.25rem;\n\t\t--text-pageTitle-size-small: 2rem;\n\t\t--text-pageTitle-weight-small: 700;\n\t\t--text-heading-casing-large: none;\n\t\t--text-heading-letter-spacing-large: 0;\n\t\t--text-heading-line-height-large: 2rem;\n\t\t--text-heading-size-large: 1.75rem;\n\t\t--text-heading-weight-large: 700;\n\t\t--text-heading-casing-medium: none;\n\t\t--text-heading-letter-spacing-medium: 0;\n\t\t--text-heading-line-height-medium: 2rem;\n\t\t--text-heading-size-medium: 1.5rem;\n\t\t--text-heading-weight-medium: 700;\n\t\t--text-heading-casing-small: none;\n\t\t--text-heading-letter-spacing-small: 0;\n\t\t--text-heading-line-height-small: 1.5rem;\n\t\t--text-heading-size-small: 1.25rem;\n\t\t--text-heading-weight-small: 700;\n\t\t--text-heading-casing-xsmall: none;\n\t\t--text-heading-letter-spacing-xsmall: 0;\n\t\t--text-heading-line-height-xsmall: 1.25rem;\n\t\t--text-heading-size-xsmall: 1rem;\n\t\t--text-heading-weight-xsmall: 700;\n\t\t--text-body-casing: none;\n\t\t--text-body-letter-spacing: 0;\n\t\t--text-body-line-height: 1.75rem;\n\t\t--text-body-size: 1.25rem;\n\t\t--text-body-weight: 500;\n\t\t--text-body-weight-bold: 700;\n\t\t--text-body-casing-spacious: none;\n\t\t--text-body-letter-spacing-spacious: 0;\n\t\t--text-body-line-height-spacious: 2rem;\n\t\t--text-body-size-spacious: 1.25rem;\n\t\t--text-body-weight-spacious: 500;\n\t\t--text-body-weight-spacious-bold: 700;\n\t\t--text-caption-casing: none;\n\t\t--text-caption-letter-spacing: 0;\n\t\t--text-caption-line-height: 1.5rem;\n\t\t--text-caption-size: 1rem;\n\t\t--text-caption-weight: 500;\n\t\t--text-caption-weight-bold: 700;\n\t\t--text-label-casing-large: uppercase;\n\t\t--text-label-letter-spacing-large: 0.04em;\n\t\t--text-label-line-height-large: 1.5rem;\n\t\t--text-label-size-large: 1.5rem;\n\t\t--text-label-weight-large: 700;\n\t\t--text-label-casing-medium: uppercase;\n\t\t--text-label-letter-spacing-medium: 0.04em;\n\t\t--text-label-line-height-medium: 1rem;\n\t\t--text-label-size-medium: 1rem;\n\t\t--text-label-weight-medium: 700;\n\t\t--color-snow: 19, 31, 36;\n\t\t--color-snow-always-light: 255, 255, 255;\n\t\t--color-snow-always-dark: 19, 31, 36;\n\t\t--color-polar: 32, 47, 54;\n\t\t--color-swan: 55, 70, 79;\n\t\t--color-swan-always-light: 229, 229, 229;\n\t\t--color-swan-always-dark: 55, 70, 79;\n\t\t--color-hare: 82, 101, 109;\n\t\t--color-hare-always-light: 175, 175, 175;\n\t\t--color-wolf: 220, 230, 236;\n\t\t--color-eel: 241, 247, 251;\n\t\t--color-squid: 235, 227, 227;\n\t\t--color-walking-fish: 32, 47, 54;\n\t\t--color-flamingo: 148, 81, 81;\n\t\t--color-pig: 245, 164, 164;\n\t\t--color-crab: 255, 120, 120;\n\t\t--color-cardinal: 238, 85, 85;\n\t\t--color-fire-ant: 216, 72, 72;\n\t\t--color-canary: 32, 47, 54;\n\t\t--color-duck: 251, 229, 109;\n\t\t--color-bee: 255, 199, 0;\n\t\t--color-bee-always-dark: 255, 199, 0;\n\t\t--color-lion: 255, 177, 0;\n\t\t--color-fox: 255, 171, 51;\n\t\t--color-cheetah: 32, 47, 54;\n\t\t--color-monkey: 229, 162, 89;\n\t\t--color-camel: 231, 166, 1;\n\t\t--color-guinea-pig: 215, 148, 51;\n\t\t--color-grizzly: 187, 113, 73;\n\t\t--color-sea-sponge: 32, 47, 54;\n\t\t--color-turtle: 95, 132, 40;\n\t\t--color-owl: 147, 211, 51;\n\t\t--color-tree-frog: 121, 185, 51;\n\t\t--color-peacock: 0, 205, 156;\n\t\t--color-iguana: 32, 47, 54;\n\t\t--color-anchovy: 210, 228, 232;\n\t\t--color-beluga: 187, 242, 255;\n\t\t--color-moon-jelly: 122, 240, 242;\n\t\t--color-blue-jay: 63, 133, 167;\n\t\t--color-macaw: 73, 192, 248;\n\t\t--color-whale: 24, 153, 214;\n\t\t--color-humpback: 43, 112, 201;\n\t\t--color-narwhal: 20, 83, 163;\n\t\t--color-manta-ray: 4, 44, 96;\n\t\t--color-starfish: 255, 134, 208;\n\t\t--color-beetle: 206, 130, 255;\n\t\t--color-betta: 144, 105, 205;\n\t\t--color-butterfly: 111, 78, 161;\n\t\t--color-dragon: 204, 52, 141;\n\t\t--color-starling: 92, 108, 252;\n\t\t--color-martin: 71, 85, 223;\n\t\t--color-grackle: 167, 160, 255;\n\t\t--color-honeycreeper: 193, 187, 255;\n\t\t--color-deep-starling: 34, 33, 81;\n\t\t--color-deep-martin: 16, 15, 62;\n\t\t--color-legendary-foreground: 140, 65, 3;\n\t\t--color-stardust: 199, 255, 254;\n\t\t--color-cosmos: 60, 77, 255;\n\t\t--color-nebula: 63, 34, 236;\n\t\t--color-nova: 207, 23, 200;\n\t\t--color-gamma: 38, 246, 99;\n\t\t--color-starlight: 38, 138, 255;\n\t\t--color-quasar: 252, 85, 255;\n\t\t--color-celestia: 255, 255, 255;\n\t\t--color-eclipse: 0, 4, 55;\n\t\t--color-black: 0, 0, 0;\n\t\t--color-aqua: 43, 164, 176;\n\t\t--color-aqua-always-light: 56, 238, 255;\n\t\t--color-ocean: 56, 238, 255;\n\t\t--color-seafoam: 30, 89, 97;\n\t\t--color-ice: 23, 52, 58;\n\t\t--color-max-shadow: 20, 208, 225;\n\t\t--color-black-white: 255, 255, 255;\n\t\t--color-diamond-stat: 86, 219, 226;\n\t\t--color-mask-green: 144, 220, 72;\n\t\t--color-pearl-stat: 255, 170, 222;\n\t\t--color-snow-dark-swan: 55, 70, 79;\n\t\t--color-black-text: 241, 247, 251;\n\t\t--color-blue-space: 11, 62, 113;\n\t\t--color-juicy-blue-space: 10, 74, 130;\n\t\t--color-juicy-blue-space-light: 35, 83, 144;\n\t\t--color-gold: 250, 169, 25;\n\t\t--color-gray-text: 220, 230, 236;\n\t\t--color-orange: 255, 157, 0;\n\t\t--color-diamond-highlight: 231, 251, 251;\n\t\t--color-diamond: 56, 208, 208;\n\t\t--color-banana: 255, 176, 32;\n\t\t--color-cloud: 207, 207, 207;\n\t\t--color-cloud-light: 221, 221, 221;\n\t\t--color-cloud-lightest: 240, 240, 240;\n\t\t--color-kiwi: 122, 199, 12;\n\t\t--color-kiwi-dark: 93, 151, 9;\n\t\t--color-kiwi-light: 142, 224, 0;\n\t\t--color-facebook: 59, 89, 152;\n\t\t--color-facebook-dark: 45, 67, 115;\n\t\t--color-google: 66, 133, 244;\n\t\t--color-twitter: 29, 161, 242;\n\t\t--color-hv-light-peach: 241, 218, 179;\n\t\t--color-hv-peach: 219, 186, 131;\n\t\t--color-hv-light-orange: 255, 177, 64;\n\t\t--color-hv-orange: 204, 121, 0;\n\t\t--color-hv-brown: 140, 90, 17;\n\t\t--color-streak-panel-extended-background: 205, 121, 0;\n\t\t--color-streak-panel-friend-background: 255, 95, 0;\n\t\t--color-streak-panel-frozen-background: 43, 112, 201;\n\t\t--color-streak-panel-frozen-flair-background: 73, 192, 248;\n\t\t--color-streak-panel-frozen-subtitle: 255, 255, 255;\n\t\t--color-streak-panel-frozen-text: 255, 255, 255;\n\t\t--color-streak-panel-frozen-topbar-text: 255, 255, 255;\n\t\t--color-streak-panel-streak-society-background: 215, 148, 51;\n\t\t--color-streak-panel-streak-society-background-always-dark: 215, 148, 51;\n\t\t--color-streak-panel-streak-society-text: 255, 255, 255;\n\t\t--color-streak-panel-unextended-heading-text: 82, 101, 109;\n\t\t--color-streak-panel-unextended-heading-background: 32, 47, 54;\n\t\t--color-streak-panel-unextended-topbar-text: 255, 255, 255;\n\t\t--color-streak-panel-milestone-gradient-start: 255, 147, 58;\n\t\t--color-streak-panel-milestone-gradient-end: 255, 200, 0;\n\t\t--color-streak-society-dark-orange: 255, 151, 1;\n\t\t--color-streak-society-light-orange: 255, 179, 1;\n\t\t--color-friends-quest-own-incomplete: 111, 139, 157;\n\t\t--color-friends-quest-friend-incomplete: 79, 100, 113;\n\t\t--color-black-text-always-light: 60, 60, 60;\n\t\t--color-cardinal-always-light: 255, 75, 75;\n\t\t--color-cowbird: 174, 104, 2;\n\t\t--color-eel-always-light: 75, 75, 75;\n\t\t--color-fox-always-light: 255, 150, 0;\n\t\t--color-fire-ant-always-light: 234, 43, 43;\n\t\t--color-grizzly-lite: 220, 143, 71;\n\t\t--color-guinea-pig-always-light: 205, 121, 0;\n\t\t--color-iguana-always-light: 221, 244, 255;\n\t\t--color-macaw-always-light: 28, 176, 246;\n\t\t--color-owl-always-light: 88, 204, 2;\n\t\t--color-polar-always-light: 247, 247, 247;\n\t\t--color-sea-sponge-always-light: 215, 255, 184;\n\t\t--color-tree-frog-always-light: 88, 167, 0;\n\t\t--color-turtle-always-light: 165, 237, 110;\n\t\t--color-walking-fish-always-light: 255, 223, 224;\n\t\t--color-wolf-always-light: 119, 119, 119;\n\t\t--color-cardinal-always-dark: 238, 85, 85;\n\t\t--color-eel-always-dark: 241, 247, 251;\n\t\t--color-hare-always-dark: 82, 101, 109;\n\t\t--color-macaw-always-dark: 73, 192, 248;\n\t\t--color-owl-always-dark: 147, 211, 51;\n\t\t--color-polar-always-dark: 32, 47, 54;\n\t\t--color-wolf-always-dark: 220, 230, 236;\n\t\t--color-rookie: 0, 175, 133;\n\t\t--color-explorer: 255, 100, 191;\n\t\t--color-traveler: 255, 145, 83;\n\t\t--color-trailblazer: 154, 143, 232;\n\t\t--color-adventurer: 96, 12, 199;\n\t\t--color-discoverer: 111, 44, 57;\n\t\t--color-daredevil: 46, 83, 138;\n\t\t--color-navigator: 9, 47, 119;\n\t\t--color-champion: 255, 110, 53;\n\t\t--color-daily_refresh: 0, 148, 255;\n\t\t--color-dark-mode-locked-path-section-text-color: 82, 101, 109;\n\t\t--color-rookie-progress-bar: 0, 198, 150;\n\t\t--color-explorer-progress-bar: 255, 138, 207;\n\t\t--color-traveler-progress-bar: 255, 167, 106;\n\t\t--color-trailblazer-progress-bar: 169, 157, 254;\n\t\t--color-adventurer-progress-bar: 122, 13, 199;\n\t\t--color-discoverer-progress-bar: 131, 50, 65;\n\t\t--color-daredevil-progress-bar: 54, 98, 165;\n\t\t--color-navigator-progress-bar: 12, 57, 141;\n\t\t--color-champion-progress-bar: 255, 129, 80;\n\t\t--color-daily_refresh-progress-bar: 28, 160, 255;\n\t\t--color-course-complete-cta: 120, 219, 224;\n\t\t--color-course-complete-cta-border: 94, 201, 204;\n\t\t--color-bea-secondary: 24, 153, 214;\n\t\t--color-eddy-secondary: 234, 43, 43;\n\t\t--color-gilded-secondary: 231, 166, 1;\n\t\t--color-lily-secondary: 165, 104, 204;\n\t\t--color-vikram-secondary: 163, 42, 113;\n\t\t--color-zari-secondary: 204, 107, 166;\n\t\t--color-oscar-secondary: 0, 164, 125;\n\t\t--color-falstaff-secondary: 150, 90, 58;\n\t\t--color-bea-radio: 20, 123, 172;\n\t\t--color-duo-radio: 62, 143, 1;\n\t\t--color-eddy-radio: 179, 53, 53;\n\t\t--color-falstaff-radio: 131, 79, 51;\n\t\t--color-lin-lucy-radio: 179, 105, 0;\n\t\t--color-lily-radio: 144, 91, 179;\n\t\t--color-vikram-radio: 143, 36, 99;\n\t\t--color-zari-radio: 179, 94, 146;\n\t\t--color-oscar-radio: 0, 144, 109;\n\t\t--color-bea-junior-shine: 67, 190, 248;\n\t\t--color-duo-shine: 114, 214, 39;\n\t\t--color-eddy-shine: 255, 105, 105;\n\t\t--color-falstaff-shine: 227, 165, 108;\n\t\t--color-lily-shine: 214, 150, 255;\n\t\t--color-lin-lucy-shine: 255, 168, 44;\n\t\t--color-oscar-shine: 63, 217, 181;\n\t\t--color-vikram-shine: 214, 90, 162;\n\t\t--color-zari-shine: 255, 158, 217;\n\t\t--color-super-background-secondary: 26, 30, 76;\n\t\t--color-super-gradient-background: 12, 47, 113;\n\t\t--color-super-gradient-top-halo: 12, 76, 70;\n\t\t--color-super-gradient-bottom-halo: 76, 29, 115;\n\t\t--color-gold-shine: 255, 231, 0;\n\t\t--color-legendary-dark-background: 24, 24, 24;\n\t\t--color-roseate: 223, 75, 162;\n\t\t--color-rosefinch: 180, 28, 117;\n\t\t--color-bluebird: 3, 144, 211;\n\t\t--color-cotinga: 121, 58, 227;\n\t\t--color-sabrewing: 165, 112, 255;\n\t\t--color-blueberry: 17, 82, 167;\n\t\t--color-ether: 60, 89, 141;\n\t\t--color-diamond-tournament-purple: 161, 161, 238;\n\t\t--color-diamond-tournament-reaction: 118, 163, 231;\n\t\t--color-yir-page0: 221, 244, 255;\n\t\t--color-yir-page1: 227, 255, 235;\n\t\t--color-yir-page1-shadow: 19, 31, 36;\n\t\t--color-yir-page3-shadow: 187, 172, 252;\n\t\t--color-yir-page4-shadow: 143, 219, 255;\n\t\t--color-yir-page5-shadow: 255, 183, 80;\n\t\t--color-super-gradient-green-variant1: 38, 255, 85;\n\t\t--color-super-gradient-blue-variant1: 38, 139, 255;\n\t\t--color-super-gradient-pink-variant1: 252, 85, 255;\n\t\t--color-super-gradient-purple-variant1: 17, 34, 181;\n\t\t--color-unknown-001e2d: 0, 30, 45;\n\t\t--color-unknown-0047a4: 0, 71, 164;\n\t\t--color-unknown-0087d0: 0, 135, 208;\n\t\t--color-unknown-00aff9: 0, 175, 249;\n\t\t--color-unknown-013047: 1, 48, 71;\n\t\t--color-unknown-048fd1: 4, 143, 209;\n\t\t--color-unknown-0e0f10: 14, 15, 16;\n\t\t--color-unknown-0e3d79: 14, 61, 121;\n\t\t--color-unknown-172071: 23, 32, 113;\n\t\t--color-unknown-280378: 40, 3, 120;\n\t\t--color-unknown-3ebbf6: 62, 187, 246;\n\t\t--color-unknown-655ebb: 101, 94, 187;\n\t\t--color-unknown-696cee: 105, 108, 238;\n\t\t--color-unknown-7c0000: 124, 0, 0;\n\t\t--color-unknown-89e219: 137, 226, 25;\n\t\t--color-unknown-935051: 147, 80, 81;\n\t\t--color-unknown-959595: 149, 149, 149;\n\t\t--color-unknown-a2a2a2: 162, 162, 162;\n\t\t--color-unknown-a3dbeb: 163, 219, 235;\n\t\t--color-unknown-a4dffb: 164, 223, 251;\n\t\t--color-unknown-aaa: 170, 170, 170;\n\t\t--color-unknown-d087ff: 208, 135, 255;\n\t\t--color-unknown-d9d9d9: 217, 217, 217;\n\t\t--color-unknown-ddd: 221, 221, 221;\n\t\t--color-unknown-de8029: 222, 128, 41;\n\t\t--color-unknown-e3e3e3: 227, 227, 227;\n\t\t--color-unknown-e4ffff: 228, 255, 255;\n\t\t--color-unknown-ed8c01: 237, 140, 1;\n\t\t--color-unknown-f3484e: 243, 72, 78;\n\t\t--color-unknown-f4fafe: 244, 250, 254;\n\t\t--color-unknown-fbdec5: 251, 222, 197;\n\t\t--color-unknown-ffc700: 255, 199, 0;\n\t\t--color-unknown-fff2aa: 255, 242, 170;\n\t\t--color-unknown-fffbef: 255, 251, 239;\n\t\t--app-offset: 0px;\n\t\t-webkit-font-smoothing: antialiased;\n\t\tdirection: ltr;\n\t\t-webkit-locale: \"es\";\n\t\tfont-size: 100%;\n\t\tmargin: 0;\n\t\toverflow: auto;\n\t\t-webkit-tap-highlight-color: transparent;\n\t\tbox-sizing: inherit;\n\t\tfont-family: din-round,sans-serif;\n\t\toutline: none;\n\t\tuser-select: auto;\n\t\tbackground: rgb(var(--color-snow));\n\t\tborder: 2px solid rgb(var(--color-swan));\n\t\tcolor: rgb(var(--color-black-text));\n\t\ttext-align: initial;\n\t\tline-height: 24px;\n\t\tbackground-color: rgb(var(--color-polar));\n\t\tborder-color: rgb(var(--color-swan));\n\t\tborder-radius: 10px;\n\t\tpadding: 10px 12px;\n\t\tappearance: none;\n\t\twidth: 100%;\n\t\tflex-grow: 1;\n\t\tresize: none;\n\t\t";
      wordBank.parentNode.insertBefore(this.elements.inputField, wordBank);
      this.elements.inputField.addEventListener('input', function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      });
      this.elements.inputField.addEventListener('keydown', function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Handle special keys through our system
        if ([' ', 'Backspace', 'Enter'].includes(e.key)) {
          e.preventDefault();
          _this2.handleKeyEvent(e);
        }
      });
      this.elements.inputField.addEventListener("blur", function () {
        return setTimeout(function () {
          return _this2.elements.inputField.focus();
        }, 50);
      });
      this.elements.inputField.focus();
    }

    /**
     * Handles key events
     * @param {KeyboardEvent} event - Keyboard event
     * TODO Maybe Override
     */
  }, {
    key: "handleKeyEvent",
    value: function handleKeyEvent(event) {
      var key = event.key;
      var userInput = this.elements.inputField.value.trim().split(" ").pop().toLowerCase();
      if (userInput in this.elements.choices) {
        console.debug("Selected ".concat(userInput));
        this.elements.choices[userInput].click();
      }
      if (key === "Backspace") {
        this.handleBackspace();
      } else if (key === "Enter") {
        this.handleSubmit();
      }
    }

    /**
     * Handles backspace key event
     */
  }, {
    key: "handleBackspace",
    value: function handleBackspace() {
      var inputField = this.elements.inputField;
      var text = inputField.value;
      if (text.length === 0) return;
      inputField.value = text.slice(0, -1);
      var word = text.trim().split(/\s+/).pop().toLowerCase();
      var words = inputField.value.trim().split(/\s+/);
      if (!words.includes(word)) {
        if (word in this.elements.choices) {
          console.debug("Removed ".concat(word));
          var dataTestValue = this.elements.choices[word].getAttribute("data-test");
          var activeButton = _toConsumableArray(document.querySelectorAll("button[data-test='".concat(dataTestValue, "']"))).find(function (btn) {
            return btn.getAttribute("aria-disabled") === "false";
          });
          if (activeButton) {
            activeButton.click();
          }
        }
      }
    }

    /**
     * Submits the challenge
     * @override
     */
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      this.elements.submitButton.click();
    }

    /**
     * Cleans up the challenge
     * @override
     */
  }, {
    key: "cleanup",
    value: function cleanup() {
      var _this$elements;
      this.eventManager.unregisterChallenge(this.challengeId);
      if ((_this$elements = this.elements) !== null && _this$elements !== void 0 && _this$elements.inputField) {
        this.elements.inputField.remove();
        this.elements.inputField = null;
        this.elements.wordBank.style.display = "flex";
      }
    }
  }]);
}(_Challenge_js__WEBPACK_IMPORTED_MODULE_0__.Challenge);

/***/ }),

/***/ "./src/ChallengeTranslate.js":
/*!***********************************!*\
  !*** ./src/ChallengeTranslate.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChallengeTranslate: () => (/* binding */ ChallengeTranslate)
/* harmony export */ });
/* harmony import */ var _Challenge_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Challenge.js */ "./src/Challenge.js");
/* harmony import */ var _ExtensionEventManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ExtensionEventManager.js */ "./src/ExtensionEventManager.js");
/* harmony import */ var _WordBank_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WordBank.js */ "./src/WordBank.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




/**
 * Challenge type: translate
 * @extends Challenge
 */
var ChallengeTranslate = /*#__PURE__*/function (_Challenge) {
  /**
   * Instantiates a new ChallengeTranslate
   * @param {HTMLElement} challengeDiv - Challenge div
   * @param {ExtensionEventManager} eventManager - Event manager
   * @throws {Error} If challengeDiv is not found
   */
  function ChallengeTranslate(challengeDiv, eventManager) {
    var _this;
    _classCallCheck(this, ChallengeTranslate);
    _this = _callSuper(this, ChallengeTranslate, [challengeDiv]);

    // hash a unique id for this challenge
    /** @type {WordBank | null} */
    _defineProperty(_this, "remainingChoices", null);
    _this.challengeId = _this.challengeType + "-" + Date.now();
    _this.eventManager = eventManager;
    _this.elements = _this.extractElements();
    _this.wordBank = new _WordBank_js__WEBPACK_IMPORTED_MODULE_2__.WordBank(_this.challengeDiv.querySelector("div[data-test='word-bank']"));
    _this.remainingChoices = new _WordBank_js__WEBPACK_IMPORTED_MODULE_2__.WordBank(_this.challengeDiv.querySelector("div[data-test='word-bank']"));
    console.debug(_this.elements);
    console.debug(_this.wordBank);
    _this.eventManager.registerChallenge(_this.challengeId, _this);
    return _this;
  }

  /**
   * Extracts challenge-specific elements
   * @override
   * @returns {{question: (string), submitButton: HTMLButtonElement, inputField: HTMLTextAreaElement, wordBank: HTMLElement}} Object containing challenge-specific elements
   */
  _inherits(ChallengeTranslate, _Challenge);
  return _createClass(ChallengeTranslate, [{
    key: "extractElements",
    value: function extractElements() {
      var _this$challengeDiv$qu;
      // noinspection JSValidateTypes
      return {
        question: ((_this$challengeDiv$qu = this.challengeDiv.querySelector("h1[data-test='challenge-header']")) === null || _this$challengeDiv$qu === void 0 ? void 0 : _this$challengeDiv$qu.textContent.trim()) || "",
        submitButton: document.querySelector('button[data-test="player-next"]'),
        inputField: null,
        wordBank: this.challengeDiv.querySelector("div[data-test='word-bank']")
      };
    }

    /**
     * Enforces typing by injecting a textarea element
     * @override
     */
  }, {
    key: "enforceTyping",
    value: function enforceTyping() {
      if (this.wordBank.wordMap.size > 0) {
        console.debug("Enforcing typing for ".concat(this.challengeType));
        this.injectTypingInput();
      }
    }

    /**
     * Injects a textarea element for typing input
     * @override
     * @throws {Error} FIXME If word bank is not found
     */
  }, {
    key: "injectTypingInput",
    value: function injectTypingInput() {
      var _this2 = this;
      if (!this.elements.wordBank || !this.wordBank) return console.error("Word bank not found");
      this.elements.wordBank.style.display = "none";
      this.elements.inputField = document.createElement("textarea");
      this.elements.inputField.dataset.extension = "true";
      this.elements.inputField.dataset.challengeId = this.challengeId;
      this.elements.inputField.setAttribute("autocapitalize", "off");
      this.elements.inputField.setAttribute("autocomplete", "off");
      this.elements.inputField.setAttribute("spellcheck", "false");
      this.elements.inputField.setAttribute("placeholder", "Type here...");
      this.elements.inputField.setAttribute("data-extension", "true");
      this.elements.inputField.style.cssText = "\n\t\t-webkit-text-size-adjust: 100%;\n\t\t--viewport-height: 100dvh;\n\t\t--web-ui_button-border-radius: 16px;\n\t\t--rtl-sign: 1;\n\t\t--text-pageTitle-casing-large: none;\n\t\t--text-pageTitle-letter-spacing-large: 0;\n\t\t--text-pageTitle-line-height-large: 2.75rem;\n\t\t--text-pageTitle-size-large: 2.5rem;\n\t\t--text-pageTitle-weight-large: 700;\n\t\t--text-pageTitle-casing-small: none;\n\t\t--text-pageTitle-letter-spacing-small: 0;\n\t\t--text-pageTitle-line-height-small: 2.25rem;\n\t\t--text-pageTitle-size-small: 2rem;\n\t\t--text-pageTitle-weight-small: 700;\n\t\t--text-heading-casing-large: none;\n\t\t--text-heading-letter-spacing-large: 0;\n\t\t--text-heading-line-height-large: 2rem;\n\t\t--text-heading-size-large: 1.75rem;\n\t\t--text-heading-weight-large: 700;\n\t\t--text-heading-casing-medium: none;\n\t\t--text-heading-letter-spacing-medium: 0;\n\t\t--text-heading-line-height-medium: 2rem;\n\t\t--text-heading-size-medium: 1.5rem;\n\t\t--text-heading-weight-medium: 700;\n\t\t--text-heading-casing-small: none;\n\t\t--text-heading-letter-spacing-small: 0;\n\t\t--text-heading-line-height-small: 1.5rem;\n\t\t--text-heading-size-small: 1.25rem;\n\t\t--text-heading-weight-small: 700;\n\t\t--text-heading-casing-xsmall: none;\n\t\t--text-heading-letter-spacing-xsmall: 0;\n\t\t--text-heading-line-height-xsmall: 1.25rem;\n\t\t--text-heading-size-xsmall: 1rem;\n\t\t--text-heading-weight-xsmall: 700;\n\t\t--text-body-casing: none;\n\t\t--text-body-letter-spacing: 0;\n\t\t--text-body-line-height: 1.75rem;\n\t\t--text-body-size: 1.25rem;\n\t\t--text-body-weight: 500;\n\t\t--text-body-weight-bold: 700;\n\t\t--text-body-casing-spacious: none;\n\t\t--text-body-letter-spacing-spacious: 0;\n\t\t--text-body-line-height-spacious: 2rem;\n\t\t--text-body-size-spacious: 1.25rem;\n\t\t--text-body-weight-spacious: 500;\n\t\t--text-body-weight-spacious-bold: 700;\n\t\t--text-caption-casing: none;\n\t\t--text-caption-letter-spacing: 0;\n\t\t--text-caption-line-height: 1.5rem;\n\t\t--text-caption-size: 1rem;\n\t\t--text-caption-weight: 500;\n\t\t--text-caption-weight-bold: 700;\n\t\t--text-label-casing-large: uppercase;\n\t\t--text-label-letter-spacing-large: 0.04em;\n\t\t--text-label-line-height-large: 1.5rem;\n\t\t--text-label-size-large: 1.5rem;\n\t\t--text-label-weight-large: 700;\n\t\t--text-label-casing-medium: uppercase;\n\t\t--text-label-letter-spacing-medium: 0.04em;\n\t\t--text-label-line-height-medium: 1rem;\n\t\t--text-label-size-medium: 1rem;\n\t\t--text-label-weight-medium: 700;\n\t\t--color-snow: 19, 31, 36;\n\t\t--color-snow-always-light: 255, 255, 255;\n\t\t--color-snow-always-dark: 19, 31, 36;\n\t\t--color-polar: 32, 47, 54;\n\t\t--color-swan: 55, 70, 79;\n\t\t--color-swan-always-light: 229, 229, 229;\n\t\t--color-swan-always-dark: 55, 70, 79;\n\t\t--color-hare: 82, 101, 109;\n\t\t--color-hare-always-light: 175, 175, 175;\n\t\t--color-wolf: 220, 230, 236;\n\t\t--color-eel: 241, 247, 251;\n\t\t--color-squid: 235, 227, 227;\n\t\t--color-walking-fish: 32, 47, 54;\n\t\t--color-flamingo: 148, 81, 81;\n\t\t--color-pig: 245, 164, 164;\n\t\t--color-crab: 255, 120, 120;\n\t\t--color-cardinal: 238, 85, 85;\n\t\t--color-fire-ant: 216, 72, 72;\n\t\t--color-canary: 32, 47, 54;\n\t\t--color-duck: 251, 229, 109;\n\t\t--color-bee: 255, 199, 0;\n\t\t--color-bee-always-dark: 255, 199, 0;\n\t\t--color-lion: 255, 177, 0;\n\t\t--color-fox: 255, 171, 51;\n\t\t--color-cheetah: 32, 47, 54;\n\t\t--color-monkey: 229, 162, 89;\n\t\t--color-camel: 231, 166, 1;\n\t\t--color-guinea-pig: 215, 148, 51;\n\t\t--color-grizzly: 187, 113, 73;\n\t\t--color-sea-sponge: 32, 47, 54;\n\t\t--color-turtle: 95, 132, 40;\n\t\t--color-owl: 147, 211, 51;\n\t\t--color-tree-frog: 121, 185, 51;\n\t\t--color-peacock: 0, 205, 156;\n\t\t--color-iguana: 32, 47, 54;\n\t\t--color-anchovy: 210, 228, 232;\n\t\t--color-beluga: 187, 242, 255;\n\t\t--color-moon-jelly: 122, 240, 242;\n\t\t--color-blue-jay: 63, 133, 167;\n\t\t--color-macaw: 73, 192, 248;\n\t\t--color-whale: 24, 153, 214;\n\t\t--color-humpback: 43, 112, 201;\n\t\t--color-narwhal: 20, 83, 163;\n\t\t--color-manta-ray: 4, 44, 96;\n\t\t--color-starfish: 255, 134, 208;\n\t\t--color-beetle: 206, 130, 255;\n\t\t--color-betta: 144, 105, 205;\n\t\t--color-butterfly: 111, 78, 161;\n\t\t--color-dragon: 204, 52, 141;\n\t\t--color-starling: 92, 108, 252;\n\t\t--color-martin: 71, 85, 223;\n\t\t--color-grackle: 167, 160, 255;\n\t\t--color-honeycreeper: 193, 187, 255;\n\t\t--color-deep-starling: 34, 33, 81;\n\t\t--color-deep-martin: 16, 15, 62;\n\t\t--color-legendary-foreground: 140, 65, 3;\n\t\t--color-stardust: 199, 255, 254;\n\t\t--color-cosmos: 60, 77, 255;\n\t\t--color-nebula: 63, 34, 236;\n\t\t--color-nova: 207, 23, 200;\n\t\t--color-gamma: 38, 246, 99;\n\t\t--color-starlight: 38, 138, 255;\n\t\t--color-quasar: 252, 85, 255;\n\t\t--color-celestia: 255, 255, 255;\n\t\t--color-eclipse: 0, 4, 55;\n\t\t--color-black: 0, 0, 0;\n\t\t--color-aqua: 43, 164, 176;\n\t\t--color-aqua-always-light: 56, 238, 255;\n\t\t--color-ocean: 56, 238, 255;\n\t\t--color-seafoam: 30, 89, 97;\n\t\t--color-ice: 23, 52, 58;\n\t\t--color-max-shadow: 20, 208, 225;\n\t\t--color-black-white: 255, 255, 255;\n\t\t--color-diamond-stat: 86, 219, 226;\n\t\t--color-mask-green: 144, 220, 72;\n\t\t--color-pearl-stat: 255, 170, 222;\n\t\t--color-snow-dark-swan: 55, 70, 79;\n\t\t--color-black-text: 241, 247, 251;\n\t\t--color-blue-space: 11, 62, 113;\n\t\t--color-juicy-blue-space: 10, 74, 130;\n\t\t--color-juicy-blue-space-light: 35, 83, 144;\n\t\t--color-gold: 250, 169, 25;\n\t\t--color-gray-text: 220, 230, 236;\n\t\t--color-orange: 255, 157, 0;\n\t\t--color-diamond-highlight: 231, 251, 251;\n\t\t--color-diamond: 56, 208, 208;\n\t\t--color-banana: 255, 176, 32;\n\t\t--color-cloud: 207, 207, 207;\n\t\t--color-cloud-light: 221, 221, 221;\n\t\t--color-cloud-lightest: 240, 240, 240;\n\t\t--color-kiwi: 122, 199, 12;\n\t\t--color-kiwi-dark: 93, 151, 9;\n\t\t--color-kiwi-light: 142, 224, 0;\n\t\t--color-facebook: 59, 89, 152;\n\t\t--color-facebook-dark: 45, 67, 115;\n\t\t--color-google: 66, 133, 244;\n\t\t--color-twitter: 29, 161, 242;\n\t\t--color-hv-light-peach: 241, 218, 179;\n\t\t--color-hv-peach: 219, 186, 131;\n\t\t--color-hv-light-orange: 255, 177, 64;\n\t\t--color-hv-orange: 204, 121, 0;\n\t\t--color-hv-brown: 140, 90, 17;\n\t\t--color-streak-panel-extended-background: 205, 121, 0;\n\t\t--color-streak-panel-friend-background: 255, 95, 0;\n\t\t--color-streak-panel-frozen-background: 43, 112, 201;\n\t\t--color-streak-panel-frozen-flair-background: 73, 192, 248;\n\t\t--color-streak-panel-frozen-subtitle: 255, 255, 255;\n\t\t--color-streak-panel-frozen-text: 255, 255, 255;\n\t\t--color-streak-panel-frozen-topbar-text: 255, 255, 255;\n\t\t--color-streak-panel-streak-society-background: 215, 148, 51;\n\t\t--color-streak-panel-streak-society-background-always-dark: 215, 148, 51;\n\t\t--color-streak-panel-streak-society-text: 255, 255, 255;\n\t\t--color-streak-panel-unextended-heading-text: 82, 101, 109;\n\t\t--color-streak-panel-unextended-heading-background: 32, 47, 54;\n\t\t--color-streak-panel-unextended-topbar-text: 255, 255, 255;\n\t\t--color-streak-panel-milestone-gradient-start: 255, 147, 58;\n\t\t--color-streak-panel-milestone-gradient-end: 255, 200, 0;\n\t\t--color-streak-society-dark-orange: 255, 151, 1;\n\t\t--color-streak-society-light-orange: 255, 179, 1;\n\t\t--color-friends-quest-own-incomplete: 111, 139, 157;\n\t\t--color-friends-quest-friend-incomplete: 79, 100, 113;\n\t\t--color-black-text-always-light: 60, 60, 60;\n\t\t--color-cardinal-always-light: 255, 75, 75;\n\t\t--color-cowbird: 174, 104, 2;\n\t\t--color-eel-always-light: 75, 75, 75;\n\t\t--color-fox-always-light: 255, 150, 0;\n\t\t--color-fire-ant-always-light: 234, 43, 43;\n\t\t--color-grizzly-lite: 220, 143, 71;\n\t\t--color-guinea-pig-always-light: 205, 121, 0;\n\t\t--color-iguana-always-light: 221, 244, 255;\n\t\t--color-macaw-always-light: 28, 176, 246;\n\t\t--color-owl-always-light: 88, 204, 2;\n\t\t--color-polar-always-light: 247, 247, 247;\n\t\t--color-sea-sponge-always-light: 215, 255, 184;\n\t\t--color-tree-frog-always-light: 88, 167, 0;\n\t\t--color-turtle-always-light: 165, 237, 110;\n\t\t--color-walking-fish-always-light: 255, 223, 224;\n\t\t--color-wolf-always-light: 119, 119, 119;\n\t\t--color-cardinal-always-dark: 238, 85, 85;\n\t\t--color-eel-always-dark: 241, 247, 251;\n\t\t--color-hare-always-dark: 82, 101, 109;\n\t\t--color-macaw-always-dark: 73, 192, 248;\n\t\t--color-owl-always-dark: 147, 211, 51;\n\t\t--color-polar-always-dark: 32, 47, 54;\n\t\t--color-wolf-always-dark: 220, 230, 236;\n\t\t--color-rookie: 0, 175, 133;\n\t\t--color-explorer: 255, 100, 191;\n\t\t--color-traveler: 255, 145, 83;\n\t\t--color-trailblazer: 154, 143, 232;\n\t\t--color-adventurer: 96, 12, 199;\n\t\t--color-discoverer: 111, 44, 57;\n\t\t--color-daredevil: 46, 83, 138;\n\t\t--color-navigator: 9, 47, 119;\n\t\t--color-champion: 255, 110, 53;\n\t\t--color-daily_refresh: 0, 148, 255;\n\t\t--color-dark-mode-locked-path-section-text-color: 82, 101, 109;\n\t\t--color-rookie-progress-bar: 0, 198, 150;\n\t\t--color-explorer-progress-bar: 255, 138, 207;\n\t\t--color-traveler-progress-bar: 255, 167, 106;\n\t\t--color-trailblazer-progress-bar: 169, 157, 254;\n\t\t--color-adventurer-progress-bar: 122, 13, 199;\n\t\t--color-discoverer-progress-bar: 131, 50, 65;\n\t\t--color-daredevil-progress-bar: 54, 98, 165;\n\t\t--color-navigator-progress-bar: 12, 57, 141;\n\t\t--color-champion-progress-bar: 255, 129, 80;\n\t\t--color-daily_refresh-progress-bar: 28, 160, 255;\n\t\t--color-course-complete-cta: 120, 219, 224;\n\t\t--color-course-complete-cta-border: 94, 201, 204;\n\t\t--color-bea-secondary: 24, 153, 214;\n\t\t--color-eddy-secondary: 234, 43, 43;\n\t\t--color-gilded-secondary: 231, 166, 1;\n\t\t--color-lily-secondary: 165, 104, 204;\n\t\t--color-vikram-secondary: 163, 42, 113;\n\t\t--color-zari-secondary: 204, 107, 166;\n\t\t--color-oscar-secondary: 0, 164, 125;\n\t\t--color-falstaff-secondary: 150, 90, 58;\n\t\t--color-bea-radio: 20, 123, 172;\n\t\t--color-duo-radio: 62, 143, 1;\n\t\t--color-eddy-radio: 179, 53, 53;\n\t\t--color-falstaff-radio: 131, 79, 51;\n\t\t--color-lin-lucy-radio: 179, 105, 0;\n\t\t--color-lily-radio: 144, 91, 179;\n\t\t--color-vikram-radio: 143, 36, 99;\n\t\t--color-zari-radio: 179, 94, 146;\n\t\t--color-oscar-radio: 0, 144, 109;\n\t\t--color-bea-junior-shine: 67, 190, 248;\n\t\t--color-duo-shine: 114, 214, 39;\n\t\t--color-eddy-shine: 255, 105, 105;\n\t\t--color-falstaff-shine: 227, 165, 108;\n\t\t--color-lily-shine: 214, 150, 255;\n\t\t--color-lin-lucy-shine: 255, 168, 44;\n\t\t--color-oscar-shine: 63, 217, 181;\n\t\t--color-vikram-shine: 214, 90, 162;\n\t\t--color-zari-shine: 255, 158, 217;\n\t\t--color-super-background-secondary: 26, 30, 76;\n\t\t--color-super-gradient-background: 12, 47, 113;\n\t\t--color-super-gradient-top-halo: 12, 76, 70;\n\t\t--color-super-gradient-bottom-halo: 76, 29, 115;\n\t\t--color-gold-shine: 255, 231, 0;\n\t\t--color-legendary-dark-background: 24, 24, 24;\n\t\t--color-roseate: 223, 75, 162;\n\t\t--color-rosefinch: 180, 28, 117;\n\t\t--color-bluebird: 3, 144, 211;\n\t\t--color-cotinga: 121, 58, 227;\n\t\t--color-sabrewing: 165, 112, 255;\n\t\t--color-blueberry: 17, 82, 167;\n\t\t--color-ether: 60, 89, 141;\n\t\t--color-diamond-tournament-purple: 161, 161, 238;\n\t\t--color-diamond-tournament-reaction: 118, 163, 231;\n\t\t--color-yir-page0: 221, 244, 255;\n\t\t--color-yir-page1: 227, 255, 235;\n\t\t--color-yir-page1-shadow: 19, 31, 36;\n\t\t--color-yir-page3-shadow: 187, 172, 252;\n\t\t--color-yir-page4-shadow: 143, 219, 255;\n\t\t--color-yir-page5-shadow: 255, 183, 80;\n\t\t--color-super-gradient-green-variant1: 38, 255, 85;\n\t\t--color-super-gradient-blue-variant1: 38, 139, 255;\n\t\t--color-super-gradient-pink-variant1: 252, 85, 255;\n\t\t--color-super-gradient-purple-variant1: 17, 34, 181;\n\t\t--color-unknown-001e2d: 0, 30, 45;\n\t\t--color-unknown-0047a4: 0, 71, 164;\n\t\t--color-unknown-0087d0: 0, 135, 208;\n\t\t--color-unknown-00aff9: 0, 175, 249;\n\t\t--color-unknown-013047: 1, 48, 71;\n\t\t--color-unknown-048fd1: 4, 143, 209;\n\t\t--color-unknown-0e0f10: 14, 15, 16;\n\t\t--color-unknown-0e3d79: 14, 61, 121;\n\t\t--color-unknown-172071: 23, 32, 113;\n\t\t--color-unknown-280378: 40, 3, 120;\n\t\t--color-unknown-3ebbf6: 62, 187, 246;\n\t\t--color-unknown-655ebb: 101, 94, 187;\n\t\t--color-unknown-696cee: 105, 108, 238;\n\t\t--color-unknown-7c0000: 124, 0, 0;\n\t\t--color-unknown-89e219: 137, 226, 25;\n\t\t--color-unknown-935051: 147, 80, 81;\n\t\t--color-unknown-959595: 149, 149, 149;\n\t\t--color-unknown-a2a2a2: 162, 162, 162;\n\t\t--color-unknown-a3dbeb: 163, 219, 235;\n\t\t--color-unknown-a4dffb: 164, 223, 251;\n\t\t--color-unknown-aaa: 170, 170, 170;\n\t\t--color-unknown-d087ff: 208, 135, 255;\n\t\t--color-unknown-d9d9d9: 217, 217, 217;\n\t\t--color-unknown-ddd: 221, 221, 221;\n\t\t--color-unknown-de8029: 222, 128, 41;\n\t\t--color-unknown-e3e3e3: 227, 227, 227;\n\t\t--color-unknown-e4ffff: 228, 255, 255;\n\t\t--color-unknown-ed8c01: 237, 140, 1;\n\t\t--color-unknown-f3484e: 243, 72, 78;\n\t\t--color-unknown-f4fafe: 244, 250, 254;\n\t\t--color-unknown-fbdec5: 251, 222, 197;\n\t\t--color-unknown-ffc700: 255, 199, 0;\n\t\t--color-unknown-fff2aa: 255, 242, 170;\n\t\t--color-unknown-fffbef: 255, 251, 239;\n\t\t--app-offset: 0px;\n\t\t-webkit-font-smoothing: antialiased;\n\t\tdirection: ltr;\n\t\t-webkit-locale: \"es\";\n\t\tfont-size: 100%;\n\t\tmargin: 0;\n\t\toverflow: auto;\n\t\t-webkit-tap-highlight-color: transparent;\n\t\tbox-sizing: inherit;\n\t\tfont-family: din-round,sans-serif;\n\t\toutline: none;\n\t\tuser-select: auto;\n\t\tbackground: rgb(var(--color-snow));\n\t\tborder: 2px solid rgb(var(--color-swan));\n\t\tcolor: rgb(var(--color-black-text));\n\t\ttext-align: initial;\n\t\tline-height: 24px;\n\t\tbackground-color: rgb(var(--color-polar));\n\t\tborder-color: rgb(var(--color-swan));\n\t\tborder-radius: 10px;\n\t\tpadding: 10px 12px;\n\t\tappearance: none;\n\t\twidth: 100%;\n\t\tflex-grow: 1;\n\t\tresize: none;\n\t\t";
      this.elements.wordBank.parentNode.insertBefore(this.elements.inputField, this.elements.wordBank);
      this.elements.inputField.addEventListener('input', function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      });
      this.elements.inputField.addEventListener('keydown', function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Handle special keys through our system
        if ([' ', 'Backspace', 'Enter'].includes(e.key)) {
          e.preventDefault();
          _this2.handleKeyEvent(e);
        }
      });
      this.elements.inputField.addEventListener("blur", function () {
        return setTimeout(function () {
          return _this2.elements.inputField.focus();
        }, 50);
      });
      this.elements.inputField.focus();
    }

    /**
     * Handles key events
     * @param {KeyboardEvent} event - Keyboard event
     * TODO Maybe Override
     */
  }, {
    key: "handleKeyEvent",
    value: function handleKeyEvent(event) {
      var key = event.key;
      if (key === " ") {
        this.handleSpace();
      } else if (key === "Backspace") {
        this.handleBackspace();
      } else if (key === "Enter") {
        var userInput = this.elements.inputField.value.trim().split(" ").pop().toLowerCase();
        if (this.remainingChoices.wordMap.has(userInput) && this.remainingChoices.wordMap.get(userInput).length > 0) {
          console.debug("Selected ".concat(userInput));
          this.remainingChoices.selectWord(userInput).click();
        }
        this.handleSubmit();
      }
    }

    /**
     * Handles space key event
     */
  }, {
    key: "handleSpace",
    value: function handleSpace() {
      var _this3 = this;
      var userInput = this.elements.inputField.value.trim().split(" ").pop().toLowerCase();
      if (!userInput) return;
      if (this.remainingChoices.wordMap.has(userInput) && this.remainingChoices.wordMap.get(userInput).length > 0) {
        console.debug("Selected ".concat(userInput));
        this.remainingChoices.selectWord(userInput).click();
        this.elements.inputField.value += " ";
      } else {
        console.warn("Word ".concat(userInput, " not found in choices ").concat(Array.from(this.remainingChoices.wordMap.keys())));
        this.elements.inputField.style.border = "2px solid red";
        this.elements.inputField.style.animation = "shake 0.3s";
        setTimeout(function () {
          _this3.elements.inputField.style.border = "2px solid rgb(var(--color-swan))";
          _this3.elements.inputField.style.animation = "";
        }, 300);
      }
    }

    /**
     * Handles backspace key event
     */
  }, {
    key: "handleBackspace",
    value: function handleBackspace() {
      var inputField = this.elements.inputField;
      var text = inputField.value;
      if (text.length === 0) {
        return;
      }
      inputField.value = text.slice(0, -1);
      var words = inputField.value.trim().split(/\s+/);
      if (text.endsWith(" ") && words.length > 0) {
        words.pop();
      }
      var removedWord = null;
      var _iterator = _createForOfIteratorHelper(this.wordBank.wordMap.keys()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var word = _step.value;
          if (!words.includes(word) && this.remainingChoices.wordMap.get(word).length !== this.wordBank.wordMap.get(word).length) {
            removedWord = word;
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (removedWord) {
        console.debug("Re-enabling ".concat(removedWord));
        var returnedButton = this.remainingChoices.returnLastUsed(removedWord);
        // Click the only enabled button to make the word available again
        var dataTestValue = returnedButton.getAttribute("data-test");
        var activeButton = _toConsumableArray(document.querySelectorAll("button[data-test='".concat(dataTestValue, "']"))).find(function (btn) {
          return btn.getAttribute("aria-disabled") === "false";
        });
        if (activeButton) {
          activeButton.click();
        }
      }
    }

    /**
     * Submits the challenge
     * @override
     */
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      this.elements.submitButton.click();
    }

    /**
     * Cleans up the challenge
     * @override
     */
  }, {
    key: "cleanup",
    value: function cleanup() {
      var _this$elements;
      this.eventManager.unregisterChallenge(this.challengeId);
      if ((_this$elements = this.elements) !== null && _this$elements !== void 0 && _this$elements.inputField) {
        this.elements.inputField.remove();
        this.elements.inputField = null;
        this.elements.wordBank.style.display = "flex";
      }
    }
  }]);
}(_Challenge_js__WEBPACK_IMPORTED_MODULE_0__.Challenge);

/***/ }),

/***/ "./src/ExtensionEventManager.js":
/*!**************************************!*\
  !*** ./src/ExtensionEventManager.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExtensionEventManager: () => (/* binding */ ExtensionEventManager)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ExtensionEventManager = /*#__PURE__*/function () {
  function ExtensionEventManager() {
    _classCallCheck(this, ExtensionEventManager);
    this.activeChallenges = new Map();
  }
  return _createClass(ExtensionEventManager, [{
    key: "initGlobalKeyCapture",
    value: function initGlobalKeyCapture() {
      var _this = this;
      document.addEventListener("keydown", function (event) {
        var textarea = event.target.closest("textarea[data-extension='true']");
        if (!textarea) {
          return;
        }
        event.stopPropagation();
        event.stopImmediatePropagation();
        if ([' ', 'Backspace', 'Enter'].includes(event.key)) {
          event.preventDefault();
          var challengeId = textarea.dataset.challengeId;
          var challenge = _this.activeChallenges.get(challengeId);
          challenge === null || challenge === void 0 || challenge.handleKeyEvent(event);
        }
      }, true);
      document.addEventListener('keypress', function (e) {
        if (e.target.closest("textarea[data-extension='true']")) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }, true);
      document.addEventListener('input', function (e) {
        if (e.target.closest("textarea[data-extension='true']")) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }, true);
    }
  }, {
    key: "registerChallenge",
    value: function registerChallenge(challengeId, challengeInstance) {
      this.activeChallenges.set(challengeId, challengeInstance);
    }
  }, {
    key: "unregisterChallenge",
    value: function unregisterChallenge(challengeId) {
      this.activeChallenges["delete"](challengeId);
    }
  }]);
}();

/***/ }),

/***/ "./src/WordBank.js":
/*!*************************!*\
  !*** ./src/WordBank.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WordBank: () => (/* binding */ WordBank)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var WordBank = /*#__PURE__*/function () {
  function WordBank(wordBankDiv) {
    _classCallCheck(this, WordBank);
    if (!wordBankDiv) {
      throw new Error("Word bank div not found");
    }

    /** @type {HTMLElement} */
    this.wordBankDiv = wordBankDiv;
    // Map of available word buttons: word → array of buttons
    this.wordMap = this.extractWords();
    // Map to track used word buttons: word → array of buttons (LIFO order)
    this.usedWordButtons = new Map();
  }

  /**
   * Extracts word choices from the word bank container.
   * @returns {Map<string, HTMLButtonElement[]>} A map where the key is the lowercase word,
   * and the value is an array of matching button elements.
   */
  return _createClass(WordBank, [{
    key: "extractWords",
    value: function extractWords() {
      var wordButtons = _toConsumableArray(this.wordBankDiv.querySelectorAll("button[data-test*='challenge-tap-token']"));
      return wordButtons.reduce(function (map, btn) {
        var word = btn.querySelector("[data-test='challenge-tap-token-text']").textContent.trim().toLowerCase();
        if (!map.has(word)) {
          map.set(word, []);
        }
        map.get(word).push(btn);
        return map;
      }, new Map());
    }

    /**
     * Selects the last available occurrence of a word.
     * This method uses a LIFO (stack) pattern to track usage so that the last-used
     * button for that word can later be returned (e.g., when a user backspaces).
     *
     * @param {string} word - The word to select.
     * @returns {HTMLButtonElement|null} The button element for the selected word, or null if unavailable.
     */
  }, {
    key: "selectWord",
    value: function selectWord(word) {
      if (this.wordMap.has(word) && this.wordMap.get(word).length > 0) {
        // Remove the last available button instance.
        var btn = this.wordMap.get(word).pop();
        // Record this button as the most-recently used.
        if (!this.usedWordButtons.has(word)) {
          this.usedWordButtons.set(word, []);
        }
        this.usedWordButtons.get(word).push(btn);
        return btn;
      }
      return null;
    }

    /**
     * Returns the last used occurrence of a word back to the available pool.
     * This method ensures that if a word has been used multiple times,
     * the instance returned is the one that was selected last.
     *
     * @param {string} word - The word to return.
     * @returns {HTMLButtonElement|null} The returned button element, or null if none are recorded.
     */
  }, {
    key: "returnLastUsed",
    value: function returnLastUsed(word) {
      if (this.usedWordButtons.has(word) && this.usedWordButtons.get(word).length > 0) {
        // Pop the most-recently used button and return it to the available pool.
        var btn = this.usedWordButtons.get(word).pop();
        this.wordMap.get(word).push(btn);
        return btn;
      }
      return null;
    }

    /**
     * Returns a word button back to the available pool.
     * This generic method can be used if the button to return is known.
     *
     * @param {string} word - The word associated with the button.
     * @param {HTMLButtonElement} wordButton - The button element to return.
     */
  }, {
    key: "returnWord",
    value: function returnWord(word, wordButton) {
      if (this.wordMap.has(word)) {
        this.wordMap.get(word).push(wordButton);
      } else {
        this.wordMap.set(word, [wordButton]);
      }
    }
  }]);
}();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/content.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ChallengeFactory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ChallengeFactory.js */ "./src/ChallengeFactory.js");
/* harmony import */ var _ChallengeTranslate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ChallengeTranslate.js */ "./src/ChallengeTranslate.js");
/* harmony import */ var _ChallengeTapComplete_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ChallengeTapComplete.js */ "./src/ChallengeTapComplete.js");
/* harmony import */ var _ExtensionEventManager_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ExtensionEventManager.js */ "./src/ExtensionEventManager.js");




var eventManager = new _ExtensionEventManager_js__WEBPACK_IMPORTED_MODULE_3__.ExtensionEventManager();
eventManager.initGlobalKeyCapture();
_ChallengeFactory_js__WEBPACK_IMPORTED_MODULE_0__.ChallengeFactory.register("translate", _ChallengeTranslate_js__WEBPACK_IMPORTED_MODULE_1__.ChallengeTranslate);
_ChallengeFactory_js__WEBPACK_IMPORTED_MODULE_0__.ChallengeFactory.register("tapComplete", _ChallengeTapComplete_js__WEBPACK_IMPORTED_MODULE_2__.ChallengeTapComplete);
var activeChallenge = null;
function enforceTyping() {
  var challengeDiv = document.querySelector("div[data-test^='challenge challenge-']");
  if (activeChallenge && (!challengeDiv || challengeDiv !== activeChallenge.challengeDiv)) {
    var _activeChallenge$clea, _activeChallenge;
    (_activeChallenge$clea = (_activeChallenge = activeChallenge).cleanup) === null || _activeChallenge$clea === void 0 || _activeChallenge$clea.call(_activeChallenge);
    activeChallenge = null;
  }
  if (!challengeDiv || challengeDiv.hasAttribute("data-extension-processed")) {
    return;
  }
  var challengeType = challengeDiv.getAttribute("data-test").replace("challenge challenge-", "");
  if (["listenTap", "completeReverseTranslation"].includes(challengeType)) {
    return;
  }
  console.debug(challengeType);
  try {
    challengeDiv.setAttribute("data-extension-processed", "true");
    activeChallenge = _ChallengeFactory_js__WEBPACK_IMPORTED_MODULE_0__.ChallengeFactory.create(challengeType, challengeDiv, eventManager);
    console.debug("Creating challenge ".concat(challengeType));
    activeChallenge.enforceTyping();
  } catch (error) {
    console.error(error.message);
  }
}
var observer = new MutationObserver(enforceTyping);
observer.observe(document.body, {
  childList: true,
  subtree: true
});
enforceTyping();
})();

/******/ })()
;
//# sourceMappingURL=content.bundle.js.map