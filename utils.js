import fs from "fs";

const fsp = fs.promises;

const readFile = async (file) => {
    let fileData = await fsp.readFile(file, "utf8");
    let jsonData = JSON.parse(fileData);

    return jsonData;
};

const writeFile = async (file, data) => {
    await fsp.writeFile(file, JSON.stringify(data, null, 4));
};

const randomBetween = (min, max) => {
    if (isNaN(min) || isNaN(max)) {
        throw new Error("Parameter is not a number!");
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const sleep = (seconds) => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export { readFile, writeFile, randomBetween, sleep };
