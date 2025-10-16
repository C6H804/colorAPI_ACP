import { fetchColors } from "./__fetchColors.js";
import { searchInColors } from "./__searchInColors.js";
import { loadColorsTable } from "./__loadColorsTable.js";
import { renderLastUpdate } from "./__renderLastUpdate.js";


export const updateColorTable = async (filter, lang, search = "", permissions = false, fetch = true) => {
    const colors = await fetchColors(filter);
    const filteredColors = searchInColors(colors.colors, search);
    loadColorsTable(filteredColors, lang, permissions);
    renderLastUpdate(lang);
};