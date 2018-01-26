import { connect } from 'react-redux';
import { getStory } from 'utils/entities';
import RecentStories from './recent-stories.component';
import { STORY } from 'router';

function mapStateToProps({ stories }) {
  const imgOptions = { q: '50', w: 600, h: 420 };
  const slides = stories.all.entities.story && stories.all.result.slice(0, 5)
    .map(id => ({ id, ...stories.all.entities.story[id] }))
    .map(({ id, ...story}) => ({
      ...getStory(story, stories.all.entities, imgOptions),
      link: { type: STORY, payload: { slug: id }}
    }));

  return { slides };
}

export default connect(mapStateToProps)(RecentStories);

