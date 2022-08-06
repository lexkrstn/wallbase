import React, { ReactElement } from "react";
import styles from './carousel.module.scss';

export default function Carousel(): ReactElement {
  return (
    <div className={styles.host}>
      <div className={styles.left}><a href="javascript:void(0)"></a></div>
      <div className={styles.right}><a href="javascript:void(0)"></a></div>
      <ul className={styles.content}>
        <li>
          <a href="#">
            <img src="https://w.wallhaven.cc/full/l3/wallhaven-l3xk6q.jpg" alt="" />
          </a>
        </li>
      </ul>
    </div>
  );
}