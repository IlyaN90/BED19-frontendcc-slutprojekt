let currentPage = 1;
let totalPages = 1;
let lastSearch = '';
let license= '';
let perPage = 10;
let lightbox = document.querySelector('.lightbox-container');
let lightboxImg = document.querySelector('.lightbox-container img');

document.querySelector('button#search-button').addEventListener('click', () => {
    doSearch();
});

document.querySelector('input#search-text').addEventListener('keyup', () => {
    if(event.keyCode == 13){
        doSearch();
    }
});


document.querySelector('a#next-page').addEventListener('click', async () => {
    if(currentPage != totalPages){
        currentPage++;

        let images = await getImages(lastSearch, license, perPage);

        updateUI(images);
    }
});

document.querySelector('a#previous-page').addEventListener('click', async () => {
    if(currentPage != 1){
        currentPage--;

        let images = await getImages(lastSearch, license, perPage);

        updateUI(images);
    }
});

document.querySelector('.lightbox-container').addEventListener('click', () => {
    lightbox.classList.add('hide');
    lightboxImg.setAttribute('src', ``);
    lightboxImg.setAttribute('alt', ``);
});

async function doSearch(){
    let newSearch = document.querySelector('input#search-text').value;
    license = document.querySelector('select#licenses').value;
    perPage = document.querySelector('select#imgs-per-page').value;
    if(newSearch.length > 0)
    {
        lastSearch = newSearch;
        currentPage = 1;
        let images = await getImages(lastSearch, license, perPage);
        totalPages = await images.photos.pages;
        console.log(`${totalPages} pages`);
        updateUI(images);
    }
}

async function getImages(text = 'truck', license='', perPage=10){
    const baseUrl = 'https://www.flickr.com/services/rest/';
    const apiKey = '2af54aca22ccb9c902078adc64b47907';
    let urlString = `${baseUrl}?method=flickr.photos.search&api_key=${apiKey}&text=${text}&license=${license}&safe_search=1&per_page=${perPage}&page=${currentPage}&format=json&nojsoncallback=1`;
    //console.log(urlString);
    try{
        let resp = await fetch(urlString);
        let data = await resp.json();
        
        return await data;
    }
    catch(err){
        console.error(err);
    }
}

function buildImgUrl(imgData, size= 'z'){
    let imgUrl = `https://farm${imgData.farm}.staticflickr.com/${imgData.server}/${imgData.id}_${imgData.secret}_${size}.jpg`
    return imgUrl;
}

function updateUI(data){
    let main = document.querySelector('main');
    main.innerHTML = '';
    console.log(`${data.photos.photo.length} found`);
    let failed = 0;
    data.photos.photo.forEach(img => {
        
        if(img.farm != 0){
            //console.log(img);
            let el = document.createElement('img');
            el.setAttribute('src', buildImgUrl(img, 'q'));
            el.setAttribute('alt', img.title);
            el.addEventListener('click', () => {
                lightboxImg.setAttribute('src', `${buildImgUrl(img, 'b')}`);
                lightboxImg.setAttribute('alt', `${img.title}`);
                lightbox.classList.remove('hide');
            });
            main.appendChild(el);
        }
        else
        {
            failed++;
        }
        document.querySelector('footer section').innerHTML = `${currentPage} / ${totalPages}`
    });
    console.log(`${failed} failed to load`);
    main.classList.remove('hide');
    document.querySelector('footer').classList.remove('hide');
}
/*
&text=
&license=
&safe_search=1
&media=photos
&per_page=
&page=
&format=json
&nojsoncallback=1
*/

/*
Size Suffixes

The letter suffixes are as follows:
s	small square 75x75
q	large square 150x150
t	thumbnail, 100 on longest side
m	small, 240 on longest side
n	small, 320 on longest side
-	medium, 500 on longest side
z	medium 640, 640 on longest side
c	medium 800, 800 on longest side†
b	large, 1024 on longest side*
h	large 1600, 1600 on longest side†
k	large 2048, 2048 on longest side†
o	original image, either a jpg, gif or png, depending on source format
*/