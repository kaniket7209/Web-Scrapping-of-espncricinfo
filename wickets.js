const request = require('request');
const cheerio = require('cheerio');
console.log("before");
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
console.log("after");
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
    let htmlStr = "";
    for (let i = 0; i < inningsArr.length; i++) {
        //     let chtml = $(inningsArr[i]).html();
        //     htmlStr += chtml;
        //     console.log(htmlStr);
        let teamNameEle = $(inningsArr[i]).find(".header-title.label");
        let teamName = teamNameEle.text();
        // TEAMNAME = Kings XI Punjab INNINGS (20 overs maximum) 
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim();



        // compare teams
        if (wteamName == teamName) {
            // console.log(teamName);
            // tables --
            let tableEle = $(inningsArr[i]).find(".table.bowler tbody");
            let allbowlers = $(tableEle).find("tr");

            let hwn = 0;
            let hwNames = "";
            for (let j = 0; j < allbowlers.length; j++) {
                let allColsOfBowler = $(allbowlers[j]).find("td");
                let bowlersName = $(allColsOfBowler[0]).text();
                let noWickets = $(allColsOfBowler[4]).text();
                // console.log(bowlersName,"---",noWickets);
                // logic to find max 
                if (noWickets >= hwn) {
                    hwn = noWickets;
                    hwNames = bowlersName;
                }

            }
            console.log(` Bowler ${hwNames} has taken ${hwn} wickets `);
        }

    }

}
