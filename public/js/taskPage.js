window.addEventListener('load', function(){
    this.localStorage.clear();
    let projectNameDiv=document.getElementById("project-name");
    let projectName="";
    projectNameDiv.addEventListener("input",function(){
        projectName=HtmlSanitizer.SanitizeHtml(projectNameDiv.textContent);
    })
    let leftDiv =document.getElementById("left-box");
    let startDateDiv =document.getElementById("date");
    let startDate;
    startDateDiv.addEventListener("input",function(){
        startDate=new Date(startDateDiv.value);
        // console.log(startDate)

    })
    let taskDiv =document.getElementById("project-task");
    let tasks="";
    let taskArray=[];
    let tBody=document.getElementsByTagName("tbody")[0];
    taskDiv.addEventListener("focus",function(event){
        event.target.setAttribute("placeholder","");
        
    })
    taskDiv.addEventListener("blur",function(event){
        if(!tasks){
            event.target.setAttribute("placeholder","Use 'task+days' format to specify the tasks you want to add and the Duration of the task,eg.'working on site+3'. Press enter to start a newline and type in another task.");
        }
    })
    taskDiv.addEventListener("input",function(){
        tasks=HtmlSanitizer.SanitizeHtml(taskDiv.innerText);
        taskArray=tasks.split(/\r\n|\n\r|\n|\r/).filter(e=>e);

    })
    let startTimeCell=document.querySelectorAll(".start-time");
    let endTimeCell=document.querySelectorAll(".end-time");
    let modifiedStartTime;
    let startTimeRow;
    let modifiedEndTime;
    let endTimeRow;
    leftDiv.addEventListener("input",function(){
        tBody.innerHTML="";
        startDate=new Date(startDateDiv.value);
        let duration=0;
        let temp;
        let tempSet=new Set();
        // console.log(tempSet);
        let startTime=document.getElementById("start-time").value;
        let endTime=document.getElementById("end-time").value;
        for(let i=0;i<taskArray.length;i++){
            if(taskArray[i].includes("+")&&taskArray[i]!=""){
                let taskAndDuration=taskArray[i].split("+");
                let task=taskAndDuration[0];
                if(tempSet.has(task)){
                    tBody.innerHTML=`<b>Duplicated task name,choose another name!</b>`;
                    break;
                }
                tempSet.add(task);
                duration=parseInt(taskAndDuration[1]);
                // console.log(task,duration,startDate);
                temp=startDate;
                if(temp=="Invalid Date"){
                    tBody.innerHTML="<b >Invalid date!!! Choose a start date or enter the durations of your task</b>"
                }else{
                    tBody.innerHTML+=`<tr>
                                <td class="table-class">${task}</td>
                                <td class="startDate">${getFormattedDate(startDate)}</td>
                                <td class="endDate">${getFormattedDate(new Date(temp.setDate(temp.getDate()+duration)))}</td>
                                <td class="start-time" contenteditable="true" data-startTime-row=${task}>${localStorage.getItem("startTimeTD"+task)==undefined?startTime:localStorage.getItem("startTimeTD"+task)}</td>
                                <td class="end-time" contenteditable="true" data-endTime-row=${task}>${localStorage.getItem("endTimeTD"+task)==undefined?endTime:localStorage.getItem("endTimeTD"+task)}</td>
                                <td>${duration}</td>
                            </tr>`;
                }
                
                startDate=new Date(temp.setDate(temp.getDate()));   
            } 
            
        }
        
        let checkTime=new RegExp(`^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$`);
        startTimeCell=document.querySelectorAll(".start-time");
        endTimeCell=document.querySelectorAll(".end-time");
        for(let i=0;i<startTimeCell.length;i++){
            startTimeCell[i].addEventListener("input",function(event){
                // console.log(event.target.textContent);
                // console.log(checkTime.test(event.target.textContent));
                if(checkTime.test(event.target.textContent)){
                    modifiedStartTime=HtmlSanitizer.SanitizeHtml(event.target.textContent);
                }else{
                    modifiedStartTime="Time format HH:MM";
                }
                startTimeRow=event.target.getAttribute("data-startTime-row");
                localStorage.setItem("startTimeTD"+startTimeRow,modifiedStartTime);
                // console.log(modifiedStartTime);
                // console.log(startTimeRow);
            })
        }
        for(let i=0;i<endTimeCell.length;i++){
            endTimeCell[i].addEventListener("input",function(event){
                // console.log(event.target.textContent);
                // console.log(checkTime.test(event.target.textContent));
                if(checkTime.test(event.target.textContent)){
                    modifiedEndTime=HtmlSanitizer.SanitizeHtml(event.target.textContent);
                }else{
                    modifiedEndTime="Time format HH:MM";
                }
                endTimeRow=event.target.getAttribute("data-endTime-row");
                localStorage.setItem("endTimeTD"+endTimeRow,modifiedEndTime);
                // console.log(modifiedEndTime);
                // console.log(endTimeRow);
                
            })
        }
        
        // startTimeCell.forEach(td => {
        //     if(startTime){
        //         td.innerHTML=localStorage.getItem("startTimeTD"+i)==undefined?startTime:localStorage.getItem("startTimeTD"+i);
        //     }
        // });
        // endTimeCell.forEach(td => {
        //     if(endTime){
        //         td.innerHTML=endTime;
        //     }
        // });

    })


    let exportButton=document.getElementById("CSV");
    
    let CSVData =[];
    function convertTableDataToArray(table_id){
        let data= document.getElementById(table_id).rows;
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
        convertTableDataToArray("data");
        console.log(CSVData);
        let row ="",CSV="";
        for(let rows of CSVData){
            row="";
            for(let item of rows){
                row+=`"${item}",`;
            }
            CSV+=row+"\r\n";
        }
        console.log(CSV);
        let aLink =document.createElement("a");
        document.body.appendChild(aLink);
        const CSVDataBlob = new Blob(["\uFEFF" + CSV],{type:"text/csv;"});
        aLink.download=`${projectName}.csv`;
        aLink.href=URL.createObjectURL(CSVDataBlob);
        aLink.click();
        document.body.removeChild(aLink);
    })

    function getFormattedDate(date) {
        var year = date.getFullYear();
      
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
      
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return month + '/' + day + '/' + year;
      }

     

 

    

})