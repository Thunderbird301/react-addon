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
    var className;

    if (contact.id == this.props.currentID) {
      className = "contact-detail-true";
    } else {
      className = "contact-detail";
    }

    return (
      <div id="contact-item" onClick={this.displayContact.bind(null, contact)}>
        <li className={className} key={this.props.contactNames}>{contact.name}</li>
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
                <button id="buttons" onClick={this.export}>Export</button>
                <button id="buttons" onClick={this.import}>Import</button>
                <button id="buttons" onClick={this.add}>+</button>
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
