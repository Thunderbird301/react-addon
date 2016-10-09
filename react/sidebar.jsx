/** -------------- SIDEBAR -------------------------*/
var ContactSidebar = React.createClass({
  add: function(){
  },
  import: function(){
  },
  export: function(){
  },
  displayContact: function(contact) {
    this.props.viewContact(contact.id, contact.name);
  },
  renderContact: function(contact) {
    return <ContactButton contact={contact} image={this.props.image} viewContact={this.props.viewContact} selected={contact.id == this.props.currentID}/>
  },
  render: function() {
      return (
          <div>
            <div id="sidebar-header">
              <div>
                <input id="search-bar" type="text" name ="search" placeholder="Search"></input>
              </div>
              <span id="sidebar-buttons">
                <input type="button" value="Export" onClick={this.export}></input>
                <input type="button" value="Import" onClick={this.import}></input>
                <input type="button" value="+" onClick={this.add}></input>
              </span>
            </div>
            <br />
            <div id="contacts-list">
              <ul>
                {this.props.contactNames.map(this.renderContact)}
              </ul>
            </div>
          </div>
      );
  },
});
