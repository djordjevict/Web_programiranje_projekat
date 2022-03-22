import { Termin } from "./Termin.js";

export class Salon {

    constructor(id, naziv, adresa, radnici){
        this.id = id;
        this.naziv=naziv;
        this.adresa=adresa;
        this.radnici = radnici;
        this.kont=null;
        this.terminiPoRadnicima = {};
        this.nizD = ["Ponedeljak", "Utorak", "Sreda", "Cetvrtak", "Petak", "Subota"];
        this.nizV = ["10:00", "12:00", "14:00", "16:00", "18:00"];
    }

    crtaj(host){
        this.kont = this.crtajDivElement(host, "GlavniKontejner");


        //o salonu
        let div1 = this.crtajDivElement(this.kont, "div1");

        let naslovNaziv = document.createElement("h2");
        naslovNaziv.innerHTML = this.naziv;
        div1.appendChild(naslovNaziv);
        let naslovAdresa = document.createElement("h3");
        naslovAdresa.innerHTML = this.adresa;
        div1.appendChild(naslovAdresa);


        //3 forme salona
        var divZaForme = this.crtajDivElement(this.kont, "divZaForme");

        var div3 = this.crtajDivElement(divZaForme, "div3");
        var div5 = document.createElement("div");
        div5.classList.add("div5");
        div5.classList.add(this.naziv+"3");
        divZaForme.appendChild(div5);
        var div4 = document.createElement("div");
        div4.classList.add("div4");
        div4.classList.add(this.naziv+"2");
        divZaForme.appendChild(div4);

        this.crtajFormuZaRezervisanje(div3);
        this.crtajFormuZaAzuriranje(div5, 1);
        this.crtajFormuZaOtkazivanje(div4, 1);


        //o radnicima i njihovim terminima
        this.crtajTermine(1);
    }


    crtajFormuZaRezervisanje(host)
    {
            //za izbor usluge
            var div = this.crtajDivElement(host, null);

            var l = document.createElement("label");
            l.innerHTML="Usluga:  ";
            div.appendChild(l);
    
            var se = document.createElement("select");
            se.className = "selectUsluga";
            div.appendChild(se);
    
            var op;
            var oUslugama = [];
            fetch("https://localhost:5001/Usluga/PrikazUsluga")
            .then(p=>{
                p.json().then(usluge => {
                    usluge.forEach(usluga => {
                        for(var i in usluga)
                        {
                            oUslugama.push(usluga[i]);
                        }
                    })

                    let duzina = oUslugama.length;
                    for(var i=0; i<duzina; i+=2)
                    {
                        op = document.createElement("option");
                        op.value=oUslugama[i];
                        op.innerHTML = oUslugama[i+1];
                        se.appendChild(op);
                    }


                    //za izbor radnika
                    div = this.crtajDivElement(host, null);
                    l = document.createElement("label");
                    l.innerHTML="Radnik:  ";
                    div.appendChild(l);

                    se = document.createElement("select");
                    se.className = "selectRadnik";
                    div.appendChild(se);
            
                    for(var i in this.radnici)
                    {
                        op = document.createElement("option");
                        op.value=this.radnici[i][0];
                        op.innerHTML = this.radnici[i][1];
                        se.appendChild(op);
                    }


                    //za izbor dana
                    div = this.crtajDivElement(host, null);
                    l = document.createElement("label");
                    l.innerHTML="Dan:  ";
                    div.appendChild(l);

                    se = document.createElement("select");
                    se.className = "selectDan";
                    div.appendChild(se);

                    for(var i=0; i<6; i++)
                    {
                        op = document.createElement("option");
                        op.value=this.nizD[i];
                        op.innerHTML = this.nizD[i];
                        se.appendChild(op);
                    }


                    //za izbor vremena
                    div = this.crtajDivElement(host, null);
                    l = document.createElement("label");
                    l.innerHTML="Vreme:  ";
                    div.appendChild(l);

                    se = document.createElement("select");
                    se.className = "selectVreme";
                    div.appendChild(se);

                    for(var i=0; i<5; i++)
                    {
                        op = document.createElement("option");
                        op.value=this.nizV[i];
                        op.innerHTML = this.nizV[i];
                        se.appendChild(op);
                    }


                    //dugme za zakazivanje termina
                    div = this.crtajDivElement(host, null);
                    let btnZakazi = document.createElement("button");
                    btnZakazi.className = "dugme1";
                    btnZakazi.innerHTML="Zakazi";
                    btnZakazi.onclick=(ev)=>this.zakaziIliAzuriraj(1, null, null);
                    div.appendChild(btnZakazi);
                })
            })
    }


