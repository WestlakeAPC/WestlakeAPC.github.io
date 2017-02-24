define(["require", "exports", "./lib/util", "jquery"], function (require, exports, util_1, $) {
    "use strict";
    exports.__esModule = true;
    console.log("Hello, console-goers!");
    console.log(util_1.greeting.something);
    var allElements = $("*");
    console.log(allElements.jquery);
});
