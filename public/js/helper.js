function checkUsernameAvailability(){
    let submitButton =document.querySelector("#submitButton");
    let url;
    if(location.href.includes("/newAccount")){
        url="app/newAccount";
    }else if(location.href.includes("/setting")){
        url="/checkUser"
    }
     let usernameInput =document.querySelector("#txtUsername");
     let usernameHintSpan =document.querySelector("#usernameAvailability");
     usernameHintSpan.style.display="inline";
     let username=usernameInput.value;
     let usernamePattern = /^[a-zA-Z0-9_-]{4,16}$/;
     let request =new XMLHttpRequest();
     request.onreadystatechange=function(){ 
         if((request.readyState==4)&&(request.status==200)){
             let str =request.responseText;
            //  console.log(str);
             if(str=="true"){
                usernameHintSpan.style.left=0;
                usernameHintSpan.style.top="25px";
                 usernameHintSpan.innerHTML="This username is taken, please choose another!";
                 submitButton.disabled=true;
             }else{
                 if(usernamePattern.test(username)==true){
                     usernameHintSpan.innerHTML= "&#10003;";
                     usernameHintSpan.style.left="200px";
                     usernameHintSpan.style.top=0;
                     submitButton.disabled=false;
                 }else{
                    usernameHintSpan.style.left=0;
                    usernameHintSpan.style.top="25px";
                     usernameHintSpan.innerHTML="Must be 4-16 characters (Abc 123 _ -)";
                     submitButton.disabled=true;
                 }
                 
             }
         }
     };
     request.open("GET",`${url}?username=`+username,true);
     // request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
     request.send();
 };

 function test(){
    let submitButton =document.querySelector("#submitButton");
    let password2Element = document.querySelector("#password2");
    let password1Element = document.querySelector("#password1");
    let passwordCheck =document.querySelector("#passwordConfirmation");
    let password1 =password1Element.value;
    let password2 =password2Element.value;
    const passwordPattern =/^(?=.{8,})(?![^a-zA-Z]+$)(?!\D+$)/;
    let usernameHintSpan =document.querySelector("#usernameAvailability");
    let checkOldPassword=document.querySelector("#checkOldPassword");
    // console.log(usernameHintSpan.innerHTML);
    passwordCheck.style.display="inline";
    if((password1===password2)&&(passwordPattern.test(password1)==true)&&(passwordPattern.test(password2)==true)){
        passwordCheck.innerHTML= "&#10003;";
        passwordCheck.style.left="200px";
        passwordCheck.style.top=0;
        
        if(usernameHintSpan&&(usernameHintSpan.innerHTML==="This username is taken, please choose another!"||usernameHintSpan.innerHTML==="Must be 4-16 characters (Abc 123 _ -)")){
            submitButton.disabled=true;
        }else{
            submitButton.disabled=false;
        }
        
        if(checkOldPassword&&(checkOldPassword.innerHTML==="Wrong password!")){
            submitButton.disabled=true;
        }else{
            submitButton.disabled=false;
        }

    }else{
        submitButton.disabled=true;
        passwordCheck.style.left=0;
        passwordCheck.style.top="25px";
        if((passwordPattern.test(password1)==false)&&(passwordPattern.test(password2)==false)){
            passwordCheck.innerHTML="At least 8 characters, min 1 letter & 1 number";
        }else{
            passwordCheck.innerHTML="Passwords don't match, please re-enter";
        } 
    }   
};

function sanitizer(){
    let inputs =document.getElementsByTagName("input");
    for(let i=0;i<inputs.length;i++){
        inputs[i].addEventListener("keyup",function(){
            HtmlSanitizer.SanitizeHtml(inputs[i].value);
        })  
    }
}

function changeLocationHref(){
    let msg =document.querySelector("#msg h3");
    if(msg){
        let nextURL;
        let nextTitle;
        if(location.href.includes("/contact")){
            nextURL = '/contact';
            nextTitle = 'Contact page';
        }else if(location.href.includes("/setting")){
            nextURL = '/setting';
            nextTitle = 'Setting page';
        }
        const nextState = { additionalInformation: 'Updated the URL with JS' };
        window.history.replaceState(nextState, nextTitle, nextURL);
        // This will replace the current entry in the browser's history, without reloading
    }
}

function direction(){
    document.querySelector(".direction i:nth-child(1)").addEventListener("click",function(){
        window.scrollTo(0,0);
    })
    document.querySelector(".direction i:nth-child(3)").addEventListener("click",function(){
        window.scrollTo(0,document.body.scrollHeight);
    })
}
 export {checkUsernameAvailability,test,sanitizer,changeLocationHref,direction};
