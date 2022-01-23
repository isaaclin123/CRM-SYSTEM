import {changeLocationHref,direction,getAllUsers,getUser,getUserByID} from "./helper.js";
window.addEventListener("load",function(){
    // const checkUserButton =document.querySelector(".bxs-user-detail");
    const allNames =document.querySelectorAll("li[data-userID]");
    const deleteButtons=this.document.querySelectorAll(".delete-user");
    /**
     * Display all user names 
     */
    allNames.forEach(name=>{
        name.addEventListener("click",function(event){
            let userID=event.target.getAttribute("data-userID");
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
    /**
     * Delete user when click on the delete user button
     */
    deleteButtons.forEach(Button=>{
        Button.addEventListener("click",function(event){
            let userID=event.target.parentNode.getAttribute("data-userID");
            dialogBox.classList.add("display");
            deleteButton.addEventListener("click",function(){
                let card =document.querySelector(`.eachUser[data-userID="${userID}"]`);
                card.classList.add("transition-effect");
                dialogBox.classList.remove("display");
                setTimeout(function(){
                    card.style.display="none";
                    location.replace(`/deleteUser?userID=${userID}`);
            },1000); 
                
            })
        })
        cancelDelete();
        
    })
    const setAdminButtons =document.querySelectorAll(".update-admin");
    /**
     * Hide delete and set admin button on the current user's card
     */
    removeButton();
    async function removeButton(){
        let currentUser=await getUser();
        for(let i=0;i<setAdminButtons.length;i++){
            let userID=setAdminButtons[i].parentNode.getAttribute("data-userID");
            if(Number(userID)===Number(currentUser.id)){
                setAdminButtons[i].classList.add("hide");
                deleteButtons[i].classList.add("hide");
            }
        }
    }
    /**
     * Set or unset a user as an admin 
     */
    setAdminButtons.forEach(button=>{
        button.addEventListener("click",async function(event){
            let userID=event.target.parentNode.getAttribute("data-userID");
            let user =await getUserByID(userID);
            let text=event.target.innerText;
            if(text==="UNSET ADMIN"){
                user.issuperadmin="";
            }else if(text==="SET AS ADMIN"){
                user.issuperadmin="1";
            }
            let request=new XMLHttpRequest();
            request.open("POST",`/updateAdmin`);
            request.setRequestHeader("Content-Type","application/json");
            request.send(JSON.stringify(user));
            location.replace("/manageUsers?message=Update successfully");
        })
    })
    /**
     * redirect to the task management page and check the user's tasks
     */
    const checkTasksButton=document.querySelectorAll(".check-tasks");
    checkTasksButton.forEach(button=>{
        button.addEventListener("click",function(event){
            const userID=event.target.parentNode.getAttribute("data-userID");
            history.pushState(null, 'User management', '/taskManagement'); 
            location.replace(`/taskManagement?userID=${userID}`);
        })
        
    })


    direction();
    changeLocationHref();
})