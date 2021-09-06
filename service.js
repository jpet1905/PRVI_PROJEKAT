//ukupan budzet - rezultat na vrhu stranice
function izracunajStanje(prihod, rashod) {
    //.toFixed(2) ispisuje dve dec ali posto vraca string, mora da se ponovo transformise u dec.broj sa parseFloat
    let rez = parseFloat((prihod - rashod).toFixed(2));
    if (prihod > rashod) //da mi za pozitivan rez ispise i "+" ispred
        return `+ ${rez}`;
    else
        return rez //za neg.vrednostr samo ce ispisati minus
}

//funkcija za validaciju
const isValid = (x, y, z) => {
    return x[x.selectedIndex].value != "0" && y.value != '' && parseFloat(z.value) > 0
}

//izracunavanje procenta
function procenti(prihod, rashod) {
    // return Math.round((Math.abs(rashod) * 100) / prihod) + "%";
     return parseFloat(((Math.abs(rashod) * 100) / prihod).toFixed(2)) + "%";
}

class Prihod {
    opis
    iznos
    static suma = 0
    static listaPIznosa = []
    constructor(unesenOpis, unesenIznos) {
        this.opis = unesenOpis;
        this.iznos = parseFloat(unesenIznos.toFixed(2));
        Prihod.suma += unesenIznos;
        Prihod.suma = parseFloat(Prihod.suma.toFixed(2));
         //DODATNO - niz vrednost
         Prihod.listaPIznosa.push(this.iznos);
         console.log(Prihod.listaPIznosa);
    }
}
let count = 0
class Rashod {
    id
    opis
    iznos
    static suma = 0
    static listaRIznosa = []
    constructor(unesenOpis, unesenIznos) {
        this.id = count++;
        this.opis = unesenOpis;
        this.iznos = parseFloat(unesenIznos.toFixed(2));
        Rashod.suma += unesenIznos;
        Rashod.suma = parseFloat(Rashod.suma.toFixed(2));
        //DODATNO - niz objekata, da tacno znamo koji iz niza brise na osnovu id
        Rashod.listaRIznosa.push({id: this.id, iznos: this.iznos});
        console.log(Rashod.listaRIznosa);
    }
}

export { izracunajStanje, isValid, procenti, Prihod, Rashod }