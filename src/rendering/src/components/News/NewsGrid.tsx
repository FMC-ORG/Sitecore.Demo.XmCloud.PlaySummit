import Link from 'next/link';
import { withDatasourceCheck, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { News } from 'src/types/news';
import { getPublicAssetUrl } from '../../../src/helpers/PublicUrlHelper';

type NewsGridProps = ComponentProps & {
  fields: {
    items: News[];
  };
};

const NewsGrid = (props: NewsGridProps): React.JSX.Element => {
  const { page } = useSitecore();

  const isPageEditing = page.mode.isEditing;
  const hasNews = !!props.fields;
  const publicUrl = getPublicAssetUrl();

  const sxaStyles = `${props.params?.styles || ''}`;

  !hasNews && console.warn('Missing Datasource Item');

  const pageEditingMissingDatasource = !hasNews && isPageEditing && <p>Missing Datasource Item</p>;

  // Newest four by PublishDate. Copy before sorting so shared layout data is not mutated;
  // undated or deleted children sort last instead of crashing the grid.
  const publishDate = (news: News) => news.fields?.PublishDate?.value ?? '';
  const newsCards = (props.fields?.items ?? [])
    .filter((news) => news?.url)
    .sort((a, b) => publishDate(b).localeCompare(publishDate(a)))
    .slice(0, 4)
    .map((news, index) => (
      <div key={index} className="news-grid-item">
        <Link href={news.url} passHref>
          <img
            className="item-image"
            src={news.fields?.Image?.value?.src}
            alt="News"
            width="465px"
            height="260px"
            loading="lazy"
          />
          {news.fields?.Title?.value}
        </Link>
      </div>
    ));

  const newsGrid = hasNews && (
    <div className={`section-news-grid ${sxaStyles}`}>
      <div className="news-tweet">
        <img
          src={`${publicUrl}/assets/img/news/conference-image.jpg`}
          alt="News"
          width="465px"
          height="388px"
          className="tweet-img"
          loading="lazy"
        />
        <div className="tweet-content">
          <div className="tweet-profile">
            {/* Static demo asset; served from public like the adjacent conference image. */}
            <img
              src={`${publicUrl}/assets/img/news/profile-pic.jpg`}
              alt="News"
              width="60px"
              className="tweet-profile-pic"
              loading="lazy"
            />
            <div className="tweet-profile-content">
              <p>John Doe - @jdoe</p>
              <p>2h ago</p>
            </div>
          </div>
          <p className="tweet-content-body">Hyped for this year&apos;s edition of Play! Summit</p>
          <p className="tweet-content-link">#play! #sports</p>
          <p className="tweet-content-comments">View all 50 comments</p>
        </div>
      </div>
      <div className="news-grid-container">
        <div className="news-grid">{newsCards}</div>
      </div>
    </div>
  );

  return (
    <>
      {newsGrid}
      {pageEditingMissingDatasource}
    </>
  );
};

export const Default = withDatasourceCheck()<NewsGridProps>(NewsGrid);
