import axios from "axios";

import { readFile, sleep } from "./utils.js";

(async () => {
    let config = await readFile("data/config.json");

    let params = process.argv.slice(2);
    let course = params[0];
    let duration = params[1];

    let headers = {
        Authorization: `Bearer ${config.JWT}`,
        "Content-Type": "application/json",
        "user-agent": config.userAgent,
    };

    // Switch from Node Fetch API to Axios to prevent unnecessary HTTP requests to GitHub and avoid errors under restricted network conditions.

    // Destructuring "data" from axios response then rename it to "session"
    let { data: session } = await axios.post(config[course].url, config[course].body, { headers });

    let startTime = Math.floor(Date.now() / 1000);

    await sleep(duration);

    let endTime = Math.floor(Date.now() / 1000);

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

    console.log(result.xpGain);
})();
