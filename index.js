import { izracunajStanje, isValid, procenti, Prihod, Rashod } from './service.js'
//selektovanja
const stanjeBudzeta = document.querySelector('#stanje');
const divPrihodovanje = document.querySelector('#prihodovanje');
const divRashodovanje = document.querySelector('#rashodovanje');
const divProcentualni = document.querySelector('#procentualni');
const forma = document.querySelector('form');
const select = document.querySelector('#select');
const inputTxt = document.querySelector('#text');
const inputVrednost = document.querySelector('#number');
const divError = document.querySelector('#error');
divError.classList.add('errorstyle');
const divStavkaPr = document.querySelector('#stavka_prihoda');
const divStavkaRa = document.querySelector('#stavka_rashoda');

//DODATAK: POZIVACE SE KOD NOVOG PRIHODA (menja pojedinacne procente)
function promenaProcenta() {
    //OVO SELEKT. MORA OVDE, NE RADI AKO JE VAN FUNKCIJE !!!
    const divoviZaIzmenu = document.querySelectorAll('.procentualni_box');
    for (let i = 0; i < divoviZaIzmenu.length; i++) {
        divoviZaIzmenu[i].removeChild(divoviZaIzmenu[i].childNodes[0]);  //mora argument za brisanje child-a
        for (let j = 0; j < Rashod.listaRIznosa.length; j++) {
            if (i == j) { //tako sam sigurna da se na pravom mestu izracunava % od iznosa koji je u tom redu
                divoviZaIzmenu[i].innerHTML = `<div>${procenti(Prihod.suma, Rashod.listaRIznosa[j].iznos)}</div>`;
                break; //ne mora da ide dalje kroz petlju
            }
        }
    }
}

//obracun na stranici koji se obavlja i u slucaju unosa prihoda i u slucaju unosa rashoda
function ispisNaStr() {
    stanjeBudzeta.innerHTML = `${izracunajStanje(Prihod.suma, Rashod.suma)}`;
    divPrihodovanje.innerHTML = `+ ${Prihod.suma}`;
    divRashodovanje.innerHTML = `- ${Rashod.suma}`;
    divProcentualni.innerHTML = procenti(Prihod.suma, Rashod.suma);
}

