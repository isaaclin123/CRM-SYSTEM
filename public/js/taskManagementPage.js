import {changeLocationHref,direction,sanitizer,toggleManagementTools,search,toggleMenu} from "./helper.js";
window.addEventListener("load",function(){
    const displayButton=document.querySelectorAll('#buttons .button')[0];
    const gettableButton=document.querySelectorAll("#buttons .button")[1];
    const form =document.querySelector("#add-form");
    const table=document.getElementById("inner-table");

    /**
     * toggle the button's ui
     */
    toggleMenu();
    displayButton.addEventListener("click",function(){
        form.classList.toggle("display");
        displayButton.classList.toggle("changeButton");

    })
    gettableButton.addEventListener("click",function(){
        table.classList.toggle("display");
        table.classList.remove("hide");
        gettableButton.classList.toggle("changeButton");
    });

    if(location.href.includes("updated")){
        gettableButton.click();
    }

    /**
     * Sanitize the input
     */
    sanitizer();
    const textarea=document.querySelector("textarea");
    textarea.addEventListener("keyup",function(){
        HtmlSanitizer.SanitizeHtml(textarea.value);
    })
    
    /**
     * Edit task
     */
    const editLinks=document.querySelectorAll("table .bxs-edit");
    const editTaskForm=document.querySelector(".edit_task");
    editLinks.forEach(element => {
        element.addEventListener("click",function(event){
            const taskID=event.target.parentNode.getAttribute("data-taskID");
            editTaskForm.classList.add("display");
            document.querySelectorAll(".bx-x").forEach(element =>{
                element.addEventListener("click",function(event){
                    event.target.parentNode.classList.remove("display");
                })
            })
            document.querySelector(".inner-task-form form").action=`/task/updateTask?taskID=${taskID}`;
            let tds=document.querySelectorAll(`tr[data-taskID="${taskID}"] td:not(tr[data-taskID="${taskID}"] td:last-child)`)
            document.querySelector("#task_name_edit").value=tds[0].innerText;
            document.querySelector("#clientID_edit").value=tds[1].getAttribute("data-clientID");
            document.querySelector("#userID_edit").value=tds[2].getAttribute("data-userID");
            document.querySelector("#task_start_date_edit").value=tds[3].innerText;
            document.querySelector("#task_end_date_edit").value=tds[4].innerText;
            document.querySelector("#isCompleted_edit").value=tds[5].innerText;
            document.querySelector("#task_description_edit").value=tds[6].innerText;  
        })
    });
    /**Delete task */
    const deleteLinks=document.querySelectorAll("table .bx-task-x");
    let dialogBox = document.getElementById("dialogBox"),
    deleteButton  = document.getElementById("delete"),
    cancelButton = document.getElementById("cancel");

    function cancelDelete(){
        cancelButton.addEventListener("click",function(){
            dialogBox.classList.remove("display");
        })
    }
    deleteLinks.forEach(deleteLink=>{
        deleteLink.addEventListener("click",function(event){
            const taskID=event.target.parentNode.getAttribute("data-taskID");
            dialogBox.classList.add("display");
            deleteButton.setAttribute("data-taskID",taskID);
            deleteButton.removeEventListener("click",deleteTask);
            deleteButton.addEventListener("click",deleteTask);
            
        })
        cancelDelete();
    })
    function deleteTask(event){
        const taskID=event.target.getAttribute("data-taskID");
        const tr=document.querySelector(`tr[data-taskID="${taskID}"]`);
        tr.classList.add("transition-effect");
        setTimeout(function(){tr.style.display="none";},1000);
        dialogBox.classList.remove("display");
        let request =new XMLHttpRequest();
        request.open("GET",`/contact/deleteTask?taskID=${taskID}&page=taskManagement`,true);
        request.send(); 
    }
    /**
     * Delete multiple tasks
     */
    const managementToolObj=toggleManagementTools();
    managementToolObj.delete_selected_users.addEventListener("click",function(event){
        let taskIDs=[];
        document.querySelectorAll(`input[type="checkbox"]:checked`).forEach(checkedBox=>{
            taskIDs.push(checkedBox.value);
        })
        if(taskIDs.length>0){
            dialogBox.classList.add("display");
            deleteButton.setAttribute("data-taskID",JSON.stringify(taskIDs))
            deleteButton.removeEventListener("click",deleteTask);
            deleteButton.addEventListener("click",deleteTask);
            cancelButton.addEventListener("click",function(){
                dialogBox.classList.remove("display");
                managementToolObj.displayManagementTools();
                taskIDs=[];
                managementToolObj.checkboxes.forEach(checkBox=>{
                    checkBox.checked=false;
                })
            })
        }else{
            managementToolObj.displayManagementTools();
        }
    })
    function deleteTask(event){
        const taskIDs=JSON.parse(event.target.getAttribute("data-taskID"));
        let request = new XMLHttpRequest();
        request.open("POST",`/contact/deleteTask`);
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify(taskIDs));
        for(let i=0;i<taskIDs.length;i++){
            let tr=document.querySelector(`tr[data-taskID="${taskIDs[i]}"]`);
            tr.classList.add("transition-effect");
            setTimeout(function(){tr.style.display="none";},1000);
        }
        dialogBox.classList.remove("display");
        managementToolObj.displayManagementTools();
    }
    /**
     * Search tasks
     */
    let userID;
    const index=location.href.indexOf("userID=")
    if(index!==-1){
        userID=location.href.substring(index+7);
    }
    search("data-taskID",1,userID);

    
    direction();
    changeLocationHref();
    limitClickTime();
    function limitClickTime(){
        let taskButtons=document.querySelectorAll("section i:not(.bxs-spreadsheet,.bx-arrow-to-top,.bx-arrow-from-top,.bx-menu,.bx-x,.bx-search)");
        for(let i=0;i<taskButtons.length;i++){
            taskButtons[i].addEventListener("click",function(){
                taskButtons.forEach(button => {
                    button.classList.add("unclickable");
                });
                setTimeout(function(){
                    taskButtons.forEach(button => {
                        button.classList.remove("unclickable");
                    });
                },1500)
            })
        }
    }
})