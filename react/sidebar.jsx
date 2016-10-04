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
    this.props.viewContact(contact.id, contact.name);
  },
  renderName: function(contact){
    var style = {'background-color': ''};

    if(contact.id==this.props.currentID){
      style = {'background-color': '#ccc'};
    }

    return (
      <div id="contact-item" style={style} >
        <li key={this.props.contactNames} onClick={this.displayContact.bind(null, contact)}>{contact.name}</li>
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
              <ul>
                {this.props.contactNames.map(this.renderName)}
              </ul>
            </div>
          </div>
      );
  },
});
