import { Field } from '@sitecore-content-sdk/nextjs';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type SocialIconProps = {
  Link?: Field<string>;
  Icon: IconProp;
};

function SocialIcon(props: SocialIconProps): React.JSX.Element {
  if (!props?.Link?.value) {
    return <></>;
  }

  return (
    <a href={props.Link.value}>
      <FontAwesomeIcon className="social-icon" icon={props.Icon} />
    </a>
  );
}

export default SocialIcon;
