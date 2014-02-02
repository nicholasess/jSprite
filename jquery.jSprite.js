;(function($, undefined) {
    'use strict';

    var ver = '1.1.0';

    $.fn.jSprite = {};

    var debug = function (s) {
        if ($.fn.jSprite.debug) {
            log(s);
        }
    };

    var log = function () {

    };

    var pause = function () {

    };
    $.fn.jSprite.pause = pause;

    var stop = function () {

    };
    $.fn.jSprite.stop = stop;

    var goTo = function () {

    };
    $.fn.jSprite.goTo = goTo;

    var getSize = function (options) {
        var image = new Image();
        image.src = $(options.element).css('backgroundImage').replace(/url\((['"])?(.*?)\1\)/gi, '$2');

        return {
            width: image.width/options.columns,
            height: image.height/options.lines
        };
    };

    var animation = function (sprite, settings, callback) {
        var element                 = settings.element,
            timeTransition          = settings.timeTransition,
            timeReload              = settings.timeReload,
            spriteBgWidth           = settings.width,
            spriteBgHeight          = settings.height,
            spriteBgLine            = settings.columns,
            spriteBgTotal           = settings.total,
            line                    = 0;

        clearTimeout(sprite.transitionTimeout);
        clearTimeout(sprite.reloadTimeout);

        if (element.length && element.is(':visible')) {
            if (sprite.position < (spriteBgTotal - 1)) {
                sprite.position++;

                line = (sprite.position % spriteBgLine) / 100;

                sprite.left = sprite.left + spriteBgWidth;

                if (line === 0) {
                   sprite.top = sprite.top + spriteBgHeight;
                   sprite.left = 0;
                }

                element.css({'background-position': '-' + sprite.left + 'px -' + sprite.top + 'px'});

                sprite.transitionTimeout = setTimeout(function() {
                    animation(sprite, settings, callback);
                }, timeTransition);
            } else {
                if (timeReload) {
                    sprite.reloadTimeout = setTimeout(function() {
                        sprite.position = 0;
                        sprite.top = 0;
                        sprite.left = 0;

                        element.css({'background-position': '0 0'});

                        animation(sprite, settings, callback);
                    }, timeReload * 1000);
                }
            }
        }
    };

    var play = function (options, callback) {
        var defaults = {
            getSize         : false,
            columns         : 3,
            lines           : 1,
            total           : 3,
            width           : 200,
            height          : 200,
            timeTransition  : 50, //milsec
            timeReload      : 3 //seconds
        },
        sprite = {
            top                 : 0,
            left                : 0,
            position            : 0,
            reloadTimeout       : 0,
            transitionTimeout   : 0
        },
        // Merge defaults and options, without modifying defaults
        settings = $.extend( {}, defaults, options );

        if (options.getSize) {
            settings = $.extend({}, settings, getSize(settings));
        }

        animation(sprite, settings, callback);
    };

    $.fn.jSprite = function (options) {
        play($.extend({}, options, { element: this }));

        return this;
    };
}(jQuery));