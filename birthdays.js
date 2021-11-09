const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
request(url, cb);
function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        extractHtml(html);
    }
}
function extractHtml(html) {
    let $ = cheerio.load(html);
    let teamsArr = $(".match-info.match-info-MATCH .team");
    let wteamname;
    for (let i = 0; i < teamsArr.length; i++) {
        let hasclass = $(teamsArr[i]).hasClass("team-gray");
        if (hasclass == false) {
            let teamnameele = $(teamsArr[i]).find(".name");
            // console.log(teamnameele.text());
            wteamname = teamnameele.text().trim();
            // console.log(wteamname);
        }
    }
    let innigsArr = $(".card.content-block.match-scorecard-table>.Collapsible");

    for (let i = 0; i < innigsArr.length; i++) {
        // let cHtml=$(innigsArr[i]).html();
        // htmlstr+=cHtml;
        let teamnameele = $(innigsArr[i]).find(".header-title.label");
        let teamname = teamnameele.text();
        teamname = teamname.split("INNINGS")[0];
        teamname = teamname.trim();
       
       
            // console.log(teamname);
            let tableelem=$(innigsArr[i]).find(".table.batsman");
            let allbowlers=$(tableelem).find("tr");
            for(let j=0;j<allbowlers.length;j++){
                let allcolsofplayers=$(allbowlers[j]).find("td");
                let isbatsmancol=$(allcolsofplayers[0]).hasClass("batsman-cell");
                if(isbatsmancol == true){
                let href=$(allcolsofplayers[0]).find("a").attr("href");
                let name=$(allcolsofplayers[0]).text();
                // console.log(href);
                let fulllink="https://www.espncricinfo.com"+href;
                getbirthdaypage(fulllink,name,teamname);
                // console.log(`teamname : ${teamname} playername: ${playername}`);
                } 
        }
    }
  }
  function getbirthdaypage(url,name,teamname){
      request(url,cb);
      function cb(err,response,html){
          if(err){

          }else{
              extractbirthday(html,name,teamname);
          }
      }
  }
  function extractbirthday(html,name,teamname){
      let $= cheerio.load(html);
      let detailsArr=$(".player-card-description");
      let birthday=$(detailsArr[1]).text();
      console.log(`${name}, plays for ${teamname} was born on ${birthday}`);
  }