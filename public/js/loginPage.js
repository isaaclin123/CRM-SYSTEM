import {sanitizer} from "./helper.js";
window.addEventListener("load",function(){
    document.querySelector(".preloader").style.display="none";
    function deleteCookie(cname) {
        const d = new Date();
        d.setDate(0);
        document.cookie = `${cname}= ; expires=${d.toUTCString ()}; path=/`; 
    }
    deleteCookie("authToken");
    sanitizer();
    var stateObj = { foo: 'bar' };
    history.pushState(stateObj, 'page 2', '/');  
    
})


    







