import React from "react";
import Banner from "components/story-slider/story-slider";
import Filters from "components/filters/filters";
import StoriesGrid from "components/stories-grid/stories-grid";
import RecentStories from "components/recent-stories/recent-stories";

import { Helmet } from "react-helmet";

function Stories ({ tags }) {
  return (
    <main id="pageContent" className="page-wrapper home">
      <Helmet key="helmet">
        <title>{tags.title}</title>
        <meta name="description" content={tags.description} />
      </Helmet>,
      <Banner />
      <Filters />
      <StoriesGrid />
      <RecentStories />
    </main>
  );
}

export default Stories;
