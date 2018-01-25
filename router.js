const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const template = require('lodash/template');
const templateSettings = require('lodash/templateSettings');
const path = require('path');
const fs = require('fs');

const storiesPath = path.join(__dirname, 'stories', 'build');
const mapPath = path.join(__dirname, 'map', 'build');

const token = process.env.REACT_APP_CONTENTFUL_TOKEN;
const space = process.env.REACT_APP_SPACE_ID;
templateSettings.interpolate = /{{([\s\S]+?)}}/g;

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
    if (item.title) seoStory.title = `CARE story - ${item.title}`;
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

const routes = router
  .get('/:slug', function(req, res) {
    getStoryDetails(req.params.slug)
      .then(tags => {
        const seoStory = Object.assign(seoParams, tags);
        seoStory.url = req.hostname + req.baseUrl

        res.set('Content-Type', 'text/html');
        res.send(template(storiesContent)(seoStory))
      })
      .catch(function(e) {
        res.set('Content-Type', 'text/html');
        res.send(template(storiesContent)(seoParams))
      })
  })
  .get('/', (req, res) => {
    getOgTags()
      .then(function(tags) {
        const seoIndex = Object.assign(seoParams, tags);
        seoIndex.url = req.hostname + req.baseUrl

        res.set('Content-Type', 'text/html');
        res.send(template(storiesContent)(seoIndex))
      })
      .catch(function(e) {
        res.set('Content-Type', 'text/html');
        res.send(template(storiesContent)(seoParams))
      })
  })

  module.exports = routes;
