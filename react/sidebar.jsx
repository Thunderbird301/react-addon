/** -------------- SIDEBAR -------------------------*/
var ContactSidebar = React.createClass({
  renderContact: function(contact) {
    return <ContactButton contact={contact} image={this.props.image} viewContact={this.props.viewContact} selected={contact.id == this.props.currentID}/>
  },
  render: function() {
      return (
          <div>
            <SidebarHeader add={this.add} export={this.export} import={this.import}/>
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
