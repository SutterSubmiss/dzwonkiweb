const $=(name)=>document.querySelector(name);

let alarm = $('.alarm');


alarm.addEventListener('click', e=>{
    fetch('/setalarm?alarm=true')
        .then(x=>x.json())
        .then(json=>{
            alarm.className = 'btn alarm '+ (json.alarm?'btn-danger':'btn-info');
        })
})

function readData(){
    fetch('/data')
    .then(x=>x.json())
    .then(json=>{
       // console.log(json.alarm);
        alarm.className = 'btn alarm '+ (json.alarm?'btn-danger':'btn-info');
    })
}

setInterval(()=>{
    readData();
},1000)