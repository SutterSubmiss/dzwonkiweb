const $=(name)=>document.querySelector(name);

let alarm = $('.alarm');
let servertime = $(".czasserwera");
let przerwy = $(".przerwy");
let edycja = false;

alarm.addEventListener('click', e=>{
    fetch('/setalarm?alarm=true')
        .then(x=>x.json())
        .then(json=>{
            alarm.className = 'btn alarm '+ (json.alarm?'btn-danger':'btn-info');
        })
})

function budujEdycjeDzwonkow(dzwonki){
    przerwy.innerHTML = '';
    dzwonki.forEach((e,i)=>{
        let inp = `<div class="input-group flex-nowrap">
        <span class="input-group-text" id="addon-wrapping">${i+1}</span>
        <input type="numeric" value="${e}" class="form-control" placeholder="Długość przerwy" 
            aria-label="Długość przerwy" aria-describedby="addon-wrapping">
      </div>`;

      
        przerwy.innerHTML += inp;

    })
}

function readData(){
    fetch('/data')
    .then(x=>x.json())
    .then(json=>{
       // console.log(json.alarm);
        alarm.className = 'btn alarm '+ (json.alarm?'btn-danger':'btn-info');
        let servernow = new Date();
        servernow.setTime(json.time*1000);
        servertime.innerHTML = servernow.toLocaleTimeString() + " " + servernow.toLocaleDateString();

        if(!edycja)
        {
            budujEdycjeDzwonkow(json.data.bell)
        }
    })
}

setInterval(()=>{
    readData();
},1000)