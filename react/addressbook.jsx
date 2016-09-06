// import {ContactSidebar} from "./contactSection.jsx";

// Fields options
var Email = {name: "Email", options: ["Work", "Home"]};
var Phone = {name: "Phone", options: ["Mobile", "Home", "Work", "Fax", "Pager"]};
var Address = {name: "Address", options: ["Home", "Work"]};
var Webpage = {name: "Webpage", options: ["Home", "Work"]};
var Chat = {name: "Chat", options: ["Google Talk", "AIM (R)", "Yahoo", "Skype", "QQ", "MSN", "ICQ", "Jabber ID", "IRC Nick"]};

var ContactSections = [Email, Phone, Address, Webpage, Chat];

var AddressBook = React.createClass({
  getInitialState: function() {
    var contactSections = [];
    for (var i = 0; i < this.props.contactSections; i++) {
        contactSections.push({
          name: this.props.contactSections[i].name,
          options: this.props.contactSections[i].options,
          fields: []
        });
    }
    return {
      contactNames: [],
      currentPersonID: -1,
      editing: false,
      contactSections: contactSections
    }
  },
  componentDidMount: function() {
    var cSide = this;
    Addressbook.open(indexedDB).then(function(addrbook) {
      addrbook.getNameAndId().then((contacts) => {
        var contactNames = [];
        for(var i = 0; i < contacts.length; i++) {
          contactNames.push({name: contacts[i].name, id: contacts[i].uuid});
        }
        cSide.setState({contactNames: contactNames});
      });
    });
  },
  setContactID: function(id) {
    console.log("SETTING ID TO " + id);
    console.trace();
    this.setState({currentPersonID: id});
  },
  renderContactSection: function(contactSection) {
    return(<ContactSection type={contactSection.name} options={contactSection.option} editing={this.editing} fields={contactSection.fields}/>);// render individual contact section
  },
  renderNoContact: function() {
    return (<div id="sidebar">
      <ContactSidebar contactNames={this.state.contactNames} viewContact={this.setContactID}/>
    </div>);
  },
  renderContactDisplay: function() {
    return (<div>
      <div id="sidebar">
        <ContactSidebar contactNames={this.state.contactNames} viewContact={this.setContactID}/>
      </div>
      <div id="main">
        {this.state.contactSections.map(this.renderContactSection)}
      </div>
    </div>);
  },
  render: function() {
    if (this.state.currentPersonID == -1) {
      console.log("NO CONTACT VIEW");
      console.trace();
      return this.renderNoContact();
    } else {
      console.log("CONTACT VIEW");
      console.trace();
      return this.renderContactDisplay();
    }
   }
});

ReactDOM.render(<AddressBook contactSections = {ContactSections}/>, document.getElementById('addressBook'));