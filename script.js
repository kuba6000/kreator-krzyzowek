let pytania_odpowiedzi = [];

function dodajpytanie(){
    let nr = parseInt(document.getElementById('nrodpowiedzi').innerHTML);
    let pytanie = document.getElementById('pytanieinput').value;
    let odpowiedz = document.getElementById('odpowiedzinput').value;
    pytania_odpowiedzi.push([pytanie, odpowiedz]);
    let nowy = document.createElement('span');
    nowy.innerHTML = `${nr}. ${pytanie} -> ${odpowiedz} <button onclick='usunpytanie(this);'>x</button><br>`;
    document.getElementById('pytaniaodpowiedzi').append(nowy);
    nr++;
    document.getElementById('nrodpowiedzi').innerHTML = nr;

    localStorage.setItem('pytaniaodpowiedzi', JSON.stringify(pytania_odpowiedzi));
}

function generujPytaniaNaStronie(){
    let d = document.getElementById('pytaniaodpowiedzi');
    d.innerHTML = "";
    let nr = 1;
    for(let i = 0; i < pytania_odpowiedzi.length; i++)
    {
        let nowy = document.createElement('span');
        nowy.innerHTML = `${nr}. ${pytania_odpowiedzi[i][0]} -> ${pytania_odpowiedzi[i][1]} <button onclick='usunpytanie(this);'>x</button><br>`;
        d.append(nowy);
        nr++;
    }
    document.getElementById('nrodpowiedzi').innerHTML = nr;
}

function usunpytanie(obj){
    let nr = parseInt(obj.parentElement.innerHTML.split('.')[0]);
    pytania_odpowiedzi.splice(nr - 1, 1);
    generujPytaniaNaStronie();

    localStorage.setItem('pytaniaodpowiedzi', JSON.stringify(pytania_odpowiedzi));
}

function onBodyLoad(){
    el = localStorage.getItem('pytaniaodpowiedzi');
    if(el !== null)
    {
        pytania_odpowiedzi = JSON.parse(el);
        generujPytaniaNaStronie();
    }

    // https://www.sitepoint.com/get-url-parameters-with-javascript/
    const urlParams = new URLSearchParams(window.location.search);
    const pytaniadozaladowania = urlParams.get('pytania');
    if(pytaniadozaladowania != null && (pytania_odpowiedzi.length == 0 || confirm("Masz już zapisane jakies pytania, czy napewno chcesz załadować pytania z linku?")))
    {
        localStorage.setItem('pytaniaodpowiedzi', decodeURIComponent(pytaniadozaladowania));
    }
    if(pytaniadozaladowania != null)
    {
        location.href = "?";
    }
}

function sharequestions(){
    let i = JSON.stringify(pytania_odpowiedzi);
    document.getElementById('linkudostepnienia').href = `?pytania=${encodeURIComponent(i)}`;
    document.getElementById('linkudostepnienia').innerHTML = "LINK DO SKOPIOWANIA";
}

