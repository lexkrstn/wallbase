import React, { FC, FormEvent, ReactNode, useCallback, useState } from 'react';
import Router from 'next/router';
import { makeQueryString } from '@/lib/helpers/query-string';
import { DEFAULT_SEARCH_OPTIONS, SearchOptions } from '@/lib/search-options';
import { useSession } from '@/lib/hooks/use-session';
import SearchOptionsBar from '../search-options-bar';
import Footer from './elements/footer';
import Header from './elements/header';
import Userbar from './elements/userbar';
import styles from './regular-layout.module.scss';

interface RegularLayoutProps {
  children: ReactNode;
  defaultSearchOpen?: boolean;
  center?: boolean;
  initialSearchOptions?: SearchOptions;
  /**
   * An optional callback that is executed when the user submits the search
   * options form (either by clicking the Refresh button or pressing enter in
   * the search bar). If the callback is not set the default behaviour is to
   * redirect to search page with options set as GET query parameters.
   */
  onSearch?: (so: SearchOptions) => void;
}

const RegularLayout: FC<RegularLayoutProps> = ({
  children, defaultSearchOpen = false, center = false,
  initialSearchOptions = DEFAULT_SEARCH_OPTIONS, onSearch,
}) => {
  const mainClasses = [styles.main];
  if (center) mainClasses.push(styles.center);
  const [searchOpen, setSearchOpen] = useState(defaultSearchOpen);
  const { user, loading: userLoading } = useSession();

  const handleSubmitSearchForm = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const searchOptions = (Object.keys(initialSearchOptions) as (keyof SearchOptions)[])
      .reduce((accum, key) => {
        const item = form.elements.namedItem(key);
        if (!item) return accum;
        const { value } = item as HTMLInputElement;
        return {
          ...accum,
          [key]: typeof DEFAULT_SEARCH_OPTIONS[key] === 'number'
            ? parseInt(value, 10)
            : value,
        };
      }, {} as Partial<SearchOptions>);
    if (onSearch) {
      onSearch(searchOptions as SearchOptions);
      return;
    }
    Router.push(`/wallpapers?${makeQueryString(searchOptions)}`);
  }, [onSearch]);

  return (
    <div className={styles.host}>
      <Userbar user={user} userLoading={userLoading} wide docked />
      <form
        className={styles.form}
        onSubmit={handleSubmitSearchForm}
        action="/wallpapers"
      >
        <Header
          searchOpen={searchOpen}
          onSearchOpen={setSearchOpen}
          defaultQuery={initialSearchOptions.query}
        />
        {searchOpen && (
          <SearchOptionsBar defaultValue={initialSearchOptions} />
        )}
      </form>
      <main className={mainClasses.join(' ')}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

RegularLayout.displayName = 'RegularLayout';

export default RegularLayout;
