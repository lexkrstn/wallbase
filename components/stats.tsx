import React, { ReactElement } from 'react';
import Button from './buttons/button';
import styles from './stats.module.scss';

export default function Stats(): ReactElement {
  return (
    <div className={styles.host}>
      <div className={styles.row}>
        All wallpapers: <span>665,883</span>
      </div>
      <div className={styles.rowInner}>
        Wallpapers / General: <span>346,937</span>
      </div>
      <div className={styles.rowInner}>
        Anime / Manga: <span>135,535</span>
      </div>
      <div className={styles.rowInner}>
        Wallpapers / People: <span>183,411</span>
      </div>

      <div className={styles.rowDark}>
        Images added today: <span>582</span>
      </div>

      <div className={styles.row}>
        Registered users: <span>61,485</span>
      </div>
      <div className={styles.rowInner}>
        Users registered last 24h: <span className="white">272</span>
      </div>
      <div className={styles.rowBtn}>
        <Button rounded xsmall dark href="/users">show users</Button>
      </div>

      <div className={styles.rowDark}>
        Unique favorite wallpapers: <span className="white">344,906</span><br/>
        Favorites: <span className="white">1,128,381</span>
      </div>

      <div className={styles.row}>
        All subscriptions: <span>283</span>
      </div>
      <div className={styles.rowInner}>
        Subscribed users: <span>43</span>
      </div>
      <div className={styles.rowInner}>
        Subscribed collections: <span>26</span>
      </div>
      <div className={styles.rowInner}>
        Subscribed tags: <span>214</span>
      </div>

      <div className={styles.rowDark}>
        Tags: <span className="white">8,162</span>
      </div>
    </div>
  );
}
