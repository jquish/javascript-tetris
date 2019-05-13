var blocks = new Array(20);
var model = new Array(20);

// piece[0]-piece[3] are block positions, piece[4] is piece type
var piece = new Array(5);
var oldPos = new Array(4);

var display;
var speed = 1500;

var type;
var colors = ['-', 'i', 'j', 'l', 'o', 's', 'z', 't'];

window.onload = function() {
    
    setUp();
    printGrid();
    start(); 

}

function start() {
    
    piece[0] = [-1, 5];
    newPiece();
    
    display = setInterval(play, speed);  
}

function play() {

    document.onkeydown = function(event) {
        switch (event.keyCode) {
            case 39:
                move(0, 1);
                break;
            case 38:
                rotatePiece()
                break;
            case 37: 
                move(0, -1);
                break;
            case 40:
                move(1, 0);
                break;
            case 32: 
                clearInterval(display); 
                while (move(1, 0) == true) continue;
                checkRows();
                
                if (!gameOver()) {
                    start();
                } else {
                    updatePos();
                    printGrid();
                    resetModel();
                    start();
                }
        }
    };

    if (move(1, 0) == false) {
        clearInterval(display);
        checkRows();

        if (!gameOver()) {
            start(); 
            
        } else {
            updatePos();
            printGrid();
            resetModel();
            start();
        }
    }
}
    
// returns true if piece is successfully moved, otherwise returns false
function move(x, y) {
    
    oldPos = piece.concat();
    clearPiece();
    
    for (var i = 0; i < 4; i++)
        piece[i] = [piece[i][0] + 1, piece[i][1] + y];
    
    if (checkOverlap() == false) {
        updatePos();
        printGrid();
        return true;
    } else {
        piece = oldPos.concat();
        updatePos();
        return false;
    }
}

// called from movePiece() and gameOver()
function checkOverlap() {
    
    for (var i = 0; i < 4; i++) {
        if (piece[i][0] < 0) continue;
        
//        check active blocks against bottom
        if (piece[i][0] >= 20) return true;
        
//        check active blocks against locked blocks
        if (model[piece[i][0]][piece[i][1]] != 0) return true;
        
//        check active blocks against sides
        if (piece[i][1] < 0 || piece[i][1] > 9) return true;
        
    }
    
    return false;
}

function clearPiece() {
    for (var i = 0; i < 4; i++) 
        if (piece[i][0] >= 0 && piece[i][1] >= 0)
            model[oldPos[i][0]][oldPos[i][1]] = 0;
}

function updatePos() {
    for (var i = 0; i < 4; i++) 
        if (piece[i][0] >= 0 && piece[i][0] <= 20)
            model[piece[i][0]][piece[i][1]] = piece[4];
}
    
// called from play()
function rotatePiece() {
    oldPos = piece.concat();
    clearPiece();
    
    for (var i = 1; i < 4; i++) {
        y = piece[i][0] - piece[0][0];
        x = piece[i][1] - piece[0][1];
        x *= -1;
        piece[i] = [piece[0][0] + x, piece[0][1] + y];
    }
    
    if (checkOverlap() == false) {
        updatePos();
        printGrid();
    } else {
        piece = oldPos.concat();
        updatePos();
    }
}

function checkRows() {
    var rows = Array();
    var row_count = 0;
    
    for (var i = 19; i >= 0; i--) {
        for (var j = 0; j < 10; j++)
            if (model[i][j] != 0) row_count++;
        if (row_count == 0) break;
        if (row_count >= 10) rows.push(i);
        row_count = 0;
    }
    
    if (rows.length > 0) deleteRows(rows);
}

function deleteRows(rows) { 
    deleted = 0;
    
    for (var i = rows[0]; i >= 0; i--) {
        if (i >= deleted) {
            if (rows.includes(i)) {
                deleted++;
            } else {
                model[i+deleted] = model[i].concat();
            }
        } else {
            model[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
    }
    
    printGrid();
}
    
// called from main function
function gameOver() { 
    for (var i = 0; i < 4; i++)
        if (piece[i][0] < 0) return true;
    
    return false;
}

// called from main function
function printGrid() {
    
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 10; j++) {
            
            blocks[i][j].classList.remove('i', 'l', 'j', 'o', 's', 'z', 't');
            
            if (model[i][j] == 0) {
                blocks[i][j].style.display = "none";
            } else {
                blocks[i][j].style.display = "block";
                blocks[i][j].classList.add(colors[model[i][j]]);
            }
        }
    }
}

function newPiece() {
    
    piece[4] = 1 + Math.floor(Math.random() * 7);
    console.log(piece[4]);
    
    if (piece[4] == 1) { 
        // I-block
        piece[1] = [piece[0][0] + 1, piece[0][1]];
        piece[2] = [piece[0][0] - 1, piece[0][1]];
        piece[3] = [piece[0][0] - 2, piece[0][1]];
        
    } else if (piece[4] == 2) { 
        // J-block
        piece[1] = [piece[0][0], piece[0][1] - 1];
        piece[2] = [piece[0][0] - 1, piece[0][1]];
        piece[3] = [piece[0][0] - 2, piece[0][1]];
    } else if (piece[4] == 3) { 
        // L-block
        piece[1] = [piece[0][0], piece[0][1] + 1];
        piece[2] = [piece[0][0] - 1, piece[0][1]];
        piece[3] = [piece[0][0] - 2, piece[0][1]];
    } else if (piece[4] == 4) { 
        // O-block
        piece[1] = [piece[0][0], piece[0][1] - 1];
        piece[2] = [piece[0][0] - 1, piece[0][1]];
        piece[3] = [piece[0][0] - 1, piece[0][1] - 1];
    } else if (piece[4] == 5) { 
        // S-block
        piece[1] = [piece[0][0] - 1, piece[0][1]];
        piece[2] = [piece[0][0], piece[0][1] - 1];
        piece[3] = [piece[0][0] - 1, piece[0][1] + 1];
    } else if (piece[4] == 6) { 
        // Z-block
        piece[1] = [piece[0][0], piece[0][1] + 1];
        piece[2] = [piece[0][0] - 1, piece[0][1]];
        piece[3] = [piece[0][0] - 1, piece[0][1] - 1];
    } else { 
        // T-block
        piece[1] = [piece[0][0], piece[0][1] - 1];
        piece[2] = [piece[0][0], piece[0][1] + 1];
        piece[3] = [piece[0][0] - 1, piece[0][1]];
    }
}

function resetModel() {
    for (var i = 0; i < 20; i++) {
        model[i] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    }
    
    printGrid();
}

function setUp() {
    
    var grid = document.getElementById("grid");
    
    for (var i = 0; i < 20; i++) {
//        initializing model array
        model[i] = new Array(10);
        
//        initializing block array
        blocks[i] = new Array(10);
        
        for (var j = 0; j < 10; j++) {
//            initializing model array
            model[i][j] = 0;
            
//            initializing block array
            var col = j;
            var row = i;

            var block = document.createElement("div");
            block.classList.add("block");
            block.setAttribute("id", col + ":" + row);
            grid.appendChild(block);

            block.style.left = col * 25 + "px";
            block.style.top = row * 25 + "px";
            
            blocks[i][j] = block;
        }
    }
}