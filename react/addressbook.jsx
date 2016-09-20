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
    return {
      contactNames: [],
      currentPersonID: -1,
      editing: false,
      contactSections: contactSections,
      tempContactSections: tempContactSections
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

    Addressbook.open(indexedDB).then(function(addrbook) {
      addrbook.getById(id).then(function(contact) {
        var details = contact.jcards[0].getAllProperties();
        for (var i = 0; i < details.length; i++) {
          self.parseProperty(details[i], contactSections, tempContactSections);
        }
        self.setState({
          contactSections: contactSections,
          tempContactSections: tempContactSections
        });
      });
    });
  },
  parseProperty: function(property, cFields, tFields) {
    var name = property.jCal[0];
    var content = property.jCal[3];
    switch (name) {
      case "email":
        var fieldID = cFields[0].fields.length;
        cFields[0].fields.push({
          currentOption: "Work",
          content: content,
          fieldID: fieldID
        });
        break;
      case "tel":
        var fieldID = cFields[1].fields.length;
        cFields[1].fields.push({
          currentOption: "Work",
          content: content,
          fieldID: fieldID
        }); // this breaks everything
        break;
      default:
        break;
    }
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
      this.setState({contactSections: cSections});
      this.setState({editing: false});
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
      save={this.save} add={this.add} remove={this.removeField} updateOption={this.updateOption} updateContent={this.updateContent}/>);// render individual contact section
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
        <ContactSidebar contactNames={this.state.contactNames} viewContact={this.setContactID}/>
      </div>
      <div id="main">
        <Header fn="John" ln="Doe" dn="jdoe" nn="JDog" bday="12/06/1996" image='images/1.jpg'/>
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