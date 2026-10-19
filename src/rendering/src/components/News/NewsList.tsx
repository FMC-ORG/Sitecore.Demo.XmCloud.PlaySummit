import Link from 'next/link';
import { Text, Image, RichText, DateField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { News } from 'src/types/news';
import { newsDateFormatter } from '../../helpers/DateHelper';

type NewsListProps = ComponentProps & {
  fields: {
    items: News[];
  };
};

const NewsList = (props: NewsListProps): React.JSX.Element => {
  const { page } = useSitecore();

  const isPageEditing = page.mode.isEditing;
  // Resolver order is preserved; deleted/unpublished children are skipped.
  const items = (props?.fields?.items ?? []).filter((news) => news?.url);
  const hasNews = items.length > 0;

  const sxaStyles = `${props.params?.styles || ''}`;

  !hasNews && console.warn('Missing Datasource Item');

  const pageEditingMissingDatasource = !hasNews && isPageEditing && <p>Missing Datasource Item</p>;

  const newsCards = items.map((news, index) => (
    <div key={index} className="news">
      <div className="image-container">
        <Image
          field={news.fields?.Image}
          alt={news.fields?.Title?.value}
          width={340}
          height={227}
        />
      </div>
      <div className="text-container">
        <Text tag="div" className="news-title" field={news.fields?.Title} />
        <DateField
          tag="p"
          className="news-date"
          field={news.fields?.PublishDate}
          render={newsDateFormatter}
        />
        <RichText className="news-excerpt" field={news.fields?.Excerpt} />
      </div>
      <div className="button-container">
        <Link href={news.url} className="btn-main">
          Read&nbsp;More
        </Link>
      </div>
    </div>
  ));

  const newsList = hasNews && (
    <section className={`section section-news-list ${sxaStyles}`}>
      <div className="container">
        <div className="content">{newsCards}</div>
      </div>
    </section>
  );

  return (
    <>
      {newsList}
      {pageEditingMissingDatasource}
    </>
  );
};

export const Default = NewsList;
