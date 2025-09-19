const CompareHash = require("./server/utils/_CompareHash");

async function test() {
    const result = await CompareHash("Azertyuiop123@", "$ePgv/EmKmB0fQHSCZD6PXs6nc4eiRdrW");
    console.log(result);
}

console.log("$2b$12$s8bjYZSMwP7sSvTMh1nI.ePgv/EmKmB0fQHSCZD6PXs6nc4eiRdrW");

test();