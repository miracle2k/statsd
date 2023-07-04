const fs = require("fs");
const { createClient } = require('redis');

class GlobalState {
    constructor() {
        this.retention = 0;
        this.stats = {};
    }

    async connectToRedis(
        redisHost,
        redisPort,
        authPassword,
    ) {
        this.client = createClient({
            url: `redis://${redisHost}:${redisPort}`,
            password: authPassword,
        });
        await this.client.connect();
    }
}

module.exports.globalState = new GlobalState();