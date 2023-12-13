const $=(name)=>document.querySelector(name);
const $$=name=>document.querySelectorAll(name);

let alarm = $('.alarm');
let servertime = $(".czasserwera");
let przerwy = $(".przerwy");
let edycja = false;


let dodajdzwonek = $(".dodajdzwonek");
let zapiszdzwonek = $(".zapiszdzwonek");
let dodajoffset = $(".dodajoffset");
let odejmijoffset = $(".odejmijoffset");
let dnitygodnia = $$('.dnitygodnia input[type=checkbox]');

function addOffset(val="") //val = plus lub minus
{
        fetch(`/addoffset?val=${val}`)
            .then(e=>{

            });
}

dodajoffset.addEventListener('click', e=>{
    addOffset("plus");
})
odejmijoffset.addEventListener('click', e=>{
    addOffset("minus");
})

zapiszdzwonek.addEventListener('click', e=>{
  
  let dz = przerwy.querySelectorAll('.input-group input');  
  dzwon = [];
  dz.forEach(e=>{
    dzwon.push(e.value);
  })  
  fetch('/zapiszdzwonki?dane=' + JSON.stringify(dzwon))
    .then(e=>e.json())
    .then(j=>{
       if(j.status == 'ok')
       {
        zapiszdzwonek.classList.add('disabled');
        edycja = false;
       }         
    })
})

dodajdzwonek.addEventListener('click', e=>{
    zapiszdzwonek.classList.remove('disabled');
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

function zapiszDzwonek(stan)
{
    if(stan)
        zapiszdzwonek.classList.remove('disabled');
    else
        zapiszdzwonek.classList.add('disabled');
    
    edycja = stan;

}

/*
    zm=0;
    zm |= (1<<3);// 4 bit ustaw na jeden
*/

function przerwafokus(e)
{
    zapiszDzwonek(true);
}

function usundzwonek(num)
{
    zapiszDzwonek(true);
    $(`#dzwonek${num}`).remove();
}

function dodajelem(num, wart){
    let inp = `<div class="input-group flex-nowrap" id="dzwonek${num}">
    <span class="input-group-text" id="addon-wrapping">${num}</span>
    <input  pattern="[0-9]{1,3}" onchange="tylkoliczba(this)" value="${wart}" onfocus="przerwafokus(this)" class="form-control" placeholder="Długość przerwy" 
        aria-label="Długość przerwy"
         aria-describedby="addon-wrapping">
         <span class="btn btn-outline-secondary btn-danger" onclick="usundzwonek(${num})" id="basic-addon2">
          <span class="icon icon-trash danger"></span>
         </span>
        
  </div>`;

      przerwy.innerHTML += inp;
}

function tylkoliczba(th)
{
    if(!/^[0-9]{1,3}$/.test(th.value))
        th.value = 0;
}

function budujEdycjeDzwonkow(dzwonki){
    przerwy.innerHTML = '';
    dzwonki.forEach((e,i)=>{
        dodajelem(i+1, e);
    })
}

function edycjaDniTygodnia(dni)
{
    for(let i=0; i<7; i++)
        dnitygodnia[i].checked = (dni & (1<<i)) == (1<<i);
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

        if(!edycja )
        {
            budujEdycjeDzwonkow(json.data.bell);
            edycjaDniTygodnia(json.data.bellday);
        }
    })
}

setInterval(()=>{
    readData();
},1000)