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
  createEmptyContactSections: function() {
    var contactSections = [];
    for (var i = 0; i < this.props.contactSections.length; i++) {
        contactSections.push({
          name: this.props.contactSections[i].name,
          options: this.props.contactSections[i].options,
          fields: [],
          index: i
        });
    }
    return contactSections;
  },
  createEmptyPersonalSection: function() {
    return {name: "", nickname: "", displayName: "", birthday: ""};
  },
  componentDidMount: function() {
    this.loadInContacts();
  },
  componentWillMount: function() {
    ReactModal.setAppElement('body');
  },
  loadInContacts: function() {
    var cSide = this;
    Addressbook.open(indexedDB).then(function(addrbook) {
      addrbook.getAllNameIdAndPhoto().then((contacts) => {
        var contactsList = [];
        for(var i = 0; i < contacts.length; i++) {
          contactsList.push({name: contacts[i].name, id: contacts[i].id, photo: contacts[i].photo});
        }
        contactsList.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase());
        cSide.setState({contactsList: contactsList});
      });
    });
  },
  addContact: function() {
    
  },
  import: function(file) {
    var self = this;
    Addressbook.open(indexedDB).then(AddressbookUtil.importContacts).then(self.loadInContacts);
  },
  export: function() {
      var selectedIds = this.state.selectedIds;
      if (selectedIds.length > 0) {
      Addressbook.open(indexedDB).then(function(addrbook) {
        Promise.all(selectedIds.map((id) => addrbook.getById(id))).then(function(contacts) {
          AddressbookUtil.exportContact(contacts);
        })
      });
    }
  },
  edit: function() {
    this.setState({editing: true});
  },  
  deleteContact: function() {
    this.closeModal('delete');
    var self = this;
    Addressbook.open(indexedDB).then(function(addrbook) {
      var idToDelete = self.state.selectedIds[0];
      addrbook.deleteById(idToDelete).then((contact) => {
        // display notification banner
        var conList = ContactParser.deleteContact(self.state.contactsList, idToDelete);
        self.setState({
          selectedIds: [],
          contactsList: conList
        });
      });
    });
  },
  addField: function(index) {
      var tempSection = this.state.tempContactSections[index];
      var content = "";
      if(tempSection.name == "Address"){
        content = [];
        for(var i = 0; i < 5; i++) {
            content.push("");
        }
      }
      var fieldID = tempSection.fields.length;
      var tempContact = this.state.tempContact;
      var property = ContactParser.addContactDetail(tempContact, tempSection.key, content, tempSection.options[0]);
      tempSection.fields.push({
          currentOption: tempSection.options[0],
          content: content,
          fieldID: fieldID,
          jCardIndex: 0,
          property: property
      });
      var tempSections = this.state.tempContactSections;
      tempSections[index] = tempSection;

      this.setState({
        tempContactSections: tempSections,
        tempContact: tempContact
      });
  },
  removeField: function(index, fieldID) {
      var tSection = this.state.tempContactSections[index];
      var field = tSection.fields.splice(fieldID, 1)[0];
      var tempSections = this.state.tempContactSections;
      tempSections[index] = tSection;

      var tempContact = this.state.tempContact;
      ContactParser.removeContactDetail(tempContact, field.property, field.jCardIndex);

      this.setState({
        tempContactSections: tempSections,
        tempContact: tempContact
      });
  },
  save: function() {
      var cSections = [];
      var tSections = this.state.tempContactSections;
      var tempContact = this.state.tempContact;
      var tpSection = this.state.tempPersonalSection;
      var pSection = ContactParser.createEmptyPersonalSection(this.props.personalDetails);
      var conList = this.state.contactsList;
      var name = this.state.name;
      var id = this.state.selectedIds[0];

      for (var key in tpSection) {
        if(key == "name" && (name != tpSection[key].content)) {
          name = tpSection[key].content;
          tempContact.name = name;
          ContactParser.rename(id, name, conList);
        }
        pSection[key] = tpSection[key];
      }

      var contact = conList.find(function(contact) {
        return contact.id == id;
      });
      contact.photo = ContactParser.getPhotoURL(tempContact.photo);

      var contact = new Contact(tempContact.toJSON());
      for (var i = 0; i < tSections.length; i++) {
          var fields = [];
          for (var j = 0; j < tSections[i].fields.length; j++) {
            fields.push({
              currentOption: tSections[i].fields[j].currentOption,
              content: tSections[i].fields[j].content,
              fieldID: tSections[i].fields[j].fieldID,
              jCardIndex: tSections[i].fields[j].jCardIndex,
              property: ContactParser.findCloneProperty(tSections[i].fields[j].property, contact)
            });
          }
          cSections.push({
            name: tSections[i].name,
            options: tSections[i].options,
            fields: fields,
            index: i,
            key: tSections[i].key
          });
      }

      this.setState({
        name: name,
        contactsList: conList,
        contact: contact,
        tempContact: tempContact,
        contactSections: cSections,
        personalSection: pSection,
        editing: false
      });
      ContactParser.updateContact(tempContact, this);
  },
  cancel: function() {
      var tSections = [];
      var cSections = this.state.contactSections;
      var contact = this.state.contact;
      var tempContact = new Contact(contact.toJSON());
      for (var i = 0; i < cSections.length; i++) {
        var fields = [];
        for (var j = 0; j < cSections[i].fields.length; j++) {
          fields.push({
            currentOption: cSections[i].fields[j].currentOption,
            content: cSections[i].fields[j].content,
            fieldID: cSections[i].fields[j].fieldID,
            jCardIndex: cSections[i].fields[j].jCardIndex,
            property: ContactParser.findCloneProperty(cSections[i].fields[j].property, tempContact)
          });
        }
          tSections.push({
            name: cSections[i].name,
            options: cSections[i].options,
            fields: fields,
            index: i,
            key: cSections[i].key
          });
      }
      this.setState({
        tempContactSections: tSections,
        editing: false,
        tempContact: tempContact
      });
  },
  updateContent: function(newText, index, fieldID) {
    var tSection = this.state.tempContactSections[index];
    var field = tSection.fields[fieldID];
    field.content = newText;
    var tSections = this.state.tempContactSections;
    tSections[index] = tSection;
    var tempContact = this.state.tempContact;
    ContactParser.updateValue(tempContact, field.property, field.jCardIndex, newText);
    this.setState({
      tempContactSections: tSections,
      tempContact: tempContact
    });
  },
  updatePersonalDetail: function(detail, newText) {
    var tDetails = this.state.tempPersonalSection;
    tDetails[detail].content = newText;
    var tempContact = this.state.tempContact;
    ContactParser.updateValue(tempContact, tDetails[detail].property, tDetails[detail].jCardIndex, newText);
    this.setState({
      tempPersonalSection: tDetails,
      tempContact: tempContact
    });
  },
  updateOption: function(option, index, fieldID) {
      var tSection = this.state.tempContactSections[index];
      var field = tSection.fields[fieldID];
      field.currentOption = option;
      var tSections = this.state.tempContactSections;
      var tempContact = this.state.tempContact;
      tSections[index] = tSection;
      ContactParser.updateOption(tempContact, field.property, field.jCardIndex, option);
      this.setState({
        tempContactSections: tSections,
        tempContact: tempContact
      });
  },
  updateProfileImage: function(image) {
    var imageFile = image.files[0];
    var tempContact = this.state.tempContact;
    tempContact.photo = imageFile;
    var contactsList = this.state.contactsList;
    this.setState({
      tempContact: tempContact,
      contactsList: contactsList
    });
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
      ContactParser.getContactDetails(id, this);
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
