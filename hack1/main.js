const commentInput = document.getElementById('comment-input');
const commentButton = document.getElementById('comment-button');
const cancelButton = document.getElementById('cancel-button');
const commentG = document.getElementById("comment-group");
const commentNum = document.getElementById("comment-num");

commentInput.addEventListener('input', updateValue);
var comNum = 1;

function updateValue() {
	var empty = 1;
	for ( var i = 0; i < commentInput.value.length; i++ ) {
		if ( commentInput.value[i] !== " " ) {
			empty = 0;
			break;
		}
	}
	if ( empty === 0 ) {
		commentButton.style.backgroundColor = "#065fd4";
		commentButton.disabled = "";
	}
	else {
		commentButton.style.backgroundColor = "#cccccc";
		commentButton.disabled = "true";
	}
}

function showButtons() {
	commentButton.style.visibility = "visible";
	cancelButton.style.visibility = "visible";
	commentButton.disabled = "true";
}

function endOfInput() {
	commentButton.style.visibility = "hidden";
	cancelButton.style.visibility = "hidden";
	commentInput.value = "";
}

function submitComment() {
	var abjinput = commentInput.value.replace(/\s/g, '&nbsp');
	console.log(abjinput);
	commentG.innerHTML += "<div class='comment'><img class='comment-img' src='images/user-icon.jpg'/><div class='comment-right'><div><span class='comment-name'>Toby Chen </span><span class='comment-time'>現在</span></div><p class='comment-text'>" + abjinput + "</p></div></div>";
	
	commentInput.value = "";
	comNum += 1;
	commentNum.innerHTML = comNum + "則留言";
	
	commentButton.style.backgroundColor = "#cccccc";
	commentButton.disabled = "true";
}


