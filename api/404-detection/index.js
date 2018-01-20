var request = require('request');
var blc = require('broken-link-checker');

exports.handler = function(event, context, callback) {

    let response = {
        status: 'success',
        links: [],
        brokenLinks: []
    };

    let htmlUrlChecker = new blc.HtmlUrlChecker(null, {
        junk: function(result) {
            response.brokenLinks.push(result.url.resolved);
        },
        link: function(result) {
            response.links.push(result.url.resolved);
        },
        end: function() {
            console.log(response);
            callback(null,response);
        }
    });
    htmlUrlChecker.enqueue(event.url, null);

};
