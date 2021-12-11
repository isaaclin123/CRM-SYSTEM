/**
 * Put the whole file's functions and variables into a function and export it so we can reuse it in user editing page
 */
//  import * as sanitizeHtml from 'sanitize-html'

 checkUsernameAndPassword("/app/newAccount");
 export function checkUsernameAndPassword(url){
 
    window.addEventListener("load",function(){
         let inputs =document.getElementsByTagName("input");
         for(let i=0;i<inputs.length;i++){
             inputs[i].addEventListener("keyup",function(){
                let clean=HtmlSanitizer.SanitizeHtml(inputs[i].value);
             })  
         }
         let submitButton =document.querySelector("#submitButton");
         let errorMessage=document.querySelectorAll(".sys-message");
         let resetButton =document.querySelector("#reset");
         resetButton.addEventListener("click",function(){
             for(let i=0;i<errorMessage.length;i++){
                 errorMessage[i].style.display="none";
             }
         })
         /**
          * Request ajax to check username's availability instantly and compare the username with regular expression,
          * disable the submit button if the username does not match with requirement.
          */
         let usernameInput =document.querySelector("#txtUsername");
         usernameInput.addEventListener("keyup",checkUsernameAvailability);
         function checkUsernameAvailability(){
             let usernameHintSpan =document.querySelector("#usernameAvailability");
             usernameHintSpan.style.display="inline";
             let username=usernameInput.value;
             let usernamePattern = /^[a-zA-Z0-9_-]{4,16}$/;
             let request =new XMLHttpRequest();
             request.onreadystatechange=function(){ 
                 if((request.readyState==4)&&(request.status==200)){
                     let str =request.responseText;
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
         /**
          * Check if the passwords that user enter are the same and compatible with the regular expression.
          * Disable the submit button if the password does not match with requirement
          */
         let password2Element = document.querySelector("#password2");
         let password1Element = document.querySelector("#password1");
         password2Element.addEventListener("keyup",test);
         password1Element.addEventListener("keyup",test);
         function test(){
             let passwordCheck =document.querySelector("#passwordConfirmation");
             let password1 =password1Element.value;
             let password2 =password2Element.value;
             const passwordPattern =/^(?=.{8,})(?![^a-zA-Z]+$)(?!\D+$)/;
             let usernameHintSpan =document.querySelector("#usernameAvailability");
             passwordCheck.style.display="inline";
             if((password1===password2)&&(passwordPattern.test(password1)==true)&&(passwordPattern.test(password2)==true)){
                 passwordCheck.innerHTML= "&#10003;";
                 passwordCheck.style.left="200px";
                 passwordCheck.style.top=0;
                
                 if(usernameHintSpan.innerHTML==="This username is taken, please choose another!"){
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

         

 
    });
 }