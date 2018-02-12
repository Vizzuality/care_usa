import React from "react";
// import DetailOne from './detail-one/detail-one.component';
import DetailTwo from './detail-two/detail-two.component';
import DetailThree from './detail-three/detail-three.component';
import { Helmet } from "react-helmet";

function Story(props) {
  const { template, story } = props;

  const Detail = template ? {
    photoStory: DetailThree,
    photoGallery: DetailThree,
    videoStory: DetailTwo,
    writtenStory: DetailThree
  }[template] : DetailThree;

  if (!Detail) return null;
  return (
    <main id="pageContent" className="page-wrapper home">
      <Helmet key="helmet">
        <title>{story.title}</title>
        <meta name="description" content={story.description} />
      </Helmet>,
      {template && <Detail story={story} />}
    </main>
  );
}

export default Story;
