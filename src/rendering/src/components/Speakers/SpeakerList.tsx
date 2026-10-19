import Link from 'next/link';
import { Text, Image } from '@sitecore-content-sdk/nextjs';
import { Speaker } from 'src/types/speaker';
import InfoText from '../NonSitecore/InfoText';
import { faBuilding, faMapMarkerAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'next-localization';

const SpeakerListItem = (speaker: Speaker): React.JSX.Element => {
  const fields = speaker.fields ?? ({} as Speaker['fields']);
  const featuredSpeakerCssClass = fields.Featured?.value ? 'featured' : '';
  const { t } = useI18n();

  const jobTitle = fields.JobTitle?.value && (
    <InfoText Icon={faUserTie}>
      <Text tag="span" field={fields.JobTitle} />
    </InfoText>
  );

  const company = fields.Company?.value && (
    <InfoText Icon={faBuilding}>
      <Text tag="span" field={fields.Company} />
    </InfoText>
  );

  const location = fields.Location?.value && (
    <InfoText Icon={faMapMarkerAlt}>
      <Text tag="span" field={fields.Location} />
    </InfoText>
  );

  return (
    <div className={`information-block ${featuredSpeakerCssClass}`}>
      <div className="info-col-left">
        <Image field={fields.Picture} alt={fields.Name?.value} width={275} height={275} />
      </div>
      <div className="info-col-content">
        <Text field={fields.Name} tag="div" className="info-col-title" />
        {jobTitle}
        {company}
        {location}
        {speaker.url && (
          <div className="info-col-cta">
            <Link href={speaker.url} className="btn-main">
              {t('Learn more') || 'Learn more'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

type SpeakerListProps = {
  fields: {
    Speakers: Speaker[];
  };
};

const SpeakerList = (props: SpeakerListProps): React.JSX.Element => {
  const { t } = useI18n();
  const available = (props?.fields?.Speakers ?? []).filter(Boolean);
  const speakers =
    available.length > 0 ? (
      <div className="speaker-list">
        {available.map((speaker, index) => (
          <SpeakerListItem {...speaker} key={index} />
        ))}
      </div>
    ) : (
      <p>{t('No speakers') || 'No speakers'}</p>
    );

  return <>{speakers}</>;
};

export const Default = SpeakerList;