    crtajFormuZaAzuriranje(host, prolazak)
    {
        if(prolazak != 1)
        {
            var temp = document.querySelector("."+this.naziv+"3");
            var roditelj = temp.parentNode;
            roditelj.removeChild(temp);

            var div5 = document.createElement("div");
            div5.classList.add("div5");
            div5.classList.add(this.naziv+"3");
            roditelj.appendChild(div5);

            host = div5;
        }


        //za izbor termina
        var div = this.crtajDivElement(host, null);

        var l = document.createElement("label");
        l.className="labelaTermin";
        l.innerHTML="Termin:  ";
        div.appendChild(l);
    
        var se = document.createElement("select");
        se.className = "selectTermin1";
        div.appendChild(se);
    
        var op;
        var oTerminu = [];
        var sviTermini = [];
        let logMust = document.body.querySelector(".idMusterije");
        fetch("https://localhost:5001/Termin/PrikazTerminaPoMusteriji/"+logMust.value)
        .then(p=>{
            p.json().then(termini => {
                termini.forEach(termin => {
                    oTerminu = [];
                    for(var i in termin)
                    {
                        oTerminu.push(termin[i]);
                    }
                    if(oTerminu[5] == this.id)
                        sviTermini.push(oTerminu);
                })

                let duzina = sviTermini.length;
                for(var i=0; i<duzina; i++)
                {
                    op = document.createElement("option");
                    op.value=sviTermini[i][0];
                    op.innerHTML = sviTermini[i][1] + " - " + sviTermini[i][2] + " - " + sviTermini[i][3] + " - " + sviTermini[i][4];
                    se.appendChild(op);
                }


                //dugme za prikaz detalja termina
                let div1 = this.crtajDivElement(host, null);
                let btnAzuriraj = document.createElement("button");
                btnAzuriraj.classList.add("dugme1");
                btnAzuriraj.classList.add("dugme2");
                btnAzuriraj.innerHTML="Azuriraj";
                btnAzuriraj.onclick=(ev)=>this.crtajDetaljeTermina(host);
                div1.appendChild(btnAzuriraj);
            })
        })
    }


    crtajFormuZaOtkazivanje(host, prolazak)
    {
        if(prolazak != 1)
        {
            var temp = document.querySelector("."+this.naziv+"2");
            var roditelj = temp.parentNode;
            roditelj.removeChild(temp);

            var div4 = document.createElement("div");
            div4.classList.add("div4");
            div4.classList.add(this.naziv+"2");
            roditelj.appendChild(div4);

            host = div4;
        }


        //za izbor termina
        var div = this.crtajDivElement(host, null);

        var l = document.createElement("label");
        l.innerHTML="Termin:  ";
        div.appendChild(l);
    
        var se = document.createElement("select");
        se.className = "selectTermin";
        div.appendChild(se);
    
        var op;
        var oTerminu = [];
        var sviTermini = [];
        let logMust = document.body.querySelector(".idMusterije");
        fetch("https://localhost:5001/Termin/PrikazTerminaPoMusteriji/"+logMust.value)
        .then(p=>{
            p.json().then(termini => {
                termini.forEach(termin => {
                    oTerminu = [];
                    for(var i in termin)
                    {
                        oTerminu.push(termin[i]);
                    }
                    if(oTerminu[5] == this.id)
                        sviTermini.push(oTerminu);
                })

                let duzina = sviTermini.length;
                for(var i=0; i<duzina; i++)
                {
                    op = document.createElement("option");
                    op.value=sviTermini[i][0];
                    op.innerHTML = sviTermini[i][1] + " - " + sviTermini[i][2] + " - " + sviTermini[i][3] + " - " + sviTermini[i][4];
                    se.appendChild(op);
                }


                //dugme za otkazivanje
                div = this.crtajDivElement(host, null);
                let btnOtkazi = document.createElement("button");
                btnOtkazi.className = "dugme1";
                btnOtkazi.innerHTML="Otkazi";
                btnOtkazi.onclick=(ev)=>this.otkazi();
                div.appendChild(btnOtkazi);
            })
        })
    }


