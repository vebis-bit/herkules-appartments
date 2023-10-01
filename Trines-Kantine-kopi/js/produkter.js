// lager en konstant for handlekurven, med en nøkkel som skal brukes for å få tilgang og en tom array
// hentet inspirasjon om localstorage og funksjoner om dette fra https://gist.github.com/prof3ssorSt3v3/3e15d06a8128d6ca7deaa831a7a1e52b
const handlekurv = {
    KEY: "egirejgrdkske",
    innhold: []
} 

function init(){ 
    // funksjon som kjøres da siden har lastet inn. sjekker om det er noe i localstorage og setter det i konstanten handlekurv
    let _innhold = localStorage.getItem(handlekurv.KEY)
    if (_innhold) {
        handlekurv.innhold = JSON.parse(_innhold) 
    }
    sync() 
}
function sync(){ // oppdaterer localstorage med hva som er i handlekurven
    let _handlekurv = JSON.stringify(handlekurv.innhold)
    localStorage.setItem(handlekurv.KEY, _handlekurv) 
}
function find(id){ // finner en vare basert på id og returnerer den
    let match = handlekurv.innhold.filter(item=>{
        if (item.id == id) {
            return true
        };
    });
    if (match && match[0]) {
        return match[0]
    }
}
function add(id){ // legger ting til i handlekurven
    if (find(id)) {
        increase(id, 1); // er den allerede i handlekurven økes den kun med 1
    }else{ // ellers lages produktet og blir sendt inn i handlekurven
        let arr = produkter.filter(produkt=>{
            if (produkt.id == id) { // finner det aktuelle produktet i produkter-konstanten
                return true;
            }
        });
        if (arr && arr[0]) { // lager objektet og henter relevant informasjon fra produkter-konstanten
            let obj = {
                id: arr[0].id,
                navn: arr[0].navn,
                antall: 1,
                pris: arr[0].pris
            };
            handlekurv.innhold.push(obj); // sender det nylagde produktet inn i handlekurven 
            sync();
            vis_sum()
        }
    }
}
function increase(id, antall=1){ // funksjon for å øke antall i handlekurv. defaulter til å øke med 1
    handlekurv.innhold = handlekurv.innhold.map(item=>{
        if (item.id === id) {
            item.antall = parseInt(item.antall) + antall; 
        }return item;
    });
    sync();
    visHandlekurv()
    vis_sum()
    vis_pris(id)
}
function change_by_list(event){ // trengtes egen funksjon for å øke og minke med input-listen, som trigges med eventlistener
    handlekurv.innhold = handlekurv.innhold.map(item=>{
        if (item.id === event.target.classList[1]) {
            item.antall = event.target.value; // setter antallet til antallet i input-feltet
        }return item;
    });
    handlekurv.innhold.forEach(item=>{ // fjerner produktet om antallet blir 0 eller færre, og oppdaterer prisen
        if (item.id === event.target.classList[1] && item.antall <= 0) {
            remove(event.target.classList[1])
        }if (item.id === event.target.classList[1] && item.antall > 0) {
            vis_pris(event.target.classList[1])
        }
    });
    sync();
    vis_sum();
}
function remove(id){ // fjerner produktet
    handlekurv.innhold = handlekurv.innhold.filter(item=>{
        if (item.id !== id) {
            return true
        };
    });
    sync();
    visHandlekurv()
    vis_sum()
}
function remove_by_btn(event){ // egen funksjon for å fjerne produktet med FJERN-knappen
    handlekurv.innhold = handlekurv.innhold.filter(item=>{
        if (item.id !== event.target.classList[1]) {
            return true
        };
    });
    sync();
    visHandlekurv();
    vis_sum()
}
function vis_sum(){ // funksjon for å oppdatere summen av varene
    let sum_tekst = document.getElementById("sum")
    sum = 0
    handlekurv.innhold.forEach(item=>{
        sum = sum + (item.pris * parseInt(item.antall))
    })
    sum_tekst.innerText = sum + "kr"
}
function vis_pris(id){ // funksjon for å vise prisen til produktene. pris * antall
    let pris_id = id + "_pris"
    let pris_tekst = document.getElementById(pris_id)
    let pris = 0
    handlekurv.innhold.forEach(item=>{
        if (item.id == id) {
            pris = item.pris * parseInt(item.antall)
        }
    })
    pris_tekst.innerText = pris + "kr"
}
function visHandlekurv() { // funksjon for å vise den oppdaterte handlekurven fra localstorage
    let handlekurv_seksjon = document.getElementById("handlekurv_Content")
    handlekurv_seksjon.innerText = ""
    let s = handlekurv.innhold
    s.forEach(produkt=>{
        let vare = document.createElement("div")
        vare.className = "vare_div"
        handlekurv_seksjon.appendChild(vare)

        let navn = document.createElement("h3")
        navn.innerText = produkt.navn
        navn.classList.add("navn")
        vare.appendChild(navn)

        let antall = document.createElement("input")
        antall.type = "number"
        antall.value = produkt.antall
        antall.classList.add("antall-liste")
        antall.classList.add(produkt.id)
        vare.appendChild(antall)

        let pris = document.createElement("h3")
        pris.innerText = (produkt.pris * produkt.antall) + " kr"
        pris.className = "pris_tekst"
        pris.id = produkt.id + "_pris"
        vare.appendChild(pris)


        let fjern = document.createElement("button")
        fjern.classList.add("knp-slett")
        fjern.classList.add(produkt.id)
        fjern.innerText = "Fjern"
        vare.appendChild(fjern)
    })
    var elements1 = document.getElementsByClassName("antall-liste") // input-listen og FJERN-knappen
    var elements2 = document.getElementsByClassName("knp-slett")
    if (handlekurv.innhold !== "") {
        for (let i = 0; i < elements1.length; i++) { // eventlistener for input-listen, og FJERN-knappen
            elements1[i].addEventListener("change", change_by_list)
        }for (let j = 0; j < elements2.length; j++) {
            elements2[j].addEventListener("click", remove_by_btn)
        }
    }
}

