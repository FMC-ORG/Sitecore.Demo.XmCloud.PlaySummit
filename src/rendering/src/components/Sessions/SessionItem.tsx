import { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { Text } from '@sitecore-content-sdk/nextjs';
import { faCalendar, faClock, faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { getSessionTime } from '../../helpers/DateHelper';
import { GraphQLSession } from 'src/types/session';

type SessionItemProps = {
  session: GraphQLSession;
};

const SessionItem = (props: SessionItemProps): React.JSX.Element => {
  const getImageStyles = (session: GraphQLSession): CSSProperties =>
    session?.image?.jsonValue?.value?.src
      ? {
          backgroundImage: `url(${session.image.jsonValue.value.src})`,
        }
      : {};

  const featuredIcon = props.session.premium?.value && (
    <div className="session-featured" title="Premium">
      <FontAwesomeIcon className="icon-yellow" icon={faStar} />
    </div>
  );

  const day =
    props.session.day?.targetItems &&
    props.session.day.targetItems.length > 0 &&
    props.session.day.targetItems.filter(Boolean).map((day, index) => (
      <p key={index}>
        <span>
          <FontAwesomeIcon className="icon" icon={faCalendar} />
        </span>
        <Text tag="span" field={day.name} />
      </p>
    ));

  const timeSlot = props.session.timeslots?.targetItems &&
    props.session.timeslots.targetItems.length > 0 && (
      <p>
        <span>
          <FontAwesomeIcon className="icon" icon={faClock} />
        </span>
        {getSessionTime(props.session.timeslots.targetItems)}
      </p>
    );

  const speaker =
    props.session.speakers?.targetItems &&
    props.session.speakers.targetItems.filter(Boolean).map((speaker, index) => (
      <p key={index}>
        <span>
          <FontAwesomeIcon className="icon" icon={faUser} />
        </span>
        <Text tag="span" className="speaker-name" field={speaker.name} />
        {(speaker.jobTitle?.value || speaker.role?.value) && (
          <span>
            {' | '}
            <Text tag="span" field={speaker.jobTitle?.value ? speaker.jobTitle : speaker.role} />
          </span>
        )}
      </p>
    ));

  return (
    <Link href={props.session.url.path} passHref className="grid-item">
      <div className="image-hover-zoom" style={getImageStyles(props.session)}></div>
      {featuredIcon}
      <div className="item-details item-details-left">
        <Text tag="div" className="item-title" field={props.session.name} />
        {day}
        {timeSlot}
        {speaker}
      </div>
    </Link>
  );
};

export default SessionItem;
