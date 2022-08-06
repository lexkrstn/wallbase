import React, { ReactElement } from 'react';

export default function PageSizeSelectbox(): ReactElement {
  return (
    <div className="selectbox" style={{width:'150px'}}>
      <input type="hidden" name="pagesize" id="pagesize" value="24"/>
      <div className="selectbox__selected">
        <span className="selectbox__text">20</span>
      </div>
      <div className="selectbox__menu">
        <ul>
          <li className="selected"><a href="javascript:;;" data-name="pagesize" data-value="24">24</a></li>
          <li><a href="javascript:;;" data-name="pagesize" data-value="36">36</a></li>
          <li><a href="javascript:;;" data-name="pagesize" data-value="48">48</a></li>
          <li><a href="javascript:;;" data-name="pagesize" data-value="60">60</a></li>
        </ul>
      </div>
    </div>
  );
}
