/**
* @desc Provides a header to the contact sidebar. It allows importing and exporting
* of contacts as well as creating new ones. It also provides a search bar for filtering contacts
**/
var SidebarHeader = (props) => (
  <div id="sidebar-header">
    <div>
      <input id="search-bar" type="text" name="search" value={props.searchText} placeholder="Search" onChange={(event)=>props.search(event.target.value)}></input>
    </div>
    <span id="sidebar-buttons">
      <button className="buttons" onClick={props.export}>Export</button>
      <button className="buttons" onClick={props.import}>Import</button>
      <button className="buttons" onClick={props.add}>+</button>
    </span>
  </div>
);