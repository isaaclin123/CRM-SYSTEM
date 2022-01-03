/**
 * Put the whole file's functions and variables into a function and export it so we can reuse it in user editing page
 */
//  import * as sanitizeHtml from 'sanitize-html'
import {checkUsernameAvailability,test,sanitizer}from "./helper.js";
window.addEventListener("load",function(){
    function deleteCookie(cname) {
        const d = new Date();
        d.setDate(0);
        document.cookie = `${cname}= ; expires=${d.toUTCString ()}; path=/`; 
    }
    deleteCookie("authToken");
    document.querySelector("#my_form").reset();
    sanitizer();
    let errorMessage=document.querySelectorAll(".sys-message");
    let resetButton =document.querySelector("#Reset");
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
    /**
     * Check if the passwords that user enter are the same and compatible with the regular expression.
     * Disable the submit button if the password does not match with requirement
     */
    let password2Element = document.querySelector("#password2");
    let password1Element = document.querySelector("#password1");
    password2Element.addEventListener("keyup",test);
    password1Element.addEventListener("keyup",test);

});