    crtajDetaljeTermina(div)
    {
        let optionEl = this.kont.querySelector(".selectTermin1");
        if(optionEl.selectedIndex == -1)
            alert("Nemate zakazan nijedan termin i nemate sta azurirati.")
        else
        {
            let zaUklanjanje = div.querySelector(".dugme2");
            zaUklanjanje.hidden = true;
            zaUklanjanje = div.querySelector(".selectTermin1");
            zaUklanjanje.hidden = true;
            zaUklanjanje = div.querySelector(".labelaTermin");
            zaUklanjanje.hidden = true;

            var oTerminu = [];
            var terminID = optionEl.options[optionEl.selectedIndex].value;
            fetch("https://localhost:5001/Termin/PrikazTerminaPoID/"+terminID, {
                method: 'GET',
            }).then(p => {
                p.json().then(termin => {
                    let ter = termin[0];
                    for(var i in ter)
                    {
                        oTerminu.push(ter[i]);
                    }


                    //za izbor usluge
                    var l = document.createElement("label");
                    l.innerHTML="Usluga:  ";
                    div.appendChild(l);
        
                    var se = document.createElement("select");
                    se.className = "selectUsluga1";
                    div.appendChild(se);
        
                    var op;
                    var oUslugama = [];
                    fetch("https://localhost:5001/Usluga/PrikazUsluga")
                    .then(p=>{
                        p.json().then(usluge => {
                            usluge.forEach(usluga => {
                                for(var i in usluga)
                                {
                                    oUslugama.push(usluga[i]);
                                }
                            })
        
                            let duzina = oUslugama.length;
                            for(var i=0; i<duzina; i+=2)
                            {
                                op = document.createElement("option");
                                op.value=oUslugama[i];
                                if(oUslugama[i] == oTerminu[3])
                                    op.selected = true;
                                op.innerHTML = oUslugama[i+1];
                                se.appendChild(op);
                            }
                            

                            //za izbor dana
                            let div1 = this.crtajDivElement(div, null);
                            l = document.createElement("label");
                            l.innerHTML="Dan:  ";
                            div1.appendChild(l);
        
                            se = document.createElement("select");
                            se.className = "selectDan1";
                            div1.appendChild(se);
        
                            for(var i=0; i<6; i++)
                            {
                                op = document.createElement("option");
                                op.value=this.nizD[i];
                                if(this.nizD[i] == oTerminu[1])
                                    op.selected = true;
                                op.innerHTML = this.nizD[i];
                                se.appendChild(op);
                            }
        

                            //za izbor vremena
                            div1 = this.crtajDivElement(div, null);
                            l = document.createElement("label");
                            l.innerHTML="Vreme:  ";
                            div1.appendChild(l);
        
                            se = document.createElement("select");
                            se.className = "selectVreme1";
                            div1.appendChild(se);
        
                            for(var i=0; i<5; i++)
                            {
                                op = document.createElement("option");
                                op.value=this.nizV[i];
                                if(this.nizV[i] == oTerminu[2])
                                    op.selected = true;
                                op.innerHTML = this.nizV[i];
                                se.appendChild(op);
                            }
        

                            //dugme za azuriranje
                            div1 = this.crtajDivElement(div, null);
                            let btnAzuiriraj = document.createElement("button");
                            btnAzuiriraj.className = "dugme1";
                            btnAzuiriraj.innerHTML="Sacuvaj izmene";
                            btnAzuiriraj.onclick=(ev)=>this.zakaziIliAzuriraj(2, terminID, oTerminu[4]);
                            div1.appendChild(btnAzuiriraj);
                        })
                    })
            })})
        }
    }


