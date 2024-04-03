require('dotenv').config();
const { buildAuthorization } = require("@retroachievements/api");

const userName = "Awkz19";
const webApiKey = process.env.APIKEY;

const authorization = buildAuthorization({ userName, webApiKey });

const { getAchievementsEarnedBetween, getUserCompletionProgress } = require("@retroachievements/api");

async function getRecentAchievements() {

    const toDate = new Date();
    const fromDate = new Date(toDate);
    fromDate.setDate(toDate.getDate() - 5);

    const achievements = await getAchievementsEarnedBetween(authorization, {
        userName: "Awkz19",
        fromDate: fromDate,
        toDate: toDate,
    });
    console.log(achievements)

}


async function getCompletionProgress(){


    const userCompletionProgress = await getUserCompletionProgress(authorization, {
        userName: "Awkz19",
      });
    console.log(userCompletionProgress)

}

async function main() {
    await getRecentAchievements()
    await getCompletionProgress();
}

main();
