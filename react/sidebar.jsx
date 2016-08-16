var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

var ContactSidebar = React.createClass({
  getInitialState: function(){
    return{contactNames: [] };
    },
  componentDidMount: function() {
    this.setState({
      contactNames: Addressbook.open(indexedDB).then(function(addrbook) {
        return addrbook.getNameAndId().then((contacts) => {
          var contactNames = [];
          for(var i = 0; i < contacts.length; i++) {
            contactNames.push(contacts[i].name);
            Application.console.log(contacts[i].name);
          }
          return contactNames;
        });
      })
    });
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
              <span id="sidebar-buttons">
                <input id="buttons" type="button" value="Export" onClick={this.export}></input>
                <input id="buttons" type="button" value="Import" onClick={this.import}></input>
                <input id="buttons" type="button" value="+" onClick={this.add}></input>
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
    <ContactSidebar/>, document.getElementById('sidebar'));
