function Player(type, team, islive) {
    this.type = type;
    this.team = team;
    this.islive = islive;
    this.moves = 0;
}

function Cell(row, col, color, player) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.player = player;
}

Cell.prototype.setPlayer = function(player) {
    this.player = player;
}

Cell.prototype.getPlayer = function(player) {
    return this.player;
}

var ChessBoard = {
    init: function() {
        this.setData();
        this.cacheDom();
        this.bindEvents();
        this.start();
    },
    setData: function() {
        this.PLAYER_TYPE = {
            KING: 'king',
            QUEEN: 'queen',
            ROOK: 'rook',
            BISHOP: 'bishop',
            KNIGHT: 'knight',
            PAWN: 'pawn'
        };
        this.COLOR = {
            WHITE: 'white',
            BLACK: 'black'
        };
        this.TEAM = {
            team1: 'white',
            team2: 'black'
        };
        // this.rowValues = ['8', '7', '6', '5', '4', '3', '2', '1'];
        // this.colValues = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        this.rowValues = [0, 1, 2, 3, 4, 5, 6, 7];
        this.colValues = [0, 1, 2, 3, 4, 5, 6, 7];

        this.team1Time = 0;
        this.team2Time = 0;
        this.toggleTime = new Date();
        this.selectedCell = null;
        this.currentTeam = this.TEAM.team1;
        this.warnCell = null;
        this.initBoard();
    },
    findDiff: function(currentTime) {
        let a = currentTime.getTime();
        let b = this.toggleTime.getTime();
        return  a - b;
    },
    setTiming: function() {
        let currentTime =  new Date();
        let diff = this.findDiff(currentTime);

        if (this.currentTeam === this.TEAM.team1)
            this.team1Time += diff;
        else
            this.team2Time += diff;

        this.toggleTime = currentTime;
    },
    millisToMinutesAndSeconds: function(millis) {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    },
    toggleCurrentTeam: function() {
        this.setTiming();
        if (this.currentTeam !== this.TEAM.team1)
            this.currentTeam = this.TEAM.team1; 
        else
            this.currentTeam = this.TEAM.team2; 
    },
    cacheDom: function() {},
    bindEvents: function() {
        $(document).on('click', '.cell', this.handleCellClick);
    },
    move(fromCell, toCell) {
        if (ChessMoveValidator.validate(toCell, fromCell)) {
            toCell.player = fromCell.player;
            toCell.player.moves++;
            fromCell.player = null;
            this.warnCell = null;
            this.toggleCurrentTeam();
        } else {
            let self = this;
            this.warnCell = toCell;
            setTimeout(function() {
                self.warnCell = null;
                self.render();
            }, 200);
        }
    },
    handleCellClick: function() {
        let self = ChessBoard;
        let element = $(this);
        
        let selectedX = element.data('row');
        let selectedY = element.data('col');

        if (self.selectedCell === self.board[selectedX][selectedY] ) {
            self.selectedCell = null;
        } else if (null === self.selectedCell && self.board[selectedX][selectedY].player) {
            self.selectedCell = self.board[selectedX][selectedY];
        } else if (self.board[selectedX][selectedY]) {
            if (self.board[selectedX][selectedY].player && self.selectedCell.player.team === self.board[selectedX][selectedY].player.team) {
                // same team case
                self.selectedCell = self.board[selectedX][selectedY];
            } else {
                self.move(self.selectedCell, self.board[selectedX][selectedY]);
                self.selectedCell = null;
            }
        }
        self.render();
    },
    start: function() {
        this.render();
    },
    render: function() {
        if (this.TEAM.team2 === this.currentTeam) {
            $('#heading').addClass('blackText');
        } else {
            $('#heading').removeClass('blackText');
        }

        $('#team1Time').html(this.millisToMinutesAndSeconds(this.team1Time));
        $('#team2Time').html(this.millisToMinutesAndSeconds(this.team2Time));

        let html = '';
        this.board.forEach((row, rowIndex) => {
            html += '<div>';
            row.forEach((cell, colIndex) => {
                let cellClass = '';
                cellClass = 'cell ' + cell.color;
                
                if (this.selectedCell && this.selectedCell.row == rowIndex && this.selectedCell.col === colIndex)
                    cellClass += ' selected';
                else if (this.warnCell && this.warnCell.row == rowIndex && this.warnCell.col === colIndex)
                    cellClass += ' warning';

                let playerHTML = '';
                if (cell.player) {
                    let teamClass = cell.player.team === this.TEAM.team1 ? 'w' : 'b';
                    playerHTML = `<div class="css-sprite-${teamClass}${cell.player.type} player"></div>`; 
                }
                html += `<div class="${cellClass}" data-row="${rowIndex}" data-col="${colIndex}">${playerHTML}</div>`;
            })
            html += '</div>';
        })
        
        document.getElementById('board').innerHTML = html;
    },
    setFrom: function() {},
    setTop: function() {},
    isValidMove: function() {},
    initBoard: function() {

        this.board = [];
        let rowValues = this.rowValues;
        let colValues = this.colValues;

        for(row = 0; row < 8; row++) {
            this.board[row] = [];

            if (0 === row) {
                let player1 = new Player(this.PLAYER_TYPE.ROOK, this.TEAM.team2, 1);
                let player2 = new Player(this.PLAYER_TYPE.KNIGHT, this.TEAM.team2, 1);
                let player3 = new Player(this.PLAYER_TYPE.BISHOP, this.TEAM.team2, 1);
                let player4 = new Player(this.PLAYER_TYPE.QUEEN, this.TEAM.team2, 1);
                let player5 = new Player(this.PLAYER_TYPE.KING, this.TEAM.team2, 1);
                let player6 = new Player(this.PLAYER_TYPE.BISHOP, this.TEAM.team2, 1);
                let player7 = new Player(this.PLAYER_TYPE.KNIGHT, this.TEAM.team2, 1);
                let player8 = new Player(this.PLAYER_TYPE.ROOK, this.TEAM.team2, 1);

                this.board[row][0] = new Cell(rowValues[row], colValues[0], this.COLOR.WHITE, player1);
                this.board[row][1] = new Cell(rowValues[row], colValues[1], this.COLOR.BLACK, player2);
                this.board[row][2] = new Cell(rowValues[row], colValues[2], this.COLOR.WHITE, player3);
                this.board[row][3] = new Cell(rowValues[row], colValues[3], this.COLOR.BLACK, player4);
                this.board[row][4] = new Cell(rowValues[row], colValues[4], this.COLOR.WHITE, player5);
                this.board[row][5] = new Cell(rowValues[row], colValues[5], this.COLOR.BLACK, player6);
                this.board[row][6] = new Cell(rowValues[row], colValues[6], this.COLOR.WHITE, player7);
                this.board[row][7] = new Cell(rowValues[row], colValues[7], this.COLOR.BLACK, player8);
            } else if (1 === row) {
                let player1 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team2, 1);
                let player2 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team2, 1);
                let player3 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team2, 1);
                let player4 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team2, 1);
                let player5 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team2, 1);
                let player6 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team2, 1);
                let player7 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team2, 1);
                let player8 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team2, 1);

                this.board[row][0] = new Cell(rowValues[row], colValues[0], this.COLOR.BLACK, player1);
                this.board[row][1] = new Cell(rowValues[row], colValues[1], this.COLOR.WHITE, player2);
                this.board[row][2] = new Cell(rowValues[row], colValues[2], this.COLOR.BLACK, player3);
                this.board[row][3] = new Cell(rowValues[row], colValues[3], this.COLOR.WHITE, player4);
                this.board[row][4] = new Cell(rowValues[row], colValues[4], this.COLOR.BLACK, player5);
                this.board[row][5] = new Cell(rowValues[row], colValues[5], this.COLOR.WHITE, player6);
                this.board[row][6] = new Cell(rowValues[row], colValues[6], this.COLOR.BLACK, player7);
                this.board[row][7] = new Cell(rowValues[row], colValues[7], this.COLOR.WHITE, player8);
            } else if (6 === row) {
                let player1 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team1, 1);
                let player2 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team1, 1);
                let player3 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team1, 1);
                let player4 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team1, 1);
                let player5 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team1, 1);
                let player6 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team1, 1);
                let player7 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team1, 1);
                let player8 = new Player(this.PLAYER_TYPE.PAWN, this.TEAM.team1, 1);

                this.board[row][0] = new Cell(rowValues[row], colValues[0], this.COLOR.WHITE, player1);
                this.board[row][1] = new Cell(rowValues[row], colValues[1], this.COLOR.BLACK, player2);
                this.board[row][2] = new Cell(rowValues[row], colValues[2], this.COLOR.WHITE, player3);
                this.board[row][3] = new Cell(rowValues[row], colValues[3], this.COLOR.BLACK, player4);
                this.board[row][4] = new Cell(rowValues[row], colValues[4], this.COLOR.WHITE, player5);
                this.board[row][5] = new Cell(rowValues[row], colValues[5], this.COLOR.BLACK, player6);
                this.board[row][6] = new Cell(rowValues[row], colValues[6], this.COLOR.WHITE, player7);
                this.board[row][7] = new Cell(rowValues[row], colValues[7], this.COLOR.BLACK, player8);
            } else if (7 === row) {
                let player1 = new Player(this.PLAYER_TYPE.ROOK, this.TEAM.team1, 1);
                let player2 = new Player(this.PLAYER_TYPE.KNIGHT, this.TEAM.team1, 1);
                let player3 = new Player(this.PLAYER_TYPE.BISHOP, this.TEAM.team1, 1);
                let player4 = new Player(this.PLAYER_TYPE.QUEEN, this.TEAM.team1, 1);
                let player5 = new Player(this.PLAYER_TYPE.KING, this.TEAM.team1, 1);
                let player6 = new Player(this.PLAYER_TYPE.BISHOP, this.TEAM.team1, 1);
                let player7 = new Player(this.PLAYER_TYPE.KNIGHT, this.TEAM.team1, 1);
                let player8 = new Player(this.PLAYER_TYPE.ROOK, this.TEAM.team1, 1);

                this.board[row][0] = new Cell(rowValues[row], colValues[0], this.COLOR.BLACK, player1);
                this.board[row][1] = new Cell(rowValues[row], colValues[1], this.COLOR.WHITE, player2);
                this.board[row][2] = new Cell(rowValues[row], colValues[2], this.COLOR.BLACK, player3);
                this.board[row][3] = new Cell(rowValues[row], colValues[3], this.COLOR.WHITE, player4);
                this.board[row][4] = new Cell(rowValues[row], colValues[4], this.COLOR.BLACK, player5);
                this.board[row][5] = new Cell(rowValues[row], colValues[5], this.COLOR.WHITE, player6);
                this.board[row][6] = new Cell(rowValues[row], colValues[6], this.COLOR.BLACK, player7);
                this.board[row][7] = new Cell(rowValues[row], colValues[7], this.COLOR.WHITE, player8);
            } else {
                for(col = 0; col < 8; col++) {
                    let color = (row + col) % 2 === 0 ? this.COLOR.WHITE : this.COLOR.BLACK;
                    this.board[row][col] = new Cell(rowValues[row], colValues[col], color, null);
                }
            }
        }
    }
}

