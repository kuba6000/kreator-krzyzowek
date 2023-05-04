function dodajpytanie(){
    let nr = parseInt(document.getElementById('nrodpowiedzi').innerHTML);
    let pytanie = document.getElementById('pytanieinput').value;
    let odpowiedz = document.getElementById('odpowiedzinput').value;
    let nowy = document.createElement('span');
    nowy.innerHTML = `${nr}. ${pytanie} -> ${odpowiedz}<br>`;
    document.getElementById('pytaniaodpowiedzi').append(nowy);
    nr++;
    document.getElementById('nrodpowiedzi').innerHTML = nr;
}

function create(){
    
}