import {changeLocationHref} from "./helper.js";
window.addEventListener("load",function(){
    let exportButton =document.querySelectorAll("#buttons .button")[0];
    exportButton.classList.add("hide");
    let displayButton=document.querySelectorAll('#buttons .button')[2];
    let gettableButton=document.querySelectorAll("#buttons .button")[3];
    let form =document.querySelector("#add-form");
    let inputs =document.querySelectorAll("input");
    let table=document.getElementById("inner-table");
    let tbody=document.querySelector("#inner-table table tbody");

    

    /**
     * toggle the button's ui
     */
    // console.log(this.location.href);
    // console.log(location.href.includes("Client"));
    if(location.href.includes("Client")){
        form.classList.toggle("display");
        displayButton.classList.toggle("changeButton");
    }
    displayButton.addEventListener("click",function(){
        form.classList.toggle("display");
        displayButton.classList.toggle("changeButton");
    })

    for(let i=0;i<inputs.length;i++){
        inputs[i].addEventListener("input",function(){
            HtmlSanitizer.SanitizeHtml(inputs[i].value);
         })  
    }
    let textarea=document.querySelector("textarea");
    textarea.addEventListener("keyup",function(){
        HtmlSanitizer.SanitizeHtml(textarea.value);
    })
    gettableButton.addEventListener("click",function(){
        table.classList.toggle("display");
        table.classList.remove("hide");
        // console.log(tbody.children);
        // for(let i=0;i<tbody.children.length;i++){
        //     tbody.children[i].classList.remove("hide");
        // }
        gettableButton.classList.toggle("changeButton");
        // table.firstElementChild.classList.remove("hide");
        exportButton.classList.toggle("hide");
        exportButton.classList.toggle("changeButton");
        
    });

    /**
     * 
     * @param {*} editLinks toggle edit link's ui
     */
    function editLink(editLinks){
        editLinks.forEach(element => {
            element.addEventListener("click",function(event){
                event.target.style.display="none";
                event.target.nextElementSibling.style.display="inline";
                let clientID=event.target.getAttribute("data-clientID");
                let tds=document.querySelectorAll(`tr[data-clientID="${clientID}"] td:not(tr[data-clientID="${clientID}"] .uneditable)`);
                tds.forEach(element =>{
                    if(element.className!=="not-editable"){
                        element.setAttribute("contenteditable","true");
                        element.classList.add("content-editable");
                    }else{
                        let temp=element.innerText;
                        // console.log(temp);
                        element.innerHTML=`<div class="selectItem">
                        <select  name="progress_status" class="progress_status">
                                <option value="Establish contact" >Establish contact</option>
                                <option value="Contact made">Contact made</option>
                                <option value="1 to 1 meeting scheduled">1 to 1 meeting scheduled</option>
                                <option value="Attended a meeting with our staff">Attend a meeting with our staff</option>
                                <option value="Interested in superChatPal">Interested in superChatPal</option>
                                <option value="Interested in socialChatPal">Interested in socialChatPal</option>
                                <option value="Interested in both product">Interested in both product</option>
                                <option value="Follow up meeting scheduled">Follow up meeting scheduled</option>
                                <option value="Follow up meeting attended">Follow up meeting attended</option>
                                <option value="Buy product">Buy product</option>
                                <option value="Not buying the product">Not buying the product</option>
                        </select>
                                        </div>`;
                        if(document.querySelector(`tr[data-clientID="${clientID}"] .progress_status`)){
                            // console.log(document.querySelector(`tr[data-clientID="${clientID}"] .progress_status`));
                            document.querySelector(`tr[data-clientID="${clientID}"] .progress_status`).value=temp;
                        }
                    }
                })
                
    
            })
        });
    }
    let editLinks=document.querySelectorAll("table .bxs-edit");
    editLink(editLinks);
    /**
     * 
     * @param {*} donLinks toggle done'link's ui and send ajax request to the server to update client's information
     */
    function donLink(donLinks){
        doneLinks.forEach(element => {
            element.addEventListener("click",async function(event){
                let user=await getUser();
                event.target.style.display="none";
                event.target.previousElementSibling.style.display="inline";
                let clientID=event.target.getAttribute("data-clientID");
                let tds=document.querySelectorAll(`tr[data-clientID="${clientID}"] td:not(tr[data-clientID="${clientID}"] td:last-child)`);
                let request;
                let client
                for(let i=0;i<tds.length;i++){
                    // console.log(HtmlSanitizer.SanitizeHtml(tds[i].textContent));
                    if(i!==9){
                        tds[i].innerText=HtmlSanitizer.SanitizeHtml(tds[i].textContent);
                    }
                    client={
                        id:clientID,
                        first_name:tds[0].textContent,
                        last_name:tds[1].textContent,
                        email:tds[2].textContent,
                        phone_number:tds[3].textContent,
                        country:tds[4].textContent,
                        city:tds[5].textContent,
                        profession:tds[6].textContent,
                        website:tds[7].textContent,
                        social_media:tds[8].textContent,
                        meet_with:tds[10].textContent,
                        notes_on_client:tds[11].textContent,
                        // addedBy:tds[12].innerText
                    }
                    if(i!==9){
                        tds[i].setAttribute("contenteditable","false");
                        tds[i].classList.remove("content-editable");
                    } 
                }
                client.progress_status=document.querySelector(`tr[data-clientID="${clientID}"] .progress_status`).value;
                // console.log(client.progress_status);
                tds[9].innerText=client.progress_status;
                // console.log(client.progress_status);
                client.tag=`${tds[12].innerText}`;
                request=new XMLHttpRequest();
                request.open("POST",`/contact/edit`);
                request.setRequestHeader("Content-Type","application/json");
                request.send(JSON.stringify(client));
    
    
            })
        })
    }
    let doneLinks=document.querySelectorAll("table .bxs-check-circle");
    donLink(doneLinks);
    
    //Creating the variables and getting elements from DOM
    let dialogBox = document.getElementById("dialogBox"),
    deleteButton  = document.getElementById("delete"),
    cancelButton = document.getElementById("cancel");

    function cancelDelete(){
        cancelButton.addEventListener("click",function(){
            dialogBox.classList.remove("display");
        })
    }
    
        
    //hide dialogBox initially;
    // dialogBox.classList.add("hide");
    /**
     * 
     * @param {*} deleteLinks send ajax request to delete a client from the database
     */
    function deleteLink(deleteLinks){
        deleteLinks.forEach(element=>{
            element.addEventListener("click",function(event){
                let request;
                let clientID=event.target.getAttribute("data-clientID");
                let tr=document.querySelector(`tr[data-clientID="${clientID}"]`);
                dialogBox.classList.add("display");
                // dialogBox.classList.remove("hide");
                deleteButton.addEventListener("click",function(){
                    // let tbody=document.querySelector("#inner-table table tbody");
                    // let tableChildrenCount=tbody.childElementCount;
                    // tableChildrenCount--;
                    // console.log(tableChildrenCount);
                    tr.classList.add("transition-effect");
                    setTimeout(function(){tr.style.display="none";},1000);
                    dialogBox.classList.remove("display");
                    request =new XMLHttpRequest();
                    // request.open("GET",`/newArticle?html=`+html,true);
                    request.open("POST",`/contact/delete`);
                    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                    request.send(`clientID=${clientID}`);
                })
                cancelDelete();

                // deleteButton.addEventListener("mouseup",function(){
                //     if(tbody.children.length<1){
                //        table.firstElementChild.classList.add("hide");
                //        location.replace("/contact?message=All clients have been deleted");
                //     }else{
                //         table.firstElementChild.classList.remove("hide");
                //     }
                // })
                
            })
        })
    }
    let deleteLinks=document.querySelectorAll("table .bxs-user-x");
    deleteLink(deleteLinks);

    /**
     * delete multiple client
     */
    let clientManagementTools=document.querySelectorAll(`.clientManagementTools i`), checkboxes=document.querySelectorAll(`input[type="checkbox"]`),delete_selected_users=document.querySelector(".delete-selected-users"),grid=document.querySelector(".bx-grid-small");
    delete_selected_users.classList.add("hide");
    checkboxes.forEach(checkbox=>{checkbox.classList.add("hide")});

    function displayManagementTools(){
        grid.classList.remove("hide");
        delete_selected_users.classList.add("hide");
        clientManagementTools.forEach(element=>{
            element.classList.remove("hide");
        })
        checkboxes.forEach(checkbox=>{
            checkbox.classList.add("hide");
        });
    }
    grid.addEventListener("click",function(event){
        clientManagementTools.forEach(element=>{
            element.classList.add("hide");
        })
        checkboxes.forEach(checkbox=>{checkbox.classList.remove("hide")});
        delete_selected_users.classList.remove("hide"); 
        grid.classList.add("hide") 
    })
    delete_selected_users.addEventListener("click",function(event){
        let clientIDs=[];
        document.querySelectorAll(`input[type="checkbox"]:checked`).forEach(checkedBox=>{
            clientIDs.push(checkedBox.value);
        })
        console.log(clientIDs);
        if(clientIDs.length>0){
            dialogBox.classList.add("display");
            deleteButton.addEventListener("click",function(){
    
                let request = new XMLHttpRequest();
                request.open("POST",`/contact/delete`);
                request.setRequestHeader("Content-Type","application/json");
                request.send(JSON.stringify(clientIDs));
                for(let i=0;i<clientIDs.length;i++){
                    let tr=document.querySelector(`tr[data-clientID="${clientIDs[i]}"]`);
                    tr.classList.add("transition-effect");
                    setTimeout(function(){tr.style.display="none";},1000);
                }
                dialogBox.classList.remove("display");
                displayManagementTools();
            })
            
            cancelButton.addEventListener("click",function(){
                dialogBox.classList.remove("display");
                displayManagementTools();
    
            })
        }else{
            displayManagementTools();
        }


    })
    /**
     * search client base on the input and toggle the table's visibility and the button's ui
     */
    let searchInput=document.querySelector("#search-box input");
    let searchIcon=this.document.querySelector("#search-box i")
    let trs=document.querySelectorAll(`tr[data-clientID]`);
    let pop_msg=document.querySelector("#search-table p");
    searchInput.addEventListener("input",function(event){
        let inputValue=HtmlSanitizer.SanitizeHtml(searchInput.value);
        trs.forEach(element => {
            element.classList.remove("hide");
        });
        searchIcon.click();
        if(inputValue===""){
            pop_msg.classList.remove("display");
        }  
    })
    searchIcon.addEventListener("click",function(){
        gettableButton.classList.add("disable");
        gettableButton.classList.add("hide");
        table.classList.remove("hide");

        let inputValue=HtmlSanitizer.SanitizeHtml(searchInput.value);
        // console.log(inputValue);
        // let array=inputValue.split(" ");
        // console.log(array);

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

    /**
     * Add task to complete for this client
     */
    let AddTaskButtons=document.querySelectorAll(".add-task");
    const section=document.querySelector("section");
    AddTaskButtons.forEach(button=>{
        button.addEventListener("click",async function(event){
            let clientID=event.target.getAttribute("data-clientID");
            let tr=document.querySelector(`tr[data-clientID="${clientID}"]`);
            let taskDiv=document.createElement("div");
            taskDiv.className="taskDiv";
            section.appendChild(taskDiv);
            // dragElement(taskDiv);
            taskDiv.innerHTML=
            `<div><i class='bx bx-x'></i></div>
                <div class="task-box">
                        <h3>Add task for ${tr.children[0].innerText} ${tr.children[1].innerText}</h3>
                        <div class="Add-task-box">
                            <form action="#" method="POST" id="task-form">
                                    <div class = "txt">
                                        <label for="task_name">Task name:</label><br>
                                        <input type="text" name="task_name" id="task_name" required>
                                        <span></span>
                                    </div>
                                    <div class = "txt">
                                        <label for="task_start_date">Task start date:</label><br>
                                        <input type="date" name="task_start_date" id="task_start_date" required>
                                        <span></span>
                                    </div>
                                    <div class = "txt">
                                        <label for="task_end_date">Task end date:</label><br>
                                        <input type="date" name="task_end_date" id="task_end_date" required>
                                        <span></span>
                                    </div>
                                    <div class = "txt">
                                        <label for="task_description">Task description:</label><br>
                                        <input type="text" name="task_description" id="task_description" required>
                                        <span></span>
                                    </div>
                                    <button>Create task</button><button>Check tasks</button><br><span id="not-null-msg"><span>
                            </form>
                        </div>
                </div>`;
            let submitButton=document.querySelectorAll(".task-box button")[0];
            let checkTaskButton=document.querySelectorAll(".task-box button")[1];
            let notNullMsg=document.querySelector("#not-null-msg");
            let inputs=document.querySelectorAll("#task-form input");
            let user=await getUser();
            submitButton.addEventListener("click",function(event){
                event.preventDefault();
                notNullMsg.innerHTML="";
                let clientTask={
                    clientID:clientID,
                    task_name:HtmlSanitizer.SanitizeHtml(document.querySelector("#task_name").value),
                    task_description:HtmlSanitizer.SanitizeHtml(document.querySelector("#task_description").value),
                    task_end_date:HtmlSanitizer.SanitizeHtml(document.querySelector("#task_end_date").value),
                    task_start_date:HtmlSanitizer.SanitizeHtml(document.querySelector("#task_start_date").value),
                    userID:user.id,
                    isCompleted:"false"

                }
                console.log(clientTask);
                if(!clientTask.task_name||!clientTask.task_description||!clientTask.task_start_date||!clientTask.task_end_date){
                    // console.log("here");
                    submitButton.disabled=true;
                    notNullMsg.innerHTML="Please fill in all the information"
                }else{
                    submitButton.disabled=false;
                    notNullMsg.innerHTML="Task created successfully";
                    // console.log(typeof clientTask);
                    let request=new XMLHttpRequest();
                    request.open("POST",`/contact/createTask`);
                    request.setRequestHeader("Content-Type","application/json");
                    request.send(JSON.stringify(clientTask));
                    submitButton.disabled=true;
                    setTimeout(function(){
                        // section.removeChild(taskDiv);
                        notNullMsg.innerHTML="";
                        inputs.forEach(element => {
                            element.value="";
                            submitButton.disabled=false;
                        });
                    },1000)
                    
                }
            }) 
            inputs.forEach(element => {
                element.addEventListener("input",function(){
                    submitButton.disabled=false;
                })
            });              
            close();
            checkTaskButton.addEventListener("click",function(event){
                event.preventDefault();
                section.removeChild(taskDiv);
                document.querySelector(`.bxs-spreadsheet[data-clientID="${clientID}"]`).click();
            }) 
        })        
    })

    /**
     * Check and edit all the current task of the client
     *
     */
    let checkTaskButtons=document.querySelectorAll(".bxs-spreadsheet");
    checkTaskButtons.forEach(button => {
        button.addEventListener("click",async function(event){
            let clientID=event.target.getAttribute("data-clientID");
            let tr=document.querySelector(`tr[data-clientID="${clientID}"]`);
            let taskBox=document.createElement("div");
            taskBox.className="taskBox";
            section.appendChild(taskBox);
            // dragElement(taskBox);
            taskBox.innerHTML=`<div><i class='bx bx-list-plus' title="Create tasks"></i> <i class='bx bx-x'></i></div>
                                <div class="task-box">
                                    <h3>Task for ${tr.children[0].innerText} ${tr.children[1].innerText}</h3>
                                    <div class="check-task-box"> </div>
                                </div>`;
            document.querySelector(".bx-list-plus").addEventListener("click",function(event){
                section.removeChild(event.target.parentNode.parentNode);
                document.querySelector(`.add-task[data-clientID="${clientID}"]`).click();

            })
            let request =new XMLHttpRequest();
            request.onreadystatechange=async function(){
                if((request.readyState==4)&&(request.status==200)){
                    let tasks=JSON.parse(request.response);
                    // console.log(tasks);
                    let currentUser=await getUser();
                    if(tasks.length!==0){
                        for(let i=0;i<tasks.length;i++){
                            let task=tasks[i];
                            let user=await getUserByID(task.userID);
                            let ResponsiblePerson;
                            if(user){
                                ResponsiblePerson=`${user.first_name} ${user.last_name}`;
                            }else{
                                ResponsiblePerson=`Previous responsible person is no longer in the system,please choose one or delete the task`;
                            }
                            document.querySelector(".check-task-box").innerHTML+=
                            `<div class="each-task" data-taskID="${task.id}">
                                <div class="tasksManagement" data-userID="${task.userID}">
                                    <i class='bx bx-task-x' data-taskID="${task.id}" data-userID="${task.userID}" title="Delete task"></i>
                                    <i class='bx bxs-check-circle' data-taskID="${task.id}" data-userID="${task.userID}" title="Done"></i>
                                    <i class='bx bx-edit-alt' data-taskID="${task.id}" data-userID="${task.userID}" title="Edit task"></i>
                                </div>
                                <div>Task name:<span>${task.task_name}</span></div>
                                <div>Task start date:<span>${task.task_start_date}</span></div>
                                <div>Task end date:<span>${task.task_end_date}</span></div>
                                <div data-userID="${task.userID}">Responsible person:<span data-userID="${user?user.id:"none"}">${ResponsiblePerson}</span></div>
                                <div>Task description:<span>${task.task_description}</span></div>
                                <div class="isCompleted" data-taskID="${task.id}" data-userID="${task.userID}"><i class='bx bxs-wink-smile' title="task completed,click to change it as uncompleted"></i><i class='bx bxs-meh-blank' title="task not completed,click to change it as completed"></i></div>
                            </div>`; 
                            // console.log(task.isCompleted);
                            let incompleteICon=document.querySelector(`.isCompleted[data-taskID="${task.id}"] .bxs-meh-blank`);
                            let completeICon=document.querySelector(`.isCompleted[data-taskID="${task.id}"] .bxs-wink-smile`)
                            if(task.isCompleted==="true"){
                                incompleteICon.classList.add("hide");
                            }else{
                                completeICon.classList.add("hide");
                            }
                            let tasksManagementTool=document.querySelector(`.tasksManagement[data-userID="${task.userID}"]`);
                            let progressTool=document.querySelector(`.isCompleted[data-userID="${task.userID}"]`);
                            console.log(tasksManagementTool);
                            console.log(progressTool);
                            if(currentUser.isSuperAdmin!=="1"&&task.userID!==currentUser.id){
                                console.log("here");
                                tasksManagementTool.classList.add("hide");
                                progressTool.classList.add("hide");
                               
                            }

                        };

                        limitClickTime();
                        document.querySelectorAll(".each-task .bxs-check-circle").forEach(doneButton =>{
                            doneButton.classList.add("hide");
                        })
                        let completeIcons=document.querySelectorAll(".each-task .bxs-wink-smile");
                        let incompleteIcons=document.querySelectorAll(".each-task .bxs-meh-blank");
                        
                        completeIcons.forEach(completeButton =>{
                            completeButton.addEventListener("click",function(event){
                                event.target.classList.add("hide");
                                let taskID=event.target.parentNode.getAttribute("data-taskID");
                                console.log(taskID);
                                let request=new XMLHttpRequest();
                                request.open("GET",`/contact/updateTaskCompleted?taskID=${taskID}&isCompleted=false`,true);
                                request.send();  
                                event.target.nextElementSibling.classList.remove("hide");
                            })
                        })
                    
                        incompleteIcons.forEach(not_completeButton =>{
                            not_completeButton.addEventListener("click",function(event){
                                event.target.classList.add("hide");
                                let taskID=event.target.parentNode.getAttribute("data-taskID");
                                console.log(taskID);
                                let request=new XMLHttpRequest();
                                request.open("GET",`/contact/updateTaskCompleted?taskID=${taskID}&isCompleted=true`,true);
                                request.send();
                                event.target.previousElementSibling.classList.remove("hide");    
                            })
                        })

                        document.querySelectorAll(".bx-task-x").forEach(deleteTaskButton =>{
                            deleteTaskButton.addEventListener("click",function(event){
                                let taskID=event.target.getAttribute("data-taskID");
                                // console.log(taskID);
                                let targetTask=document.querySelector(`.each-task[data-taskID="${taskID}"]`);
                                targetTask.classList.add("transition-effect");
                                setTimeout(function(){targetTask.style.display="none";},1000)
                                
                                let deleteRequest= new XMLHttpRequest();
                                deleteRequest.open("GET",`/contact/deleteTask?taskID=${taskID}`,true);
                                deleteRequest.send();   
                            })   
                        });
                        document.querySelectorAll(".bx-edit-alt").forEach(editTaskButton =>{
                            editTaskButton.addEventListener("click", async function(event){
                                let allUsers=await getAllUsers();
                                let currentUser=await getUser();
                                console.log(allUsers);
                                event.target.classList.add("hide");
                                event.target.previousElementSibling.classList.remove("hide");
                                let taskID=event.target.getAttribute("data-taskID");
                                // let targetTask=document.querySelector(`.each-task[data-taskID="${taskID}"]`);
                                document.querySelectorAll(`.each-task[data-taskID="${taskID}"] span:not(span[data-userID])`).forEach(span =>{
                                    span.setAttribute("contenteditable","true");
                                    span.classList.add("content-editable-span");
                                })
                                let tempResponsiblePerson=document.querySelector(`.each-task[data-taskID="${taskID}"] span[data-userID]`).innerText;

                                
                                if(currentUser.isSuperAdmin==="1"){
                                    let selectItem;
                                    document.querySelector(`.each-task[data-taskID="${taskID}"] span[data-userID]`).innerHTML=`<select class="allUsers"></select>`;
                                
                                    selectItem=document.querySelector(`.each-task[data-taskID="${taskID}"] span[data-userID] select`);
                                    allUsers.forEach(user => {
                                        selectItem.innerHTML+=`<option data-userID="${user.id}">${user.first_name} ${user.last_name}</option>`;
  
                                });
                                    selectItem.value=tempResponsiblePerson;
                                }
                                
                            

                            })
                        });
                        document.querySelectorAll(".check-task-box .bxs-check-circle").forEach(doneButton =>{
                            doneButton.addEventListener("click",function(event){
                                event.target.classList.add("hide");
                                event.target.nextElementSibling.classList.remove("hide");
                                let taskID=event.target.getAttribute("data-taskID");
                                let clientTask;
                                let spans=document.querySelectorAll(`.each-task[data-taskID="${taskID}"] span`);
                                let ResponsiblePerson=document.querySelector(`.each-task[data-taskID="${taskID}"] span[data-userID] select`);
                                console.log(ResponsiblePerson);
                                let userID=event.target.getAttribute("data-userID");
                                if(ResponsiblePerson){
                                    if(ResponsiblePerson.options[ResponsiblePerson.selectedIndex]){
                                        userID=ResponsiblePerson.options[ResponsiblePerson.selectedIndex].getAttribute("data-userID");
                                    }
                                    // else{
                                    //     userID=event.target.getAttribute("data-userID");
                                    // }
                                }
                                console.log(userID);
                                // console.log(userID);
                                for(let i=0;i<spans.length;i++){
                                    clientTask={
                                        task_name:HtmlSanitizer.SanitizeHtml(spans[0].textContent),
                                        task_description:HtmlSanitizer.SanitizeHtml(spans[4].textContent),
                                        clientID:clientID,
                                        task_start_date:HtmlSanitizer.SanitizeHtml(spans[1].textContent),
                                        task_end_date:HtmlSanitizer.SanitizeHtml(spans[2].textContent),
                                        userID:userID,
                                        taskID:taskID
                                    };
                                    spans[i].setAttribute("contenteditable","false");
                                    spans[i].classList.remove("content-editable-span");
                                    if(i===3&&ResponsiblePerson){
                                        if(ResponsiblePerson.value){
                                            spans[i].innerText=`${ResponsiblePerson.value}`;
                                        }else{
                                            spans[i].innerText=`Please choose a responsible person or delete the task`;
                                        }
                                        
                                    }
                                }
                                // console.log(clientTask);
                                let updateRequest=new XMLHttpRequest();
                                updateRequest.open("POST",`/contact/updateTask`);
                                updateRequest.setRequestHeader("Content-Type","application/json");
                                updateRequest.send(JSON.stringify(clientTask));
                                            
                            })
                        })
                    }else{
                        document.querySelector(".check-task-box").innerHTML="No task yet, create some"
                    }
                   
                    
                }
            }
            request.open("POST",`/contact/getTasks`);
            request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            request.send(`clientID=${clientID}`);
            
            

            close();
             
        })
    });

    /**
     * Export the table as csv file
     * 
     */
    
    let CSVData =[];
    function convertTableDataToArray(table){
        let data= document.querySelector(table).rows;
        for(let i=0;i<data.length;i++){
            let eachRow=data[i].children;
            let columnsInRow=[];
            for(let j=0;j<eachRow.length-1;j++){
                columnsInRow.push(eachRow[j].innerText);
            }
            CSVData.push(columnsInRow);
        }
    }

    exportButton.addEventListener("click",function(){
        // console.log("here");
        CSVData=[];
        convertTableDataToArray("#inner-table table");
        // console.log(CSVData);
        let row ="",CSV="";
        for(let rows of CSVData){
            row="";
            for(let item of rows){
                row+=`"${item}",`;
            }
            CSV+=row+"\r\n";
        }
        // console.log(CSV);
        let aLink =document.createElement("a");
        document.body.appendChild(aLink);
        const CSVDataBlob = new Blob(["\uFEFF" + CSV],{type:"text/csv;"});
        aLink.download=`client-table.csv`;
        aLink.href=URL.createObjectURL(CSVDataBlob);
        aLink.click();
        document.body.removeChild(aLink);
    })

    /**
     * Import and upload csv file 
     */
    let importButton=document.querySelectorAll("#buttons .button")[1];
    importButton.addEventListener("click",function(){
        let uploadDiv=document.createElement("div");
        uploadDiv.className="uploadDiv";
        section.appendChild(uploadDiv);
        uploadDiv.innerHTML=`<div><i class='bx bx-x'></i></div>
                             <div id="uploadCSV">
                                <h3>Import you client csv file and convert the data to the table</h3>
                                <span><a href="./examples/client-table.csv">CSV file template</a></span>
                                <form action="/uploadCSV" method="POST" enctype="multipart/form-data">
                                    <span><label for="file-upload"><i class='bx bx-upload'></i></label><input id="file-upload" type="file" name="CSVFile" accept=".csv" class="custom-file-input" required></span>
                                    <br>
                                    <span><button type="submit">Upload</button></span>
                                </form> 
                             </div>`;
        close();
    })

    document.querySelector(".direction i:nth-child(1)").addEventListener("click",function(){
        window.scrollTo(0,0);
    })
    document.querySelector(".direction i:nth-child(3)").addEventListener("click",function(){
        window.scrollTo(0,document.body.scrollHeight);
    })

    limitClickTime();

    function limitClickTime(){
        let clientButtons=document.querySelectorAll("section i:not(.add-task,.bxs-spreadsheet,.bx-arrow-to-top,.bx-arrow-from-top,.bx-menu,.bx-x,.bx-list-plus,.bx-search)");
        for(let i=0;i<clientButtons.length;i++){
            clientButtons[i].addEventListener("click",function(){
                clientButtons.forEach(button => {
                    button.classList.add("unclickable");
                });
                setTimeout(function(){
                    clientButtons.forEach(button => {
                        button.classList.remove("unclickable");
                    });
                },3000)
            })
        }
    }
    


    
    function close(){
        document.querySelectorAll(".bx-x").forEach(element =>{
            element.addEventListener("click",function(event){
                section.removeChild(event.target.parentNode.parentNode);
            })
        })
       
    }

    async function getUser(){
        const userObj =await fetch(`http://localhost:3000/user`);
        const user= await userObj.json();
        return user;
    }

    async function getUserByID(id){
        let user;
        try {
            const userObj =await fetch(`http://localhost:3000/user?id=${id}`);
            user= await userObj.json();
        } catch (error) {
            console.log(error.message);
        }
        
        return user;
    }
    async function getAllUsers(){
        const userObj =await fetch(`http://localhost:3000/users`);
        console.log(userObj);
        const users= await userObj.json();
        console.log(users);
        return users;
    }

    

    changeLocationHref();

    
    

    // function dragElement(element) {
    // var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    // if (element) {
    //         // if present, the header is where you move the DIV from:
    //         element.onmousedown = dragMouseDown;
    //     } else {
    //         // otherwise, move the DIV from anywhere inside the DIV:
    //         element.onmousedown = dragMouseDown;
    //     }

    //     function dragMouseDown(e) {
    //         e = e || window.event;
    //         e.preventDefault();
    //         // get the mouse cursor position at startup:
    //         pos3 = e.clientX;
    //         pos4 = e.clientY;
    //         document.onmouseup = closeDragElement;
    //         // call a function whenever the cursor moves:
    //         document.onmousemove = elementDrag;
    //     }

    //     function elementDrag(e) {
    //         e = e || window.event;
    //         e.preventDefault();
    //         // calculate the new cursor position:
    //         pos1 = pos3 - e.clientX;
    //         pos2 = pos4 - e.clientY;
    //         pos3 = e.clientX;
    //         pos4 = e.clientY;
    //         // set the element's new position:
    //         element.style.top = (element.offsetTop - pos2) + "px";
    //         element.style.left = (element.offsetLeft - pos1) + "px";
    //     }

    //     function closeDragElement() {
    //         // stop moving when mouse button is released:
    //         document.onmouseup = null;
    //         document.onmousemove = null;
    //     }
    // }

    
    
    

})