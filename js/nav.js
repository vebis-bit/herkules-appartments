const navEl = document.createElement("nav");
navEl.id = "navbar";

const logoEl = document.createElement("div");
logoEl.id = "logo";

const logoImgEl = document.createElement("img");
logoImgEl.src = "img/HAlogo.png";
logoImgEl.alt = "Logo";
const a1El = document.createElement("a");
a1El.href = "index.html";
const logoTextEl = document.createElement("h1");
logoTextEl.innerText = "Herkules Appartments";

const linksEl = document.createElement("div")
linksEl.id = "links";
links = [ 
{href: "reservasjon.html", tekst: "Lei ut leilighet"},
{href: "meny.html", tekst: "Lei leilighet"},
{href: "about.html", tekst: "Kontakt oss"} ];
for (i = 0; i < links.length; i++) {
    aEl = document.createElement("a");
    aEl.href = links[i].href;
    linksEl.appendChild(aEl)
    aEl.innerText = links[i].tekst;
}

document.body.prepend(navEl);
navEl.append(a1El);
logoEl.append(logoImgEl);
logoEl.append(logoTextEl);
a1El.append(logoEl);
navEl.append(linksEl);