var imagesrc= [
    "https://iphone-wallpaper.pics/wallpaper/a/p/apple-wooden20210223_raw.jpg",
    "https://iphone-wallpaper.pics/wallpaper/w/p/wp4993855_79f0e5a5ed6bd568e155767941ba2fc5_raw.jpg",
    "https://iphone-wallpaper.pics/wallpaper/m/a/manarola-italy-iphone-wallpaper_7e3eba43b9ef769ac4ef0361cd184e55_raw.jpg",
    "https://iphone-wallpaper.pics/wallpaper/h/u/huawei-magazine-wallpaper-100-1440x2560_2febc560de7b71880dc45772f5364d72_raw.jpg",
    "https://iphone-wallpaper.pics/wallpaper/1/0/1007934-gorgerous-victoria-falls-wallpaper-1080x1920_a3d9308d110574fd315b0f3eb9d9af6f_raw.jpg",
    "https://iphone-wallpaper.pics/wallpaper/w/p/wp5351374_951c4fd7b8c6a60e6e4b21c9c2670e46_raw.jpg",
    "https://iphone-wallpaper.pics/wallpaper/h/u/huawei-magazine-wallpaper-162-1440x2560_ddf5e03f7f8eccf408a64ee08b45ad50_raw.jpg",
    "https://iphone-wallpaper.pics/wallpaper/i/p/iphone-12-1440x2560-green-abstract-apple-october-2020-event-4k-23088_b58ed82776a35aab41ed58649f6cb91d_raw.jpg"
];
var i = 0;

function nextphoto() {
    if ( i === imagesrc.length-1 ) {
        return;
    }
    if ( i === 0 ) {
        var pre_button = document.getElementById("pre_button");
        pre_button.className = "image-viewer__button";
    }
    var nowphoto = document.getElementById("display");
    var imgsrc = document.getElementById("imgsrc");
    i++;
    nowphoto.src = imagesrc[i];
    imgsrc.herf = imagesrc[i];
    imgsrc.innerText = imagesrc[i];
    if ( i === imagesrc.length-1 ) {
        var next_button = document.getElementById("next_button");
        next_button.className = "disabled";
    }
}

function prephoto() {
    if ( i === 0 ) {
        return;
    }
    if ( i === imagesrc.length-1 ) {
        var next_button = document.getElementById("next_button");
        next_button.className = "image-viewer__button";
    }
    var nowphoto = document.getElementById("display");
    var imgsrc = document.getElementById("imgsrc");
    i--;
    nowphoto.src = imagesrc[i];
    imgsrc.herf = imagesrc[i];
    imgsrc.innerText = imagesrc[i];
    if ( i === 0 ) {
        var pre_button = document.getElementById("pre_button");
        pre_button.className = "disabled";
    }
}