    otkazi()
    {
        let optionEl = this.kont.querySelector(".selectTermin");
        if(optionEl.selectedIndex == -1)
            alert("Nemate zakazan nijedan termin i nemate sta otkazati.")
        else
        {
            var terminID = optionEl.options[optionEl.selectedIndex].value;
            fetch("https://localhost:5001/Termin/OtkaziTermin/"+terminID, {
                method: 'DELETE',
            }).then(p => {
                    this.crtajTermine(2);
                    this.crtajFormuZaAzuriranje(null, 2);
                    let div = this.kont.querySelector(".div4");
                    this.crtajFormuZaOtkazivanje(div, 2);
                })
        }
    }


    zakaziIliAzuriraj(broj, terminID, radnikID)
    {
        if(broj == 1)   //zvala je funkcija za zakazivanje
        {
            var usluga = ".selectUsluga";
            var radnikk = ".selectRadnik";
            var dann = ".selectDan";
            var vremee = ".selectVreme";
        }
        else    //zvala je funkcija za azuriranje
        {
            var usluga = ".selectUsluga1";
            var radnikk = ".selectRadnik1";
            var dann = ".selectDan1";
            var vremee = ".selectVreme1";
        }
        let optionEl = this.kont.querySelector(usluga);
        var uslugaID = optionEl.options[optionEl.selectedIndex].value;

        optionEl = this.kont.querySelector(dann);
        var dan = optionEl.options[optionEl.selectedIndex].value;

        optionEl = this.kont.querySelector(vremee);
        var vreme = optionEl.options[optionEl.selectedIndex].value;

        let musterijaID = document.body.querySelector(".idMusterije").value;

        if(broj == 1)   //zvala je funkcija za zakazivanje
        {
            optionEl = this.kont.querySelector(radnikk);
            var radnikID = optionEl.options[optionEl.selectedIndex].value;
            let terminZaProveru = this.terminiPoRadnicima[radnikID];
            let slobodan = this.proveraTermina(terminZaProveru, dan, vreme);
            if (slobodan == true)
            {
                fetch("https://localhost:5001/Termin/DodajTermin/"+musterijaID+"/"+uslugaID+"/"+radnikID+"/"+dan+"/"+vreme,
                {
                    method:"POST"
                }).then(p => {
                    this.crtajTermine(2);
                    this.crtajFormuZaAzuriranje(null, 2);
                    let div = this.kont.querySelector(".div4");
                    this.crtajFormuZaOtkazivanje(div, 2);
                })
            }
            else
                alert("Termin koji zelite da rezervisete je vec zauzet");
        }
        else    //zvala je funkcija za azuriranje
        {
            let terminZaProveru = this.terminiPoRadnicima[radnikID];
            let slobodan = this.proveraTermina(terminZaProveru, dan, vreme);
            if(slobodan == false)
            {
                let dan1 = this.switchFja(dan, vreme);
                let vreme1 = dan1[1];
                dan1 = dan1[0];
                let id = terminZaProveru[dan1][vreme1].vratiID();
                if(id == terminID)
                    slobodan = true;
            }
            if(slobodan == true)
            {
                fetch("https://localhost:5001/Termin/PromeniTermin/"+terminID+"/"+dan+"/"+vreme+"/"+uslugaID,
                {
                    method:"PUT"
                }).then(p => {
                    this.crtajTermine(2);
                    this.crtajFormuZaAzuriranje(null, 2);
                    let div = this.kont.querySelector(".div4");
                    this.crtajFormuZaOtkazivanje(div, 2);
                })
            }
            else
                alert("Termin koji zelite da azurirate je vec zauzet");
        }

    }