// produktene, lagret som objekter i en array
const produkter = [{navn: "Leilighet1", id: "leilghet1", pris: 129, src: "img/slideshow_1.jpg"}, 
{navn: "Leilighet2", id: "leilighet2", pris: 99, src: "img/slideshow_2.jpg"},
{navn: "Leilighet3", id: "leilighet3", pris: 109, src: "img/slideshow_3.jpg"}]

const filler = ["Helt nybygd leilighet, alt nytt! Leiligheten har store glass-skyvedører ut til egen uteplass og egen hage i et stille område med kort vei til Oslo sentrum. Leiligheten har to soverom med dobbeltsenger og stue med en stor L-sofa som også kan brukes som to soveplasser, eget kjøkken og bad. Det er kun et par hundre meters gangavstand fra Blommenholm togstasjon og tog tar ca. 12 minutter til Oslo sentrum. Det er gangavstand til Oslofjorden og det følger to sykler for gratis utlån med leiligheten.",
                "Helt nybygd leilighet, alt nytt! Leiligheten har store glass-skyvedører ut til egen uteplass og hage. Leiligheten har dobbeltseng, møblert uteplass og er moderne innredet. Leiligheten har eget bad med led og marmor, varmekabler i gulv, m.m. Sengen er behagelig og er 220 cm. lang og passer til en eller to personer. Kjøkkenet er også helt nytt, normal utrustning, stekeovn/mikrobølgeovn, kjøleskap, fryser og oppvaskmaskin. Det er et par hundre meters gangavstand til tog og 12 min til Oslo.",
                "Koselig nyoppusset leilighet med nytt kjøkken og nytt bad og egen hage med egen uteplass som tilhører leiligheten. Leiligheten har en dobbeltseng i sovealkove i tillegg til en sovesofa som også blir en dobbeltseng og det er gulvvarme i hele leiligheten. Det er kun et par hundre meters gangavstand fra Blommenholm togstasjon og toget tar ca. 12 minutter til Oslo sentrum. Det er også gangavstand til fine turstier langs Oslofjorden og det følger to sykler for gratis utlån med leiligheten."
            ]

function main(){ // funksjon som lager alle produktene og viser dem på venstre side av skjermen
    var prod_Side = document.getElementById("products")
    for (let i = 0; i < produkter.length; i++) {
        let div = document.createElement("div")
        div.className = "produkt_Boks"
        div.id = produkter[i].navn
        prod_Side.appendChild(div)

        let mat_bilder = document.createElement("img")
        mat_bilder.src = produkter[i].src
        div.appendChild(mat_bilder)

        let head_Navn = document.createElement("h1")
        head_Navn.innerText = produkter[i].navn
        div.appendChild(head_Navn)

        let btn = document.createElement("button")
        btn.innerText = "Lei Leilighet"
        btn.id = produkter[i].id
        btn.addEventListener("click", go_to_site)
        div.appendChild(btn)

        let produkt_informasjon = document.createElement("p")
        produkt_informasjon.className = "produkt_info"
        produkt_informasjon.innerText = filler[i]
        div.appendChild(produkt_informasjon)

    }
}
function go_to_site(event){ 
    // funksjon for å gå til en annen side
    if (event.target.id == "leilghet1"){
        window.open("https://www.airbnb.no/rooms/899194240620581421?preview_for_ml=true&source_impression_id=p3_1694797213_UTn3CF6XfbQDaHf7")
    }
    else if (event.target.id == "leilighet2"){
        window.open("https://www.airbnb.no/rooms/941935239376085403?preview_for_ml=true&source_impression_id=p3_1694797293_ap5jHXioyQDnTqoD")
    }
    else if (event.target.id == "leilighet3"){
        window.open("https://www.airbnb.no/rooms/591888942047962720?preview_for_ml=true&source_impression_id=p3_1694797357_UVi060RxDqB3117n")
    }

}

function legg_Til(ev) { // funksjon for Legg Til-knappene. legger til produktene
    ev.preventDefault();
    add(ev.target.id)
    visHandlekurv()
}
main()  // kjører funksjonen for å vise produktene
window.addEventListener("DOMContentLoaded", ()=>{ // kjøres når siden har lastet ned. oppdaterer handlekurven og viser den
    init()
    vis_sum()
    visHandlekurv()
})
