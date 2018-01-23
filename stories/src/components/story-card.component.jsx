import React from 'react';
import cx from 'classnames';
import Link from 'redux-first-router-link';
import Dotdotdot from 'react-dotdotdot';
import kebabCase from 'lodash/kebabCase';

const getHeight = (w,h) => {
  const delta = w && h ? (Math.round((w/h) * 10) / 10) : null;
  if (delta) {
    if (delta <= 1) return 350;
    if (delta >= 1.5) return 200;
    return 270;
  }
  return 172;
};

const StoryCard =  ({ link, sectorList, location, title, summary, cover }) => {
  const dimensions = {
    width: (cover && cover.details && cover.details.image.width) || 0,
    height: (cover && cover.details && cover.details.image.height) || 0
  };
  const height = getHeight(dimensions.width, dimensions.height);
  return (
    <article className="article-item box" style={{ height: (height + 285) }}>
      <div className="holder">
        <figure className="article-content">
          <Link to={link}>
            <div
              className={cx('article-layer', { 'no-image': !cover })}
              style={{ height, backgroundImage: `url(http:${cover.url})` }}
            >
              <p>
                <button className="btn" type="button">
                  GO TO STORY
                </button>
              </p>
            </div>
          </Link>
          <figcaption>
              <div className="article-data">
                <p className="cat">
                  {sectorList.map((sector, i) => (
                    <Link key={sector} to={`/stories?category=${kebabCase(sector)}`}>
                      {sector}
                      {i === sectorList.length - 1? null : ','}
                    </Link>
                  ))}
                </p>
                <span className="country">{location}</span>
              </div>
            <Link to={link}>
              <h4>{title}</h4>
              <p>
                <Dotdotdot clamp="120px">
                  {summary}
                </Dotdotdot>
              </p>
            </Link>
          </figcaption>
        </figure>
      </div>
    </article>
  );
}

export default StoryCard;
