window.addEventListener("load",function(){
    let displayButton=document.querySelectorAll('.button')[0];
    let gettableButton=document.querySelectorAll(".button")[1];
    let form =document.querySelector("#add-form");
    let inputs =document.querySelectorAll("input");
    let table=document.getElementById("inner-table");
    displayButton.addEventListener("click",function(){
        form.classList.toggle("display");
        displayButton.classList.toggle("changeButton");
    })
    let submitBtn=document.querySelector("#submitButton");
    let requireInputs=document.querySelectorAll("input:required");
    for(let i=0;i<inputs.length;i++){
        inputs[i].addEventListener("keyup",function(){
            let clean=HtmlSanitizer.SanitizeHtml(inputs[i].value);
         })  
    }
    let textarea=document.querySelector("textarea");
    textarea.addEventListener("keyup",function(){
        HtmlSanitizer.SanitizeHtml(textarea.value);
    })
    gettableButton.addEventListener("click",function(){
        table.classList.toggle("display");
        gettableButton.classList.toggle("changeButton");
    });


    let deleteLinks=document.querySelectorAll("table .bxs-message-square-x");
    function editLink(editLinks){
        editLinks.forEach(element => {
            element.addEventListener("click",function(event){
                event.target.style.display="none";
                event.target.nextElementSibling.style.display="inline";
                let clientID=event.target.getAttribute("data-clientID");
                let tds=document.querySelectorAll(`tr[data-clientID="${clientID}"] td:not(tr[data-clientID="${clientID}"] td:last-child)`);
                tds.forEach(element =>{
                    element.setAttribute("contenteditable","true");
                    element.classList.add("content-editable");
                })
                
    
            })
        });
    }
    let editLinks=document.querySelectorAll("table .bxs-edit");
    editLink(editLinks);
    
    function donLink(donLinks){
        doneLinks.forEach(element => {
            element.addEventListener("click",function(event){
                event.target.style.display="none";
                event.target.previousElementSibling.style.display="inline";
                let clientID=event.target.getAttribute("data-clientID");
                let tds=document.querySelectorAll(`tr[data-clientID="${clientID}"] td:not(tr[data-clientID="${clientID}"] td:last-child)`);
                let request;
                let client
                for(let i=0;i<tds.length;i++){
                    // console.log(HtmlSanitizer.SanitizeHtml(tds[i].textContent));
                    tds[i].innerText=HtmlSanitizer.SanitizeHtml(tds[i].textContent);
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
                        facebook:tds[8].textContent,
                        instagram:tds[9].textContent,
                        other_social_media:tds[10].textContent,
                        meet_with:tds[12].textContent,
                        notes_on_client:tds[11].textContent,
                        addedBy:tds[13].textContent
                    }
                    tds[i].setAttribute("contenteditable","false");
                    tds[i].classList.remove("content-editable"); 
                }
                request=new XMLHttpRequest();
                request.open("POST",`/contact/edit`);
                request.setRequestHeader("Content-Type","application/json");
                request.send(JSON.stringify(client));
                console.log(client);
    
    
            })
        })
    }
    let doneLinks=document.querySelectorAll("table .bxs-check-circle");
    donLink(doneLinks);
    
    //Creating the variables and getting elements from DOM
    let dialogBox = document.getElementById("dialogBox"),
    deleteButton  = document.getElementById("delete"),
    cancelButton = document.getElementById("cancel");
        
    //hide dialogBox initially;
    // dialogBox.classList.add("hide");
    deleteLinks.forEach(element=>{
        element.addEventListener("click",function(event){
            let request;
            let clientID=event.target.getAttribute("data-clientID");
            let tr=document.querySelector(`tr[data-clientID="${clientID}"]`);
            dialogBox.classList.add("display");
            // dialogBox.classList.remove("hide");
            deleteButton.addEventListener("click",function(){
                tr.style.display="none";
                dialogBox.classList.remove("display");
                request =new XMLHttpRequest();
                // request.open("GET",`/newArticle?html=`+html,true);
                request.open("POST",`/contact/delete`);
                request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                request.send(`clientID=${clientID}`);
            })
            cancelButton.addEventListener("click",function(){
                dialogBox.classList.remove("display");
            })
            
        })
    })
    let searchInput=document.querySelector("#search-box input");
    let searchIcon=this.document.querySelector("#search-box i")
    let trs=document.querySelectorAll(`tr[data-clientID]`);
    let searchResult=document.querySelector("#search-table");
    let resultTableHead=document.querySelector("#result-table");
    let resultTable=document.querySelector("#result-table tbody");
    let pop_msg=document.querySelector("#search-table p");
    resultTableHead.classList.add("hide");
    searchInput.addEventListener("keyup",function(event){
        let inputValue=HtmlSanitizer.SanitizeHtml(searchInput.value);
        // if(event.keyCode==13){
        //     event.preventDefault();
        //     searchIcon.click();
        // }
        searchIcon.click();
        if(inputValue===""){
            pop_msg.classList.remove("display");
        }
        
        
    })
    searchIcon.addEventListener("click",function(){
        resultTable.innerHTML="";
        let inputValue=HtmlSanitizer.SanitizeHtml(searchInput.value);
        for(let i=0;i<trs.length;i++){
            let lowerCaseInnerText=trs[i].innerText.toLowerCase();
            if(lowerCaseInnerText.includes(inputValue.toLowerCase())&&inputValue!==""){
                console.log(inputValue);
                console.log(trs[i].outerHTML);
                resultTable.innerHTML+=trs[i].outerHTML;
            }
        }

        if(resultTable.innerHTML===""){
            pop_msg.classList.add("display");
            resultTableHead.classList.add("hide");
        }else{
            resultTableHead.classList.remove("hide");
            pop_msg.classList.remove("display");
        }  
    })


    let msg =document.querySelector("#msg h3");
    if(msg){
        const nextURL = '/contact';
        const nextTitle = 'Contact page';
        const nextState = { additionalInformation: 'Updated the URL with JS' };
        window.history.replaceState(nextState, nextTitle, nextURL);
        // This will replace the current entry in the browser's history, without reloading
    }

    


    // let hint_msg=document.querySelector("#hint-msg");
    // for(let i=0;i<requireInputs.length;i++){
    //     requireInputs[i].addEventListener("input",function(){
    //         if(requireInputs[i].value===""){
    //             submitBtn.disabled=true;
    //             hint_msg.innerHTML="<p>Please fill in the required information<p>";
    //         }else{
    //             hint_msg.innerHTML="";
    //         }
    //     })
        
    // }
    
    

})