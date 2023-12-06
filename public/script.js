const $=(name)=>document.querySelector(name);

let alarm = $('.alarm');
let servertime = $(".czasserwera");
let przerwy = $(".przerwy");
let edycja = false;
let dodajdzwonek = $(".dodajdzwonek");

dodajdzwonek.addEventListener('click', e=>{
    
    let i = przerwy.querySelectorAll('.input-group').length;
    edycja=true;
    dodajelem(i+1, 0);
})

alarm.addEventListener('click', e=>{
    fetch('/setalarm?alarm=true')
        .then(x=>x.json())
        .then(json=>{
            alarm.className = 'btn alarm '+ (json.alarm?'btn-danger':'btn-info');
        })
})

function dodajelem(num, wart){
    let inp = `<div class="input-group flex-nowrap">
    <span class="input-group-text" id="addon-wrapping">${num}</span>
    <input type="numeric" value="${wart}" class="form-control" placeholder="Długość przerwy" 
        aria-label="Długość przerwy"
         aria-describedby="addon-wrapping">
         <span class="btn btn-outline-secondary btn-danger" id="basic-addon2">
          <span class="icon icon-trash danger"></span>
         </span>
        
  </div>`;

  
    przerwy.innerHTML += inp;
}

function budujEdycjeDzwonkow(dzwonki){
    przerwy.innerHTML = '';
    dzwonki.forEach((e,i)=>{
        dodajelem(i+1, e);
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