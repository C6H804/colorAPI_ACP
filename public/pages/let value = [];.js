let hex = "";
let values = [];
let colorRal = "";
let names = [];
let rowId = 999999999999;

function rgbToHex(rgb) {
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
    return result ? "#" + ((1 << 24) + (parseInt(result[1]) << 16) + (parseInt(result[2]) << 8) + parseInt(result[3])).toString(16).slice(1).toUpperCase() : null;
}


document.querySelectorAll("td").forEach((e, i) => {
    if (e.innerText.trim().startsWith("RAL ")) {
        colorRal = e.innerText.trim().replace(" ", "");
        hex = e.style.backgroundColor;
        rowId = i;
        names = [];
    }

    if (i === rowId + 2) {
        names.push(e.innerText.trim());
    }
    if (i === rowId + 3) {
        names.push(e.innerText.trim());
    }
    if (i === rowId + 4) {
        names.push(e.innerText.trim());
    }

    if (i % 9 === 5 && e.innerText.trim() !== "") {
        names.push(e.innerText.trim());
        values.push(
            {
                color: rgbToHex(hex),
                ral: colorRal,
                name_fr: names[0],
                name_en: names[1],
                name_pt: names[2]
            });
        hex = "";
        colorRal = "";
        names = [];
    }
});
console.log(values);

