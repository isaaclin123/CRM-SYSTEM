
import {changeLocationHref,direction,sanitizer} from "./helper.js";
window.addEventListener("load",()=>{
    const navOptions=document.querySelectorAll(".nav li"),allCards=document.querySelectorAll(".eachTask");
    const nav1Text=navOptions[0].innerText,nav2Text=navOptions[1].innerText,nav3Text=navOptions[2].innerText;

      /**
     * Sanitize the input
     */
       sanitizer();
       const textarea=document.querySelector("textarea");
       textarea.addEventListener("keyup",function(){
           HtmlSanitizer.SanitizeHtml(textarea.value);
       })
    
    /**
     * Toggle task ui
     */
    toggleTasks(0,'1');
    toggleTasks(1,'0');
    toggleTasks(2);
    function toggleTasks(navOptionsIndex,isCompleted){
        navOptions[navOptionsIndex].addEventListener("click",()=>{
            if(navOptions[navOptionsIndex].innerText==="Clear tasks"){
                removeDisplay();
                navOptions[0].innerText=nav1Text;
                navOptions[1].innerText=nav2Text;
                navOptions[2].innerText=nav3Text;
            }else{
                if(navOptionsIndex<2){
                    removeDisplay();
                    allCards.forEach(card=>{
                        if(card.getAttribute("data-complete")===`${isCompleted}`){
                            card.classList.toggle("display");
                        }
                    })
                    navOptions[navOptionsIndex].innerText="Clear tasks";
                    if(navOptionsIndex===0){
                        navOptions[1].innerText=nav2Text;
                    }else if(navOptionsIndex===1){
                        navOptions[0].innerText=nav1Text;
                    }
                    navOptions[2].innerText=nav3Text;
                }else{
                    removeDisplay();
                    allCards.forEach(card=>{
                        card.classList.toggle("display");
                    })
                    navOptions[navOptionsIndex].innerText="Clear tasks";
                    navOptions[0].innerText=nav1Text;
                    navOptions[1].innerText=nav2Text;
                }
            }
        })
    }

    function removeDisplay(){
        allCards.forEach(card=>{
            card.classList.remove("display");
        })
    }

    if(location.href.includes("updated")||location.href.includes("deleted")){
        navOptions[2].click();
    }

    /**
     * Create task
     */
    const addTaskButton=document.querySelector("#buttons .bx-list-plus");
    const addTaskForm=document.querySelector("#add-form");
    addTaskButton.addEventListener("click",()=>{
        addTaskForm.classList.toggle("display");
        if(addTaskButton.classList.contains("bx-list-plus")){
            addTaskButton.classList.replace("bx-list-plus","bx-list-minus");
            addTaskButton.title="Close form"
        }else if(addTaskButton.classList.contains("bx-list-minus")){
            addTaskButton.classList.replace("bx-list-minus","bx-list-plus");
            addTaskButton.title="Add task"
        }  
    })

    /**
     * Toggle card back and front
     */
    const turnBackButton=document.querySelectorAll(".bx-directions");
    turnBackButton.forEach(box=>{
        box.addEventListener("click",(event)=>{
            let taskID=event.target.getAttribute("data-taskID");
            document.querySelector(`.card__side--front[data-taskID="${taskID}"]`).classList.toggle("turnBack");
            document.querySelector(`.card__side--back[data-taskID="${taskID}"]`).classList.toggle("turnFront");
        })
    })
    
    /**Delete task
     * 
     */
    const deleteTaskButtons=document.querySelectorAll(".delete-task");
    let dialogBox = document.getElementById("dialogBox"),
    deleteButton  = document.getElementById("delete"),
    cancelButton = document.getElementById("cancel");

    function cancelDelete(){
        cancelButton.addEventListener("click",function(){
            dialogBox.classList.remove("display");
        })
    }
    deleteTaskButtons.forEach(button=>{
        button.addEventListener("click",(event)=>{
            let taskID=event.target.parentNode.getAttribute("data-taskID");
            let isCompleted=event.target.parentNode.getAttribute("data-complete");
            if(isCompleted==='0'){
                dialogBox.classList.add("display"); 
                deleteButton.setAttribute("data-taskID",taskID);
                deleteButton.removeEventListener("click",confirmDeleTask);
                deleteButton.addEventListener("click",confirmDeleTask);
                cancelDelete();
            }else if(isCompleted==='1'){
                deleteTask(taskID);
                setTimeout(()=>{
                    location.replace("/userTasks?message=Task deleted successfully");
                },1000)
            }
        })
    })
    function confirmDeleTask(event){
        const taskID=event.target.getAttribute("data-taskID");
        deleteTask(taskID);
        dialogBox.classList.remove("display"); 
        setTimeout(()=>{
            location.replace("/userTasks?message=Task deleted successfully");
        },1000)
    }
    function deleteTask(taskID){
        const card=document.querySelector(`.eachTask[data-taskID="${taskID}"]`);
        card.classList.add("transition-effect");
        setTimeout(function(){card.style.display="none";},1000);
        let request=new XMLHttpRequest();
        request.open(`GET`,`/contact/deleteTask?taskID=${taskID}`);
        request.send();
    }
    /**
     * Update task's complete status
     */
    const completeButton=document.querySelectorAll(".update-complete");
    completeButton.forEach(button=>{
        button.addEventListener("click",(event)=>{
            let taskID=event.target.parentNode.getAttribute("data-taskID");
            let isCompleted;
            if(event.target.innerText==="SET COMPLETED"){
                isCompleted="true";
            }else if(event.target.innerText==="SET UNCOMPLETED"){
                isCompleted="false";
            }
            let request=new XMLHttpRequest();
            request.open(`GET`,`/contact/updateTaskCompleted?taskID=${taskID}&isCompleted=${isCompleted}&page=userTaskPage`);
            request.send();
            location.replace(`/userTasks?message=Task updated successfully`);
        })
    })
 
    /**
     * Edit task
     */
    const editTaskButton=document.querySelectorAll(".edit-tasks");
    const editTaskForm=document.querySelector(".edit_task");
    editTaskButton.forEach(button=>{
        button.addEventListener("click",(event)=>{
            let taskID=event.target.parentNode.getAttribute("data-taskID");
            let isCompleted=event.target.parentNode.getAttribute("data-complete");
            if(isCompleted==='0'){
                isCompleted="false";
            }else if(isCompleted==='1'){
                isCompleted="true";
            }
            editTaskForm.classList.add("display");
            document.querySelectorAll(".bx-x").forEach(element =>{
                element.addEventListener("click",function(event){
                    event.target.parentNode.classList.remove("display");
                })
            })
            document.querySelector(".inner-task-form form").action=`/task/updateTask?taskID=${taskID}`;
            let cardHeading=document.querySelector(`.card__heading[data-taskID="${taskID}"]`);
            let cardDetailLis=document.querySelectorAll(`.card__details[data-taskID="${taskID}"] ul li`);
            document.querySelector("#task_name_edit").value=cardHeading.innerText.toLowerCase();
            document.querySelector("#clientID_edit").value=cardDetailLis[0].getAttribute("data-clientID");
            document.querySelector("#task_start_date_edit").value=cardDetailLis[1].innerText.substring(cardDetailLis[1].innerText.indexOf(":")+2);
            document.querySelector("#task_end_date_edit").value=cardDetailLis[2].innerText.substring(cardDetailLis[2].innerText.indexOf(":")+2);
            document.querySelector("#isCompleted_edit").value=isCompleted;
            document.querySelector("#task_description_edit").value=cardDetailLis[3].innerText;

        })
    })
    /**
     * Close tha card
     */
    const closeCardButtons=document.querySelectorAll(".eachTask .bx-x");
    closeCardButtons.forEach(button=>{
        button.addEventListener("click",(event)=>{
            let taskID=event.target.parentNode.getAttribute("data-taskID");
            event.target.parentNode.parentNode.parentNode.classList.remove("display");
            document.querySelector(`.card__side--front[data-taskID="${taskID}"]`).classList.toggle("turnBack");
            document.querySelector(`.card__side--back[data-taskID="${taskID}"]`).classList.toggle("turnFront");
        })
    })


    
    direction();
    changeLocationHref();
})