export const searchInColors = (colors, search) => {
    return colors.filter(e => {
        if (e.type === "OTHER") {
            return e.name_fr.toLowerCase().includes(search.toLowerCase().trim()) ||
                e.name_en.toLowerCase().includes(search.toLowerCase().trim()) ||
                e.name_pt.toLowerCase().includes(search.toLowerCase().trim()) ||
                e.value.toLowerCase().startsWith(search.toLowerCase().trim());
        } else {
            return e.name_fr.toLowerCase().includes(search.toLowerCase().trim()) ||
                e.name_en.toLowerCase().includes(search.toLowerCase().trim()) ||
                e.name_pt.toLowerCase().includes(search.toLowerCase().trim()) ||
                e.value.toLowerCase().slice(3).startsWith(search.toLowerCase().trim());
        }
    });
};