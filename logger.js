import dayjs from "dayjs";

import { readFile, writeFile } from "./utils.js";

export default async (course, duration, totalEXP) => {
    let today = dayjs().format("YYYY-MM-DD");
    let log = await readFile("data/log.json");

    // Optional chaining
    if (log[0]?.[today]) {
        let index = log[0][today].findIndex((entry) => entry?.[course]);

        if (index >= 0) {
            log[0][today][index][course].count++;
            log[0][today][index][course].duration += duration;
            log[0][today][index][course].totalEXP += totalEXP;
        } else {
            log[0][today].unshift({
                [course]: {
                    count: 1,
                    duration,
                    totalEXP,
                },
            });
        }
    } else {
        log.unshift({
            [today]: [
                {
                    [course]: {
                        count: 1,
                        duration,
                        totalEXP,
                    },
                },
            ],
        });
    }

    await writeFile("data/log.json", log);
};
