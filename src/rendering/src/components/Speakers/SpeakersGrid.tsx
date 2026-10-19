import Link from 'next/link';
import { Text, Image, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { GraphQLSpeaker } from 'src/types/speaker';

export type SpeakersGridProps = ComponentProps & {
  fields: {
    data: {
      item: {
        children: {
          results: GraphQLSpeaker[];
        };
      };
    };
  };
};

const SpeakersGrid = (props: SpeakersGridProps): React.JSX.Element => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const hasSpeakers = !!props.fields?.data?.item;

  const sxaStyles = `${props.params?.styles || ''}`;

  !hasSpeakers && console.warn('Missing Datasource Item');

  const pageEditingMissingDatasource = !hasSpeakers && isPageEditing && (
    <p>Missing Datasource Item</p>
  );

  // Featured speakers are presented by FeaturedSpeakers; tolerate deleted/unpublished targets.
  const speakers = (props.fields?.data?.item?.children?.results ?? [])
    .filter((speaker) => speaker?.url?.path && !speaker.featured?.value)
    .map((speaker, index) => (
      <Link key={index} href={speaker.url.path} passHref className="speakers-grid-speaker">
        <div className="speaker-image">
          <Image
            field={speaker.picture?.jsonValue}
            alt={speaker.name?.value}
            width={265}
            height={265}
          />
        </div>
        <Text className="speaker-name" tag="p" field={speaker.name} />
        <Text tag="p" field={speaker.jobTitle} />
      </Link>
    ));

  const speakersGrid = hasSpeakers && (
    <div className={`speakers-grid container ${sxaStyles}`}>{speakers}</div>
  );

  return (
    <>
      {speakersGrid}
      {pageEditingMissingDatasource}
    </>
  );
};

export const Default = SpeakersGrid;
