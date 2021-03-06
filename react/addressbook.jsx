/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Fields options
var Email = {name: "Email", options: ["Work", "Home"], key: "email"};
var Phone = {name: "Phone", options: ["Mobile", "Home", "Work", "Fax", "Pager"], key: "tel"};
var Address = {name: "Address", options: ["Home", "Work"], key: "adr"};
var Webpage = {name: "Webpage", options: ["Home", "Work"], key: "url"};
var Chat = {name: "Chat", options: ["Google Talk", "AIM (R)", "Yahoo", "Skype", "QQ", "MSN", "ICQ", "Jabber ID", "IRC Nick"], key: ""};


var ContactSections = [Email, Phone, Address, Webpage, Chat];
var PersonalDetails = ["name", "nickName", "displayName", "birthday"];

var AddressBook = React.createClass({
  getInitialState: function() {
    var contactSections = ContactParser.createEmptyContactSections(this.props.contactSections);
    var tempContactSections = ContactParser.createEmptyContactSections(this.props.contactSections);
    var personalSection = ContactParser.createEmptyPersonalSection(this.props.personalDetails);
    var tempPersonalSection = ContactParser.createEmptyPersonalSection(this.props.personalDetails);

    return {
      contactsList: [],
      selectedIds: [],
      contact: null,
      name: null,
      tempContact: null,
      editing: false,
      photoUrl: "images/1.jpg",
      contactSections: contactSections,
      tempContactSections: tempContactSections,
      personalSection: personalSection,
      tempPersonalSection: tempPersonalSection,
      modals: {delete: false}
    }
  },
  componentDidMount: function() {
    this.loadInContacts();
  },
  componentWillMount: function() {
    ReactModal.setAppElement('body');
  },
  loadInContacts: function() {
    DatabaseConnection.loadInContacts(this);
  },
  addContact: function() {
    // TO DO
  },
  import: function(file) {
    var self = this;
    Addressbook.open(indexedDB).then(AddressbookUtil.importContacts).then(self.loadInContacts);
  },
  export: function() {
    DatabaseConnection.export(this.state.selectedIds);
  },
  edit: function() {
    this.setState({editing: true});
  },
  deleteContact: function() {
    this.closeModal('delete');
    DatabaseConnection.deleteContact(this.state.selectedIds[0], this);
  },
  addField: function(index) {
    ContactParser.addContactDetail(this.state.tempContact, index, this.state.tempContactSections, this);
  },
  removeField: function(index, fieldID) {
    ContactParser.removeContactDetail(this.state.tempContact, index, this.state.tempContactSections, fieldID, this)
  },
  save: function() {
    DatabaseConnection.updateContact(this.state.tempContact, this);
  },
  cancel: function() {
    ContactParser.cancelContactEdit(this);
  },
  updateContent: function(newText, index, fieldID) {
    ContactParser.updateContent(this, index, fieldID, newText);
  },
  updatePersonalDetail: function(detail, newText) {
    ContactParser.updatePersonalDetail(this, detail, newText);
  },
  updateOption: function(option, index, fieldID) {
    ContactParser.updateOption(this, option, index, fieldID);
  },
  updateProfileImage: function(image) {
    ContactParser.updateProfileImage(this, image);
  },
  setContactID: function(event, id, name) {
    var selected = this.state.selectedIds;
    if ((event.ctrlKey || event.metaKey) && selected.length > 0) {
      var index = selected.indexOf(id);
      if (index == -1) { // selects contact
        selected.push(id);
      } else { // deselects contact
        selected.splice(index, 1);
      }
      this.setState({
        selectedIds: selected
      });
    } else {
      DatabaseConnection.getContactDetails(id, this);
      this.setState({
        selectedIds: [id],
        name: name
      });
    }
  },
  openModal: function(type) {
    var modals = this.state.modals;
    modals[type] = true;
    this.setState({modals: modals});
  },
  closeModal: function(type) {
    var modals = this.state.modals;
    modals[type] = false;
    this.setState({modals: modals});
  },
  editingDisplay: function() {
    if (!this.state.editing) {
      return (<div id="main-buttons">
        <button className="buttons" onClick={this.edit}>Edit</button>
        <button className="buttons" onClick={this.openModal.bind(null, 'delete')}>Delete</button>
      </div>);
    } else {
      return (<div id="main-buttons">
        <button className="buttons" onClick={this.save}>Save</button>
        <button className="buttons" onClick={this.cancel}>Cancel</button>
      </div>);
    }
  },
  renderModals: function() {
    if(this.state.modals.delete) {
      return <DeleteModal name={this.state.name} noDelete={this.closeModal.bind(null, 'delete')} confirmDelete={this.deleteContact} />;
    }
  },
  renderContactSection: function(contactSection) {
    if (this.state.editing) {
    return(<ContactSection type={contactSection.name} options={contactSection.options} editing={this.state.editing} index={contactSection.index} fields={this.state.tempContactSections[contactSection.index].fields}
      save={this.save} add={this.addField} remove={this.removeField} updateOption={this.updateOption} updateContent={this.updateContent}/>);// render individual contact section
    } else {
      return(<ContactSection type={contactSection.name} options={contactSection.options} editing={this.state.editing} index={contactSection.index} fields={contactSection.fields}
        save={this.save}/>);// render individual contact section
    }
  },
  renderNoContact: function() {
    return (<div id="sidebar">
      <ContactSidebar contactNames={this.state.contactsList} viewContact={this.setContactID} add={this.addContact} image={this.state.photoUrl}
        import={this.import} export={this.export}/>
    </div>);
  },
  renderContactDisplay: function() {
    return (<div>
      <div id="sidebar">
        <ContactSidebar contactNames={this.state.contactsList} viewContact={this.setContactID} selected={this.state.selectedIds} image={this.state.photoUrl}
          add={this.addContact} import={this.import} export={this.export}/>
      </div>
      <div id="main">
        <div id="main-header">
          <Header personalDetails={this.state.personalSection} onUserInput={this.updatePersonalDetail} onNewImage={this.updateProfileImage} editing={this.state.editing} image={this.state.photoUrl}/>
          {this.editingDisplay()}
        </div>
        <div id="main-contact">
          {this.renderModals()}
          {this.state.contactSections.map(this.renderContactSection)}
        </div>
      </div>
    </div>);
  },
  render: function() {
    if (this.state.selectedIds.length == 0) {
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

ReactDOM.render(<AddressBook contactSections = {ContactSections} personalDetails = {PersonalDetails}/>, document.getElementById('addressBook'));
