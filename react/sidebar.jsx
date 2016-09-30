/** -------------- SIDEBAR -------------------------*/
var ContactSidebar = React.createClass({
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
  renderName: function(contact){
    return (
      <div>
        <input id="contact-item" type="button" value={contact.name} key={this.props.contactNames} onClick={this.displayContact.bind(null, contact)}></input>
      </div>      
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
                <input type="button" value="Export" onClick={this.export}></input>
                <input type="button" value="Import" onClick={this.import}></input>
                <input type="button" value="+" onClick={this.add}></input>
              </span>
            </div>
            <br />
            <div id="contacts-list">
              {this.props.contactNames.map(this.renderName)}
            </div>
          </div>
      );
  },
});