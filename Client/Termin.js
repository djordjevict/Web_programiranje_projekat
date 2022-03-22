export class Termin {

    constructor(dan, vreme, radnik, zauzetost){
        this.id;
        this.dan=dan;
        this.vreme=vreme;
        this.zauzetost = zauzetost;
        this.radnikID = radnik;
        this.kont = null;
        this.musterijaID = null;
        this.usluga = null;
    }

    crtaj(host)
    {
        this.kont = document.createElement("td");
        if(this.zauzetost == "SLOBODNO")
        {
            this.kont.style.backgroundColor = "yellow";
            this.kont.innerHTML = this.zauzetost;
        }
        else
        {
            this.kont.style.backgroundColor = "red";
            this.kont.innerHTML = this.zauzetost + "<br/>" + this.usluga;
        }
        host.appendChild(this.kont);
    }

    azuirarajInformacije(id, musterija, usluga)
    {
        this.id = id;
        this.zauzetost = "ZAUZETO";
        this.musterijaID = musterija;
        this.usluga = usluga;
    }

    vratiID()
    {
        return this.id;
    }

}