import Link from 'next/link';
import { withDatasourceCheck, Image, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { Sponsor } from 'src/types/sponsor';
import { getPublicAssetUrl } from '../../../src/helpers/PublicUrlHelper';

type SponsorsGridProps = ComponentProps & {
  fields: {
    items: Sponsor[];
  };
};

const SponsorsGrid = (props: SponsorsGridProps): React.JSX.Element => {
  const { page } = useSitecore();

  const publicUrl = getPublicAssetUrl();
  const isPageEditing = page.mode.isEditing;
  const hasSponsors = !!props.fields;

  const sxaStyles = `${props.params?.styles || ''}`;

  !hasSponsors && console.warn('Missing Datasource Item');

  const pageEditingMissingDatasource = !hasSponsors && isPageEditing && (
    <p>Missing Datasource Item</p>
  );

  const sponsors = (props.fields?.items ?? [])
    .filter((sponsor) => sponsor?.url)
    .map((sponsor, index) => (
      <Link key={index} href={sponsor.url} passHref className="grid-item">
        <Image
          field={sponsor.fields?.Logo}
          alt={sponsor.fields?.Name?.value}
          width={265}
          height={265}
        />
        <div className="item-details">
          <Text tag="p" field={sponsor.fields?.Name} />
        </div>
      </Link>
    ));

  const downArrow = <img src={`${publicUrl}/assets/img/icons/down-arrow.svg`} alt="^" />;

  const sponsorsGrid = hasSponsors && (
    <section className={`section ${sxaStyles}`}>
      <div className="section-content container">
        <h1 className="section-content-title">Explore Sponsors</h1>
        <div className="item-grid">
          <div className="grid-filters">
            <span>Filter by</span>
            <button
              type="button"
              className="dropdown-filter"
              id="menu-button-schedule"
              aria-expanded="true"
              aria-haspopup="true"
              aria-label="schedule"
            >
              Schedule
              {downArrow}
            </button>
            <button
              type="button"
              className="dropdown-filter"
              id="menu-button-speakers"
              aria-expanded="true"
              aria-haspopup="true"
              aria-label="speakers"
            >
              Speakers
              {downArrow}
            </button>
            <button
              type="button"
              className="dropdown-filter"
              id="menu-button-category"
              aria-expanded="true"
              aria-haspopup="true"
              aria-label="category"
            >
              Category
              {downArrow}
            </button>
            <button
              type="button"
              className="dropdown-filter"
              id="menu-button-sport"
              aria-expanded="true"
              aria-haspopup="true"
              aria-label="sport"
            >
              Sport
              {downArrow}
            </button>
          </div>

          <div className="grid-content">{sponsors}</div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {sponsorsGrid}
      {pageEditingMissingDatasource}
    </>
  );
};

export const Default = withDatasourceCheck()<SponsorsGridProps>(SponsorsGrid);
