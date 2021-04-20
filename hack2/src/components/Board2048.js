import Row from './Row'

export default function Board2048 ({ board , gameOver , newClick, win}) {

    let boardClassName = "board";
    let infoClassName = "info end-fade-in";
    if ( gameOver ) {
        boardClassName = "game-over-board";
        infoClassName = "game-over-info end-fade-in";
    }
    let outSentence = "No funding this year QAO";
    if ( win ) {
        outSentence = "You should study a PhD!";
    }
    let phdSentence = "You should study a PhD!";
    
    return (
        <>
        <table className={boardClassName} id="board-full">
            <tbody>
                {board.map((row_vector, row_idx) => (<Row key={row_idx} row_vec={row_vector} row_i={row_idx}/>))}
            </tbody>
        </table>
        <div className={infoClassName} id="game-over-info">
            <span id="game-over-text">{outSentence}</span>
            <div className="button" id="game-over-button" onClick={newClick}>Try again</div>
        </div>
        </>
    );
};