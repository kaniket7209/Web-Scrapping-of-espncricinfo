const request = require('request');
const cheerio = require('cheerio');
console.log("before");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/ball-by-ball-commentary";
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
    let $ = cheerio.load(html);
    let contentArr = $(".d-flex.match-comment-padder.align-items-center .match-comment-long-text p");
    let data = $(contentArr[0]).text();
    console.log(data);
    let datahtml = $(contentArr[0]).html();
    console.log(datahtml);

}
