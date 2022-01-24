import {changeLocationHref,direction,getAllUsers,getUser,getUserByID,sanitizer,toggleManagementTools,search,toggleMenu} from "./helper.js";
window.addEventListener("load",function(){
    const exportButton =document.querySelectorAll("#buttons .button")[0];
    exportButton.classList.add("hide");
    const displayButton=document.querySelectorAll('#buttons .button')[2];
    const gettableButton=document.querySelectorAll("#buttons .button")[3];
    const form =document.querySelector("#add-form");
    const table=document.getElementById("inner-table");

    

    /**
     * toggle the button's ui
     */
     toggleMenu();
    if(location.href.includes("Client")){
        form.classList.toggle("display");
        displayButton.classList.toggle("changeButton");
    }
    displayButton.addEventListener("click",function(){
        form.classList.toggle("display");
        displayButton.classList.toggle("changeButton");
    })
    gettableButton.addEventListener("click",function(){
        table.classList.toggle("display");
        table.classList.remove("hide");
        gettableButton.classList.toggle("changeButton");
        exportButton.classList.toggle("hide");
        exportButton.classList.toggle("changeButton");
        
    });
    /**
     * Sanitize the input
     */
    sanitizer();
    const textarea=document.querySelector("textarea");
    textarea.addEventListener("keyup",function(){
        HtmlSanitizer.SanitizeHtml(textarea.value);
    })


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
                        element.innerHTML=`<div class="selectItem">
                        <select  name="progress_status" class="progress_status">
                                <option value="None" >None</option>
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
                    if(i!==9){
                        tds[i].innerText=HtmlSanitizer.SanitizeHtml(tds[i].textContent);
                        tds[i].setAttribute("contenteditable","false");
                        tds[i].classList.remove("content-editable");
                    }
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
                }
                client.progress_status=document.querySelector(`tr[data-clientID="${clientID}"] .progress_status`).value;
                tds[9].innerText=client.progress_status;
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
    
    
    /**
     * 
     * @param {*} deleteLinks send ajax request to delete a client from the database
     */
     const dialogBox = document.getElementById("dialogBox"),
     deleteButton  = document.getElementById("delete"),
     cancelButton = document.getElementById("cancel");
     const deleteLinks=document.querySelectorAll("table .bxs-user-x");
     function cancelDelete(){
         cancelButton.addEventListener("click",function(){
             dialogBox.classList.remove("display");
         })
     }
    //be mindful of nested add eventListener, need to remove it first
    deleteLink(deleteLinks);
    function deleteLink(deleteLinks){
        deleteLinks.forEach(element=>{
            element.addEventListener("click",function(event){
                const clientID=event.target.getAttribute("data-clientID");
                dialogBox.classList.add("display");
                deleteButton.setAttribute("data-clientID",clientID);
                deleteButton.removeEventListener("click",deleteSingleClient);
                deleteButton.addEventListener("click",deleteSingleClient);    
            })
        })
        cancelDelete(); 
    }
    function deleteSingleClient(event){
        const clientID=event.target.getAttribute("data-clientID");
        const tr=document.querySelector(`tr[data-clientID="${clientID}"]`);
        tr.classList.add("transition-effect");
        setTimeout(function(){
            tr.style.display="none";   
        },1000);
        dialogBox.classList.remove("display");
        const request =new XMLHttpRequest();
        request.open("POST",`/contact/delete`);
        request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        request.send(`clientID=${clientID}`);
    }
    

    /**
     * delete multiple client
     */
     const managementToolObj=toggleManagementTools();
    if(managementToolObj.delete_selected_users){
        managementToolObj.delete_selected_users.addEventListener("click",function(event){
            let clientIDs=[];
            document.querySelectorAll(`input[type="checkbox"]:checked`).forEach(checkedBox=>{
                clientIDs.push(checkedBox.value);
            })
            if(clientIDs.length>0){
                dialogBox.classList.add("display");
                deleteButton.setAttribute("data-clientID",JSON.stringify(clientIDs))
                deleteButton.removeEventListener("click",deleteClient);
                deleteButton.addEventListener("click",deleteClient);
                cancelButton.addEventListener("click",function(){
                    dialogBox.classList.remove("display");
                    managementToolObj.displayManagementTools();
                    clientIDs=[];
                    managementToolObj.checkboxes.forEach(checkBox=>{
                        checkBox.checked=false;
                    })
                })
            }else{
                managementToolObj.displayManagementTools();
            }
        })
        function deleteClient(event){
            const clientIDs=JSON.parse(event.target.getAttribute("data-clientID"));
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
            managementToolObj.displayManagementTools();
        }
    }
    
    /**
     * search client base on the input and toggle the table's visibility and the button's ui
     */
     let clientID;
     const index=location.href.indexOf("clientID=")
     if(index!==-1){
         clientID=location.href.substring(index+9);
     }
    search("data-clientID",3,"",clientID);

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
                let task_start_date=(HtmlSanitizer.SanitizeHtml(document.querySelector("#task_end_date").value));
                task_start_date=returnNumberFormat(task_start_date);
                let task_end_date=(HtmlSanitizer.SanitizeHtml(document.querySelector("#task_start_date").value));
                task_end_date=returnNumberFormat(task_end_date);
                let clientTask={
                    clientid:clientID,
                    task_name:HtmlSanitizer.SanitizeHtml(document.querySelector("#task_name").value),
                    task_description:HtmlSanitizer.SanitizeHtml(document.querySelector("#task_description").value),
                    task_end_date:task_start_date,
                    task_start_date:task_end_date,
                    userid:user.id,
                    iscompleted:"false"

                }
                if(!clientTask.task_name||!clientTask.task_description||!clientTask.task_start_date||!clientTask.task_end_date){
                    submitButton.disabled=true;
                    notNullMsg.innerHTML="Please fill in all the information"
                }else{
                    submitButton.disabled=false;
                    notNullMsg.innerHTML="Task created successfully";
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
                    let currentUser=await getUser();
                    if(tasks.length!==0){
                        for(let i=0;i<tasks.length;i++){
                            let task=tasks[i];
                            let task_start_date=task.task_start_date;
                            let task_end_date=task.task_end_date;
                            task_start_date=returnDateFormat(task_start_date);
                            task_end_date=returnDateFormat(task_end_date);
                            let user=await getUserByID(task.userid);
                            let ResponsiblePerson;
                            if(user){
                                ResponsiblePerson=`${user.first_name} ${user.last_name}`;
                            }else{
                                ResponsiblePerson=`No responsible person or previous responsible person is no longer in the system,please choose one or delete the task`;
                            }
                            document.querySelector(".check-task-box").innerHTML+=
                            `<div class="each-task" data-taskID="${task.id}" >
                                <div class="tasksManagement" data-userID="${task.userid}" data-taskID="${task.id}">
                                    <i class='bx bx-task-x' data-taskID="${task.id}" data-userID="${task.userid}" title="Delete task"></i>
                                    <i class='bx bxs-check-circle' data-taskID="${task.id}" data-userID="${task.userid}" title="Done"></i>
                                    <i class='bx bx-edit-alt' data-taskID="${task.id}" data-userID="${task.userid}" title="Edit task"></i>
                                </div>
                                <div>Task name:<span>${task.task_name}</span></div>
                                <div >Task start date:<span class="task-date ">${task_start_date}</span></div>
                                <div >Task end date:<span class="task-date ">${task_end_date}</span></div>
                                <div data-userID="${task.userid}">Responsible person:<span data-userID="${user?user.id:"none"}">${ResponsiblePerson}</span></div>
                                <div>Task description:<span>${task.task_description}</span></div>
                                <div class="isCompleted" data-taskID="${task.id}" data-userID="${task.userid}"><i class='bx bxs-wink-smile' title="task completed,click to change it as uncompleted"></i><i class='bx bxs-meh-blank' title="task not completed,click to change it as completed"></i></div>
                            </div>`; 
                            let incompleteICon=document.querySelector(`.isCompleted[data-taskID="${task.id}"] .bxs-meh-blank`);
                            let completeICon=document.querySelector(`.isCompleted[data-taskID="${task.id}"] .bxs-wink-smile`)
                            if(task.iscompleted==="true"){
                                incompleteICon.classList.add("hide");
                            }else{
                                completeICon.classList.add("hide");
                            }
                            let tasksManagementTool=document.querySelector(`.tasksManagement[data-taskID="${task.id}"]`);
                            let progressTool=document.querySelector(`.isCompleted[data-taskID="${task.id}"]`);
                            if(currentUser.issuperadmin!=="1"&&task.userid!==currentUser.id){
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
                            completeButton.removeEventListener("click",setUnComplete);
                            completeButton.addEventListener("click",setUnComplete);
                        })
                    
                        incompleteIcons.forEach(not_completeButton =>{
                            not_completeButton.removeEventListener("click",setComplete);
                            not_completeButton.addEventListener("click",setComplete);
                        })

                        document.querySelectorAll(".bx-task-x").forEach(deleteTaskButton =>{
                            deleteTaskButton.removeEventListener("click",deleteTask);  
                            deleteTaskButton.addEventListener("click",deleteTask);  
                        });

                        document.querySelectorAll(".bx-edit-alt").forEach(editTaskButton =>{
                            editTaskButton.removeEventListener("click", displayTask);
                            editTaskButton.addEventListener("click", displayTask);
                        });
                        document.querySelectorAll(".check-task-box .bxs-check-circle").forEach(doneButton =>{
                            doneButton.setAttribute("data-clientID",clientID);
                            doneButton.removeEventListener("click",updateTask);
                            doneButton.addEventListener("click",updateTask);
                                
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
    function setUnComplete(event){
        event.target.classList.add("hide");
        let taskID=event.target.parentNode.getAttribute("data-taskID");
        let request=new XMLHttpRequest();
        request.open("GET",`/contact/updateTaskCompleted?taskID=${taskID}&isCompleted=false`,true);
        request.send();  
        event.target.nextElementSibling.classList.remove("hide");
    }
    function setComplete(event){
        event.target.classList.add("hide");
        let taskID=event.target.parentNode.getAttribute("data-taskID");
        let request=new XMLHttpRequest();
        request.open("GET",`/contact/updateTaskCompleted?taskID=${taskID}&isCompleted=true`,true);
        request.send();  
        event.target.previousElementSibling.classList.remove("hide");
    }
    function deleteTask(event){
        let taskID=event.target.getAttribute("data-taskID");
        let targetTask=document.querySelector(`.each-task[data-taskID="${taskID}"]`);
        targetTask.classList.add("transition-effect");
        setTimeout(function(){targetTask.style.display="none";},1000)
        let deleteRequest= new XMLHttpRequest();
        deleteRequest.open("GET",`/contact/deleteTask?taskID=${taskID}`,true);
        deleteRequest.send();
    }
    async function displayTask(event){
        let allUsers=await getAllUsers();
        let currentUser=await getUser();
        event.target.classList.add("hide");
        event.target.previousElementSibling.classList.remove("hide");
        let taskID=event.target.getAttribute("data-taskID");
        document.querySelector(`.each-task[data-taskID="${taskID}"] .isCompleted`).classList.add("hide");
        // let targetTask=document.querySelector(`.each-task[data-taskID="${taskID}"]`);
        document.querySelectorAll(`.each-task[data-taskID="${taskID}"] span:not(span[data-userID], .task-date)`).forEach(span =>{
            span.setAttribute("contenteditable","true");
            span.classList.add("content-editable-span");
        })
        document.querySelectorAll(`.each-task[data-taskID="${taskID}"] .task-date`).forEach(date=>{
            let tempDate=date.innerText;
            date.innerHTML=`<input type="date" value="${tempDate}">`;
        })
        let tempResponsiblePerson=document.querySelector(`.each-task[data-taskID="${taskID}"] span[data-userID]`).innerText;
        if(currentUser.issuperadmin==="1"){
            let selectItem;
            document.querySelector(`.each-task[data-taskID="${taskID}"] span[data-userID]`).innerHTML=`<select class="allUsers"></select>`;
        
            selectItem=document.querySelector(`.each-task[data-taskID="${taskID}"] span[data-userID] select`);
            allUsers.forEach(user => {
                selectItem.innerHTML+=`<option data-userID="${user.id}">${user.first_name} ${user.last_name}</option>`;
        });
            selectItem.value=tempResponsiblePerson;
        }
    }
    async function updateTask(event){
        event.target.classList.add("hide");
        event.target.nextElementSibling.classList.remove("hide");
        let taskID=event.target.getAttribute("data-taskID");
        let clientTask;
        let spans=document.querySelectorAll(`.each-task[data-taskID="${taskID}"] span`);
        let ResponsiblePerson=document.querySelector(`.each-task[data-taskID="${taskID}"] span[data-userID] select`);
        document.querySelector(`.each-task[data-taskID="${taskID}"] .isCompleted`).classList.remove("hide");
        let userID=event.target.getAttribute("data-userID");
        let clientID=event.target.getAttribute("data-clientID");
        if(ResponsiblePerson){
            if(ResponsiblePerson.options[ResponsiblePerson.selectedIndex]){
                userID=ResponsiblePerson.options[ResponsiblePerson.selectedIndex].getAttribute("data-userID");
            }
        };
        let isCompleted;
        let unCompletedIcon=document.querySelector(`.each-task[data-taskID="${taskID}"] .isCompleted .bxs-meh-blank`);
        let completedIcon =document.querySelector(`.each-task[data-taskID="${taskID}"] .isCompleted .bxs-wink-smile`);
        if(unCompletedIcon.classList.contains("hide")){
            isCompleted="true";
        }else if(completedIcon.classList.contains("hide")){
            isCompleted="false";
        }
        
        clientTask={
            task_name:HtmlSanitizer.SanitizeHtml(spans[0].textContent),
            task_description:HtmlSanitizer.SanitizeHtml(spans[4].textContent),
            clientid:clientID,
            userid:userID,
            taskid:taskID,
            iscompleted:isCompleted
        };
        spans[0].setAttribute("contenteditable","false");
        spans[0].classList.remove("content-editable-span");
        spans[4].setAttribute("contenteditable","false");
        spans[4].classList.remove("content-editable-span");
        if(ResponsiblePerson){
            if(ResponsiblePerson.value){
                spans[3].innerText=`${ResponsiblePerson.value}`;
            }else{
                spans[3].innerText=`Please choose a responsible person or delete the task`;
            } 
        }
        spans[1].innerText=document.querySelectorAll(`.each-task[data-taskID="${taskID}"] .task-date input`)[0].value;
        spans[2].innerText=document.querySelectorAll(`.each-task[data-taskID="${taskID}"] .task-date input`)[0].value;
        
        clientTask.task_start_date=spans[1].innerText.replaceAll("-",'');
        clientTask.task_end_date=spans[2].innerText.replaceAll("-",'');
        let updateRequest=new XMLHttpRequest();
        updateRequest.open("POST",`/contact/updateTask`);
        updateRequest.setRequestHeader("Content-Type","application/json");
        updateRequest.send(JSON.stringify(clientTask));
        }
    });

    function returnDateFormat(dateNumberString){
        return dateNumberString.substring(0,4)+"-"+dateNumberString.substring(4,6)+"-"+dateNumberString.substring(6,8);
    }
    function returnNumberFormat(dateString){
        return dateString.replaceAll("-","").padStart(8,"0");
    }

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
        CSVData=[];
        convertTableDataToArray("#inner-table table");
        let row ="",CSV="";
        for(let rows of CSVData){
            row="";
            for(let item of rows){
                row+=`"${item}",`;
            }
            CSV+=row+"\r\n";
        }
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

    direction();
    limitClickTime();
    /**
     * Limit client's click frequency
     */
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
                },1500)
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

    changeLocationHref();
})