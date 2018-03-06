import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import qs from 'query-string';

import { STORY } from 'router';
import { getStory } from 'utils/entities';
import storiesGridDuck, { setCardOffset }  from './stories-grid.duck';
import StoriesGrid from './stories-grid.component';

class StoriesGridContainer extends React.Component {

  static propTypes = {
    storyEntities: PropTypes.object,
    cardStart: PropTypes.number,
    cardOffset: PropTypes.number
  };

  getLink(story, id) {
    return { type: STORY, payload: { slug: id } };
  }

  render() {
    const { storyEntities, cardStart, cardOffset } = this.props;
    const stories =  storyEntities.story || {};
    const imgOptions = { q: '50', w: 660, h: 660 };
    const cards = (stories ? Object.keys(stories) : [])
      .map(id => {
        const story = getStory(stories[id], storyEntities, imgOptions);

        return {
          ...story,
          link: this.getLink(story, id)
        };
      })
      .slice(cardStart, cardOffset);

    return createElement(StoriesGrid, { ...this.props, cards });
  }
}

function mapStateToProps({ storiesGrid, location, stories }) {
  const storyEntities = stories.filtersActive
    ? stories.filtered.entities
    : stories.all.entities;

  const cardLimit = Object.values((storyEntities.story || {})).length;
  const categorySelected = (qs.parse(location.search).category || '').split('-').join(' ');
  const sectionTitle = categorySelected ? categorySelected + ' stories' : 'Stories';
  return { ...storiesGrid, cardLimit, storyEntities, sectionTitle };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setCardOffset }, dispatch);
}

export { storiesGridDuck };

export default connect(mapStateToProps, mapDispatchToProps)(StoriesGridContainer);
