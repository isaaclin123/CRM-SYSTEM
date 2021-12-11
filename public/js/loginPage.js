window.addEventListener("load",function(){
    // let form =document.getElementsByTagName("form")[0];
    // form.reset();
    history.pushState(null,null,document.URL);
    window.addEventListener("popstate",function(){
        history.pushState(null,null,document.URL);
    })
    let inputs =document.getElementsByTagName("input");
         for(let i=0;i<inputs.length;i++){
             inputs[i].addEventListener("keyup",function(){
                let clean=HtmlSanitizer.SanitizeHtml(inputs[i].value);
             })  
         }
     
})
