const player = 'O'; //-10
const computer = 'X'; //10

function makeBoard(){
    let board = [];
    let temp = [];
    for(let row = 0; row < 6; row++ ){
        for(let column = 0; column < 7; column++){
            temp.push(0);
        }
        board.push(temp);
        temp=[];
    }
    return board;
}

function printBoard(board){
    console.table(board);
}

function isEmpty(board){
    for(let row = 0; row < 6; row++ ){
        for(let column = 0; column < 7; column++){
            if(board[row][column] === 0){
                return true
            }
        }
    }
    return false
}

function isWin(board){

    //row wining
    for(let row=0; row < 6; row ++){
        for(let column = 0; column < 4; column++){
            if((board[row][column] === board[row][column+1]) && (board[row][column] === board[row][column+2]) && (board[row][column] === board[row][column+3])){
                if(board[row][column] === player){
                    return -10
                }
                else if(board[row][column] === computer){
                    return 10
                }
            }
        }
    }

    //cloumn wining
    for(let column = 0; column < 7; column++){
        for(let row=0; row < 3; row ++){

            if((board[row][column] === board[row+1][column]) && (board[row][column] === board[row+2][column]) && (board[row][column] === board[row+3][column])){
                if(board[row][column] === player){
                    return -10
                }
                else if(board[row][column] === computer){
                    return 10
                }
            }
        }
    }

    //left diagonal
    for(let row=0; row < 6; row ++){
        for(let column = 0; column < 7; column++){

            //upper diagonal
            if((row - 3 >= 0) && (column - 3 >= 0)){
                if((board[row][column] === board[row-1][column-1]) && (board[row][column] === board[row - 2][column - 2]) && (board[row][column] === board[row - 3][column - 3])){
                    if(board[row][column] === player){
                        return -10
                    }
                    else if(board[row][column] === computer){
                        return 10
                    }
                }
            }

            //lower diagonal
            if((row + 3 < 6) && (column + 3 < 7)){
                if((board[row][column] === board[row + 1][column + 1]) && (board[row][column] === board[row + 2][column + 2]) && (board[row][column] === board[row + 3][column + 3])){
                    if(board[row][column] === player){
                        return -10
                    }
                    else if(board[row][column] === computer){
                        return 10
                    }
                }
            }
        }
    }

    //right diagonal
    for(let row=0; row < 6; row ++){
        for(let column = 0; column < 7; column++){

            //upper diagonal
            if((row - 3 >= 0) && (column + 3 < 7)){
                if((board[row][column] === board[row-  1][column + 1]) && (board[row][column] === board[row - 2][column + 2]) && (board[row][column] === board[row - 3][column + 3])){
                    if(board[row][column] === player){
                        return -10
                    }
                    else if(board[row][column] === computer){
                        return 10
                    }
                }
            }

            //lower diagonal
            if((row + 3 < 6) && (column - 3 >= 0)){
                if((board[row][column] === board[row + 1][column - 1]) && (board[row][column] === board[row + 2][column - 2]) && (board[row][column] === board[row + 3][column - 3])){
                    if(board[row][column] === player){
                        return -10
                    }
                    else if(board[row][column] === computer){
                        return 10
                    }
                }
            }
        }
    }

    return 0
}

function takeInput(){

    //input of row from user
    let input = parseInt(prompt("Your Turn.... \n Enter Row Number : "));

    //validate input
    if( input >= 0 && input < 7){
        return input;
    }
    return -1;
}

function userTurn(board){

    input = takeInput();

    while(input === -1){
        alert("Enter valid row number :)");
        input = takeInput();
    }

    //cheak for last place
    for(let row = 5; row >= 0; row-- ){
        if(board[row][input] === 0){
            board[row][input] = player;
            break;
        }
    }
    return board
}

function comTurn(board , column){

    alert(`Computer choose ${column} column :)`)
    //cheak for last place
    for(let row = 5; row >= 0; row-- ){
        if(board[row][column] === 0){
            board[row][column] = computer;
            break;
        }
    }
    return board
}

function max(no1 , no2){
    return no1 > no2 ? no1 : no2 ;
}

function min(no1 , no2){
    return no1 < no2 ? no1 : no2 ;
}

function minMax(board , depth , isCom){

    let score = isWin(board);

    if(score === 10 || score === -10 || !(isEmpty(board))){
        return score;
    }

    if(isCom){
        // if computer
        let bestScore = -9999

        for(let row = 0; row < 6; row++ ){
            for(let column = 0; column < 7; column++){
               
                if(board[row][column] === 0){
    
                    board[row][column] = computer
                    bestScore = max(bestScore,minMax(board , depth + 1 , !(isCom)) - 1)
                    board[row][column] = 0
    
                }
    
            }
        }
        
        return bestScore

    } else {
        // if player

        let bestScore = 9999

        for(let row = 0; row < 6; row++ ){
            for(let column = 0; column < 7; column++){
               
                if(board[row][column] === 0){
    
                    board[row][column] = player
                    bestScore = min(bestScore,minMax(board , depth + 1 , !(isCom)) - 1)
                    board[row][column] = 0
    
                }
    
            }
        }
        
        return bestScore
    }
}

function findBestMove(board){

    let bestScore = -9999;
    let bestMove = -1;
    let score;

    for(let row = 0; row < 6; row++ ){
        for(let column = 0; column < 7; column++){
           
            if(board[row][column] === 0){

                board[row][column] = computer;
                score = minMax(board , 0 , false);
                board[row][column] = 0;

                if(score > bestScore){
                    bestMove = column;
                    bestScore = score
                }

            }

        }
    }

    return bestMove

}

board = makeBoard()
printBoard(board)
while(isEmpty(board)){
    board = userTurn(board)
    printBoard(board)

    result = isWin(board)
    if(result === -10){
        alert("O win");
        break;
    }

    bestMove = findBestMove(board);
    board = comTurn(board , bestMove);
    printBoard(board)

    result = isWin(board)
    if(result === 10){
        alert("X win");
        break;
    }
}