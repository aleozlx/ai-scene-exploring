var DFS = DFS || {}; // Namespace

DFS.Walker = function(roomId){ // Constructor
    this.roomId = undefined; // Where the AI is standing currently
    this.roomsVisited = [roomId]; // Rooms discovered will all be here in DFS order
    this.path = [roomId]; // Helper stack for backtrack of rooms
};

DFS.Walker.prototype.dfs = function() { // DFS algorithm
    console.debug('dfs: started');
    
    var s = [-1]; // Initialized with the fake door
    while(1){
        var d = s.pop();
        if(d == -1 && this.path.length == 0) break; // Termination
        if(!this.walkInto(d)) continue;
        var doors;
        try{ doors = this.scanDoors(d); }
        catch(err) {
            switch (err) {
                case 'enemy':
                    return;
                default: continue;
            }
        }
        this.sortDoors(doors);
        while(doors.length) s.push(doors.pop());
    }
    
    console.debug('dfs: ended');
};

DFS.Walker.prototype.walkInto = function(doorId){
    if(doorId == 0) return 0; // Cannot walk into a closed door.
    else if(doorId == -1){
        // A fake door means this is the initial case or 
        // the DFS algorithm is backtracking so AI should
        // return to previous room.
        // The former case is handled in the same way as the latter.
        
        var _oldRoomId = this.roomId;
        this.roomId = this.path.pop();
        if(this.roomId == undefined) console.error('walkInto: backtracking error');
        console.debug('walkInto: '+_oldRoomId+' ? '+this.roomId+' (backtrack)');
        return 1;
    }
    
    /* This part is dependent on the structure of the game scene */
        
    // Locate the AI
    var i = ~~(this.roomId / cav2_sz);
    var j = this.roomId % cav2_sz;
    
    // Find out direction to the door
    var direction = cav2_directionToDoor(i, j, doorId);
    
    // Get new roomId
    var nextRoom = cav2_walkTo(i, j, direction);
    var oldRoomId = this.roomId;
    var newRoomId = nextRoom[0] * cav2_sz + nextRoom[1];
    /* ========================================================= */
    
    if(this.roomsVisited.indexOf(newRoomId)>=0){
        console.debug('walkInto: Room '+newRoomId+' has been visited.');
        return 0;
    }
    else{
        console.debug('walkInto: '+oldRoomId+' '+direction+' '+newRoomId);
        this.roomId = newRoomId;
        this.path.push(oldRoomId);
        this.roomsVisited.push(newRoomId);
        return 1;
    }
};

DFS.Walker.prototype.scanDoors = function(doorExcluded) {
    var doors = new Array();
    
    /* This part is dependent on the structure of the game scene */
    
    // Locate the AI
    var i = ~~(this.roomId / cav2_sz);
    var j = this.roomId % cav2_sz;
    
    var doorId;
    // Look around and discover new doors
    doorId = cav2_isDoorOpen(i, j, '^');
    if(doorId > 0) doors.push(doorId);
    doorId = cav2_isDoorOpen(i, j, '>');
    if(doorId > 0) doors.push(doorId);
    doorId = cav2_isDoorOpen(i, j, 'v');
    if(doorId > 0) doors.push(doorId);
    doorId = cav2_isDoorOpen(i, j, '<');
    if(doorId > 0) doors.push(doorId);
    /* ========================================================= */
    var excluded = doors.indexOf(doorExcluded);
    if(excluded >= 0) doors.splice(excluded, 1);
    console.debug('scanDoors: '+doors.length+' door(s) found');
    return doors;
};

DFS.Walker.prototype.sortDoors = function(doors) {
    // Order (in-place) doors by their priorities
    // ...
    
    // the fake door again, cue to backtrack
    // if(doors.length) 
        doors.push(-1);
    return doors;
};
