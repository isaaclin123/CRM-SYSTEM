window.addEventListener("load",function(){
    function deleteCookie(cname) {
        const d = new Date();
        d.setDate(0);
        document.cookie = `${cname}= ; expires=${d.toUTCString ()}; path=/`; 
    }
    deleteCookie("authToken");
    let inputs =document.getElementsByTagName("input");
             for(let i=0;i<inputs.length;i++){
                 inputs[i].addEventListener("keyup",function(){
                    HtmlSanitizer.SanitizeHtml(inputs[i].value);
                 })  
             }
    var stateObj = { foo: 'bar' };
    history.pushState(stateObj, 'page 2', '/'); 
    // history.replaceState(stateObj,null,"/")  ; 
    
})


    







