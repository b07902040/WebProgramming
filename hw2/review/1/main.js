function init(){
    //alert ("ok");

    //全域按鈕
    next_but=document.getElementById("next");
    pre_but=document.getElementById("previous");
    //pre_but.style.filter="grayscale(100%)";

    //全域圖片連結imgsrc
    imgsrc=document.getElementById("link"); 

    //全域array
    pics=["https://stickershop.line-scdn.net/stickershop/v1/sticker/230059742/IOS/sticker.png",
          "https://stickershop.line-scdn.net/stickershop/v1/sticker/230059766/ANDROID/sticker.png",
          "https://stickershop.line-scdn.net/stickershop/v1/sticker/230059746/ANDROID/sticker.png",
          "https://stickershop.line-scdn.net/stickershop/v1/sticker/23335552/ANDROID/sticker.png"
            ]
    //全域目前圖片
    display_pic=document.getElementById("display");
    display_div=document.getElementById("display_div");
    

    display_div.style.backgroundImage="url('images/loading.gif')";
    display_div.style.backgroundSize = "510px 300px"

    current_pic=0;
    display_pic.src=pics[current_pic];
    imgsrc.href=pics[current_pic];
    imgsrc.innerHTML=pics[current_pic];

    display_div.style.backgroundImage="url('')";

    checkState();
    

}



function clickNext(){

    if (current_pic !==pics.length-1 ) //還沒到最後一張
        { 
            
            display_div.style.backgroundImage="url('images/loading.gif')";
            display_div.style.backgroundSize = "510px 300px"

                current_pic=current_pic+1;
                display_pic.src=pics[current_pic];
                imgsrc.href=pics[current_pic];
                imgsrc.innerHTML=pics[current_pic];

            display_div.style.backgroundImage="url('')";
        }
        checkState();
}

function clickPre(){

    if (current_pic !==0 ) //還沒到第一張
        {
            display_div.style.backgroundImage="url('images/loading.gif')";
            display_div.style.backgroundSize = "510px 300px"

                current_pic=current_pic-1;     
                display_pic.src=pics[current_pic];
                imgsrc.href=pics[current_pic];
                imgsrc.innerHTML=pics[current_pic];
            
            display_div.style.backgroundImage="url('')";
            
        }
        checkState();

}

function checkState(){
    if(current_pic === pics.length-1)//如果到最後一張
        {
            next_but.className="disabled";
        }
    else
        {
            next_but.className=""
        }
    if(current_pic === 0)//如果到第一張
            {
                pre_but.className="disabled";
            }
        else
            {
                pre_but.className="";
            }
}

