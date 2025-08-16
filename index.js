import axios from "axios";
import chalk from "chalk";

import { readFile, sleep } from "./utils.js";
import logger from "./logger.js";

(async () => {
    let config = await readFile("data/config.json");

    let params = process.argv.slice(2);
    let course = params[0];
    let duration = params[1] ? +params[1] : 60;

    let headers = {
        Authorization: `Bearer ${config.JWT}`,
        "Content-Type": "application/json",
        "user-agent": config.userAgent,
    };

    // Switch from Node Fetch API to Axios to prevent unnecessary HTTP requests to GitHub and avoid errors under restricted network conditions.

    // Double destructuring
    let {
        data: { learningLanguage },
    } = await axios.get(config.learningLanguage, { headers });

    if (learningLanguage != course) {
        console.log(chalk.hex("#fb4646")(`Wrong course! (${learningLanguage})`));
        return;
    }

    let session;

    try {
        // Destructuring "data" from axios response
        ({ data: session } = await axios.post(config[course].url, config[course].body, { headers }));
    } catch (error) {
        console.log(chalk.hex("#ec3636")("ERROR! (GET)"));
        process.exit();
    }

    let startTime = Math.floor(Date.now() / 1000);

    console.log(chalk.hex("#fb4646")(`Duration: ${duration}s`));

    countdown(duration);

    await sleep(duration);

    let endTime = Math.floor(Date.now() / 1000);

    try {
        let { data: result } = await axios.put(
            `${config[course].url}/${session.id}`,
            {
                ...session,
                ...config[course].session,
                endTime,
                startTime,
            },
            { headers }
        );

        if (result) {
            await logger(course, duration, result.xpGain);
            console.log(chalk.hex("#16da51")(`EXP: ${result.xpGain}`));
        }
    } catch (error) {
        console.log(chalk.hex("#ec3636")("ERROR! (POST)"));
    }
})();

const countdown = (seconds) => {
    let interval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(interval);
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
        } else {
            process.stdout.write(
                chalk.hex("#f8ca82")("\rCountdown: " + seconds.toString().padStart(3, " ") + " seconds remaining...")
            );
        }
    }, 1000);
};
