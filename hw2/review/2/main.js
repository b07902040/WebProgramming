var counter = 1;
var image_list = [
    'http://kenlu.net/wp-content/uploads/2020/12/under-armour-stephen-curry-curry-brand-launch-1.jpg',
    'https://i.dongtw.com/2020/01/452-2.jpg',
    'https://img.sportsv.net/img/article/cover/6/81176/fit-dHvFxzAqYx-945x495.jpg'
];
setTimeout("loading()",500);
function loading(){
    document.getElementById("display").src = image_list[counter];
    document.getElementsByTagName("a")[0].href = image_list[counter];
    document.getElementsByTagName("a")[0].textContent = image_list[counter];
}
document.getElementById("previous").onclick = function(){
    document.getElementById("display").src = "./images/loading.gif";
    if(counter == 2){
        document.getElementById("next").className = "image-viewer__button"
    }
    if(counter >= 1){
        counter = counter-1; 
    }
    if(counter == 0){
        document.getElementById("previous").className += " disabled"
    }
    document.getElementById("display").src = image_list[counter];
    document.getElementsByTagName("a")[0].href = image_list[counter];
    document.getElementsByTagName("a")[0].textContent = image_list[counter];
}
document.getElementById("next").onclick = function(){
    document.getElementById("display").src = "./images/loading.gif";
    if(counter == 0){
        document.getElementById("previous").className = "image-viewer__button"
    }
    if(counter <= 1){
        counter = counter+1; 
    }
    if(counter == 2){
        document.getElementById("next").className += " disabled"
    }
    document.getElementById("display").src = image_list[counter];
    document.getElementsByTagName("a")[0].href = image_list[counter];
    document.getElementsByTagName("a")[0].textContent = image_list[counter];
}
