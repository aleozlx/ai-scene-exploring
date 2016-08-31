/* ----------------------------------------- 
                    cav2
------------------------------------------ */

var canvas2 = canvas2 || {}; // Namespace

canvas2.get = function() {
    return document.getElementById("cav2");
};

canvas2.init = function() {
    var c = canvas2.get();
    var width = c.getAttribute("width");
    var height = c.getAttribute("height");
    var context = c.getContext("2d");
    context.clearRect(0, 0, width, height);
    context.setLineDash([6]);
    context.strokeRect(0, 0, width, height);
    context.setLineDash([]);
};

canvas2.doors = undefined;
canvas2.sz = undefined;

canvas2.isDoorOpen = function(i, j, direction) {
    return canvas2.doors[i*canvas2.sz+j][['^', '>', 'v', '<'].indexOf(direction)];
};

canvas2.walkTo = function(i, j, direction) {
    if (canvas2.isDoorOpen(i, j, direction) < 1) return null;
    switch(direction){
        case '^':
            return [i-1, j];
        case '>':
            return [i, j+1];
        case 'v':
            return [i+1 ,j];
        case '<':
            return [i, j-1];
        default:
            return null;
    }
};

canvas2.labelRoom = function(i, j, text) {
    var context = canvas2.get().getContext("2d");
    context.font = "12px Arial";
    context.fillText(text,7+50*j+3,7+50*i+15);
};

canvas2.roomId = function(i, j) {
    return i*canvas2.sz+j;
};

canvas2.directionToDoor = function(i, j, doorId) {
    var k = canvas2.doors[i*canvas2.sz+j].indexOf(doorId);
    if(k >= 0) return ['^', '>', 'v', '<'][k];
    else return null;
};

canvas2.drawGrid = function(sz) {
    var context = canvas2.get().getContext("2d");
    canvas2.doors = new Array();
    var doorId = 1;
    for (var i = 0; i<sz; ++i) for (var j = 0; j<sz; ++j){
        context.strokeRect(7+50*j,7+50*i,50,50);
        canvas2.doors.push([0, 0, 0, 0]);
    }
    for (var i = 0; i<sz; ++i) for (var j = 1; j<sz; ++j){
        if (Math.random()>0.20){
            context.clearRect(7+50*j-3,7+50*i+16,6,16);
            canvas2.doors[i*sz+j][3] = doorId;
            canvas2.doors[i*sz+j-1][1] = doorId;
            ++doorId;
        }
    }
    for (var i = 1; i<sz; ++i) for (var j = 0; j<sz; ++j){
        if (Math.random()>0.20){
            context.clearRect(7+50*j+16,7+50*i-3,16,6);
            canvas2.doors[i*sz+j][0] = doorId;
            canvas2.doors[(i-1)*sz+j][2] = doorId;
            ++doorId;
        }
    }
    canvas2.sz = sz;
};

/* ----------------------------------------- 
                    cav3
------------------------------------------ */

var canvas3 = canvas3 || {}; // Namespace

canvas3.get = function() {
    return document.getElementById("cav3");
};

canvas3.getMousePosition = function (canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      j: ~~((event.clientX - rect.left) / 50),
      i: ~~((event.clientY - rect.top) / 50)
    };
};

canvas3.init = function() {
    var c = canvas3.get();
    var width = c.getAttribute("width");
    var height = c.getAttribute("height");
    var context = c.getContext("2d");
    context.clearRect(0, 0, width, height);
    context.setLineDash([6]);
    context.strokeRect(0, 0, width, height);
    context.setLineDash([]);
    canvas3.drawGrid();
    for(var i=0;i<9;++i) for(var j=0;j<20;++j){
        canvas3.fillGrid(i, j, {type: 'void'});
    }
    canvas3.fillGrid(1, 1, {type: 'start'});
    canvas3.fillGrid(7, 18, {type: 'target'});
    c.addEventListener('click', function(event) {
        var position = canvas3.getMousePosition(c, event);
        canvas3.tryToggleObstacle(position.i, position.j);
    }, false);
};

canvas3.drawGrid = function() {
    var c = canvas3.get();
    var width = c.getAttribute("width");
    var height = c.getAttribute("height");
    var context = c.getContext("2d");
    context.setLineDash([3]);
    function hLine(y) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
    }
    function vLine(x) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }
    for (var y = 50; y<height; y+=50) hLine(y);
    for (var x = 50; x<width; x+=50) vLine(x);
    context.setLineDash([]);
};

canvas3.gridCells = new Array(180);

canvas3.fillGrid = function(i, j, obj) {
    var context = canvas3.get().getContext('2d');
    function circle(fill, stroke) {
        const radius = 8;
        var centerX = j * 50 + 25, centerY = i * 50 + 25;
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = fill;
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = stroke;
        context.stroke();
    }
    function square(fill) {
        const padding = 1;
        context.fillStyle = fill;
        context.fillRect(j*50+padding, i*50+padding, 50-padding*2, 50-padding*2);
    }
    obj.labelStyle = 'black';
    switch (obj.type) {
        case 'start':
            circle('green', '#003300');
            break;
        case 'target':
            circle('red', '#330000');
            break;
        case 'obstacle': 
            obj.labelStyle = 'white';
            square('black');
            break;
        case 'void':
            square('white');
            break;
    }
    context.font = "12px Arial";
    context.fillStyle = obj.labelStyle;
    context.fillText(''+(i*20+j),50*j+3,50*i+15);
    canvas3.gridCells[i*20+j] = obj;
};

canvas3.tryToggleObstacle = function (i, j) {
    if(canvas3.gridCells[i*20+j].type == 'void') {
        canvas3.fillGrid(i, j, {type: 'obstacle'});
    }
    else if(canvas3.gridCells[i*20+j].type == 'obstacle') {
        canvas3.fillGrid(i, j, {type: 'void'});
    }
};