function create(){
    if(pytania_odpowiedzi.length == 0)
    {
        alert("Brak dodanych pytań");
        return;
    }

    // https://stackoverflow.com/questions/943113/algorithm-to-generate-a-crossword/1021800#1021800
    pytania_odpowiedzi = pytania_odpowiedzi.sort((a,b)=>{
        if(a[1].length < b[1].length)
            return 1;
        if(a[1].length > b[1].length)
            return -1;
        return 0;
    });
    let tried = 0;
    let minx = 0;
    let miny = 0;
    let maxx = 0;
    let maxy = 0;
    let plansza = {};
    let usedLettersFinder = {};
    let doAgain = true;
    while(doAgain){
        doAgain = false;
        plansza = {};
        usedLettersFinder = {};
        minx = 0;
        miny = 0;
        maxx = 0;
        maxy = 0;
        for(let i = 0; i < pytania_odpowiedzi.length; i++)
        {
            let odpowiedz = pytania_odpowiedzi[i][1];
            if(i == 0){
                maxx = odpowiedz.length - 1;
                for(let j = 0; j < odpowiedz.length; j++){
                    // ID_PYTANIA, ORIENTACJA, ID_LITERY, LITERA, ID_PYTANIA_PRZECHODZACEGO, ID_LITRY_PYTANIA_PRZECHODZACEGO
                    plansza[[j, 0]] = [i, 0, j, odpowiedz[j], undefined, undefined];
                    if(odpowiedz[j] in usedLettersFinder){
                        usedLettersFinder[odpowiedz[j]].push([j, 0]);
                    }
                    else{
                        usedLettersFinder[odpowiedz[j]] = [[j, 0]];
                    }
                }
            }
            else
            {
                let usable_crosses = [];
                for(let j = 0; j < odpowiedz.length; j++)
                {
                    if(odpowiedz[j] in usedLettersFinder)
                    {
                        let possible_crosses = usedLettersFinder[odpowiedz[j]];
                        for(let crossID = 0; crossID < possible_crosses.length; crossID++)
                        {
                            let cross = possible_crosses[crossID];
                            if(plansza[cross][4] === undefined)
                            {
                                let found_intersection = false;
                                for (let offset = -j; offset < odpowiedz.length - j; offset++)
                                {
                                    if (offset == 0) continue;
                                    if (plansza[cross][1] == 0)
                                    {
                                        if([cross[0], cross[1] + offset] in plansza && plansza[[cross[0], cross[1] + offset]][3] !== odpowiedz[j + offset]) 
                                        {
                                            found_intersection = true;
                                            break;
                                        }
                                    }
                                    else
                                    {
                                        if([cross[0] + offset, cross[1]] in plansza && plansza[[cross[0] + offset, cross[1]]][3] !== odpowiedz[j + offset]) 
                                        {
                                            found_intersection = true;
                                            break;
                                        }
                                    }
                                }
                                if(found_intersection)
                                    break;
                                usable_crosses.push([j, cross]);
                            }
                        }
                    }
                }

                if(usable_crosses.length == 0)
                {
                    tried++;
                    doAgain = true;
                    break;
                }

                // select random
                let cross = usable_crosses[Math.floor(Math.random()*usable_crosses.length)];
                let j = cross[0];
                cross = cross[1];
                
                for (let offset = -j; offset < odpowiedz.length - j; offset++)
                {
                    if (plansza[cross][1] == 0)
                    {
                        let coords = [cross[0], cross[1] + offset];
                        if (coords in plansza)
                        {
                            plansza[coords][4] = i;
                            plansza[coords][5] = j + offset;
                        }
                        else{
                            plansza[coords] = [i, 1, j + offset, odpowiedz[j + offset], undefined, undefined];
                            if (odpowiedz[j + offset] in usedLettersFinder)
                            {
                                usedLettersFinder[odpowiedz[j + offset]].push(coords);
                            }
                            else
                            {
                                usedLettersFinder[odpowiedz[j + offset]] = [coords];
                            }
                            if (miny > coords[1]) miny = coords[1];
                            if (maxy < coords[1]) maxy = coords[1];
                        }
                    }
                    else
                    {
                        let coords = [cross[0] + offset, cross[1]];
                        if (coords in plansza)
                        {
                            plansza[coords][4] = i;
                            plansza[coords][5] = j + offset;
                        }
                        else{
                            plansza[coords] = [i, 0, j + offset, odpowiedz[j + offset], undefined, undefined];
                            if (odpowiedz[j + offset] in usedLettersFinder)
                            {
                                usedLettersFinder[odpowiedz[j + offset]].push(coords);
                            }
                            else
                            {
                                usedLettersFinder[odpowiedz[j + offset]] = [coords];
                            }
                            if (minx > coords[0]) minx = coords[0];
                            if (maxx < coords[0]) maxx = coords[0];
                        }
                    }
                }
            }
            if(doAgain) break;
        }
        if(tried == 100)
        {
            break;
        }
    }
    console.log(plansza);
    localStorage.setItem("plansza", JSON.stringify([plansza, minx, miny, maxx, maxy, pytania_odpowiedzi]));
    location.href = 'solve.html';
}
