import { Salon } from "./Salon.js";
//import { Musterija } from "./Musterija.js";

//naslov i podnaslov
let l = document.createElement("h1");
l.innerHTML = "Dobrodosli na portal za prikaz salona.";
l.className = "naslov";
document.body.appendChild(l);

l = document.createElement("h3");
l.innerHTML = "Da bi videli salone i zakazali svoje termine molimo Vas da se prijavite.";
l.className = "podnaslov";
document.body.appendChild(l);

//forma za unos korisnika
let divEl = document.createElement("div");
divEl.className = "divEl";
document.body.appendChild(divEl);
let divEl1 = document.createElement("div");
divEl1.className = "divEl1";
divEl.appendChild(divEl1);
let divEl2 = document.createElement("div");
divEl2.className = "divEl2";
divEl.appendChild(divEl2);
let divEl3 = document.createElement("div");
divEl3.className = "divEl3";
divEl.appendChild(divEl3);

l = document.createElement("label");
l.innerHTML="Ime:";
divEl1.appendChild(l);
let ime = document.createElement("input");
ime.className="Ime";
divEl2.appendChild(ime);

l = document.createElement("label");
l.innerHTML="Prezime:";
divEl1.appendChild(l);
let prezime = document.createElement("input");
prezime.className="Prezime";
divEl2.appendChild(prezime);

l = document.createElement("label");
l.className="idMusterije";
l.hidden = true;
divEl1.appendChild(l);

const dugme = document.createElement("button");
dugme.innerHTML = "Prijavi se";
dugme.className = "dugme";
divEl3.appendChild(dugme);

const dugme1 = document.createElement("button");
dugme1.innerHTML = "Odjavi se";
dugme1.className = "dugme";
dugme1.hidden = true;
divEl3.appendChild(dugme1);


//Prijavi se
dugme.onclick = (ev) => {

    let ime = document.body.querySelector(".Ime").value;
    let prezime = document.body.querySelector(".Prezime").value;

    if( ime === "" || prezime === "")
    {
        alert("Unesite ime i prezime!");
        ocisti();
        return;
    }
    else
    {
        ime = ime.toLowerCase();
        prezime = prezime.toLowerCase();
        if( /^[a-z]+$/.test(ime) && /^[a-z]+$/.test(prezime) )
        {
            ime = ime[0].toUpperCase() + ime.substr(1, ime.length-1);
            prezime = prezime[0].toUpperCase() + prezime.substr(1, prezime.length-1);
            let imeEl = document.body.querySelector(".Ime");
            imeEl.value = ime;
            let prezimeEl = document.body.querySelector(".Prezime");
            prezimeEl.value = prezime;
        }
        else
        {
            alert("Postoje nedozvoljeni karakteri unutar imena ili prezimena!");
            ocisti();
            return;
        }
    }

    dugme.hidden = true;
    dugme1.hidden = false;

    fetch("https://localhost:5001/Musterija/DodajMusteriju/"+ime+"/"+prezime,
    {
        method:"POST",
    }).then(p => {
        if (p.status == 200)
        {
            alert("Uspesno ste se prijavi " + ime + " " + prezime);
            p.json().then(data=>{
                let logMust = document.body.querySelector(".idMusterije");
                logMust.value = data;
                //musterija.dodajId(data);
                });
                
            fetch("https://localhost:5001/Salon/PrikazSalona")
                .then(p=>{
                    p.json().then(saloni => {
                        saloni.forEach(salon => {
                                var oSalonu = [];
                                var oRadnicima = [];
                                for(var i in salon) //salon je json
                                {
                                    if (i === "radnici")
                                    {
                                        let niz = salon[i]; //salon[i] je niz gde je svaki element json o radniku
                                        for(var k in niz)
                                        {
                                            let radnik = [];
                                            for(var j in niz[k]) //onda se setamo unutar json-a o jednom radniku
                                            {
                                                radnik.push(niz[k][j]);
                                            }
                                            oRadnicima.push(radnik);
                                        }
                                    }
                                    else
                                    {
                                        oSalonu.push(salon[i]);
                                    }
                                }
                                let ss = new Salon(oSalonu[0], oSalonu[1], oSalonu[2], oRadnicima);
                                ss.crtaj(document.body);
                        })
                        
                    })
                })   
        }
        else
        {
            alert("Nastala je greska.");
        }
    })
}


//Odjavi se
dugme1.onclick = (ev) => {
    let logMust = document.body.querySelector(".idMusterije");
    logMust.value = null;
    ocisti();
    alert("Uspesno ste se odjavili");

    var temp = document.querySelectorAll(".GlavniKontejner");
    for(var i=0; i<temp.length; i++)
    {
        var roditelj = temp[i].parentNode;
        roditelj.removeChild(temp[i]);
    }
    dugme.hidden = false;
    dugme1.hidden = true;
}


function ocisti()
{
    let pom = document.body.querySelector(".Ime");
    pom.value = "";
    pom = document.body.querySelector(".Prezime");
    pom.value = "";
}