import React, { ReactElement } from 'react';

export default function AspectSelectbox(): ReactElement {
  return (
    <div className="selectbox">
      <input type="hidden" name="aspect" id="aspect" value=""/>
      <div className="selectbox__selected">
        <span className="selectbox__text">All</span>
      </div>
      <div className="selectbox__menu">
        <ul>
          <li className="selected"><a href="javascript:;;" data-name="aspect" data-value="">All <span>(default)</span></a></li>
          <li><a href="javascript:;;" data-name="aspect" data-value="1.33">4:3 <span>1280x960, 1600x1200...</span></a></li>
          <li><a href="javascript:;;" data-name="aspect" data-value="1.25">5:4 <span>1280x1024, 2560x2048...</span></a></li>
          <li><a href="javascript:;;" data-name="aspect" data-value="1.77">16:9 <span>1280x720, 1920x1080...</span></a></li>
          <li><a href="javascript:;;" data-name="aspect" data-value="1.60">16:10 <span>1280x800, 1920x1200...</span></a></li>
          <li><a href="javascript:;;" data-name="aspect" data-value="1.70">Netbook <span>1024x600, 1280x768...</span></a></li>
          <li><a href="javascript:;;" data-name="aspect" data-value="2.50">Dual <span>2560x1024...</span></a></li>
          <li><a href="javascript:;;" data-name="aspect" data-value="3.20">Dual wide <span>3360x1050, 3840x1200...</span></a></li>
          <li><a href="javascript:;;" data-name="aspect" data-value="0.99">Portrait <span></span></a></li>
        </ul>
      </div>
    </div>
  );
}
