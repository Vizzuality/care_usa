import StoriesComponent from './stories.component';
import storiesDuck from './stories.duck';
import { connect } from 'react-redux';


function mapStateToProps({ stories }) {
  return {
   tags: stories.ogTags
  };
}

export { storiesDuck }
export default connect(mapStateToProps)(StoriesComponent);
