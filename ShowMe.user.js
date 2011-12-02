// ==UserScript==
// @name        Show Me
// @author      thurmda
// @namespace   http://danielthurman.com/
// @description 
// @include       *
// ==/UserScript==

//only run on top (no iframes, etc.)
if (top != self)
	return;

(function(){
    
    var  sister = document.getElementById('mainlogo'),
    el = document.createElement('a');
    el.innerHTML = 'Show Me';
    el.href = "http://danielthurman.com/sxsw";
    if(sister){
        sister.parentNode.insertBefore(el, sister.nextSibling);
    }
    console.dir(sister);
}());