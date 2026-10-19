import { Link, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import { HeaderProps } from './Header';
import { isXmcDemoLink } from 'src/helpers/XmcDemoNavigation';

export type HeaderContentProps = HeaderProps & {
  pathname?: string;
  asPath?: string;
  query?: string | ParsedUrlQueryInput;
};

const HeaderContent = (props: HeaderContentProps): React.JSX.Element => {
  const router = useRouter();
  const { page } = useSitecore();
  const sxaStyles = `${props.params?.styles || ''}`;
  const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
  // Languages is a custom CM context extension, not a normalized Page property.
  const languages = page.layout.sitecore.context.Languages;
  const availableLanguages = Array.isArray(languages)
    ? languages.filter(
        (language): language is { Name: string } =>
          typeof language?.Name === 'string' && router.locales?.includes(language.Name)
      )
    : [];
  // Show only the current locale when optional language context is unavailable.
  // This does not claim translations exist in any other configured locale.
  const languageList = availableLanguages.length ? availableLanguages : [{ Name: page.locale }];

  const changeLanguage = (lang: string) => {
    if (props.pathname && props.asPath && props.query) {
      router.push({ pathname: props.pathname, query: props.query }, props.asPath, {
        locale: lang,
        shallow: false,
      });
    }
  };

  const links = props.fields?.data?.item?.children?.results
    ?.filter((item) => isXmcDemoLink(item.field?.jsonValue?.value?.href))
    .map((item, index) => (
      <Link key={index} field={item.field.jsonValue} prefetch={false}>
        {item.displayName}
      </Link>
    ));

  return (
    <>
      <div className={`header-eyebrow ${sxaStyles}`}>
        <div className="content">
          <select
            aria-label="Language"
            onChange={(e) => changeLanguage(e.currentTarget.value)}
            className="languagePicker"
            value={page.locale}
          >
            {languageList.map((language) => (
              <option key={language.Name} value={language.Name} className="languageItem">
                {languageNames.of(language.Name)}
              </option>
            ))}
          </select>
          {links}
        </div>
      </div>
      <Placeholder name="jss-header-content" rendering={props.rendering} />
    </>
  );
};

export default HeaderContent;
