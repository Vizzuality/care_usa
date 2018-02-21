import React  from 'react';

import remark from 'remark';
import remarkReact from 'remark-react';

function TextContent({ children }) {
  const customDiv = p => (
    <div className="std">{p.children}</div>
  )

  return remark()
    .use(remarkReact, {
      remarkReactComponents: { div: customDiv }
    })
    .processSync(children).contents
}

export default TextContent;
