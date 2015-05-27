//settings variables
var numSegments = 10;
var rotation = 360/numSegments;
var centerX = $('canvas').width()/2;
var centerY = $('canvas').height()/2;
var centerPoint = new Point(centerX, centerY);
var segLength = Math.min($('canvas').width(), $('canvas').height()) * 0.48;
var circleSize = 50;
var tool = 'draw'

//draw work area
drawGuide();
updatePetalSizeDisplay();

//groups to hold drawings & rotations of original drawings
var rotateGroups = [];
var drawGroup = new Group();

//set button events
var $rotateButton = $('button.rotate');
$rotateButton.on('click', drawRotation);
var $clearButton = $('button.clear');
$clearButton.on('click', clearDrawing);
var $increasePetal = $('button.petal-increase');
$increasePetal.on('click', increasePetalSize);
var $decreasePetal = $('button.petal-decrease');
$decreasePetal.on('click', decreasePetalSize);

function drawGuide() {
  if (tri) {
    tri.remove()
  }

  var t1 = centerPoint;
  var t2 = new Point(centerPoint.x, centerPoint.y - segLength);
  t2 = t2.rotate(rotation/2, centerPoint);
  var t3 = new Point(centerPoint.x, centerPoint.y - segLength);
  t3 = t3.rotate(360 - rotation/2, centerPoint);

  var tri = new Path();
  tri.add(t1);
  tri.add(t2);
  tri.add(t3);
  tri.closed = true;
  tri.fillColor = "#D6FFEB"
}

function drawRotation() {
  length = rotateGroups.length;
  rotateGroups[length] = drawGroup.clone();
  clearDrawGroup();

  //rotate & draw segments
  for(var i = length + 1; i <= length + numSegments; i++) {
    var newGroup = rotateGroups[i-1].clone();
    newGroup.rotate(rotation, centerPoint);
    rotateGroups[i] = newGroup;
  }
  rotateGroups[length].visible = false;
}

function clearDrawing() {
  rotateGroups.forEach(function (group) {
    group.remove();
  });
  rotateGroups = [];
  clearDrawGroup();
}

function clearDrawGroup() {
  drawGroup.remove();
  drawGroup = new Group();
}

function onMouseDown(event) {
  if (tool === 'circle') {
    var circle = new Path.Circle(event.point, circleSize);
    circle.strokeColor = 'black';
    drawGroup.addChild(circle);
  }
  else if (tool === 'draw') {
    drawLine = new Path();
    drawLine.strokeColor = 'black';
    drawGroup.addChild(drawLine);
  }
}

function onMouseDrag(event) {
  if (tool === 'draw') {
    drawLine.add(event.point);
  }
}

function updatePetalSizeDisplay() {
  $('h4.petal-size').html('Petal Size: ' + circleSize);
}

function increasePetalSize() {
  circleSize += 5;
  updatePetalSizeDisplay();
}

function decreasePetalSize() {
  if (circleSize >= 10) {
    circleSize -= 5;
    updatePetalSizeDisplay();
  }
}