let brojacBtn = 0; //za id dugmica kod rashoda (zbog brisanja iz niza)
//ispis svake stavke na stranici
function ispisStavke(x, segment) {
    const ispisPr = document.createElement('div');
    ispisPr.className = 'ispis';
    const spanLinija = document.createElement('span');
    spanLinija.className = 'underscored';
    segment.append(ispisPr, spanLinija);
    //u ispisPr se nalaze sledeci divovi:
    const div1 = document.createElement('div');
    div1.innerHTML = x.opis;
    //dugme za brisanje na hover
    const div2 = document.createElement('div');
    //kreiram dugme
    const btnDel = document.createElement('button');
    div2.appendChild(btnDel);
    btnDel.className = 'dugme';
    btnDel.textContent = 'Obrisi stavku';
    if (segment == divStavkaPr) {
        //lakse mi bilo ovde da zadam boju zbog uslova za koju je stranu (nego u css jer nije jedinstveno)
        btnDel.style.backgroundColor = 'rgb(0, 128, 128)';
    }
    if (segment == divStavkaRa) {
        btnDel.style.backgroundColor = 'rgb(255, 99, 71)';
        btnDel.id = brojacBtn++; //ima ga samo kod rashoda
        console.log("kreirano je dugme " + btnDel.id);
    }
    //NOVO
    btnDel.addEventListener('click', () => {
        if (segment == divStavkaPr) {
            Prihod.suma = Prihod.suma - x.iznos;
            //sve nam je jedno sa kog mesta brise, vazno da je taj iznos (jer nemamo %)
            Prihod.listaPIznosa.splice(Prihod.listaPIznosa.indexOf(x.iznos), 1);

        } else if (segment == divStavkaRa) {
            //prolazi kroz niz objekata rashoda
            for (let i = 0; i < Rashod.listaRIznosa.length; i++) {
                if (btnDel.id == Rashod.listaRIznosa[i].id) {
                    Rashod.suma = Rashod.suma - Rashod.listaRIznosa[i].iznos;
                    Rashod.listaRIznosa.splice(i, 1);
                    console.log(Rashod.listaRIznosa);
                    console.log("obrisano je dugme " + btnDel.id);
                }
            }

        }
        ispisNaStr();
        ispisPr.remove();
        //brise pripadajucu liniju da ona ne bi ostajala i podebljavala se
        spanLinija.remove();
        //OVA FJA MORA ISPOD BRISANJA REDA ZBOG NJENE PETLJE KOJA PROLAZI KROZ SVE DIV4;
        //DA BI SE POKLOPILI I i J
        //u suprotnom ne bi za odradilo novi % za sve stavke ispod one koja se brise
        promenaProcenta();

    })
    //dugme se pojavi ako se predje preko tog reda
    ispisPr.addEventListener('mouseenter', () => {
        btnDel.style.visibility = 'visible';
    });
    //dugme se gubi kada izadjemo iz polja te stavke prihoda
    ispisPr.addEventListener('mouseleave', () => {
        btnDel.style.visibility = 'hidden';
    })


    const div3 = document.createElement('div');
    if (segment == divStavkaPr) {
        div3.innerHTML = `+ ${x.iznos}`;
        div3.style.color = 'rgb(0, 128, 128)';
    } else if (segment == divStavkaRa) {
        div3.innerHTML = `- ${x.iznos}`;
        div3.style.color = 'rgb(255, 99, 71)';
    }
    ispisPr.append(div1, div2, div3);

    //rashodi imaju i prikaz u %
    if (segment == divStavkaRa) {
        const div4 = document.createElement('div');
        div4.classList.add('procentualni_box');
        div4.innerHTML = `<div>${procenti(Prihod.suma, x.iznos)}</div>`; //mora tako jer kvadrat za % je manji od ostalih divova
        ispisPr.appendChild(div4);
    }
}

//submitovanje forme na button
forma.addEventListener('submit', (event) => {
    event.preventDefault();
    //reset polja za ispis greske pri unosu
    divError.innerHTML = '';

    if (isValid(select, inputTxt, inputVrednost) == true) {
        //ako je unet prihod
        if (select[select.selectedIndex].value == "prihod") {
            let zarada = new Prihod(inputTxt.value.trim(), parseFloat(inputVrednost.value));
            //ispis ukupnog rezultata
            ispisNaStr();
            //ispis novounete stavke u jednoj liniji
            ispisStavke(zarada, divStavkaPr);
            //DODATAK ZA IZMENU POJEDINACNIH PROCENATA
            promenaProcenta();
        }
        //ako je unet rashod
        else {
            let potrosnja = new Rashod(inputTxt.value.trim(), parseFloat(inputVrednost.value));
            //ispis ukupnog rezultata
            ispisNaStr();
            //ispis novounete stavke u jednoj liniji
            ispisStavke(potrosnja, divStavkaRa);
        }
    } else {  //ispis gresaka (sa innerom i break da bi moglo istovremeno da ispise dve ili vise gresaka)
        if (select[select.selectedIndex].value == "0") {
            divError.innerHTML += `Morate izabrati jednu od kategorija<br>`;
        }
        if (inputTxt.value == '') {
            divError.innerHTML += `Morate uneti opis<br>`;
        }
        //ovde je jedino sa else if jer jedna mogucnost iskljucuje drugu
        if (inputVrednost.value == '') {
            divError.innerHTML += `Morate uneti iznos<br>`;
        } else if (parseFloat(inputVrednost.value) <= 0) {
            divError.innerHTML += `Iznos mora biti pozitivna vrednost<br>`;
        }
    }
    //resetovanje polja
    select.selectedIndex = 0
    inputTxt.value = '';
    inputVrednost.value = '';
});
