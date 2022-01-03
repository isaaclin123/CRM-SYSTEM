
import {checkUsernameAvailability,test,sanitizer,changeLocationHref} from "./helper.js";
window.addEventListener("load",function(){
    sanitizer();
    let navLists =document.querySelectorAll(".nav ul li");
    let setting_content=document.querySelector(".setting-content");
    navLists[0].classList.add("click-background");
    navLists.forEach(element => {
        element.addEventListener("click",function(event){
            navLists.forEach(list =>{
                list.classList.remove("click-background");
            })
            this.classList.add("click-background");
            setting_content.style.opacity=0;
            setting_content.classList.remove("transition");
            setTimeout(function(){
                setting_content.classList.add("transition");
                setting_content.style.opacity=1;
            },300)
        })
    })
    editProfile();
    async function editProfile(){
        const user=await getUser();
        setting_content.innerHTML=`
        <form action="/updateUser" method="POST" id="my_form" autocomplete="off">

            <div class = "txtfield">
                <input type="text" name="username" id="txtUsername" required value="${user.username}">
                <span></span>
                <label for="txtUsername">Username:</label>
                <alert class = "sys-message" id="usernameAvailability"></alert>
            </div>

            <div class = "txtfield">
                <input type="text" name="first_name" id="first_name" required value="${user.first_name}">
                <span></span>
                <label for="first_name">First Name:</label>
            </div>

            <div class = "txtfield">
                <input type="text" name="last_name" id="last_name" required value="${user.last_name}">
                <span></span>
                <label for="last_name">Last Name:</label>
            </div>

            <div class = "txtfield">
                <input type="text" name="companyName" id="companyName" required value="${user.isQualifiedCompany}" disabled>
                <span></span>
                <label for="companyName">Company Name:</label>
                <alert class = "sys-message" id="qualifiedCompany"></alert>
            </div>

            <div class = "txtfield">
                <input type="text" name="jobTitle" id="jobTitle" required value="${user.jobTitle}">
                <label for="jobTitle">Job Title:</label>
            </div>
            <div class = "txtfield">
                    <input type="email" name="email" id="email" required value="${user.email}" >
                    <label for="email">Email:</label>
                </div>
            <div id = "sub-res">
                <button type="submit" value = "submit" id="submitButton">Save change</button>
            </div>
        </form>
        `;
        let usernameInput =document.querySelector("#txtUsername");
        usernameInput.addEventListener("keyup",checkUsernameAvailability);
    }
    navLists[0].addEventListener("click",function(){
        editProfile();
    })
    navLists[1].addEventListener("click",function(){
        setting_content.innerHTML=`
        <form action="/updateUserPassword" method="POST" id="my_form">
            <div class = "txtfield">
                <input type="password" name="password0" id="password0" required>
                <span></span>
                <label for="password0">Old Password:</label>
                <alert class = "sys-message" id="checkOldPassword"></alert>
            </div>
            <div class = "txtfield">
                <input type="password" name="password1" id="password1" required>
                <span></span>
                <label for="password1">New Password:</label>
            </div>
            <div class = "txtfield">
                <input type="password" name="password2" id="password2" required>
                <span></span>
                <label for="password2">Re-enter new password:</label>
                <alert class = "sys-message" id="passwordConfirmation"></alert>
            </div>
            <div id = "sub-res">
                <button type="submit" value = "submit" id="submitButton">Save change</button>
            </div>
        </form>`;

        const password2Element = document.querySelector("#password2");
        const password1Element = document.querySelector("#password1");
        password2Element.addEventListener("keyup",test);
        password1Element.addEventListener("keyup",test);
        const oldPassword =document.querySelector("#password0");
        let submitButton =document.querySelector("#submitButton");
        let timer;
        oldPassword.addEventListener("keyup",function(){
            clearTimeout(timer);
            timer=setTimeout(()=>{
                let request =new XMLHttpRequest();
            request.onreadystatechange=function(){ 
                if((request.readyState==4)&&(request.status==200)){
                    let str =request.responseText;
                    let checkOldPassword=document.querySelector("#checkOldPassword");
                    if(str==="true"){
                        checkOldPassword.innerHTML=`&#10003;`;
                        checkOldPassword.style.left="200px";
                        checkOldPassword.style.top=0;
                        submitButton.disabled=false;

                    }else{
                        checkOldPassword.innerHTML=`Wrong password!`;
                        checkOldPassword.style.left=0;
                        checkOldPassword.style.top="25px";
                        submitButton.disabled=true;
                    }
                }
            };
            request.open("POST",`/checkOldPassword`);
            request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            request.send(`oldPassword=${oldPassword.value}`);
                
            },500);
            
        });

    })
    navLists[2].addEventListener("click",function(){
        setting_content.innerHTML=`<form action="/deleteUser" method="GET" id="my_form">
                                        <div id="warning">
                                            <i class='bx bx-error'></i>
                                        </div>
                                        <div id = "sub-res">
                                            <button type="submit" value = "submit" id="submitButton">Delete</button>
                                        </div>
                                    </form>`;
            //Creating the variables and getting elements from DOM
        let dialogBox = document.getElementById("dialogBox"),
        deleteButton  = document.getElementById("delete"),
        cancelButton = document.getElementById("cancel");
        document.getElementById("submitButton").addEventListener("click",function(event){
            event.preventDefault();
            dialogBox.classList.add("display");
            deleteButton.addEventListener("click",function(){
                // let request =new XMLHttpRequest();
                // request.open("GET",`/deleteUser`,true);
                // request.send();
                location.replace("/deleteUser");
            })

            cancelButton.addEventListener("click",function(){
                dialogBox.classList.remove("display");
            })
        })
    })

    async function getUser(){
        const userObj =await fetch(`http://localhost:3000/user`);
        const user= await userObj.json();
        return user;
    }

    changeLocationHref();



})
