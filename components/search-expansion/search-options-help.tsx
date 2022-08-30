import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FC } from 'react';
import styles from './search-options-help.module.scss';

const SearchOptionsHelp: FC = () => (
  <div className={styles.host}>
    <div className={styles.desc}>
      <div className={styles.icon}>
        <FontAwesomeIcon icon={faExclamationCircle} />
      </div>
      Search options below apply to the search input field.
      <br/>
      {'Examples: '}
      <span>jessica alba not:biel page:46</span>
      {' or '}
      <span>&quot;ergo proxy&quot; imgtype:png imgtype:gif</span>
      {' or '}
      <span>nature uploader:users</span>
    </div>
    <div className={styles.table}>
      <div className={styles.row}>
        <div className={styles.cell}>
          <span className={styles.key}>some keywords</span>
          <br/>
          Just type keywords to find wallpapers tagged with at least one of them
          (every word is a keyword).
        </div>
        <div className={styles.cell}>
          <span className={styles.key}>&quot;some words&quot;</span>
          <br/>
          Use quotation marks to make the query more strict (the words are
          treated as a keyword).
        </div>
        <div className={styles.cell}>
          <span className={styles.key}>not</span>
          :
          <span className={styles.value}>word</span>
          <br/>
          Exclude keywords you don&apos;t want to appear in the results page.
          To use spaces wrap your words in quotation marks.
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.cell}>
          <span className={styles.key}>uploader</span>
          :
          <span className={styles.value}>[users|bot]</span>
          <br/>
          Select uploaders. Bot - 4chan imageboard users, users - users uploaded
          directly to wallbase.
        </div>
        <div className={styles.cell}>
          <span className={styles.key}>page</span>
          :
          <span className={styles.value}>123</span>
          <br/>
          Jump directly to the specified results page.
        </div>
        <div className={styles.cell}>
          <span className={styles.key}>imgtype</span>
          :
          <span className={styles.value}>[jpg|png|gif]</span>
          <br/>
          Search only images of a specific type (JPG, PNG or GIF).
          This option may be used multiple times in one query.
        </div>
      </div>
    </div>
  </div>
);

SearchOptionsHelp.displayName = 'SearchOptionsHelp';

export default SearchOptionsHelp;
