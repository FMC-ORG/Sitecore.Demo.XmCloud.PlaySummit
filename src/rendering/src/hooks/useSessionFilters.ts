import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/** URL-backed state shared by separately authored filter/grid renderings. */
export default function useSessionFilters() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('chronological');

  useEffect(() => {
    if (router.isReady) {
      setSearch(typeof router.query.q === 'string' ? router.query.q : '');
      setSort(router.query.sort === 'name' ? 'name' : 'chronological');
    }
  }, [router.isReady, router.query.q, router.query.sort]);

  const changeSearch = (value: string) => {
    setSearch(value);
    // Read asPath only in the client event, preserving the public CMS URL/rewrite.
    const url = new URL(router.asPath, 'http://localhost');
    if (value) url.searchParams.set('q', value);
    else url.searchParams.delete('q');
    void router.replace(`${url.pathname}${url.search}${url.hash}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const changeSort = (value: string) => {
    setSort(value);
    const url = new URL(router.asPath, 'http://localhost');
    if (value === 'name') url.searchParams.set('sort', value);
    else url.searchParams.delete('sort');
    void router.replace(`${url.pathname}${url.search}${url.hash}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  return { search, sort, changeSearch, changeSort };
}
