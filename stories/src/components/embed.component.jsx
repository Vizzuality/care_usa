import React from "react";

function Embed (props) {
  const { url, width, height } = props;
  if(!url) return null;

  return (
    <iframe
      className="embed-component"
      allowFullScreen title={`Iframe for ${url}`} frameBorder="0" width={width} height={height}
      src={`${url}?origin=${window.location.origin}&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`}
    />
  );
}

Embed.defaultProps = {
  width: 820,
  height: 360
}

export default Embed;
