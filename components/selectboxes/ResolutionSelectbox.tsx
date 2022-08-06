import React, { ReactElement } from 'react';

export default function ResolutionSelectbox(): ReactElement {
  return (
    <div className="selectbox">
      <input type="hidden" name="res" id="res" value=""/>
      <input type="hidden" name="res_op" id="res_op" value="eq"/>
      <div className="selectbox__selected">
        <a href="javascript:;;" data-name="res_op">
          <span className="active" data-value="eq">Exactly</span>
          <span data-value="gt">At least</span>
        </a>
        <span>&nbsp; : &nbsp; </span>
        <span className="selectbox__text">All</span>
      </div>
      <div className="selectbox__menu">
        <ul>
          <li className="selected"><a href="javascript:;;" data-name="res" data-value="">All</a></li>
        </ul>
        <div className="selectbox__two-folds">
          <div className="selectbox__two-folds-fold">
            <div className="selectbox__header">Standard</div>
            <ul>
              <li><a href="javascript:;" data-name="res" data-value="800x600">800x600</a></li>
              <li><a href="javascript:;" data-name="res" data-value="1024x768">1024x768</a></li>
              <li><a href="javascript:;" data-name="res" data-value="1280x960">1280x960</a></li>
              <li><a href="javascript:;" data-name="res" data-value="1280x1024">1280x1024</a></li>
              <li><a href="javascript:;" data-name="res" data-value="1400x1050">1400x1050</a></li>
              <li><a href="javascript:;" data-name="res" data-value="1600x1200">1600x1200</a></li>
              <li><a href="javascript:;" data-name="res" data-value="2560x2048">2560x2048</a></li>
            </ul>
          </div>
          <div className="selectbox__two-folds-fold">
            <div className="selectbox__header">Widescreen</div>
            <ul>
              <li><a href="javascript:;" data-name="res" data-value="1024x600">1024x600</a></li>
              <li><a href="javascript:;" data-name="res" data-value="1280x800">1280x800</a></li>
              <li><a href="javascript:;" data-name="res" data-value="1366x768">1366x768</a></li>
              <li><a href="javascript:;" data-name="res" data-value="1440x900">1440x900</a></li>
              <li><a href="javascript:;" data-name="res" data-value="1600x900">1600x900</a></li>
              <li><a href="javascript:;" data-name="res" data-value="1680x1050">1680x1050</a></li>
              <li><a href="javascript:;" data-name="res" data-value="1920x1080">1920x1080</a></li>
              <li><a href="javascript:;" data-name="res" data-value="1920x1200">1920x1200</a></li>
              <li><a href="javascript:;" data-name="res" data-value="2560x1440">2560x1440</a></li>
              <li><a href="javascript:;" data-name="res" data-value="2560x1600">2560x1600</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
