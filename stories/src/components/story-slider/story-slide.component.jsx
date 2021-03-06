import React from 'react';
import cx from 'classnames';
import Link from 'redux-first-router-link';

function StorySlide (props) {
  const { link, title, authors = [], sectorList = [], countries = [], cover, agency = [] } = props;
  const avatar = author => (author.photo && author.photo.url);
  const countriesMarkup = countries.map(country => (
    <span key={country.iso} className="country">
      {
        agency.map(a => (
          <span key={a.name}>
            {a.name}
          </span>
        ))
      }
      <br />
      {country.name}
    </span>
  ));
  const bannerBackground = cover ? `http:${cover.url}` : '/images/banner-image.png';
  return (
    <Link to={link}>
      <figure className={cx('slide', { veil: !!cover })}>
        <div
          className="slide-banner"
          style={{ backgroundImage: `url(${bannerBackground})` }}
        />
        <div className="slide-wrapper">
          <figcaption className="slide-content">
            <div className="tag">
              <span>LAST STORIES</span>
              <i className="icon-flag" />
            </div>
            <span>{sectorList.join(', ')}</span>
            <h1>{title}</h1>
            <div className="clearfix">
              {authors.map(author => [
                <div className="author-avatar-image" key="authorAvatar">
                  {avatar(author) &&
                  <img
                    className="rounded-img"
                    src={`http:${avatar(author)}`}
                    alt={`By ${author.name}`}
                  />
                  }
                </div>,
                <p key="authorName" className="author-data">
                  <span className="author">By {author.name}</span>
                  {countriesMarkup}
                </p>
              ])
              }
              {!authors.length && countries.length &&
              <p key="authorName" className="author-data">
                {countriesMarkup}
              </p>
              }
            </div>
          </figcaption>
          </div>
      </figure>
    </Link>
  );
}

export default StorySlide;
