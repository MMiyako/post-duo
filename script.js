import { spawnSync } from "child_process";
import chalk from "chalk";

import { randomBetween, sleep } from "./utils.js";

// node script.js <language> <times> [min_duration] [max_duration]
// Example: node script.js fi 5
// Example: node script.js fi 10 50 70

let params = process.argv.slice(2);
let min = params[2] ? +params[2] : 60;
let max = params[3] ? +params[3] : 100;

console.time("Run time");

for (let index = 1; index <= params[1]; index++) {
    let duration = randomBetween(min, max);

    console.log(chalk.hex("#33c9ff")(`Total: ${params[1]}`));
    console.log(chalk.hex("#9ea3ff")(`Current: ${index}`));

    spawnSync("node", [`index.js`, params[0], duration], { stdio: "inherit" });

    await sleep(2);

    console.log(`----------------------------------------`);
}

console.timeEnd("Run time");
console.log(`----------------------------------------`);
