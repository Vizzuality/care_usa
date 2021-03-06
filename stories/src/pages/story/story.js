import { connect } from 'react-redux';
import camelCase from 'lodash/camelCase';
import StoryComponent from './story.component';
import { getStory } from 'utils/entities';

function mapStateToProps({ stories, location }) {
  const { slug } = location.payload;
  const slugParsed = decodeURIComponent(slug);
  const currentStory = stories.all.entities.story && stories.all.entities.story[slugParsed];
  const template = currentStory && camelCase(currentStory.template);
  const imgOptions = { q: '80', w: 1440, h: 700 };
  const story = getStory(currentStory, stories.all.entities, imgOptions);
  return { story, template };
}

export default connect(mapStateToProps)(StoryComponent);
