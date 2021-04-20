export default function Header({generalStep, generalQs, newClick, bestQs}){

    return (
        <>
        <h1 id="title">Merging School</h1>
        <div className="btn-groups">
            <div className="qs-ranking" id="general-qs-ranking">QS: <p id="general-qs-ranking-value">{generalQs}</p></div>
            <div className="qs-ranking" id="general-step">Step: <p id="general-step-value">{generalStep}</p></div>
            <div className="qs-ranking" id="best-qs-ranking">Best: <p id="best-qs-ranking-value">{bestQs}</p></div>
            <div className="button" id="reset-button" onClick={newClick}>New Game</div>
        </div>
        </>
    );
}