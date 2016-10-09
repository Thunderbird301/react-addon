var SidebarHeader = (props) => (
  <div id="sidebar-header">
    <div>
      <input id="search-bar" type="text" name ="search" placeholder="Search"></input>
    </div>
    <span id="sidebar-buttons">
      <input type="button" value="Export" onClick={props.export}></input>
      <input type="button" value="Import" onClick={props.import}></input>
      <input type="button" value="+" onClick={props.add}></input>
    </span>
  </div>
);