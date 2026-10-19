import Link from 'next/link';
import { Image, withDatasourceCheck, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { Sponsor } from 'src/types/sponsor';

export type SelectedSponsorsGridProps = ComponentProps & {
  fields: {
    Sponsors: Sponsor[];
  };
};

const SelectedSponsorsGrid = (props: SelectedSponsorsGridProps): React.JSX.Element => {
  const { page } = useSitecore();

  const isPageEditing = page.mode.isEditing;
  const selected = (props?.fields?.Sponsors ?? []).filter((sponsor) => sponsor?.url);
  const hasSponsors = selected.length > 0;

  const sxaStyles = `${props.params?.styles || ''}`;

  !hasSponsors && console.warn('Missing Datasource Item');

  const pageEditingMissingDatasource = !hasSponsors && isPageEditing && (
    <p>Missing Datasource Item</p>
  );

  const sponsors = selected.map((sponsor, index) => (
    <Link key={index} href={sponsor.url} passHref className="sponsor">
      <div className="sponsor-image">
        <Image
          field={sponsor.fields?.Logo}
          alt={sponsor.fields?.Name?.value}
          width={180}
          height={80}
          loading="lazy"
        />
      </div>
    </Link>
  ));

  const selectedSponsorsGrid = hasSponsors && (
    <div className={`selected-sponsors-grid ${sxaStyles}`}>{sponsors}</div>
  );

  return (
    <>
      {selectedSponsorsGrid}
      {pageEditingMissingDatasource}
    </>
  );
};

export const Default = withDatasourceCheck()<SelectedSponsorsGridProps>(SelectedSponsorsGrid);
