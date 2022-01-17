import {changeLocationHref,getClientNameByID} from "./helper.js";
window.addEventListener("load",function(){
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
    
    if(location.href.indexOf("login")===-1){
        console.log("here");
        setTimeout(()=>{
            dialogBox.classList.add("display");},1000);
            redirectButton.addEventListener("click",()=>{
                setBackwardPage();
                location.replace("/userTasks");
                
            })
        cancel();  
    }
    const bell=document.querySelector(".notification");
    bell.addEventListener("click",()=>{
        dialogBox.classList.add("display");
        redirectButton.addEventListener("click",()=>{
            setBackwardPage();
            location.replace("/userTasks");
            
        })
        cancel(); 
    })

    const sliderClients=document.querySelectorAll(".slider-container h3");
    sliderClients.forEach(client=>{
        client.addEventListener("click",(event)=>{
            let clientID=event.target.getAttribute("data-clientID");
            console.log(event.target);
            setBackwardPage();
            location.replace(`/contact?clientID=${clientID}`);

        })
    })
    
    function setBackwardPage(){
        history.pushState(null, 'home page', '/home?login=1'); 
    }

    changeLocationHref();
    
})