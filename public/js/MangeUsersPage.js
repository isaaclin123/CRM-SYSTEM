import {changeLocationHref,direction,getAllUsers,getUser,getUserByID} from "./helper.js";
window.addEventListener("load",function(){
    // const checkUserButton =document.querySelector(".bxs-user-detail");
    const allNames =document.querySelectorAll("li[data-userID]");
    const deleteButtons=this.document.querySelectorAll(".delete-user");
    allNames.forEach(name=>{
        name.addEventListener("click",function(event){
            let userID=event.target.getAttribute("data-userID");
            // console.log(userID);
            // console.log(document.querySelector(`.eachUser[data-userID="${userID}"]`));
            let selectedUser=document.querySelector(`.eachUser[data-userID="${userID}"]`);
            if(selectedUser){
                selectedUser.classList.toggle("display");
                document.querySelector(`.eachUser[data-userID="${userID}"] .bx-x`).addEventListener("click",function(){
                    selectedUser.classList.remove("display");
                })
            }   
        })
    })
    let dialogBox = document.getElementById("dialogBox"),
    deleteButton  = document.getElementById("delete"),
    cancelButton = document.getElementById("cancel");

    function cancelDelete(){
        cancelButton.addEventListener("click",function(){
            dialogBox.classList.remove("display");
        })
    }
    deleteButtons.forEach(Button=>{
        Button.addEventListener("click",function(event){
            let userID=event.target.parentNode.getAttribute("data-userID");
            console.log(event.target);
            dialogBox.classList.add("display"); 
            deleteButton.addEventListener("click",function(){
                location.replace(`/deleteUser?userID=${userID}`);
            })
        })
        cancelDelete();
        
    })
    const setAdminButtons =document.querySelectorAll(".update-admin");
    setAdminButtons.forEach(button=>{
        button.addEventListener("click",async function(event){
            let userID=event.target.parentNode.getAttribute("data-userID");
            let user =await getUserByID(userID);
            console.log(user);
            let text=event.target.innerText;
            console.log(text);
            if(text==="UNSET ADMIN"){
                user.isSuperAdmin="";
            }else if(text==="SET AS ADMIN"){
                user.isSuperAdmin="1";
            }
            let request=new XMLHttpRequest();
            request.open("POST",`/updateAdmin`);
            request.setRequestHeader("Content-Type","application/json");
            request.send(JSON.stringify(user));
            location.replace("/manageUsers?message=Update successfully");
        })
    })
    const checkTasksButton=document.querySelectorAll(".check-tasks");
    checkTasksButton.forEach(button=>{
        button.addEventListener("click",function(event){
            const userID=event.target.parentNode.getAttribute("data-userID");
            location.replace(`/taskManagement?userID=${userID}`);
        })
        
    })


    direction();
    changeLocationHref();
})