import { ComponentProps } from 'lib/component-props';
import { useI18n } from 'next-localization';

// The legacy Boxever welcome flow is archived; keep its approved static CMS fallback.
const DynamicWelcomeMessage = (props: ComponentProps): React.JSX.Element => {
  const { t } = useI18n();
  const message = t('Welcome to PLAY! Summit') || 'Welcome to PLAY! Summit';

  return (
    <section className={`section dynamic-welcome-message ${props.params?.styles || ''}`}>
      <div className="container message-banner">
        <span>{message}</span>
      </div>
    </section>
  );
};

export const Default = DynamicWelcomeMessage;
