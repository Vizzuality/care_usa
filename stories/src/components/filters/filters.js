import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FiltersComponent from './filters.component';
import filtersDuck, { updateFilters } from './filters.duck';
import { slugify, DATE_FORMAT } from 'utils/stories';

function mapStateToProps({ filters, location, stories }) {
  const categories = Object.values(filters.categories.entities.category || {})
    .map(category => ({ value: slugify(category.name), label: category.name }));

  const countries = uniqBy(Object.values(stories.all.entities.country || {})
    .map(country => ({ value: country.iso, label: country.name }))
    , 'value');

  const templates = uniqBy(
    Object.values(stories.all.entities.story || {}),
    'template'
  ).map(story => (({ value: slugify(story.template), label: story.template })));

  const parseYear = story => (story.story_date ? moment(story.story_date).format(DATE_FORMAT) : moment().format(DATE_FORMAT));
  const years = uniqBy(
    Object.values(stories.all.entities.story || {}),
    parseYear
  ).map(story => parseYear(story));

  return {
    years,
    categories,
    countries,
    templates,
    query: location.query
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateFilters }, dispatch);
}

class FiltersContainer extends React.Component {

  static defaultProps = {
    query: {},
    categories: [],
    countries: [],
    templates: []
  };

  static propTypes = {
    query: PropTypes.object,
    categories: PropTypes.array.isRequired,
    countries: PropTypes.array.isRequired,
    templates: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.updateFilters = debounce(this.props.updateFilters, 350);
  }

  onFilterChange(e) {
    const { query } = this.props;
    const { value, name } = e.target;
    let filters =  {};
    if (name === 'date_start') {
      const date_end = value ? (parseInt(value, 10) + 1).toString() : '';
      filters = { ...query, [name]: value, date_end }
    } else {
      filters = { ...query, [name]: value };
    }
    this.updateFilters(filters);
  }
  render() {
    const { onFilterChange } = this;

    return createElement(FiltersComponent, {
      ...this.props,
      onFilterChange
    });
  }
}

export { filtersDuck }
export default connect(mapStateToProps, mapDispatchToProps)(FiltersContainer);
