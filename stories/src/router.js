import { connectRoutes, redirect, NOT_FOUND } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import querySerializer from 'query-string';
import restoreScroll from 'redux-first-router-restore-scroll'
import ReactGA from 'react-ga';

// thunks
import { getCategoriesThunk, getCountriesThunk } from 'components/filters/filters.duck';
import { getOgTagsThunk, getStoriesThunk, getFilteredStoriesThunk } from 'pages/stories/stories.duck';

// pages
import Stories from 'pages/stories/stories';
import Story from 'pages/story/story';

const history = createHistory();

// route names
export const HOME = 'location/HOME';
export const STORIES = 'location/STORIES';
export const STORY = 'location/STORY';
export const MAP = 'location/MAP';
export const ABOUT = 'location/ABOUT';
export const DONATE = 'location/DONATE';

const dispatchPreFetchThunks = (...thunks) => async (...params) => thunks.forEach(thunk => thunk(...params));

export const routes = {
  [HOME]: {
    path: '/',
    thunk: async () => window.location.replace('/map')
  },
  [STORIES]: {
    path: '/stories',
    thunk: dispatchPreFetchThunks(getOgTagsThunk, getStoriesThunk, getFilteredStoriesThunk, getCategoriesThunk, getCountriesThunk),
    component: Stories
  },
  [STORY]: {
    path: '/stories/:slug',
    thunk: dispatchPreFetchThunks(getStoriesThunk),
    component: Story
  },
  [MAP]: {
    path: '/map',
    thunk: async () => window.location.replace('/map')
  },
  [ABOUT]: {
    path: '/about',
    thunk: async () => window.location.replace('/map#?careHistory=true&hideBack=true')
  },
  [DONATE]: {
    path: '/donate',
    thunk: async () => window.location.replace('https://www.care.org/donate')
  },
  [NOT_FOUND]: {
    path: '/404',
    thunk: async dispatch => dispatch(redirect({ type: HOME }))
  }
};

function trackPage () {
  ReactGA.pageview(window.location.pathname + window.location.search);
}

export default connectRoutes(
  history,
  routes,
  {
    querySerializer,
    restoreScroll: restoreScroll({
      shouldUpdateScroll: (prev, locationState) => (prev.pathname !== locationState.pathname)
    }),
    onAfterChange: trackPage
  }
);
