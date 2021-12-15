window.addEventListener("load",function(){
    let displayButton=document.querySelectorAll('.button')[1];
    let gettableButton=document.querySelectorAll(".button")[0];
    let form =document.querySelector("#add-form");
    let inputs =document.querySelectorAll("input");
    let table=document.getElementById("inner-table");
    let tbody=document.querySelector("#inner-table table tbody");
    /**
     * toggle the button's ui
     */
    displayButton.addEventListener("click",function(){
        form.classList.toggle("display");
        displayButton.classList.toggle("changeButton");
    })

    for(let i=0;i<inputs.length;i++){
        inputs[i].addEventListener("keyup",function(){
            inputs[i].value=HtmlSanitizer.SanitizeHtml(inputs[i].value);
         })  
    }
    let textarea=document.querySelector("textarea");
    textarea.addEventListener("keyup",function(){
        HtmlSanitizer.SanitizeHtml(textarea.value);
    })
    gettableButton.addEventListener("click",function(){
        table.classList.toggle("display");
        table.classList.remove("hide");
        gettableButton.classList.toggle("changeButton");
        // table.firstElementChild.classList.remove("hide");
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
    /**
     * 
     * @param {*} donLinks toggle done'link's ui and send ajax request to the server to update client's information
     */
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
    let deleteLinks=document.querySelectorAll("table .bxs-message-square-x");
    deleteLink(deleteLinks);
    /**
     * search client base on the input and toggle the table's visibility and the button's ui
     */
    let searchInput=document.querySelector("#search-box input");
    let searchIcon=this.document.querySelector("#search-box i")
    let trs=document.querySelectorAll(`tr[data-clientID]`);
    let pop_msg=document.querySelector("#search-table p");
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
    searchIcon.addEventListener("click",function(){
        gettableButton.classList.add("disable");
        gettableButton.classList.add("hide");
        table.classList.remove("hide");

        let inputValue=HtmlSanitizer.SanitizeHtml(searchInput.value);
        let flag=false;
        for(let i=0;i<trs.length;i++){
            let lowerCaseInnerText=trs[i].innerText.toLowerCase();
            if(lowerCaseInnerText.includes(inputValue.toLowerCase())&&inputValue!==""){
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

    
    let msg =document.querySelector("#msg h3");
    if(msg){
        const nextURL = '/contact';
        const nextTitle = 'Contact page';
        const nextState = { additionalInformation: 'Updated the URL with JS' };
        window.history.replaceState(nextState, nextTitle, nextURL);
        // This will replace the current entry in the browser's history, without reloading
    }
    
    

})