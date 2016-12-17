/**
 * Created by ethertyper on 10/18/16.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    var greeting = (function () {
        function greeting() {
        }
        return greeting;
    }());
    greeting.something = "Steven is awesome and helps me do gulp!";
    exports.greeting = greeting;
});
