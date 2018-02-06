import React from "react";
import PropTypes from 'prop-types';
import moment from 'moment';
import Link from 'redux-first-router-link';
import { slugify } from 'utils/stories';

function Box (props) {
  const { title, sectorList, summary, authors, story_date, countries, showSummary, agency = [] } = props;
  const date = story_date && moment(story_date).format('MMM. D, YYYY');
  const avatar = author => (author.photo && author.photo.url);
  const countriesMarkup = countries.map(country => (
    <span key={country.iso} className="country">
      {
        agency.map(a => (
          <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer">
            {a.name}
            <svg className="icon external-icon" viewBox="0 0 34 32">
              <title>externallink</title>
              <path d="M26.747 3.619h-8.948v-3.619h14.159v1.59l0.219 0.219-0.219 0.219v12.195h-3.387v-8.808l-14.316 14.317-1.811-1.811 14.303-14.301zM0 5.524v26.349h26.667v-15.746h-3.627v12.381h-19.548l0.072-19.683h12.372v-3.302h-15.937z"></path>
            </svg>
          </a>
        ))
      }
      <br />
      {country.name}
    </span>
  ));

  return (
      <div className="banner-content">
        <h1>{title}</h1>
        <section className="story-data">
          <div className="author-area">
            {authors.map(author => [
                <p key="avatar" className="author-avatar">
                  <a className="author-avatar-image">
                    {avatar(author) &&
                      <img
                        className="rounded-img"
                        src={`http:${avatar(author)}`}
                        alt={`By ${author.name}`}
                      />
                    }
                  </a>
                </p>,
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
            <p className="datetime-area">
              {sectorList.map((sector, i) => (
                <Link className="cat-link" key={sector} to={`/stories?category=${slugify(sector)}`}>
                  {sector}
                  {i === sectorList.length - 1? null : ','}
                </Link>
              ))}
              {date &&
                <span className="datetime">
                  <time dateTime={date}>{date}</time>
                </span>
              }
            </p>
          </div>
          {showSummary &&
            <div className="story-preview">
              <p>
                {summary}
              </p>
            </div>
          }
        </section>
      </div>
  );
}
Box.propTypes = {
  title: PropTypes.string,
  sectorList: PropTypes.array,
  summary: PropTypes.string,
  authors: PropTypes.array,
  story_date: PropTypes.string
};

Box.defaultProps = {
  authors: [],
  showSummary: false
};

export default Box;
