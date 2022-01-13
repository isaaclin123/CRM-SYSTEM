
import {changeLocationHref,direction,sanitizer,getClientNameByID} from "./helper.js";
window.addEventListener("load",()=>{
    const allClientNames=document.querySelectorAll("li[data-clientID]"),navOptions=document.querySelectorAll(".nav li"),allCards=document.querySelectorAll(".eachTask");
    const nav1Text=navOptions[0].innerText,nav2Text=navOptions[1].innerText,nav3Text=navOptions[2].innerText;
    
    displayClientNames();
    toggleTasks(0,'1');
    toggleTasks(1,'0');
    toggleTasks(2);

    if(location.href.includes("updated")||location.href.includes("deleted")){
        navOptions[2].click();
    }

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

    const turnBackButton=document.querySelectorAll(".bx-directions");
    turnBackButton.forEach(box=>{
        box.addEventListener("click",(event)=>{
            console.log("here");
            let taskID=event.target.getAttribute("data-taskID");
            document.querySelector(`.card__side--front[data-taskID="${taskID}"]`).classList.toggle("turnBack");
            document.querySelector(`.card__side--back[data-taskID="${taskID}"]`).classList.toggle("turnFront");
        })
    })
    
    


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
    async function displayClientNames(){
        for(let i=0;i<allClientNames.length;i++){
            let clientID=allClientNames[i].getAttribute("data-clientID");
            let clientName=await getClientNameByID(clientID);
            if(clientName){
                allClientNames[i].innerText=clientName.first_name+" "+clientName.last_name;
            }else{
                allClientNames[i].innerText="none";
            }
            
        }
    }
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
            let card=document.querySelector(`.eachTask[data-taskID="${taskID}"]`);

            function deleteTask(taskID){
                card.classList.add("transition-effect");
                setTimeout(function(){card.style.display="none";},1000);
                let request=new XMLHttpRequest();
                request.open(`GET`,`/contact/deleteTask?taskID=${taskID}`);
                request.send();
            }
            if(isCompleted==='0'){
                dialogBox.classList.add("display"); 
                deleteButton.addEventListener("click",function(){
                    deleteTask(taskID);
                    dialogBox.classList.remove("display"); 
                    setTimeout(()=>{
                        location.replace("/userTasks?message=Task deleted successfully");
                    },1000)
                    
                })
                
                cancelDelete();
            }else if(isCompleted==='1'){
                deleteTask(taskID);
                setTimeout(()=>{
                    location.replace("/userTasks?message=Task deleted successfully");
                },1000)
            }

        })
    })

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

            // request.onreadystatechange=function(){
            //     if (request.readyState != 4 || request.status != 200) {return;}
            //     // document.querySelector(".users-box").innerHTML=request.responseText;
            // }
            location.replace(`/userTasks?message=Task updated successfully`);
        })
    })
    // function refreshFrame(){
    //     document.getElementById('myframe').contentWindow.location.reload(true);
    // }
    
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
            console.log(cardDetailLis,cardHeading);
            document.querySelector("#task_name_edit").value=cardHeading.innerText;
            document.querySelector("#clientID_edit").value=cardDetailLis[0].getAttribute("data-clientID");
            document.querySelector("#task_start_date_edit").value=cardDetailLis[1].innerText.substring(cardDetailLis[1].innerText.indexOf(":")+2);
            document.querySelector("#task_end_date_edit").value=cardDetailLis[2].innerText.substring(cardDetailLis[2].innerText.indexOf(":")+2);
            document.querySelector("#isCompleted_edit").value=isCompleted;
            document.querySelector("#task_description_edit").value=cardDetailLis[3].innerText;

        })
    })


    
    direction();
    changeLocationHref();
})