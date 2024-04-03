require('dotenv').config();
const { buildAuthorization } = require("@retroachievements/api");

const userName = "Awkz19";
const webApiKey = process.env.APIKEY;

const authorization = buildAuthorization({ userName, webApiKey });

const { getGame, getUserProfile } = require("@retroachievements/api");

async function main() {
    const userProfile = await getUserProfile(authorization, {
        userName: "Awkz19",
      });
    console.log(userProfile)
}

main();
