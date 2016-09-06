/** -------------- SIDEBAR -------------------------*/
var ContactSidebar = React.createClass({
  // getInitialState: function(){
  //   return{contactNames: [] };
  //   },
  // componentDidMount: function() {
  //   var cSide = this;
  //   Addressbook.open(indexedDB).then(function(addrbook) {
  //     addrbook.getNameAndId().then((contacts) => {
  //       var contactNames = [];
  //       for(var i = 0; i < contacts.length; i++) {
  //         contactNames.push(contacts[i].name);
  //       }
  //       cSide.setState({contactNames: contactNames});
  //     });
  //   });
  // },
  add: function(){
  },
  delete: function(){
  },
  import: function(){
  },
  export: function(){
  },
  displayContact: function(contact) {
    this.props.viewContact(contact.id);
  },
  renderName: function(contact, i){
    return (
      <input type="button" value={contact.name} key={this.props.contactNames} onClick={this.displayContact.bind(null, contact)}></input>
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
              {this.props.contactNames.map(this.renderName)}
            </div>
          </div>
      );
  },
});