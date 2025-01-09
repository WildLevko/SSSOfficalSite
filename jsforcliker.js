var counter = 0;
var interval;
function inc() {
counter++;
upd();
}
function upd() {
    var counterElement = document.getElementById("counter");
    counterElement.textContent = counter;
}