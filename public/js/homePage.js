import {changeLocationHref} from "./helper.js";
window.addEventListener("load",function(){
    /**
     * redirect user to the different page when clicking different item
     */
    document.querySelector(".uncompleted-task span").addEventListener("click",()=>{
        setBackwardPage();
        location.replace("/userTasks");
        
    })
    document.querySelector(".client span").addEventListener("click",()=>{
        setBackwardPage();
        location.replace("/contact");
    })
    const dialogBox = document.getElementById("dialogBox"),
    redirectButton  = document.getElementById("redirect"),
    cancelButton = document.getElementById("cancel");

    function cancel(){
        cancelButton.addEventListener("click",function(){
            dialogBox.classList.remove("display");
        })
    }
    /**
     * Hide the due tasks dialogbox after login
     */
    if(location.href.indexOf("login")===-1){
        setTimeout(()=>{
            dialogBox.classList.add("display");},1000);
            redirectButton.addEventListener("click",()=>{
                setBackwardPage();
                location.replace("/userTasks");
                
            })
        cancel();  
    }
    /**
     * Display the due tasks dialogbox when clicking the bell
     */
    const bell=document.querySelector(".notification");
    bell.addEventListener("click",()=>{
        dialogBox.classList.add("display");
        redirectButton.addEventListener("click",()=>{
            setBackwardPage();
            location.replace("/userTasks");
            
        })
        cancel(); 
    })
    /**
     * Redirect to the contact list page when click on the client's name
     */
    const sliderClients=document.querySelectorAll(".slider-container h3");
    sliderClients.forEach(client=>{
        client.addEventListener("click",(event)=>{
            let clientID=event.target.getAttribute("data-clientID");
            setBackwardPage();
            location.replace(`/contact?clientID=${clientID}`);

        })
    })
    /**
     * Push the current page to the browser history
     */
    function setBackwardPage(){
        history.pushState(null, 'home page', '/home?login=1'); 
    }

    changeLocationHref();
    
})