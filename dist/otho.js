(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Otho = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _watcher = require('./watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _isArray = require('../utils/is-array');

var _isArray2 = _interopRequireDefault(_isArray);

var _isFunction = require('../utils/is-function');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isNodeList = require('../utils/is-node-list');

var _isNodeList2 = _interopRequireDefault(_isNodeList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * Responsible for initialising the watchers, passing
 * through the configuration and ensuring user defined
 * callbacks are executed when necessary.
 */
var Handler = function () {

    /**
     * @function
     * Initialising the configuration for the handler.
     * @param {Object} - amalgamation of default and user defined options.
     */
    function Handler(_ref) {
        var els = _ref.els,
            error = _ref.error,
            placehold = _ref.placehold,
            forcePlacehold = _ref.forcePlacehold,
            imageLoaded = _ref.imageLoaded,
            imageLoading = _ref.imageLoading,
            success = _ref.success,
            fail = _ref.fail,
            progress = _ref.progress,
            loaded = _ref.loaded;

        _classCallCheck(this, Handler);

        this.els = this.getElements(els);

        // Image src for placehold or if error occurs.
        this.error = error;
        this.placehold = placehold;

        this.forcePlacehold = forcePlacehold;

        // Classes to add to the image / holder.
        this.imageLoaded = imageLoaded;
        this.imageLoading = imageLoading;

        this.watchers = [];

        // Callback functions.
        this.fail = fail || function () {};
        this.loaded = loaded || function () {};
        this.success = success || function () {};
        this.progress = progress || function () {};
    }

    /**
     * @function
     * Ensures different types of elements are outputted as an array.
     * @param {Array|Function|Object} els - Elements that are either holders or elements.
     * @returns {Array} - An array of images / holders.
     */


    _createClass(Handler, [{
        key: 'getElements',
        value: function getElements(els) {

            if ((0, _isArray2.default)(els)) {

                return els;
            } else if ((0, _isFunction2.default)(els)) {

                return els.call(this);
            } else if ((0, _isNodeList2.default)(els)) {

                return Array.prototype.slice.call(els, 0);
            } else {

                return [els];
            }
        }

        /**
         * @function
         * Initialises the watchers with default configuration,
         * note this can be overidden by "data-o" attributes on
         * the watcher's element.
         * @returns {Object::Handler} Handler - Instance of the handler 
         */

    }, {
        key: 'init',
        value: function init() {

            var self = this;

            for (var i = 0; i < self.els.length; i++) {

                var watcher = new _watcher2.default({
                    el: self.els[i],
                    error: self.error,
                    placehold: self.placehold,
                    imageLoaded: self.imageLoaded,
                    imageLoading: self.imageLoading,
                    loaded: self._imageLoaded.bind(self),
                    failed: self._imageFailed.bind(self),
                    success: self._imagesSuccess.bind(self)
                });

                self.watchers.push(watcher);
            }

            return self;
        }

        /**
         * @function 
         * Called when an image has been loaded, computes the
         * progress of the watchers as well as firing other
         * callbacks.
         * @params {Object::Watcher} watcher - The object that listens to the image status.
         */

    }, {
        key: '_imageLoaded',
        value: function _imageLoaded(watcher) {

            var self = this;
            var toLoad = self.watchers.length;
            var haveLoaded = self.watchers.filter(function (watcher) {
                return watcher.hasLoaded;
            }).length;

            self.loaded(watcher);

            self.progress(watcher, {
                total: toLoad,
                loaded: haveLoaded,
                percent: Math.round(haveLoaded / toLoad * 100)
            });

            if (toLoad === haveLoaded) {

                self._imagesSuccess();
            }
        }

        /**
         * @function
         * Called when an image has failed to load, and fires
         * a callback.
         * @params {Object::Watcher} watcher - The object that listens to the image status.
         */

    }, {
        key: '_imageFailed',
        value: function _imageFailed(watcher) {

            var self = this;

            self.fail(watcher);
        }

        /**
         * @function
         * Called when all of the images have been loaded, and fires
         * a callback.
         * @params {Object::Watcher} watcher - The object that listens to the image status.
         */

    }, {
        key: '_imagesSuccess',
        value: function _imagesSuccess() {

            var self = this;

            self.success(self.watchers);
        }
    }]);

    return Handler;
}();

exports.default = Handler;

},{"../utils/is-array":6,"../utils/is-function":7,"../utils/is-node-list":8,"./watcher":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleManipulation = require('../utils/style-manipulation');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * Watches the status of the image load, manipulating the
 * associated element and firing callbacks depending on the
 * image's status.
 */
var Watcher = function () {

    /**
     * @function
     * Initialising the configuration for the watcher.
     * @param {Object} - Defined options.
     */
    function Watcher(_ref) {
        var el = _ref.el,
            error = _ref.error,
            placehold = _ref.placehold,
            loaded = _ref.loaded,
            failed = _ref.failed,
            imageLoaded = _ref.imageLoaded,
            imageLoading = _ref.imageLoading;

        _classCallCheck(this, Watcher);

        this.el = el;

        this.error = this.el.getAttribute('data-o-error') || error;
        this.placehold = this.el.getAttribute('data-o-placehold') || placehold;
        this.imageLoaded = this.el.getAttribute('data-o-loaded') || imageLoaded;
        this.imageLoading = this.el.getAttribute('data-o-loading') || imageLoading;

        this.loaded = loaded;
        this.failed = failed;

        this.toLoad = this.el.src;
        this.hasLoaded = false;
        this.init();
    }

    /**
     * @function
     * Indicate that the image is loading, swap out the image's
     * src for the specified placeholder src and defer loading of 
     * the image to an Image object.  
     */


    _createClass(Watcher, [{
        key: 'init',
        value: function init() {

            (0, _styleManipulation.addClass)(this.el, this.imageLoading);

            this.el.src = this.placehold;

            this.pseudo = new Image();
            this.pseudo.onload = this._loaded.bind(this);
            this.pseudo.onerror = this._error.bind(this);
            this.pseudo.src = this.toLoad;
        }

        /**
         * @function
         * The image has loaded succesfully, swap out the image's 
         * placeholder src for the loaded src. Also, fire associated
         * callback. 
         */

    }, {
        key: '_loaded',
        value: function _loaded() {

            (0, _styleManipulation.removeClass)(this.el, this.imageLoading);
            (0, _styleManipulation.addClass)(this.el, this.imageLoaded);

            this.el.src = this.pseudo.src;

            this.hasLoaded = true;

            this.loaded(this);
        }

        /**
         * @function
         * The image has loaded unsuccesfully, swap out the image's 
         * placeholder src for the error src. Also, fire associated
         * callback. 
         */

    }, {
        key: '_error',
        value: function _error() {

            (0, _styleManipulation.removeClass)(this.el, this.imageLoading);

            this.el.src = this.error;

            this.failed(this);
        }
    }]);

    return Watcher;
}();

exports.default = Watcher;

},{"../utils/style-manipulation":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @object
 * Default options for the handler.
 */
exports.default = {
    els: document.getElementsByTagName('img'),
    error: '',
    placehold: '',
    forcePlacehold: false,
    imageLoaded: 'o-image-loaded',
    imageLoading: 'o-image-loading'
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.load = load;

var _handler = require('./components/handler');

var _handler2 = _interopRequireDefault(_handler);

var _options = require('./config/options');

var _options2 = _interopRequireDefault(_options);

var _extend = require('./utils/extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function load(userOptions) {

    var options = (0, _extend2.default)(_options2.default, userOptions);

    return new _handler2.default(options).init();
};

},{"./components/handler":1,"./config/options":3,"./utils/extend":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = extend;
/**
 * @function
 * See https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/ for full description.
 * @param {Object} arguments - List of objects that need to be extended.
 * @returns {Object} - Extended object
 */
function extend() {

    var extended = {},
        deep = false,
        i = 0,
        length = arguments.length;

    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {

        deep = arguments[0];
        i++;
    }

    var merge = function merge(obj) {

        for (var prop in obj) {

            if (Object.prototype.hasOwnProperty.call(obj, prop)) {

                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {

                    extended[prop] = _helper.extend(true, extended[prop], obj[prop]);
                } else {

                    extended[prop] = obj[prop];
                }
            }
        }
    };

    for (; i < length; i++) {
        merge(arguments[i]);
    }return extended;
}

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isArray;
/**
 * @function
 * Determines whether the supplied element is an array.
 * @param el - The element to check.
 * @returns {Boolean} - Whether the element is an array
 */
function isArray(el) {
  return Object.prototype.toString.call(el) === '[object Array]';
}

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFunction;
/**
 * @function
 * Determines whether the supplied element is an array.
 * @param el - The element to check.
 * @returns {Boolean} - Whether the element is an array
 */
function isFunction(el) {
  return !!(el && el.constructor && el.call && el.apply);
}

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = isNodeList;
/**
 * @function
 * Determines whether the supplied element is a node list.
 * See http://stackoverflow.com/questions/7238177/how-to-detect-htmlcollection-nodelist-in-javascript for a detailed description.
 * @param nodes - The nodes to check.
 * @returns {Boolean} - Whether the element is a node list
 */
function isNodeList(nodes) {

    var stringRepr = Object.prototype.toString.call(nodes);

    return (typeof nodes === 'undefined' ? 'undefined' : _typeof(nodes)) === 'object' && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) && typeof nodes.length === 'number' && (nodes.length === 0 || _typeof(nodes[0]) === "object" && nodes[0].nodeType > 0);
}

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addClass = addClass;
exports.removeClass = removeClass;
/**
 * @function
 * Add class(es) to an element.
 * Note: Could probably use rest params for this...
 * @param el - The element to add the class(es) to.
 * @param arguments - List of classes to add to the element.
 */
function addClass(el /* , classes to add */) {

    var toAdd = Array.prototype.slice.call(arguments, 1);
    var classes = el.className.split(' ');

    if (toAdd.length === 0) {
        throw new Error("You need to provide at least one class");
    }

    el.className = classes.concat(toAdd).join(' ').trim();
}

/**
 * @function
 * Remove class(es) from an element.
 * Note: Could probably use rest params for this...
 * @param el - The element to remove the class(es) from.
 * @param arguments - List of classes to remove from the element.
 */
function removeClass(el /*, classes to remove */) {

    var toRemove = Array.prototype.slice.call(arguments, 1);

    if (toRemove.length === 0) {
        throw new Error("You need to provide at least one class");
    }

    el.className = el.className.split(' ').filter(function (className) {
        return toRemove.indexOf(className) === -1;
    }).join(' ').trim();
}

},{}]},{},[4])(4)
});