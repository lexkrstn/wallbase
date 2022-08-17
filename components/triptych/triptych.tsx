import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import { TagWithCategory } from '../../interfaces/tag';
import { Statistics } from '../../lib/stats';
import { thousands } from '../../lib/helpers/formatters';
import Button from '../buttons/button';
import PopularTagList from '../popular-tag-list';
import StatisticsPane from '../statistics-pane';
import styles from './triptych.module.scss';
import patreonImage from './patreon-button.png';

interface TriptychProps {
  popularTags: TagWithCategory[] | null,
  stats: Statistics;
}

const Triptych: FC<TriptychProps> = ({ popularTags, stats }) => (
  <div className={styles.host}>

    <section className={styles.fold}>
      <header className={styles.header}>
        <h2 className={styles.title}>Popular tags</h2>
        <span className={styles.desc}>(this week)</span>
        <span className={styles.headerRightAddon}>
          <Button xsmall dark rounded href="/tags">more tags</Button>
        </span>
      </header>
      {!popularTags && (
        <div className={styles.spinner}></div>
      )}
      {!!popularTags && (
        <PopularTagList tags={popularTags} />
      )}
    </section>

    <section className={styles.fold}>
      <header className={styles.header}>
        <h2 className={styles.title}>Users</h2>
        <ul className={styles.tabs}>
          <li className={styles.activeTab}>
            <button type="button">Statistics</button>
          </li>
          <li>
            <Link href="/users">
              <a>
                {'Online: '}
                <span className={styles.number}>{thousands(stats.usersOnline)}</span>
              </a>
            </Link>
          </li>
        </ul>
      </header>
      <StatisticsPane stats={stats} />
    </section>

    <section className={styles.fold}>
      <header className={styles.header}>
        <h2 className={styles.title}>Donations</h2>
      </header>
      <div className={styles.text}>
        <p>In order to keep this site as much responsive and alive as possible I need help.</p>
        <p>Wallbase generates around ~500GB of transfer per day. The whole traffic is sliced into two servers and this configuration is doing pretty good at the moment. Basically everything you see here (from setting up linux/Node.js/PostgreSQL/..., optimizations, design, coding is handled by me alone.</p>
        <p>If you appreciate what I am doing, please consider a donation. Any amout is a big help for me.</p>
      </div>
      <div className={styles.paypal}>
        <a href="https://patreon.com" target="blank" rel="nofollow">
          <Image src={patreonImage} width="180" height="42" />
        </a>
        <br/>
        Thank you!
      </div>
    </section>

  </div>
);

export default React.memo(Triptych);