ChessBoard.init();

var ChessMoveValidator = {
    isCell: function(row, col) {
        return row >=0 && row<=7 && col >=0 && col <= 7 ? true: false;
    },
    isFriendlyFire: function(toCell, fromCell) {
        return toCell.player && toCell.player.team === fromCell.player.team ? true : false;
    },
    isEmpty: function(row, col) {
        return this.isCell(row, col) && ChessBoard.board[row][col].player ? false : true;
    },
    isDiagonalKill: function(toCell, fromCell) {
        if(fromCell.player) {
            if (this.isFriendlyFire(toCell, fromCell))
                return false;
            
            let rowDiff = null, colDiff = null;
            if(toCell.row < fromCell.row) 
                rowDiff = fromCell.row - toCell.row;
            else
                rowDiff = toCell.row - fromCell.row;

            if(toCell.col < fromCell.col) 
                colDiff = fromCell.col - toCell.col;
            else
                colDiff = toCell.col - fromCell.col;

            // Diagonal check
            if (rowDiff !== colDiff)
                return;
            
            let rowMinus = null, colMinus = null;
            if (toCell.row < fromCell.row && toCell.col > fromCell.col) {
                rowMinus = true;
                colMinus = false;
            } else if (toCell.row > fromCell.row && toCell.col > fromCell.col) {
                rowMinus = false;
                colMinus = false;
            } else if (toCell.row > fromCell.row && toCell.col < fromCell.col) {
                rowMinus = false;
                colMinus = true;
            } else if (toCell.row < fromCell.row && toCell.col < fromCell.col) {
                rowMinus = true;
                colMinus = true;
            } else {
                return false;
            }
            
            let nextRow = rowMinus ? fromCell.row - 1 : fromCell.row + 1; 
            let nextCol = colMinus ? fromCell.col - 1 : fromCell.col + 1; 
            console.log('row'+ nextRow + ' col' + nextCol);
            while(nextRow !== toCell.row && nextCol !== toCell.col) {
                console.log('row'+ nextRow + ' col' + nextCol);
                if (!this.isEmpty(nextRow, nextCol))
                    return false;

                rowMinus ? nextRow-- : nextRow++;
                colMinus ? nextCol-- : nextCol++;
            }

            return true;
        }
        return false;
    },
    isStraightKill: function(toCell, fromCell) {
        if(fromCell.player) {
            if (this.isFriendlyFire(toCell, fromCell))
                return false;

            if (toCell.col === fromCell.col) {
                let minus = false;

                if(toCell.row < fromCell.row) {
                    minus = true;
                }

                let nextRow =  fromCell.row + 1;
                if (minus) 
                    nextRow =  fromCell.row - 1;
               
                while(nextRow !== toCell.row) {
                    if (!this.isEmpty(nextRow, toCell.col))
                        return false;

                    if (minus) 
                        nextRow--;
                    else
                        nextRow++;
                }

                return true;
            } else if(toCell.row === fromCell.row) {
                let minus = false;

                if(toCell.col < fromCell.col) {
                    minus = true;
                }

                let nextCol =  fromCell.col + 1;
                if (minus) 
                    nextCol =  fromCell.col - 1;
               
                while(nextCol !== toCell.col) {
                    if (!this.isEmpty(toCell.row, nextCol))
                        return false;
                        
                    if (minus) 
                        nextCol--;
                    else
                        nextCol++;
                }

                return true;
            }
            
            return false;    
        }

        return false;
    },

    validate: function(toCell, fromCell) {
        if (ChessBoard.currentTeam !== fromCell.player.team)
            return false;

        switch(fromCell.player.type) {
            case ChessBoard.PLAYER_TYPE.PAWN:   return this.pawnValidator(toCell, fromCell);
            case ChessBoard.PLAYER_TYPE.ROOK:   return this.rookValidator(toCell, fromCell);
            case ChessBoard.PLAYER_TYPE.KNIGHT: return this.knightValidator(toCell, fromCell);
            case ChessBoard.PLAYER_TYPE.BISHOP: return this.bishopValidator(toCell, fromCell);
            case ChessBoard.PLAYER_TYPE.QUEEN:  return this.queenValidator(toCell, fromCell);
            case ChessBoard.PLAYER_TYPE.KING:   return this.kingValidator(toCell, fromCell);
        }
        return true;
    },
    knightValidator: function(toCell, fromCell) {
        let result = false;
        if (this.isFriendlyFire(toCell, fromCell))
            return false;

        if (
            ((this.isCell(fromCell.row - 2, fromCell.col + 1)) && (toCell.row === fromCell.row - 2 && toCell.col === fromCell.col + 1)) || 
            ((this.isCell(fromCell.row - 1, fromCell.col + 2)) && (toCell.row === fromCell.row - 1 && toCell.col === fromCell.col + 2)) || 
            ((this.isCell(fromCell.row + 1, fromCell.col + 2)) && (toCell.row === fromCell.row + 1 && toCell.col === fromCell.col + 2)) || 
            ((this.isCell(fromCell.row + 2, fromCell.col + 1)) && (toCell.row === fromCell.row + 2 && toCell.col === fromCell.col + 1)) || 
            ((this.isCell(fromCell.row + 2, fromCell.col - 1)) && (toCell.row === fromCell.row + 2 && toCell.col === fromCell.col - 1)) || 
            ((this.isCell(fromCell.row + 1, fromCell.col - 2)) && (toCell.row === fromCell.row + 1 && toCell.col === fromCell.col - 2)) || 
            ((this.isCell(fromCell.row - 1, fromCell.col - 2)) && (toCell.row === fromCell.row - 1 && toCell.col === fromCell.col - 2)) || 
            ((this.isCell(fromCell.row - 2, fromCell.col - 1)) && (toCell.row === fromCell.row - 2 && toCell.col === fromCell.col - 1))
        ) {
            result = true;
        }

        return result;
    },
    kingValidator: function(toCell, fromCell) {
        let result = false;
        if (this.isFriendlyFire(toCell, fromCell))
            return false;

        // Start Special Case
        if(fromCell.player.team === ChessBoard.TEAM.team1 && fromCell.row === 7 && fromCell.col === 4 && toCell.row === 7 && toCell.col ===6) {
            if(
                (fromCell.player.moves === 0) &&
                (!ChessBoard.board[7][6].player && !ChessBoard.board[7][5].player) &&
                (ChessBoard.board[7][7].player.type === ChessBoard.PLAYER_TYPE.ROOK && ChessBoard.board[7][7].player.moves === 0)
            ) {
                let toCell = ChessBoard.board[7][5], fromCell = ChessBoard.board[7][7];
                toCell.player = fromCell.player;
                toCell.player.moves++;
                fromCell.player = null;
                return true;
            }
        } else if(fromCell.player.team === ChessBoard.TEAM.team2 && fromCell.row === 0 && fromCell.col === 4 && toCell.row === 0 && toCell.col ===6) {
            if(
                (fromCell.player.moves === 0) &&
                (!ChessBoard.board[0][6].player && !ChessBoard.board[0][5].player) &&
                (ChessBoard.board[0][7].player.type === ChessBoard.PLAYER_TYPE.ROOK && ChessBoard.board[0][7].player.moves === 0)
            ) {
                let toCell = ChessBoard.board[0][5], fromCell = ChessBoard.board[0][7];
                toCell.player = fromCell.player;
                toCell.player.moves++;
                fromCell.player = null;
                return true;
            }
        }

        if (
            (toCell.row === fromCell.row - 1 && toCell.col === fromCell.col) || 
            (toCell.row === fromCell.row - 1 && toCell.col === fromCell.col + 1) || 
            (toCell.row === fromCell.row && toCell.col === fromCell.col + 1) || 
            (toCell.row === fromCell.row + 1 && toCell.col === fromCell.col + 1) || 
            (toCell.row === fromCell.row + 1 && toCell.col === fromCell.col) || 
            (toCell.row === fromCell.row + 1 && toCell.col === fromCell.col - 1) || 
            (toCell.row === fromCell.row && toCell.col === fromCell.col - 1) || 
            (toCell.row === fromCell.row - 1 && toCell.col === fromCell.col - 1)
        ) {
            result = true;
        }
        
        return result;
    },
    queenValidator:  function(toCell, fromCell) {
        return this.isDiagonalKill(toCell, fromCell) || this.isStraightKill(toCell, fromCell);
    },
    bishopValidator: function(toCell, fromCell) {
        return this.isDiagonalKill(toCell, fromCell);
    },
    rookValidator: function(toCell, fromCell) {
        return this.isStraightKill(toCell, fromCell);
    },  
    pawnValidator: function(toCell, fromCell) {
        let result = true;

        if (ChessBoard.TEAM.team1 === fromCell.player.team) {
            if(toCell.col === fromCell.col && 
                (toCell.row === fromCell.row - 1 || (fromCell.player.moves == 0 && toCell.row === fromCell.row - 2 && !ChessBoard.board[fromCell.row - 1][fromCell.col].player)) &&
                !toCell.player
            ) {
                // straight move
                result = true;
            } else if(toCell.player && toCell.player.team !== fromCell.player.team && (toCell.row !== fromCell.row) && (toCell.row === fromCell.row - 1) && (toCell.col === fromCell.col - 1 || toCell.col === fromCell.col + 1)) {
                // kill check
                result = true;
            } else {
                result = false;
            }
        } else {
            if(toCell.col === fromCell.col &&
                (toCell.row === fromCell.row + 1 || (fromCell.player.moves == 0 && toCell.row === fromCell.row + 2  && !ChessBoard.board[fromCell.row + 1][fromCell.col].player)) && 
                !toCell.player
            ) {
                // straight move
                result = true;
            } else if(toCell.player && toCell.player.team !== fromCell.player.team && (toCell.row !== fromCell.row) && (toCell.row === fromCell.row + 1) && (toCell.col === fromCell.col - 1 || toCell.col === fromCell.col + 1)) {
                // kill check
                result = true;
            } else {
                result = false;
            }
        }

        return result;
    }
}

// check mate detection
// player swap
// timer
// move history
