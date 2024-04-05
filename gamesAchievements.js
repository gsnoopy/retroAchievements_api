require('dotenv').config();
const fs = require('fs').promises
const { buildAuthorization } = require("@retroachievements/api");

const userName = "Awkz19";
const webApiKey = process.env.APIKEY;

const authorization = buildAuthorization({ userName, webApiKey });

const { getConsoleIds, getUserCompletionProgress } = require("@retroachievements/api");

async function getCompletionProgress() {
    const userCompletionProgress = await getUserCompletionProgress(authorization, {
        userName: "Awkz19",
    });
    return userCompletionProgress;
}

function getConsoleImage(consoleName) {
    if (consoleName === "PlayStation 2") {
        return "https://static.retroachievements.org/assets/images/system/ps2.png";
    } else if (consoleName === "Game Boy") {
        return "https://static.retroachievements.org/assets/images/system/gb.png";
    } else if (consoleName === "Game Boy Advanced") {
        return "https://static.retroachievements.org/assets/images/system/gba.png";
    } else if (consoleName === "SNES/Super Famicom") {
        return "https://static.retroachievements.org/assets/images/system/snes.png";
    } else {
        return "Console name error"; 
    }
}

async function main() {

    //const consoleIds = await getConsoleIds(authorization);
    //console.log(consoleIds)

    const userCompletionProgress = await getCompletionProgress();
    const results = userCompletionProgress.results;

    const formattedData = results.map(game => ({
        gameID: game.gameId,
        name: game.title,
        image: "https://media.retroachievements.org/" + game.imageIcon,
        totalAchievements: game.maxPossible,
        unlocked: game.numAwarded,
        progression: Math.round((game.numAwarded / game.maxPossible) * 100), 
        console: game.consoleName,
        consoleImage: getConsoleImage(game.consoleName) 
    }));

    const jsonData = JSON.stringify(formattedData, null, 2);
    await fs.writeFile('database.json', jsonData);
    console.log('JSON salvo com sucesso!');

}


main();
