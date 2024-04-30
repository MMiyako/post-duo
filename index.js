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

    let session = await fetch(config[course].url, {
        body: JSON.stringify(config[course].body),
        headers,
        method: "POST",
    }).then((response) => response.json());

    let startTime = Math.floor(Date.now() / 1000);

    await sleep(duration);

    let endTime = Math.floor(Date.now() / 1000);

    let result = await fetch(`${config[course].url}/${session.id}`, {
        body: JSON.stringify({
            ...session,
            ...config[course].session,
            endTime: endTime,
            startTime: startTime,
        }),
        headers,
        method: "PUT",
    }).then((response) => response.json());

    console.log(result.xpGain);
})();
