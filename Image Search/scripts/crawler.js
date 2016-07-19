'use strict';

const rp = require('request-promise');
const cheerio = require('cheerio');
const entities = require("entities");

class Crawler {

  constructor(url, offset, res) {
    this.url = url;
    this.offset = offset;
    this.res = res;

    this.options = {
      uri: this.url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
      },
      transform: function (body) {
        return cheerio.load(body);
      }
    };
  }

  getUrl() {
    let res = this.res;
    let offset = this.offset;
    rp(this.options)
    .then(function ($) {
      let r = [];
      let l = $('.rg_di').toArray();
      l.forEach(function(e) {
        let check = $(e).find('.rg_meta').text();
        if(check && (check !== "" || check !== " ")) {
          let meta = JSON.parse(check);
          r.push({
            url: meta.ou,
            about: entities.decodeHTML(meta.pt),
            thumbnail: meta.tu,
            site: meta.ru
          });
        }
      });
      if(r.length - 10 <= offset) {
        res.json({error: "offset", reason: "maximum offset allowed is " + (r.length - 10)})
      } else {
        res.json(r.slice(offset, offset + 10));
      }
    })
    .catch(function (err) {
      throw err
    });
  }

}


module.exports = Crawler;