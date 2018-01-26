import qs from 'query-string';

export function getPictures(pictures, stories = {}, imgOptions= {}) {
  if (!pictures) return;
  const imgParams = qs.stringify(imgOptions);

  return pictures.map(id => {
    const pictureEntity = stories.picture || {};
    const picture = pictureEntity[id];
    const fileEntity = stories.file || {};
    const file = picture && fileEntity[picture.file];
    if (file) return { ...picture, ...file, url: `${file.url}?${imgParams}` };
    return null;
  }).filter(p => !!p);
}

export function getAuthors(authors, stories = {}) {
  if (!authors) return;
  return authors.map(id => {
    const authorEntity = stories.author || {};
    const author = authorEntity[id];
    if (author) {
      const photoEntity = stories.photo || {};
      const photo = photoEntity[author.photo];
      return { ...author, photo };
    }
    return null;
  }).filter(a => !!a);
}

export function getEntity(list, stories = {}, entity) {
  if (!list) return;
  return list.map(id => {
    const listEntity = stories[entity] || {};
    return listEntity[id];
  }).filter(a => !!a);
}

export function getStory(story, entities, imgOptions = {}) {
  const pictureList = story && getPictures(story.pictures, entities, imgOptions);
  const videos = story && getEntity(story.videos, entities, 'video');
  const authors = story && getAuthors(story.authors, entities);
  const countries = story && getEntity(story.countries, entities, 'country');
  const pictures = pictureList && pictureList.filter(p => !p.cover);
  const cover = pictureList && pictureList.find(p => p.cover);
  const agency = story && getEntity(story.agency, entities, 'agency');
  return {
    ...story,
    cover,
    pictures,
    videos,
    authors,
    countries,
    agency
  };
}
