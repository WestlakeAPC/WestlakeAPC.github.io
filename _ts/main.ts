import {greeting} from "./lib/util"
import * as $ from "jquery"

console.log("Hello, console-goers!");

console.log(greeting.something);

const allElements: JQuery = $("*");
console.log(allElements.jquery);
