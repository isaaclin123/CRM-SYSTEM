
import {checkUsernameAvailability,test,sanitizer,changeLocationHref,getUser} from "./helper.js";
window.addEventListener("load",function(){
    
    sanitizer();
    let navLists =document.querySelectorAll(".nav ul li");
    let setting_content=document.querySelector(".setting-content");
    
    /**
     * Change the nav list's background when clicking
     */
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
    /**
     * Edit user's profile
     */
    if(!this.location.href.includes("Company")&&!this.location.href.includes("password")){
        editProfile();
    }
    
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
                <input type="text" name="companyName" id="companyName" required value="${user.isqualifiedcompany}" disabled>
                <span></span>
                <label for="companyName">Company Name:</label>
                <alert class = "sys-message" id="qualifiedCompany"></alert>
            </div>

            <div class = "txtfield">
                <input type="text" name="jobTitle" id="jobTitle" required value="${user.jobtitle}">
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
    /**
     * Check and update user's password
     */
    navLists[1].addEventListener("click",function(){
        updatePassword();
    })
    function updatePassword(){
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
                <label for="password2">Re-enter password:</label>
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
    }
    /**
     * Delete user
     */
    navLists[2].addEventListener("click",function(){
        setting_content.innerHTML=`<form action="/deleteUser" method="GET" id="my_form">
                                        <div id="warning">
                                            <i class='bx bx-error'></i>
                                        </div>
                                        <div id = "sub-res">
                                            <button type="submit" value = "submit" id="submitButton">Delete</button>
                                        </div>
                                    </form>`;
        let dialogBox = document.getElementById("dialogBox"),
        deleteButton  = document.getElementById("delete"),
        cancelButton = document.getElementById("cancel");
        document.getElementById("submitButton").addEventListener("click",function(event){
            event.preventDefault();
            dialogBox.classList.add("display");
            deleteButton.addEventListener("click",function(){
                location.replace("/deleteUser");
            })

            cancelButton.addEventListener("click",function(){
                dialogBox.classList.remove("display");
            })
        })
    });

    /**
     * Add company 
     */
    navLists[3].addEventListener("click",function(){
        addCompanyForm();

    })
    function addCompanyForm(){
        setting_content.innerHTML=`
        <form action="/AddQualifiedCompany" method="POST" id="my_form">
            <h3>Add a new company and enable user to create account with this company</h3>
            <div class = "txtfield">
                <input type="text" name="newCompany" id="newCompany" required>
                <span></span>
                <label for="newCompany">New company:</label>
                <alert class = "sys-message" id="newCompany"></alert>
            </div>
            <div id = "sub-res">
                <button type="submit" value = "submit" id="submitButton">Add</button>
            </div>
        </form>`;
    }

    if(location.href.includes("Company")){
        navLists[3].click();
        addCompanyForm();
    }else if(location.href.includes("password")){
        navLists[1].click();
        updatePassword();
    }

    

    changeLocationHref();



})
