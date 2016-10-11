/** -------------- SIDEBAR -------------------------*/
var ContactSidebar = React.createClass({
  add: function() {
  },
  delete: function() {
  },
  import: function() {
  },
  export: function() {
    if (this.props.currentID) {
      this.props.export();
    }
  },
  selectContact: function(event, contact) {
    this.props.viewContact(event, contact.id, contact.name);
  },
  renderName: function(contact){
    var className;

    if (contact.id == this.props.currentID) {
      className = "true";
    } else {
      className = "";
    }

    return (
      <div id="contact-name" className={className} onClick={(event)=>this.selectContact(event, contact)}>
        <ProfileImage type="sidebar" image={contact.photo}/>
        <li className="contact-detail" key={this.props.contactNames}>{contact.name}</li>
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
                <button className="buttons" onClick={this.export}>Export</button>
                <button className="buttons" onClick={this.import}>Import</button>
                <button className="buttons" onClick={this.add}>+</button>
              </span>
            </div>
            <br />
            <div id="contacts-list">
              <ul>
                {this.props.contactNames.map(this.renderName)}
              </ul>
            </div>
          </div>
      );
  },
});
