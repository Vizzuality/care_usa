import { connect } from 'react-redux';
import { getStory } from 'utils/entities';
import StorySlider from './story-slider.component';
import { STORY } from 'router';
import sortBy from 'lodash/sortBy';

function mapStateToProps({ stories }) {
  const content = stories.all.entities.story && stories.all.result
    .map(id => ({ id, ...stories.all.entities.story[id] }))

  if (!content || !content.length) return {};

  const imgOptions = { q: '50', w: 2560, h: 1080 };
  const slides = sortBy(content
    .filter(story => story.featured)
    .map(({ id, ...story}) => ({
      ...getStory(story, stories.all.entities, imgOptions),
      link: { type: STORY, payload: { slug: id }}
    })),
    'featured');

  return { slides };
}

export default connect(mapStateToProps)(StorySlider);

