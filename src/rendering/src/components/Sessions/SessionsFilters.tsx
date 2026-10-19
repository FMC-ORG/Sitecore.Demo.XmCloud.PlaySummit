import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { useI18n } from 'next-localization';
import useSessionFilters from 'src/hooks/useSessionFilters';

const SessionsFilters = (props: ComponentProps): React.JSX.Element => {
  const { page } = useSitecore();
  const { search, sort, changeSearch, changeSort } = useSessionFilters();
  const { t } = useI18n();

  return (
    <section className={`section pb-4 pt-12 ${props.params?.styles || ''}`}>
      <div className="section-content form item-grid sessions-filters container">
        <h2 className="section-content-title">{t('Explore sessions') || 'Explore sessions'}</h2>
        <div className="filters-row">
          <div className="filters-col">
            <input
              type="search"
              aria-label={t('Search sessions') || 'Search sessions'}
              placeholder="Search sessions..."
              value={search}
              disabled={page.mode.isEditing}
              onChange={(event) => changeSearch(event.currentTarget.value)}
            />
            {search && (
              <button type="button" onClick={() => changeSearch('')}>
                {t('Clear search') || 'Clear search'}
              </button>
            )}
          </div>
          <div className="filters-col sort-by-col">
            <select
              aria-label={t('Sort sessions') || 'Sort sessions'}
              className="dropdown-filter sort-by-dropdown"
              value={sort}
              disabled={page.mode.isEditing}
              onChange={(event) => changeSort(event.currentTarget.value)}
            >
              <option value="chronological">{t('Chronological') || 'Chronological'}</option>
              <option value="name">{t('Session name') || 'Session name'}</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Default = SessionsFilters;
