/**
 * Created by ethertyper on 10/18/16.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var greeting = (function () {
        function greeting() {
        }
        greeting.something = "Steven is awesome and helps me do gulp!";
        return greeting;
    }());
    exports.greeting = greeting;
    (function subscribe() {
        var channels = ["AnimatorJoe", "Eli Bradley"];
        /* Fancy robo-magic */
        channels.forEach(function (channel) { return console.log("Now autosubscribed to " + channel + "'s channel."); });
        console.log("JK but totally subscribe to them.");
    })();
});
