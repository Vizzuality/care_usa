'use strict';
require('dotenv').config();

const port = process.env.PORT || 5000;
const path = require('path');
const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const template = require('lodash/template');
const templateSettings = require('lodash/templateSettings');

const router = express.Router();

const mapPath = path.join(process.cwd(), 'map', 'build');
const storiesPath = path.join(process.cwd(), 'stories', 'build');
const app = express();

app.use(express.static(storiesPath));
app.use(express.static(mapPath));

app.get('/map', (req, res) => {
  res.sendFile(path.join(mapPath, 'map/index.html'));
});

const token = process.env.REACT_APP_CONTENTFUL_TOKEN;
const space = process.env.REACT_APP_SPACE_ID;

function parseContentfulImg(url) {
  return 'http:' + url + '?q=50&w=800&h=800'
}
function getStoryDetails(slug) {
  const url = `https://cdn.contentful.com/spaces/${space}/entries?content_type=story&query=${slug.split('-').join(' ')}&access_token=${token}`
  return fetch(url)
  .then(res => res.json())
  .then(body => {
    if (!body.items || !body.items.length) return null;
    const item = body.items[0].fields;
    const img = body.includes.Asset[0].fields.file;
    const seoStory = {};
    if (item.title) seoStory.title = `Care story - ${item.title}`;
    if (item.summary) seoStory.description = item.summary;
    if (img && img.url) {
      seoStory.image = parseContentfulImg(img.url);
    }
    return seoStory;
  });
}
function getOgTags() {
  const url = `https://cdn.contentful.com/spaces/${space}/entries?content_type=ogTags&access_token=${token}`
  return fetch(url)
  .then(res => res.json())
  .then(body => {
    if (!body.items || !body.items.length) return {};
    const field = body.items[0].fields;
    const image = body.includes.Asset[0].fields.file;
    const seo = {}
    if (field.ogTitle) seo.title = field.ogTitle;
    if (field.ogDescription) seo.description = field.ogDescription;
    if (image && image.url) seo.image = parseContentfulImg(image.url);
    return seo;
  });
}

const storiesHtml = path.join(storiesPath, 'index.html');
const storiesContent = fs.readFileSync(storiesHtml);

const seoParams = {
  title: 'CARE\'s World of Impact',
  description: 'Since 1946 CARE has turned donor gifts into life-changing programs around the world. In one map and in many stories, see how gifts to CARE deliver lasting change.',
  image: 'http://images.contentful.com/nlip0spjj3b7/6nGcJ78WYwMQeIeWsKKUou/1eabaf9ae44cfa1a7c8e5eb9979278da/ETH-2015-MT-002.JPG?q=50&w=800&h=800',
  url: ''
}
templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const storiesRouter = router
  .get('/:slug', function(req, res, next) {
    getStoryDetails(req.params.slug)
      .then(({ item, img }) => {
        const seoStory = Object.assign(seoParams, tags);
        seoStory.url = req.hostname + req.baseUrl

        res.set('Content-Type', 'text/html');
        res.send(template(storiesContent)(seoStory))
      });
  })
  .get('/', (req, res) => {
    getOgTags()
      .then(function(tags) {
        const seoIndex = Object.assign(seoParams, tags);
        seoIndex.url = req.hostname + req.baseUrl

        res.set('Content-Type', 'text/html');
        res.send(template(storiesContent)(seoIndex))
      })
  });

app.use('/stories', storiesRouter);


app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on http://0.0.0.0:%s/', port);
});
