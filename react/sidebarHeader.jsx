/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
* @desc Provides a header to the contact sidebar. It allows importing and exporting
* of contacts as well as creating new ones. It also provides a search bar for filtering contacts
**/
var SidebarHeader = (props) => (
  <div id="sidebar-header">
    <div>
      <input id="search-bar" type="text" name ="search" placeholder="Search"></input>
    </div>
    <span id="sidebar-buttons">
      <button className="buttons" onClick={props.export}>Export</button>
      <button className="buttons" onClick={props.import}>Import</button>
      <button className="buttons" onClick={props.add}>+</button>
    </span>
  </div>
);
