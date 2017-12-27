import React from "react";
import Box from "./box.component";
import DetailSwitch from "components/detail-switch/detail-switch";

function DetailBanner ({ story, showSummary, showOnMap }) {

  const { cover } = story;
  const bgStyle = { backgroundImage: `url(https://${cover.url})` };

  return (
    <section className="banner-story-container collapse">
      <div className="banner-holder" style={bgStyle} >
        <div className="banner">
          <div className="banner-box">
            <Box showSummary={showSummary} {...story} />
          </div>
          <DetailSwitch/>
        </div>
      </div>
    </section>
  );
}

export default DetailBanner;
