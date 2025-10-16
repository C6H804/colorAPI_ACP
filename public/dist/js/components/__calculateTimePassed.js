export const calculateTimePassed = (date, lang) => {
    const translation = {
        "fr": {
            "year": "an",
            "years": "ans",
            "month": "mois",
            "months": "mois",
            "week": "semaine",
            "weeks": "semaines",
            "day": "jour",
            "days": "jours",
            "hour": "heure",
            "hours": "heures",
            "minute": "minute",
            "minutes": "minutes",
            "agoStart": "Il y a ",
            "agoEnd": "",
            "now": "À l'instant"
        },
        "en": {
            "year": "year",
            "years": "years",
            "month": "month",
            "months": "months",
            "week": "week",
            "weeks": "weeks",
            "day": "day",
            "days": "days",
            "hour": "hour",
            "hours": "hours",
            "minute": "minute",
            "minutes": "minutes",
            "agoStart": "",
            "agoEnd": " ago",
            "now": "Just now"
        },
        "pt": {
            "year": "ano",
            "years": "anos",
            "month": "mês",
            "months": "meses",
            "week": "semana",
            "weeks": "semanas",
            "day": "dia",
            "days": "dias",
            "hour": "hora",
            "hours": "horas",
            "minute": "minuto",
            "minutes": "minutos",
            "agoStart": "Há ",
            "agoEnd": "",
            "now": "Agora mesmo"
        }
    };

    let minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 1) return translation[lang].now;
    if (minutes < 60) return translation[lang].agoStart + Math.round(minutes) + " " + translation[lang].minutes + translation[lang].agoEnd;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if (hours < 24) return translation[lang].agoStart + Math.round(hours) + " " + translation[lang].hours + " " + Math.round(minutes) + " " + translation[lang].minutes + " " + translation[lang].agoEnd;
    let days = Math.floor(hours / 24);
    hours = hours % 24;
    if (days < 7) return translation[lang].agoStart + Math.round(days) + " " + translation[lang].days + " " + Math.round(hours) + " " + translation[lang].hours + " " + translation[lang].agoEnd;
    let weeks = Math.floor(days / 7);
    days = days % 7;
    if (weeks < 4) return translation[lang].agoStart + Math.round(weeks) + " " + translation[lang].weeks + " " + Math.round(days) + " " + translation[lang].days + " " + translation[lang].agoEnd;
    let months = Math.floor(weeks / 4);
    weeks = weeks % 4;
    if (months < 12) return translation[lang].agoStart + Math.round(months) + " " + translation[lang].months + " " + Math.round(weeks) + " " + translation[lang].weeks + " " + translation[lang].agoEnd;
    let years = Math.floor(months / 12);
    months = months % 12;
    if (years < 2) return translation[lang].agoStart + Math.round(years) + " " + translation[lang].years + " " + Math.round(months) + " " + translation[lang].months + " " + translation[lang].agoEnd;
    return translation[lang].agoStart + Math.round(years) + " " + translation[lang].years + " " + translation[lang].agoEnd;
};