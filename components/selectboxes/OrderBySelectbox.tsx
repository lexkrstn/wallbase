import React, { ReactElement } from 'react';

export default function OrderBySelectbox(): ReactElement {
  return (
    <div className="selectbox">
      <input type="hidden" name="orderby" id="orderby" value="date"/>
      <input type="hidden" name="sort" id="sort" value="desc"/>
      <div className="selectbox__selected">
        <span className="selectbox__text">Date</span>
        <span>&nbsp; : &nbsp; </span>
        <a href="javascript:;;" data-name="sort">
          <span className="active" data-value="desc">descending</span>
          <span data-value="asc">ascending</span>
        </a>
      </div>
      <div className="selectbox__menu">
        <ul>
          <li><a href="javascript:;;" data-name="orderby" data-value="relevance">Relevancy</a></li>
          <li className="selected"><a href="javascript:;;" data-name="orderby" data-value="date">Date</a></li>
          <li><a href="javascript:;;" data-name="orderby" data-value="views">Views</a></li>
          <li><a href="javascript:;;" data-name="orderby" data-value="favs">Favorites</a></li>
        </ul>
      </div>
    </div>
  );
}
