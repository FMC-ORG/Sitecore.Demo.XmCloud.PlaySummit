import { useSitecore } from '@sitecore-content-sdk/nextjs';

type IntegrationUnavailableProps = {
  name: string;
  styles?: string;
};

const IntegrationUnavailable = ({
  name,
  styles,
}: IntegrationUnavailableProps): React.JSX.Element | null => {
  const { page } = useSitecore();
  if (!page.mode.isEditing) return null;

  return (
    <div className={`component integration-unavailable ${styles || ''}`}>
      <div className="component-content">
        <p role="status">{name} is not included in this XMC-only demo.</p>
      </div>
    </div>
  );
};

export default IntegrationUnavailable;
