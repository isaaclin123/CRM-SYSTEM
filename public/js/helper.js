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
    if(msg||location.href.indexOf("userID=")!==-1||location.href.indexOf("login")===-1){
        let nextURL;
        let nextTitle;
        if(location.href.includes("/contact")){
            nextURL = '/contact';
            nextTitle = 'Contact page';
        }else if(location.href.includes("/setting")){
            nextURL = '/setting';
            nextTitle = 'Setting page';
        }else if(location.href.includes("/manageUsers")){
            nextURL = '/manageUsers';
            nextTitle = 'User management';
        }else if(location.href.includes("/taskManagement")){
            nextURL = '/taskManagement';
            nextTitle = 'Task management';
        }else if(location.href.includes("/userTasks")){
            nextURL = '/userTasks';
            nextTitle = 'User task management';
        }else if(location.href.includes("/home")){
            nextURL = '/home?login=1';
            nextTitle = 'Home page';
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

async function getUser(){
    const userObj =await fetch(`/user`);
    const user= await userObj.json();
    return user;
}

async function getUserByID(id){
    let user;
    try {
        const userObj =await fetch(`/user?id=${id}`);
        user= await userObj.json();
    } catch (error) {
        console.log(error.message);
    }
    
    return user;
}
async function getAllUsers(){
    const userObj =await fetch(`/users`);
    console.log(userObj);
    const users= await userObj.json();
    console.log(users);
    return users;
}

async function getClientNameByID(clientID){
    let clientName;
    try {
        const clientObj =await fetch(`/task/clientName?clientID=${clientID}`);
        clientName= await clientObj.json();
    } catch (error) {
        console.log(error.message);
    }
    return clientName;
}

function toggleManagementTools(){
    const managementTools=document.querySelectorAll(`.managementTools i`), checkboxes=document.querySelectorAll(`input[type="checkbox"]`),delete_selected_users=document.querySelector(".delete-selected-users"),grid=document.querySelector(".bx-grid-small");
    delete_selected_users.classList.add("hide");
    checkboxes.forEach(checkbox=>{checkbox.classList.add("hide")});
    function displayManagementTools(){
        grid.classList.remove("hide");
        delete_selected_users.classList.add("hide");
        managementTools.forEach(element=>{
            element.classList.remove("hide");
        })
        checkboxes.forEach(checkbox=>{
            checkbox.classList.add("hide");
        });
    }
    grid.addEventListener("click",function(event){
        managementTools.forEach(element=>{
            element.classList.add("hide");
        })
        checkboxes.forEach(checkbox=>{checkbox.classList.remove("hide")});
        delete_selected_users.classList.remove("hide"); 
        grid.classList.add("hide") 
    })

    return {displayManagementTools:displayManagementTools,delete_selected_users:delete_selected_users,checkboxes:checkboxes};
}

async function search(rowAttribute,buttonOrder,userID,clientID){
    const searchInput=document.querySelector("#search-box input");
    const searchIcon=document.querySelector("#search-box i");
    let trs=document.querySelectorAll(`tr[${rowAttribute}]`);
    const pop_msg=document.querySelector("#search-table p");
    const gettableButton=document.querySelectorAll("#buttons .button")[`${buttonOrder}`];
    const table=document.getElementById("inner-table");
    if(userID){
        const user =await getUserByID(userID);
        searchInput.value=user.first_name+user.last_name;
        searchInput.focus();
        let trs=document.querySelectorAll(`tr:not(tr[data-userID="${userID}"],.theadTr)`);
        let tasks=document.querySelectorAll(`tr[data-userID="${userID}"]`);
        if(tasks.length>0){
            trs.forEach(tr=>{
                table.style.display="block";
                tr.classList.add("hide");
            })
        }else{
            pop_msg.classList.add("display");
        }    
    }
    if(clientID){
        const clientName=await getClientNameByID(clientID);
        searchInput.value=clientName.first_name+clientName.last_name;
        searchInput.focus();
        let trs=document.querySelectorAll(`tr:not(tr[data-clientID="${clientID}"],.theadTr)`);
        let client=document.querySelector(`tr[data-clientID="${clientID}"]`);
        if(client){
            trs.forEach(tr=>{
                table.style.display="block";
                tr.classList.add("hide");
            })
        }else{
            pop_msg.classList.add("display");
        }  
    }
    searchInput.addEventListener("keyup",function(event){
        let inputValue=HtmlSanitizer.SanitizeHtml(searchInput.value);
        trs.forEach(element => {
            element.classList.remove("hide");
        });
        searchIcon.click();
        if(inputValue===""){
            pop_msg.classList.remove("display");
        }  
    })
    searchIcon.addEventListener("click",async function(){
        gettableButton.classList.add("disable");
        gettableButton.classList.add("hide");
        table.classList.remove("hide");
        let inputValue=HtmlSanitizer.SanitizeHtml(searchInput.value);
        let flag=false;
        for(let i=0;i<trs.length;i++){
            let lowerCaseInnerText=trs[i].innerText.toLowerCase().replace(/\s/g, "");
            if(lowerCaseInnerText.includes(inputValue.toLowerCase().replace(/\s/g, ""))&&inputValue!==""){
                flag=true;
                table.style.display="block";
            }else{

                trs[i].classList.add("hide");
            }
        }
        if(!flag){
            pop_msg.classList.add("display");
            table.style.display="none";
            table.classList.add("hide");
        }else{
            pop_msg.classList.remove("display");
            
        }
        if(!inputValue){
            gettableButton.classList.remove("disable");
            gettableButton.classList.remove("hide");
            trs.forEach(element => {
                element.classList.remove("hide");
            });
        }
        if(inputValue===""){
            table.classList.toggle("hide");
        }
    })

    async function getUserByID(id){
        let user;
        try {
            const userObj =await fetch(`/user?id=${id}`);
            user= await userObj.json();
        } catch (error) {
            console.log(error.message);
        }
        
        return user;
    }
}

function toggleMenu(){
    const menuButton=document.querySelector("#buttons .bx-menu");
    const navList=document.querySelector("#buttons");
    menuButton.addEventListener("click",function(){
        if(navList.classList.contains("visible")){
            navList.style.overflow="hidden";
            navList.classList.remove("visible");
            menuButton.classList.replace("bx-menu-alt-right","bx-menu")
        }else{
            navList.style.overflow="visible";
            navList.classList.add("visible");
            menuButton.classList.replace("bx-menu","bx-menu-alt-right")
        }
    })
}

 export {checkUsernameAvailability,test,sanitizer,changeLocationHref,direction,getUser,getAllUsers,getUserByID,getClientNameByID,toggleManagementTools,search,toggleMenu};
