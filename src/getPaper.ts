var paper = require("paper");

if (typeof window !== "undefined" && typeof window.paper !== "undefined") {
    paper = window.paper;
}
module.exports = paper;