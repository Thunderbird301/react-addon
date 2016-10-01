// Fields options
var Email = {name: "Email", options: ["Work", "Home"], key: "email"};
var Phone = {name: "Phone", options: ["Mobile", "Home", "Work", "Fax", "Pager"], key: "tel"};
var Address = {name: "Address", options: ["Home", "Work"], key: "adr"};
var Webpage = {name: "Webpage", options: ["Home", "Work"], key: "url"};
var Chat = {name: "Chat", options: ["Google Talk", "AIM (R)", "Yahoo", "Skype", "QQ", "MSN", "ICQ", "Jabber ID", "IRC Nick"], key: ""};


var ContactSections = [Email, Phone, Address, Webpage, Chat];

var AddressBook = React.createClass({
  getInitialState: function() {
    var contactSections = this.createEmptyContactSections();
    var tempContactSections = this.createEmptyContactSections();
    var personalSection = this.createEmptyPersonalSection();
    var tempPersonalSection = this.createEmptyPersonalSection();
    return {
      contactNames: [],
      currentPersonID: -1,
      editing: false,
      contactSections: contactSections,
      tempContactSections: tempContactSections,
      personalSection: personalSection,
      tempPersonalSection: tempPersonalSection
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
  getContactDetails: function(id) {
    var self = this;
    var contactSections = this.createEmptyContactSections();
    var tempContactSections = this.createEmptyContactSections();
    var personalSection = this.createEmptyPersonalSection();
    var tempPersonalSection = this.createEmptyPersonalSection();

    Addressbook.open(indexedDB).then(function(addrbook) {
      addrbook.getById(id).then(function(contact) {
        var details = contact.jcards[0].getAllProperties();
        for (var i = 0; i < details.length; i++) {
          self.parseProperty(details[i], contactSections, tempContactSections, personalSection, tempPersonalSection);
        }
        self.setState({
          contactSections: contactSections,
          tempContactSections: tempContactSections,
          personalSection: personalSection,
          tempPersonalSection: tempPersonalSection
        });
      });
    });
  },
  parseProperty: function(property, cFields, tFields, pField, tpField) {
    var name = property.name;
    var type = property.getParameter("type");
    var content = property.getFirstValue();
    if (Array.isArray(type)) {
      type = type[0];
    }
    if (type) {
      type = type.charAt(0).toUpperCase() + type.slice(1);
    }

    switch (name) {
      case "email":
        this.addFieldProperty(0, type, content, cFields);
        this.addFieldProperty(0, type, content, tFields);
        break;
      case "tel":
        this.addFieldProperty(1, type, content, cFields);
        this.addFieldProperty(1, type, content, tFields);
        break;
      case "adr":
        this.addFieldProperty(2, type, content, cFields);
        this.addFieldProperty(2, type, content, tFields);
        break;
      case "url":
        this.addFieldProperty(3, type, content, cFields);
        this.addFieldProperty(3, type, content, tFields);
        break;
      case "fn":
        pField.name = content;
        tpField.name = content;
        break;
      case "nn":
        pField.nickName = content;
        tpField.nickName = content;
        break;
      case "dn":
        pField.displayName = content;
        tpField.displayName = content;
        break;
      case "bday":
        pField.birthday = content.toString();
        tpField.birthday = content.toJSDate().toISOString();
        break;
      default:
        break;
    }
  },
  addFieldProperty: function(index, currentOption, content, fields) {
    var fieldID = fields[index].fields.length;
    fields[index].fields.push({
      currentOption: currentOption,
      content: content,
      fieldID: fieldID
    });
  },
  edit: function() {
    this.setState({editing: true});
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
      tempSection.fields.push({
          currentOption: tempSection.options[0],
          content: content,
          fieldID: fieldID
      });
      var tempSections = this.state.tempContactSections;
      tempSections[index] = tempSection;
      this.setState({tempContactSections: tempSections});
  },
  removeField: function(index, fieldID) {
      var tSection = this.state.tempContactSections[index];
      tSection.fields.splice(fieldID, 1);
      var tempSections = this.state.tempContactSections;
      tempSections[index] = tSection;
      this.setState({tempContactSections: tempSections});
  },
  save: function() {
      var cSections = [];
      var tSections = this.state.tempContactSections;
      for (var i = 0; i < tSections.length; i++) {
          var fields = [];
          for (var j = 0; j < tSections[i].fields.length; j++) {
            fields.push({
              currentOption: tSections[i].fields[j].currentOption,
              content: tSections[i].fields[j].content
            });
          }
          cSections.push({
            name: tSections[i].name,
            options: tSections[i].options,
            fields: fields,
            index: i
          });
      }
      var tpSection = this.state.tempPersonalSection;
      var pSection = this.createEmptyPersonalSection();
      for (var key in tpSection) {
        pSection[key] = tpSection[key];
      }
      this.setState({
        contactSections: cSections,
        personalSection: pSection,
        editing: false
      });
  },
  cancel: function() {
      var tSections = [];
      var cSections = this.state.contactSections;
      for (var i = 0; i < cSections.length; i++) {
        var fields = [];
        for (var j = 0; j < cSections[i].fields.length; j++) {
          fields.push({
            currentOption: cSections[i].fields[j].currentOption,
            content: cSections[i].fields[j].content
          });
        }
          tSections.push({
            name: cSections[i].name,
            options: cSections[i].options,
            fields: fields,
            index: i
          });
      }
      this.setState({tempContactSections: tSections});
      this.setState({editing: false});
  },
  updateContent: function(newText, index, fieldID) {
    var tSection = this.state.tempContactSections[index];
    tSection.fields[fieldID].content = newText;
    var tSections = this.state.tempContactSections;
    tSections[index] = tSection;
    this.setState({tempContactSections: tSections});
  },
  updatePersonalDetail: function(detail, newText) {
    var tDetails = this.state.tempPersonalSection;
    tDetails[detail] = newText;
    this.setState({tempPersonalSection: tDetails});
  },
  updateOption: function(option, index, fieldID) {
      var tSection = this.state.tempContactSections[index];
      tSection.fields[fieldID].currentOption = option;
      var tSections = this.state.tempContactSections;
      tSections[index] = tSection;
      this.setState({tempContactSections: tSections});
  },
  setContactID: function(id) {
    this.getContactDetails(id);
    this.setState({
      currentPersonID: id,
    });
  },
  editingDisplay: function() {
    if (!this.state.editing) {
      return (<div>
        <button id="buttons" onClick={this.edit}>Edit</button>
      </div>);
    } else {
      return (<div>
        <button id="buttons" onClick={this.save}>Save</button>
        <button id="buttons" onClick={this.cancel}>Cancel</button>
      </div>);
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
      <ContactSidebar contactNames={this.state.contactNames} viewContact={this.setContactID}/>
    </div>);
  },
  renderContactDisplay: function() {
    return (<div>
      <div id="sidebar">
        <ContactSidebar contactNames={this.state.contactNames} viewContact={this.setContactID} currentID={this.state.currentPersonID}/>
      </div>
      <div id="main">
        <Header personalDetails={this.state.personalSection} onUserInput={this.updatePersonalDetail} editing={this.state.editing} image='images/1.jpg'/>
        {this.editingDisplay()}
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
