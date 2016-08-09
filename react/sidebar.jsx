var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);
var contacts = ["sam","Bob"];
var ContactSidebar = React.createClass({
  getInitialState: function(){
    return{contactNames:contacts}
  },
  add: function(){
    Application.console.log("added");
  },
  delete: function(){
    Application.console.log("delete");
  },
  import: function(){
    Application.console.log("import");
  },
  export: function(){
    Application.console.log("export");
  },
  renderName: function(name){
    return (
      <p>{name}</p>
    );
  },
  render: function() {
      return (
          <div>
            <div id="sidebar-header">
              <div>
                <input id="search-bar" type="text" name ="search" placeholder="Search"></input>
              </div>
              <span id="buttons">
                <input type="button" value="Export" onClick={this.export}></input>
                <input type="button" value="Import" onClick={this.import}></input>
                <input type="button" value="+" onClick={this.add}></input>
              </span>
            </div>
            <div id="contacts-list">
              {this.state.contactNames.map(this.renderName)}
            </div>
          </div>
      );
  },
});

ReactDOM.render(
    <ContactSidebar contactNames={contacts}/>, document.getElementById('sidebar'));