    crtajTermine(prolazak)
    {
        if(prolazak != 1)
        {
            var temp = document.querySelectorAll("."+this.naziv);
            for(var i=0; i<temp.length; i++)
            {
                var roditelj = temp[i].parentNode;
                roditelj.removeChild(temp[i]);
            }
        }

        for(var i in this.radnici)
        {
            let idRadnika = this.radnici[i][0];
            let imeRadnika = this.radnici[i][1];
            let zanimanjeRadnika = this.radnici[i][2];
            let terminiRadnika = new Array(6);
            for(var n = 0; n < 6; n++)
            {
                terminiRadnika[n] = new Array(5);
                let dan = this.nizD[n];
                for(var j = 0; j < 5; j++)
                {
                    let vreme = this.nizV[j];
                    terminiRadnika[n][j] = new Termin(dan, vreme, idRadnika, "SLOBODNO");
                }
            }

            let divZaRadnika = document.createElement("div");
            divZaRadnika.classList.add(this.naziv);
            divZaRadnika.classList.add("divZaRadnika");
            this.kont.appendChild(divZaRadnika);

            let radnik = document.createElement("h4");
            radnik.innerHTML = imeRadnika + " - " + zanimanjeRadnika;
            divZaRadnika.appendChild(radnik);

            let div2 = this.crtajDivElement(divZaRadnika, "div2");

            fetch("https://localhost:5001/Termin/PrikazTerminaPoRadniku/" + idRadnika)
                .then(p=>{
                    p.json().then(termini => {
                        if (termini != [])
                        {
                            for(var j in termini) //termini je niz json elementa gde je svaki el termin
                            {
                                for(var k in termini[j])
                                {
                                    this.ucitajTermin(terminiRadnika, termini[j]["id"], termini[j]["dan"], termini[j]["vreme"], termini[j]["musterija"], termini[j]["usluga"]);
                                } 
                            }
                        }
                        this.terminiPoRadnicima[idRadnika] = terminiRadnika;

                        var tabela = document.createElement("table");
                        tabela.className="tabela";
                        div2.appendChild(tabela);

                        var tabelahead= document.createElement("thead");
                        tabela.appendChild(tabelahead);

                        let red = document.createElement("tr");
                        var zaglavlje = ["       ", "Ponedeljak", "Utorak", "Sreda", "Cetvrtak", "Petak", "Subota"];
                        zaglavlje.forEach(el=>{
                            let kolona = document.createElement("th");
                            kolona.innerHTML = el;
                            red.appendChild(kolona);
                        })
                        tabelahead.appendChild(red);

                        var tabelaBody = document.createElement("tbody");
                        tabela.appendChild(tabelaBody);

                        for(var k = 0; k < 5; k++)
                        {
                            let red = document.createElement("tr");
                            tabelaBody.appendChild(red);
                            for(var j = 0; j < 7; j++)
                            {
                                if(j==0)
                                {
                                    let kolona = document.createElement("td");
                                    kolona.innerHTML = this.nizV[k];
                                    red.appendChild(kolona);
                                }
                                else
                                {
                                    j--;
                                    terminiRadnika[j][k].crtaj(red, null);
                                    j++;
                                }
                            }
                        }
                    })
                })
        }
    }


    proveraTermina(niz, dan, vreme)
    {
        let temp = this.switchFja(dan, vreme);
        let i = temp[0];
        let j = temp[1];
        if (niz[i][j]["zauzetost"] == "SLOBODNO")
            return true;
        else
            return false;
    }


    ucitajTermin(niz, id, dan, vreme, musterija, usluga)
    {
        let temp = this.switchFja(dan, vreme);
        let i = temp[0];
        let j = temp[1];
        niz[i][j].azuirarajInformacije(id, musterija, usluga);
    }


    switchFja(dan,vreme)
    {
        let i, j;
        switch(dan){
            case "Ponedeljak":{
                i = 0;
                break;
            }
            case "Utorak":{
                i = 1;
                break;
            }
            case "Sreda":{
                i = 2;
                break;
            }
            case "Cetvrtak":{
                i = 3;
                break;
            }
            case "Petak":{
                i = 4;
                break;
            }
            case "Subota":{
                i = 5;
                break;
            }
            default:{
            }
        }
        switch(vreme){
            case "10:00":{
                j = 0;
                break;
            }
            case "12:00":{
                j = 1;
                break;
            }
            case "14:00":{
                j = 2;
                break;
            }
            case "16:00":{
                j = 3;
                break;
            }
            case "18:00":{
                j = 4;
                break;
            }
            default:{
            }
        }
        return [i,j];
    }

    
    crtajDivElement(host, nazivKlase){
        let divElement = document.createElement("div");
        if(nazivKlase != null)
            divElement.className = nazivKlase;
        host.appendChild(divElement);
        return divElement;
    }

}