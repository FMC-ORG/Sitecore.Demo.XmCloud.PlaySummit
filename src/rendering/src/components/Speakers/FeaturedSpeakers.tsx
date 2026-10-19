import { Text, Field, Image, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { GraphQLSpeaker } from 'src/types/speaker';
import Link from 'next/link';

export type FeaturedSpeakersProps = ComponentProps & {
  fields: {
    data: {
      source: {
        numberOfSpeakers: Field<number | string>;
      };
      item: {
        children: {
          results: GraphQLSpeaker[];
        };
      };
    };
  };
};

// GraphQL `field(name:)` returns the datasource number as a string; accept either shape.
const getSpeakerNumberToShow = (props: FeaturedSpeakersProps, available: number): number => {
  const provided = Number(props.fields?.data?.source?.numberOfSpeakers?.value);
  return Number.isFinite(provided) && provided > 0 ? provided : available;
};

const FeaturedSpeakers = (props: FeaturedSpeakersProps): React.JSX.Element => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const hasSpeakers = !!props.fields?.data?.item;

  const sxaStyles = `${props.params?.styles || ''}`;

  !hasSpeakers && console.warn('Missing Datasource Item');

  const pageEditingMissingDatasource = !hasSpeakers && isPageEditing && (
    <p>Missing Datasource Item</p>
  );

  const featured = (props.fields?.data?.item?.children?.results ?? []).filter(
    (speaker) => speaker?.url?.path && speaker.featured?.value
  );
  const speakers = featured
    .slice(0, getSpeakerNumberToShow(props, featured.length))
    .map((speaker, index) => (
      <Link key={index} href={speaker.url.path} passHref>
        <div className="grid-item">
          <div className="item-image">
            <Image
              field={speaker.picture?.jsonValue}
              alt={speaker.name?.value}
              width={265}
              height={265}
              loading="lazy"
            />
          </div>
          <div className="item-details">
            <Text tag="p" className="item-title" field={speaker.name} />
            <Text tag="p" field={speaker.jobTitle} />
          </div>
        </div>
      </Link>
    ));

  const featuredSpeakers = hasSpeakers && (
    <div className={`featured-speakers item-grid ${sxaStyles}`}>
      <div className="grid-content">{speakers}</div>
    </div>
  );

  return (
    <>
      {featuredSpeakers}
      {pageEditingMissingDatasource}
    </>
  );
};

export const Default = FeaturedSpeakers;
