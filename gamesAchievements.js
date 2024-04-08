const fs = require('fs').promises;
const { buildAuthorization } = require("@retroachievements/api");

require('dotenv').config();

const userName = "Awkz19";
const webApiKey = process.env.APIKEY;

const authorization = buildAuthorization({ userName, webApiKey });

const { getUserCompletionProgress } = require("@retroachievements/api");

async function getCompletionProgress() {
    const userCompletionProgress = await getUserCompletionProgress(authorization, {
        userName: "Awkz19",
    });
    return userCompletionProgress;
}

function getConsoleImage(consoleName) {
    switch (consoleName) {
        case "PlayStation 2":
            return "https://static.retroachievements.org/assets/images/system/ps2.png";
        case "Game Boy":
            return "https://static.retroachievements.org/assets/images/system/gb.png";
        case "Game Boy Advanced":
            return "https://static.retroachievements.org/assets/images/system/gba.png";
        case "SNES/Super Famicom":
            return "https://static.retroachievements.org/assets/images/system/snes.png";
        default:
            return "Console name error";
    }
}

async function main() {
    try {

        const userCompletionProgress = await getCompletionProgress();
        const results = userCompletionProgress.results;


        let existingData = [];
        try {
            const fileContent = await fs.readFile('database.json', 'utf8');
            existingData = JSON.parse(fileContent);
        } catch (error) {
            console.log("O arquivo database.json não existe ou está vazio.");
        }

        results.forEach(newGame => {
            const existingGameIndex = existingData.findIndex(existingGame => existingGame.gameID === newGame.gameId);
            if (existingGameIndex !== -1) {
                existingData[existingGameIndex] = {
                    ...existingData[existingGameIndex],
                    totalAchievements: newGame.maxPossible,
                    unlocked: newGame.numAwarded,
                    progression: Math.round((newGame.numAwarded / newGame.maxPossible) * 100),
                    console: newGame.consoleName,
                    consoleImage: getConsoleImage(newGame.consoleName)
                };
            } else {
                existingData.push({
                    gameID: newGame.gameId,
                    name: newGame.title,
                    image: "https://media.retroachievements.org/" + newGame.imageIcon,
                    totalAchievements: newGame.maxPossible,
                    unlocked: newGame.numAwarded,
                    progression: Math.round((newGame.numAwarded / newGame.maxPossible) * 100),
                    console: newGame.consoleName,
                    consoleImage: getConsoleImage(newGame.consoleName)
                });
            }
        });

        await fs.writeFile('database.json', JSON.stringify(existingData, null, 2));
        const currentDate = new Date().toLocaleString();
        console.log(`[${currentDate}] Arquivo .json atualizado`);

    } catch (error) {
        console.error("Ocorreu um erro:", error);
    }
}

main()
setInterval(main, 12 * 3600000);
