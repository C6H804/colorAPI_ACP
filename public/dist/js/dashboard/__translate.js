export const translate = (lang = "en") => {
    const dictionary = {
        fr: {
            title: "COULEURS EN STOCK",
            decconexion: "Se déconnecter",
            filterLabel: "Filtrer par :",
            available: "Disponibles",
            matte: "Mat",
            shiny: "Brillant",
            sanded: "Sablé",
            all: "Tous",
            lastUpdate: "Dernière mise à jour :",
            searchInColors: "Recherchez un code RAL ou une couleur",
            color: "Couleurs",
            ral: "#RAL",
            name: "Nom de la couleur",
            shortMatte: "M",
            shortShiny: "B",
            shortSanded: "S",
        }, 
        en: {
            title: "COLORS IN STOCK",
            decconexion: "Log out",
            filterLabel: "Filter by:",
            available: "Available",
            matte: "Matte",
            shiny: "Shiny",
            sanded: "Sanded",
            all: "All",
            lastUpdate: "Last update:",
            searchInColors: "Search for a RAL code or a color",
            color: "Colors",
            ral: "RAL#",
            name: "Color name",
            shortMatte: "M",
            shortShiny: "Sh",
            shortSanded: "Sa"
        },
        pt: {
            title: "CORES EM ESTOQUE",
            decconexion: "desconexão",
            filterLabel: "Filtrar por:",
            available: "Disponíveis",
            matte: "Fosca",
            shiny: "Brilhante",
            sanded: "Sable",
            all: "Todos",
            lastUpdate: "Última atualização:",
            searchInColors: "Procure um código RAL ou uma cor",
            color: "Cores",
            ral: "RAL#",
            name: "Nome da cor",
            shortMatte: "F",
            shortShiny: "B",
            shortSanded: "S"
        }
    }

    document.querySelectorAll("h1")[0].innerText = dictionary[lang].title;
    document.getElementById("logoutText").innerText = dictionary[lang].decconexion;
    document.querySelectorAll("h3")[0].innerText = dictionary[lang].lastUpdate;
    
    document.querySelector("label[for='filterSelect']").innerText = dictionary[lang].filterLabel;
    document.getElementById("searchInput").setAttribute("placeholder", dictionary[lang].searchInColors);
    const filterSelect = document.getElementById("filterSelect");
    filterSelect.options[0].text = dictionary[lang].available;
    filterSelect.options[1].text = dictionary[lang].matte;
    filterSelect.options[2].text = dictionary[lang].shiny;
    filterSelect.options[3].text = dictionary[lang].sanded;
    filterSelect.options[4].text = dictionary[lang].all;


    const headCell = document.querySelectorAll(".headCell");
    headCell[0].innerText = dictionary[lang].color;
    headCell[2].innerText = dictionary[lang].ral;
    headCell[3].innerText = dictionary[lang].name;
    headCell[4].innerText = dictionary[lang].matte;
    headCell[5].innerText = dictionary[lang].shortMatte;
    headCell[6].innerText = dictionary[lang].shiny;
    headCell[7].innerText = dictionary[lang].shortShiny;
    headCell[8].innerText = dictionary[lang].sanded;
    headCell[9].innerText = dictionary[lang].shortSanded;


}