var dotPixelSize = 30;
var numberOfDots = 20;
var img;
function LightenDarkenColor(col, amt) {
  var usePound = false;

  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col, 16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

const mapRange = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
// dots is an array of Dot objects,
// mouse is an object used to track the X and Y position
// of the mouse, set with a mousemove event listener below
var dots = [],
  mouse = {
    x: 0,
    y: 0,
  };

// The Dot object used to scaffold the dots
var Dot = function (distance) {
  this.x = 0;
  this.y = 0;
  this.node = (function () {
    var n = document.createElement("div");
    n.className = "trail";
    n.style.opacity = mapRange(distance, 1, numberOfDots, 0.1, 1);
    n.style.backgroundColor = LightenDarkenColor(
      "#ac0000",
      mapRange(distance, 1, numberOfDots, 0, 100)
    );
    // document.body.appendChild(n);
    return n;
  })();
};
// The Dot.prototype.draw() method sets the position of
// the object's <div> node
Dot.prototype.draw = function () {
  var offset = dotPixelSize / 2;
  this.node.style.left = this.x - offset + "px";
  this.node.style.top = this.y - offset + "px";
};

// Creates the Dot objects, populates the dots array
for (var i = 0; i < numberOfDots; i++) {
  var d = new Dot(numberOfDots - i);
  dots.push(d);
}

// This is the screen redraw function
function draw() {
  // Make sure the mouse position is set everytime
  // draw() is called.
  var x = mouse.x,
    y = mouse.y;

  // This loop is where all the 90s magic happens
  dots.forEach(function (dot, index, dots) {
    var nextDot = dots[index + 1] || dots[0];

    dot.x = x;
    dot.y = y;
    dot.draw();
    x += (nextDot.x - dot.x) * 0.5;
    y += (nextDot.y - dot.y) * 0.5;
  });
}

addEventListener("click", function (event) {
  if (
    window.innerWidth - (window.innerWidth - event.pageX) < 150 &&
    window.innerHeight - event.pageY < 150
  ) {
    const [link] = document.getElementsByClassName("main-link");
    link.click();
  }
});

addEventListener("mousemove", function (event) {
  if (img) {
    if (
      window.innerWidth - (window.innerWidth - event.pageX) < 155 &&
      window.innerHeight - event.pageY < 155
    ) {
      img.style.boxShadow = "0 0 10px white";
    } else {
      img.style.boxShadow = "none";
    }
  }

  mouse.x = event.pageX;
  mouse.y = event.pageY;
});

// animate() calls draw() then recursively calls itself
// everytime the screen repaints via requestAnimationFrame().
function animate() {
  if (!img) {
    const [ele] = document.getElementsByTagName("img");
    img = ele;
  }
  draw();
  requestAnimationFrame(animate);
}

animate();
const [html] = document.getElementsByTagName("html");
if (html) {
  html.addEventListener("mouseenter", (_) => {
    dots.forEach((dot) => document.body.appendChild(dot.node));
  });
}
