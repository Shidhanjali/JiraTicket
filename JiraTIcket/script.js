const main_cont=document.querySelector('.main-cont')
const add=document.querySelector(".add-btn")
const remove=document.querySelector(".remove-btn")
const modal=document.querySelector(".modal-cont")
const text=document.querySelector("textarea")
const color_selector =document.querySelectorAll(".priority-color")
const color_set= document.querySelectorAll(".color")
let priority_color="black"
let colors=["lightpink","lightblue","lightgreen","black"]
let addFlag=false
let removeFlag=false
const lockclass="fa-lock"
const unlockclass="fa-unlock"
let arr_details=[]
// get the data from the local storage if there is data already in it 
if(localStorage.getItem("Jira-ticket")){
    arr_details=JSON.parse(localStorage.getItem("Jira-ticket",JSON.stringify(arr_details)))
    arr_details.forEach(item =>{
        createTicket(item.color,item.id,item.content,false)
    })
} 

color_selector.forEach((color) => {
    color.addEventListener("click",(e)=>{
        color_selector.forEach((color)=>{
            if(e.target===color){
                color.classList.add("active")
                priority_color=color.classList[0]
            }
            else color.classList.remove("active")
        })
    })
})
console.log(text)
add.addEventListener("click",(e)=>{
    // inverse the value of the addflag attribute
    
    addFlag=!addFlag
    alert("Write Mode on")
    // if true display the modal else hide it
    if(addFlag)modal.style.display="flex"
    else modal.style.display="none"
})
remove.addEventListener("click",(e)=>{
    removeFlag = !removeFlag
    if(removeFlag) alert("Delete mode on")
    else alert("Delete mode off")

    
})
modal.addEventListener("keydown",(e)=>{
    const key=e.key
    if(key==='Shift'){
        const content =text.value
        createTicket(priority_color,shortid(),content,true)
        addFlag=false
        modal.style.display="none"
        text.value=""
    }
})
function getTicketIndx(id){
    let index=arr_details.findIndex((item)=>{
        return item.id===id
    })
    return index
}

function createTicket(color,id,content,new_ticket){

    const ticket=document.createElement("div")
    ticket.setAttribute("class","ticket-cont")
    
    ticket.innerHTML=`<div class="ticket-color ${color}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${content}</div>
    <div class="lock-area">
        <i class="fa fa-solid fa-lock"></i>
    </div>
    `
    main_cont.appendChild(ticket)
    removeticket(ticket,id)
    handlelock(ticket,id)
    handlepriority(ticket,id)
    if(new_ticket){
        arr_details.push({color,id,content})
        localStorage.setItem("Jira-ticket",JSON.stringify(arr_details))
    }

}
function removeticket(ticket,id) {
    ticket.addEventListener("click",(e)=>{
        if(!removeFlag)return
        let index=getTicketIndx(id)
        // DB removal
        arr_details.splice(index,1)
        localStorage.setItem("Jira-ticket",JSON.stringify(arr_details))
        // ui removal
        ticket.remove();
    })
}
function handlepriority(ticket,id){
    const ticketcolor = ticket.querySelector(".ticket-color")
    ticketcolor.addEventListener("click",(e)=>{
        // get the index of the ticket with the current id

        let ticketIdx=getTicketIndx(id)
        const prioritycolor = ticketcolor.classList[ticketcolor.classList.length - 1]
        ticketcolor.classList.remove(prioritycolor)
        let index= colors.indexOf(prioritycolor)
        if(index==3)index=0
        else index+=1
        ticketcolor.classList.add(colors[index])
        arr_details[ticketIdx].color=colors[index]
        localStorage.setItem("Jira-ticket",JSON.stringify(arr_details))
    })
}




function handlelock(ticket,id) {
    const ticket_lock=ticket.querySelector(".lock-area").children[0]
    const taskarea=ticket.querySelector(".task-area")
    ticket_lock.addEventListener("click",(e)=>{
        let index=getTicketIndx(id)

        if(ticket_lock.classList.contains(lockclass)){
            taskarea.setAttribute("contenteditable","true")
            ticket_lock.classList.remove(lockclass)
            ticket_lock.classList.add(unlockclass)
        }
        else{
            taskarea.setAttribute("contenteditable","false")
            ticket_lock.classList.remove(unlockclass)
            ticket_lock.classList.add(lockclass)
        }
        arr_details[index].content=taskarea.innerText
        localStorage.setItem("Jira-ticket",JSON.stringify(arr_details))
    })
}

for(let i=0;i<color_set.length;i++){
    color_set[i].addEventListener("click",(e)=>{
        let ticket_cont=document.querySelectorAll(".ticket-cont")
        let curr_color=color_set[i].classList[0]
        let filteredarray = arr_details.filter((ticket)=>{
            return curr_color===ticket.color
        })
        ticket_cont.forEach((ticket)=>{
            ticket.remove()
        })
        filteredarray.forEach((ticket)=>{
            createTicket(ticket.color,ticket.id,ticket.content,false)
        })
    }) 
    color_set[i].addEventListener('dblclick',(e)=>{
       
        let ticket_cont=document.querySelectorAll(".ticket-cont")
        ticket_cont.forEach((ticket)=>{
            ticket.remove()
        })
        arr_details.forEach((item)=>{
            createTicket(item.color,item.id,item.content,false)
        })
    })
}