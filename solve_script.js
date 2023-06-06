
let plansza = {};
let pytania_odpowiedzi = [];

function onBodyLoad(){
    el = localStorage.getItem('plansza');
    if(el !== null)
    {
        e = JSON.parse(el);
        narysujPlansze(e[0], e[1], e[2], e[3], e[4], e[5]);
    }
    else
    {
        location.href = "index.html";
    }
}

function uzupelnij(){
    Object.keys(plansza).forEach(key =>{
        key = key.split(',');
        let el = document.getElementById(`${key[0]}x${key[1]}`);
        el.value = plansza[key][3];
        el.style.backgroundColor = "green";
        el.disabled = true;
    });
}

function onkeyupevent(obj, event, dir){
    // backspace
    operation = 1;
    if(event.keyCode == 8)
    {
        operation = -1;
    }
    let id = obj.id;
    let xy = id.split('x');
    let objnew;
    if (dir == 0)
        objnew = document.getElementById(`${parseInt(xy[0])+operation}x${xy[1]}`);
    else
        objnew = document.getElementById(`${xy[0]}x${parseInt(xy[1])+operation}`);
    if(objnew !== null)
    {
        objnew.select();
    }

    let el = plansza[[parseInt(xy[0]), parseInt(xy[1])]];
    let odpowiedz = pytania_odpowiedzi[el[0]][1];
    let matched = true;
    let litery = [];
    for(let i = 0; i < odpowiedz.length; i++)
    {
        if(el[1] == 0)
        {
            let id_html = `${(parseInt(xy[0]) - el[2]) + i}x${xy[1]}`;
            if(document.getElementById(id_html).value != odpowiedz[i])
            {
                matched = false;
                break;
            }
            litery.push(id_html);
        }
        else
        {
            let id_html = `${xy[0]}x${(parseInt(xy[1]) - el[2]) + i}`;
            if(document.getElementById(id_html).value != odpowiedz[i])
            {
                matched = false;
                break;
            }
            litery.push(id_html);
        }
    }
    if(matched)
    {
        for(let i = 0; i < litery.length; i++)
        {
            let el_html = document.getElementById(litery[i]);
            el_html.disabled = true;
            el_html.style.backgroundColor = "green";
        }
    }
}

function narysujPlansze(plansza_, minx, miny, maxx, maxy, pytania_odpowiedzi_local){
    plansza = plansza_;
    pytania_odpowiedzi = pytania_odpowiedzi_local;
    let planszaHTML = "<table>";
    let pytaniaWPoziomie = [];
    let pytaniaWPionie = [];
    for(let y = miny; y <= maxy; y++)
    {
        planszaHTML += "<tr>";
        for(let x = minx; x <= maxx; x++)
        {
            if([x, y] in plansza)
            {
                planszaHTML += `<td class='box_border'><span class='mini_corner'>${plansza[[x,y]][2] == 0 ? plansza[[x,y]][0] : (plansza[[x,y]][5] == 0 ? plansza[[x,y]][4] : " ")}</span><input id='${x}x${y}' type='text' maxlength=1 onkeyup='onkeyupevent(this, event, ${plansza[[x,y]][1]});' /></td>`;
                if(plansza[[x,y]][1] == 0)
                    pytaniaWPoziomie.push(plansza[[x,y]][0]);
                else
                    pytaniaWPionie.push(plansza[[x,y]][0]);
            }
            else
            {
                planszaHTML += "<td></td>";
            }
        }
        planszaHTML += "</tr>";
    }
    planszaHTML += "</table>";
    document.getElementById('plansza').innerHTML = planszaHTML;

    // https://dev.to/clairecodes/how-to-create-an-array-of-unique-values-in-javascript-using-sets-5dg6
    pytaniaWPoziomie = Array.from(new Set(pytaniaWPoziomie));
    pytaniaWPionie = Array.from(new Set(pytaniaWPionie));

    pytania_odpowiedzi_local_html = "<b>W poziomie:</b><br>";
    for(let i = 0; i < pytaniaWPoziomie.length; i++)
    {
        pytania_odpowiedzi_local_html += `${pytaniaWPoziomie[i]}. ${pytania_odpowiedzi_local[pytaniaWPoziomie[i]][0]}<br>`;
    }
    pytania_odpowiedzi_local_html += "<b>W pione:</b><br>"
    for(let i = 0; i < pytaniaWPionie.length; i++)
    {
        pytania_odpowiedzi_local_html += `${pytaniaWPionie[i]}. ${pytania_odpowiedzi_local[pytaniaWPionie[i]][0]}<br>`;
    }
    document.getElementById('pytaniaodpowiedzilocal').innerHTML = pytania_odpowiedzi_local_html;
}