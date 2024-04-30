const readFile = async (file) => {
    let fileData = await fsp.readFile(file, "utf8");
    let jsonData = JSON.parse(fileData);

    return jsonData;
};

const writeFile = async (file, data) => {
    await fsp.writeFile(file, JSON.stringify(data, null, 4));
};

const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export { readFile, writeFile, randomBetween, sleep };
