function cav2() {
    return document.getElementById("cav2");
}

function cav2_init() {
    var c = cav2();
    var width = c.getAttribute("width");
    var height = c.getAttribute("height");
    var context = c.getContext("2d");
    context.clearRect(0, 0, width, height);
    context.setLineDash([6]);
    context.strokeRect(0, 0, width, height);
    context.setLineDash([]);
}

var cav2_doors;
var cav2_sz;

function cav2_isDoorOpen(i, j, direction) {
    return cav2_doors[i*cav2_sz+j][['^', '>', 'v', '<'].indexOf(direction)];
}

function cav2_walkTo(i, j, direction) {
    if (cav2_isDoorOpen(i, j, direction) < 1) return null;
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
}

function cav2_labelRoom(i, j, text) {
    var context = cav2().getContext("2d");
    context.font = "12px Arial";
    context.fillText(text,7+50*j+3,7+50*i+15);
}

function cav2_roomId(i, j) {
    return i*cav2_sz+j;
}

function cav2_directionToDoor(i, j, doorId) {
    var i = cav2_doors[i*cav2_sz+j].indexOf(doorId);
    if(i >= 0) return ['^', '>', 'v', '<'][i];
    else return null;
}

function cav2_drawGrid(sz) {
    var context = cav2().getContext("2d");
    cav2_doors = new Array();
    var doorId = 1;
    for (var i = 0; i<sz; ++i) for (var j = 0; j<sz; ++j){
        context.strokeRect(7+50*j,7+50*i,50,50);
        cav2_doors.push([0, 0, 0, 0]);
    }
    for (var i = 0; i<sz; ++i) for (var j = 1; j<sz; ++j){
        if (Math.random()>0.20){
            context.clearRect(7+50*j-3,7+50*i+16,6,16);
            cav2_doors[i*sz+j][3] = doorId;
            cav2_doors[i*sz+j-1][1] = doorId;
            ++doorId;
        }
    }
    for (var i = 1; i<sz; ++i) for (var j = 0; j<sz; ++j){
        if (Math.random()>0.20){
            context.clearRect(7+50*j+16,7+50*i-3,16,6);
            cav2_doors[i*sz+j][0] = doorId;
            cav2_doors[(i-1)*sz+j][2] = doorId;
            ++doorId;
        }
    }
    cav2_sz = sz;
}
