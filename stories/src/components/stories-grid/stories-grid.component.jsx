import React from "react";
import StoryCard from "../story-card.component";
import Masonry from 'react-masonry-infinite';

function StoriesGrid({ cards, setCardOffset, cardOffset, cardLimit }) {
  const masonryColumns = [
    { columns: 1, gutter: 20 },
    { mq: '750px', columns: 3, gutter: 20 }
  ];
  return (
    <section className="article-container">
      <h3>Total Stories</h3>
      <div className="grid">
        <span className="group">({cardLimit} Stories)</span>
      </div>
      <div className="grid">
        <Masonry
          pack={true}
          hasMore={false}
          loadMore={() => (null)}
          className="article-list"
          sizes={masonryColumns}
        >
          {
            [...cards.map((storycard, key) => (
              <StoryCard
                key={`${key}-story-card`}
                {...storycard}
              />
            )),
              (<div
                key="quickDonate"
                className="donate-form box"
              >
                <h4 className="form-heading">Quick Donate</h4>
                <fieldset className="holder">
                  {/* <button
                    id="donateSubmit"
                    className="button"
                    type="button"
                    name="donateBtn"
                  >
                    DONATE
                  </button> */}
                  <a
                    href="https://www.care.org/donate"
                    className="button"
                  >
                    DONATE
                  </a>
                </fieldset>
              </div>)]
          }
        </Masonry>
        {(cardOffset < cardLimit) &&
          <a className="more" onClick={() => setCardOffset(cardOffset + 5)}>
          SHOW MORE STORIES
        </a>
        }
      </div>
    </section>
  );
}

export default StoriesGrid;
