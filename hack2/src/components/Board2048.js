import Row from './Row'

export default function Board2048 ({ board , gameOver , newClick, win, first, newlyBoard}) {

    let boardClassName = "board";
    let infoClassName = "end-fade-in info";
    if ( gameOver ) {
        boardClassName = "game-over-board";
        infoClassName = "end-fade-in game-over-info";
    }
    let outSentence = "No funding this year QAO";
    if ( win ) {
        outSentence = "You should study a PhD!";
    }
    if ( first ) {
        infoClassName = "info";
    }
    
    return (
        <>
        <table className={boardClassName} id="board-full">
            <tbody>
                {board.map((row_vector, row_idx) => (<Row key={row_idx} row_vec={row_vector} row_i={row_idx} newlyBoard={newlyBoard}/>))}
            </tbody>
        </table>
        <div className={infoClassName} id="game-over-info">
            <span id="game-over-text">{outSentence}</span>
            <div className="button" id="game-over-button" onClick={newClick}>Try again</div>
        </div>
        </>
    );
};