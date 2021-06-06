import { ALLOWED_TAGS } from './constants'
export {
    startsWith,
    downloadAsFile,
    getLocalStorageSpace,
    sanitize,
    isEmailValid,
    isPasswordValid
}

function startsWith (src, part) {
    return src.substring(0, part.length) === part
}


/**
 * This is a static download functionality
 * i.e. provide a fulename and some text,
 * and this function will start a download a file of that filename 
 * containing the provided text in the browser
 * @param {*} filename 
 * @param {*} text 
 */
function downloadAsFile (filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/**
 * Returns an approximate size of total localstorage space
 */
function getLocalStorageSpace () {
    var allStrings = '';
    for (var key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
            allStrings += window.localStorage[key];
        }
    }
    return allStrings ? 3 + ((allStrings.length * 16) / (8 * 1024)) + ' KB' : 'Empty (0 KB)';
}

/**
 * Sanitize HTML
 * @param {*} dirtyHtml 
 */
const sanitize = dirtyHtml => window.DOMPurify.sanitize(dirtyHtml, { ALLOWED_TAGS })


const isEmailValid = email => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))

//
// at least one lowercase letter, 
// one uppercase letter, one numeric digit, 
// and one special character
// Length between 8 to 20
// https://www.w3resource.com/javascript/form/password-validation.php
//
const isPasswordValid = pswd => (/^(?=.*[0-9])(?=.*[- ?!@#$%^&*\/\\])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9- ?!@#$%^&*\/\\]{8,20}$/.test(pswd))