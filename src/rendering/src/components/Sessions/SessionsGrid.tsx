import { useSitecore } from '@sitecore-content-sdk/nextjs';
import useSessionFilters from 'src/hooks/useSessionFilters';
import { ComponentProps } from 'lib/component-props';
import { GraphQLSession } from 'src/types/session';
import SessionItem from './SessionItem';

type SessionsGridProps = ComponentProps & {
  fields: {
    data: {
      item: {
        children: {
          results: GraphQLSession[];
        };
      };
    };
  };
};

const SessionsGrid = (props: SessionsGridProps): React.JSX.Element => {
  const { page } = useSitecore();
  const { search, sort } = useSessionFilters();
  const isPageEditing = page.mode.isEditing;
  const hasSessions = !!props.fields?.data?.item;

  const sxaStyles = `${props.params?.styles || ''}`;

  !hasSessions && console.warn('Missing Datasource Item');

  const pageEditingMissingDatasource = !hasSessions && isPageEditing && (
    <p>Missing Datasource Item</p>
  );

  const query = isPageEditing ? '' : search.trim().toLocaleLowerCase();
  const matchingSessions = (props.fields?.data?.item?.children?.results ?? []).filter((session) =>
    session?.name?.value?.toLocaleLowerCase().includes(query)
  );
  const startHour = (session: GraphQLSession) => {
    const hours = (session.timeslots?.targetItems ?? [])
      .map((slot) => {
        const hour = parseInt(
          typeof slot?.name === 'string' ? slot.name : (slot?.name?.value ?? '')
        );
        return hour < 7 ? hour + 12 : hour;
      })
      .filter(Number.isFinite);
    return hours.length ? Math.min(...hours) : Number.POSITIVE_INFINITY;
  };
  matchingSessions.sort((a, b) =>
    sort === 'name'
      ? a.name.value.localeCompare(b.name.value)
      : (a.day?.targetItems?.[0]?.name?.value ?? '').localeCompare(
          b.day?.targetItems?.[0]?.name?.value ?? ''
        ) || startHour(a) - startHour(b)
  );
  const sessions = matchingSessions.map((session, index) => (
    <SessionItem key={index} session={session} />
  ));

  const sessionsGrid = hasSessions && (
    <div className={`item-grid sessions-grid ${sxaStyles}`}>
      <p className="sessions-count" role="status">
        {matchingSessions.length} sessions
      </p>
      <div className="grid-content">{sessions}</div>
    </div>
  );

  return (
    <>
      {sessionsGrid}
      {pageEditingMissingDatasource}
    </>
  );
};

export const Default = SessionsGrid;
