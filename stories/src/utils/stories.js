import moment from 'moment';

export function slugify(string) {
  return string.trim().split(' ').join('-');
}

export function deslugify(string) {
  return string.split('-').join(' ');
}

export const DATE_FORMAT = 'YYYY';

export function buildFilters(query) {
  const keyMap = {
    category: 'fields.sectorList[in]',
    country: 'fields.countryList[in]',
    q: 'query',
    date_start: 'fields.story_date[gte]',
    date_end: 'fields.story_date[lt]',
    template: 'fields.template'
  };
  const formatQuery= (type, string) => {
    const formatter = {
      date_start: s => moment(s, DATE_FORMAT).toISOString(),
      date_end: s => moment(s, DATE_FORMAT).toISOString(),
      category: deslugify,
      template: deslugify
    }[type];

    if (!formatter) return string;
    return formatter(string);
  };

  return Object.keys(query).reduce((acc, next) => {
    const value = formatQuery(next, query[next]);
    const key = keyMap[next];
    if (key && value) return { ...acc, [key]: value };
    return acc;
  }, {});
}
