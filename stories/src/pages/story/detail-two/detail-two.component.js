import React from 'react';
import cx from 'classnames';
import DetailBanner from 'components/detail-banner.component';
import DetailHeader from 'components/detail-header.component';
import ArticleVideo from 'components/article-video/article-video';
import ArticleQuote from 'components/article-quote.component';
import RecentStories from 'components/recent-stories/recent-stories';
import TextContent from 'components/text-content.component';
import Embed from 'components/embed.component';

function DetailTwo ({ story }) {
  const { quote, cite, pictures = [], videos = [], summary, body = '', videoLink = '' } = story;
  const [quotePicture] = pictures;
  const [video] = videos;
  const parsedVideoLink = videoLink && videoLink.replace('watch?v=', 'embed/').replace('&', '?');
  const hasQuote = quotePicture || quote;
  const bodyParts = body.split('\n');
  const separator = Math.floor(bodyParts.length / 2);
  const bodyTop = bodyParts.slice(0, separator).join('\n');
  const bodyBottom = bodyParts.slice(separator).join('\n');

  return (
    <main id="pageContent" className="page-wrapper">
      {story.cover
        ? <DetailBanner story={story}/>
        : <DetailHeader story={story} />
      }
      <article className="article-expanded-container">
        <div className="article-expanded-holder video-content">
          {video && <ArticleVideo video={video} />}
          {parsedVideoLink && <Embed url={parsedVideoLink} width="820" height="440" />}
          <div className={cx(['std', { noMedia: !video }])}>
            <p className="marked">
              {summary}
            </p>
          </div>
          <TextContent>
            {bodyTop}
          </TextContent>
        </div>
        <div className="article-expanded-holder quote-content">
          {hasQuote &&
            <ArticleQuote
              picture={quotePicture}
              quote={quotePicture ? quotePicture.quote : quote}
              cite={cite}
            />
          }
          <div className={{ noMedia: !hasQuote }}>
            <TextContent>
              {bodyBottom}
            </TextContent>
          </div>
        </div>
      </article>
      <RecentStories/>
    </main>
  );
}

export default DetailTwo;
