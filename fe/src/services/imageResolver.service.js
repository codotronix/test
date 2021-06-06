/**
 * Since all out story banner images has the same url pattern
 * i.e. `${storyUrl}.webp`
 * We need to first if the image is actually available
 * And return true / false depending on that...
 * Also we can cache the api calls tying it with the specific url
 */
// import { config } from '../utils/urls'

// const IMG_AVAIALABLE = {}   // { url1: true, url2: false, url3: false ... }

// export const resolveImage = imgUrl => {

//     // if cached data available, return it
//     if(imgUrl in IMG_AVAIALABLE) return IMG_AVAIALABLE[imgUrl]

//     var http = new XMLHttpRequest();

//     http.open('HEAD', imgUrl, false);
//     http.send();

//     IMG_AVAIALABLE[imgUrl] = http.status !== 404 ? imgUrl : config.defaultImg
//     return IMG_AVAIALABLE[imgUrl]
// }