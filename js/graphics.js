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
