const request = require('request');
const cheerio = require('cheerio');
const { clear } = require('console');
const chalk = require('chalk');
// console.log("before");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/full-scorecard";

request(url, cb);
function cb(error, response, html) {
    if (error) {
        console.log("Page 404 not found");
    }
    else {
        // console.log(html);
        extracthmtl(html);
    }
}
// console.log("after");
function extracthmtl(html) {
    let $ = cheerio.load(html); // read the html for us
    let teamsArr = $(".match-info.match-info-MATCH .team");
    // winning team name
    let wteamName;
    for (let i = 0; i < teamsArr.length; i++) {
        let hasclass = $(teamsArr[i]).hasClass("team-gray");
        if (hasclass == false) {
            let teamNameEle = $(teamsArr[i]).find(".name");
            wteamName = teamNameEle.text();
            //  console.log(wteamName);
        }
    }

    // innings - 2 innings
    let inningsArr = $(".card.content-block.match-scorecard-table .Collapsible");
    for (let i = 0; i < inningsArr.length; i++) {
        let teamNameEle = $(inningsArr[i]).find(".header-title.label");
        let teamName = teamNameEle.text();
        // TEAMNAME = Kings XI Punjab INNINGS (20 overs maximum) 
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim();
        // comparing 
        if (wteamName == teamName) {
            let tableele = $(inningsArr[i]).find(".table.batsman tbody");
            let allBatsmanEle = $(tableele).find("tr");
            for (let j = 0; j < allBatsmanEle.length; j++) {
                let allColsOfBatsman = $(allBatsmanEle[j]).find("td");
                // console.log(allColsOfBatsman.text());
                let isbatsmanpresent = $(allColsOfBatsman[0]).hasClass("batsman-cell");
                if (isbatsmanpresent == true) {
                    // find link 
                    let href = $(allColsOfBatsman[0]).find("a").attr("href");
                    let name = $(allColsOfBatsman[0]).text();
                    // console.log(href);
                    let fulllink = "https://www.espncricinfo.com" + href;
                    // console.log(fulllink);
                    getbirthdays(fulllink, name, teamName);
                }
            }

        }

    }
}

function getbirthdays(url, name, teamName) {
    request(url, cb);
    function cb(error, response, html) {
        if (error) {
            console.log("Page 404 not found");
        }
        else {
            // console.log(html);
            extractbirthdays(html, teamName, name);
        }
    }

}

function extractbirthdays(html, teamName, name) {
    let $ = cheerio.load(html);
    let detailsArr = $(".player-card-description");
    let birthday = $(detailsArr[1]).text();
    // console.log(chalk.red(birthday));
    console.log(`Batsman ${chalk.greenBright(name)} of team ${teamName} was born on ${birthday} `);
}
