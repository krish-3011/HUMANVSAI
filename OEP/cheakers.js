const player = -1
const kingPlayer = -2
const computer = 1
const kingComputer = 2
const validSpace = 0

function makeBoard(){
    board=[]
    for(let row = 0; row < 8; row ++){
        rowBoard=[]
        let validCell = (row  + 1)% 2;
        for(let column = 0; column < 8; column++){
            let cell;
            if(column === validCell){
                cell = validSpace;
                validCell = validCell + 2;
            }else{
                cell = ' ';
            }
            rowBoard.push(cell);
        }
        board.push(rowBoard);
    }
    return board;
    
}

function getIntialBoard(){

    let board = makeBoard();

    //intial postion of computer
    for(let row = 0; row < 3; row++){
        for(let column = 0; column < 8; column ++){
            if(board[row][column] === 0){
                board[row][column] = computer;
            }
        }
    }

     //intial postion of player
     for(let row = 5; row < 8; row++){
        for(let column = 0; column < 8; column ++){
            if(board[row][column] === 0){
                board[row][column] = player;
            }
        }
    }
    console.table(board)
}

function vaildMove(board,move){
    let pice = move[0];
    let newpice = move[1];

    //is new pice space is oocupied
    if(board[newpice[0]][newpice[1]] === 0){

        //for one step
        if(pice[0] - 1  === newpice[0]){
            if(pice[1] - 1 === newpice[1] || pice[1] + 1=== newpice[1]){
                return true
            }
        }

        //for two step
        if(pice[0] - 2  === newpice[0]){
            if((pice[1] - 2 === newpice[1] &&  pice[1] - 1) || pice[1] + 2 === newpice[1]){
                return true
            }
        }
    }
}

function getInput(){
    alert("Your Turn")
    let row = prompt('Enter row number of your pice : ');
    row = row - 1;

    if(isNaN(row) ||row > 7 || row < 0){
        alert('Enter valid row number :(');
        return [[-1,-1],[-1,-1]];
    }

    let column = prompt('Enter column number of your pice : ');
    column = column - 1;

    if( isNaN(column) || column > 7 || column < 0){
        alert('Enter valid column number :(');
        return [[-1,-1],[-1,-1]];
    }

    if(board[row][column] !== null){
        alert('Cell is already occupied :(');
        return [-1,-1];
    }

    return [row,column];
}

getIntialBoard();
