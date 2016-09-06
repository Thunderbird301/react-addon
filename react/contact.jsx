/** -------------- SIDEBAR -------------------------*/
var ContactSidebar = React.createClass({
  // getInitialState: function(){
  //   return{contactNames: [] };
  //   },
  // componentDidMount: function() {
  //   var cSide = this;
  //   Addressbook.open(indexedDB).then(function(addrbook) {
  //     addrbook.getNameAndId().then((contacts) => {
  //       var contactNames = [];
  //       for(var i = 0; i < contacts.length; i++) {
  //         contactNames.push(contacts[i].name);
  //       }
  //       cSide.setState({contactNames: contactNames});
  //     });
  //   });
  // },
  add: function(){
    Application.console.log("added");
  },
  delete: function(){
    Application.console.log("delete");
  },
  import: function(){
    Application.console.log("import");
  },
  export: function(){
    Application.console.log("export");
  },
  displayContact: function(contact) {
    this.props.viewContact(contact.id);
  },
  renderName: function(contact, i){
    return (
      <input type="button" value={contact.name} key={this.props.contactNames} onClick={this.displayContact}></input>
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
                <input id="buttons" type="button" value="Export" onClick={this.export}></input>
                <input id="buttons" type="button" value="Import" onClick={this.import}></input>
                <input id="buttons" type="button" value="+" onClick={this.add}></input>
              </span>
            </div>
            <div id="contacts-list">
              {this.props.contactNames.map(this.renderName)}
            </div>
          </div>
      );
  },
});

/** -------------- CONTACT FIELDS -------------------------*/

// Fields options
var Email = {name: "Email", options: ["Work", "Home"]};
var Phone = {name: "Phone", options: ["Mobile", "Home", "Work", "Fax", "Pager"]};
var Address = {name: "Address", options: ["Home", "Work"]};
var Webpage = {name: "Webpage", options: ["Home", "Work"]};
var Chat = {name: "Chat", options: ["Google Talk", "AIM (R)", "Yahoo", "Skype", "QQ", "MSN", "ICQ", "Jabber ID", "IRC Nick"]};

var ContactSections = [Email, Phone, Address, Webpage, Chat];

var ContactField = React.createClass({
    saveContent: function() {
      if(this.props.type != "Address") {
        this.props.onUserInput(this.refs.newText.value, this.props.index);
      } else {
        var address = [this.refs.street.value, this.refs.city.value, this.refs.postalCode.value, this.refs.region.value, this.refs.country.value];
        this.props.onUserInput(address, this.props.index);
      }
    },
    saveOption: function(event) {
        this.props.onUserSelect(event.target.value, this.props.index);
    },
    remove: function() {
        this.props.onUserDelete(this.props.index);
    },
    renderAddressForm: function() {
        return (
            <div id="field">
                <select onChange={this.saveOption} value={this.props.currentOption}>
                    {this.props.options.map(this.renderOption)}
                </select>
                <input type="text" ref="street" defaultValue={this.props.fieldContent[0]} className="form-control"></input>
                <input type="text" ref="city" defaultValue={this.props.fieldContent[1]} className="form-control"></input>
                <input type="text" ref="postalCode" defaultValue={this.props.fieldContent[2]} className="form-control"></input>
                <input type="text" ref="region" defaultValue={this.props.fieldContent[3]} className="form-control"></input>
                <input type="text" ref="country" defaultValue={this.props.fieldContent[4]} className="form-control"></input>
                <button id="buttons" onClick={this.remove}>-</button>
            </div>
        );
    },
    renderAddressField: function(content) {
        return (
            <div id="field">
                <p>{content}</p>
            </div>
        );
    },
    renderAddressDisplay: function() {
      return (
        <div id = "field">
           <p>{this.props.currentOption}</p>
          {this.props.fieldContent.map(this.renderAddressField)}
        </div>
      );
    },
    renderOption: function(option) {
        return (
            <option value={option}>{option}</option >
        );
    },
    renderDisplay : function() {
        if (this.props.type == "Address") {
            return this.renderAddressDisplay();
        }
        return (
            <div id="field">
                <p>{this.props.currentOption}
                    : {this.props.fieldContent}</p>
            </div>
        );
    }, renderForm : function() {
        if (this.props.type == "Address") {
            return this.renderAddressForm();
        }
        return (
            <div id="field">
                <select onChange={this.saveOption} value={this.props.currentOption}>
                    {this.props.options.map(this.renderOption)}
                </select>
                <input type="text" ref="newText" defaultValue={this.props.fieldContent} className="form-control" onChange={this.saveContent}></input>
                <button id="buttons" onClick={this.remove}>-</button>
            </div>
        )
    }, render : function() {
        if (this.props.editing) {
            return this.renderForm();
        } else {
            return this.renderDisplay();
        }
    }
});

/** -------------- CONTACT SECTION -------------------------*/
var ContactSection = React.createClass({
    getInitialState: function() {
        var fields = [];
        var tempFields = [];
        var content = "";
        if(this.props.type == "Address"){
          content = [];
          for(var i = 0; i < 5; i++) {
              content.push("");
          }
        }
        fields.push({
            id: this.nextId(),
            options: this.props.options,
            currentOption: this.props.options[0],
            type: this.props.type,
            fieldContent: content,
            editing: false
        });
        tempFields.push({
            id: this.nextId(),
            options: this.props.options,
            currentOption: this.props.options[0],
            type: this.props.type,
            fieldContent: content,
            editing: false
        });

        return {fields: fields, editing: false, tempFields: tempFields};
    },
    add: function() {
        var tempFields = this.state.tempFields;
        var content = "";
        if(this.props.type == "Address"){
          content = [];
          for(var i = 0; i < 5; i++) {
              content.push("");
          }
        }
        tempFields.push({
            id: this.nextId(),
            options: this.props.options,
            currentOption: this.props.options[0],
            type: this.props.type,
            fieldContent: content,
            editing: false
        });
        this.setState({tempFields: tempFields});
    },
    nextId: function() {
        this.uniqueId = this.uniqueId || 0;
        return this.uniqueId++;
    },
    updateContent: function(newText, i) {
        Application.console.log(newText);
        var fields = this.state.tempFields;
        fields[i].fieldContent = newText;
        this.setState({tempFields: fields});
    },
    updateOption: function(option, i) {
        var fields = this.state.tempFields;
        fields[i].currentOption = option;
        this.setState({tempFields: fields});
    },
    removeField: function(i) {
        var fields = this.state.tempFields;
        fields.splice(i, 1);
        this.setState({tempFields: fields});
    },
    save: function() {
        var tempFields = this.state.tempFields;
        var fields = [];
        for (var i = 0; i < tempFields.length; i++) {
            fields.push({
                id: tempFields[i].id,
                options: tempFields[i].options,
                currentOption: tempFields[i].currentOption,
                type: this.props.type,
                fieldContent: tempFields[i].fieldContent,
                editing: false
            });
        }
        this.setState({fields: fields});
        this.setState({editing: false});
    },
    cancel: function() {
        var tempFields = [];
        var fields = this.state.fields;
        for (var i = 0; i < fields.length; i++) {
            tempFields.push({
                id: fields[i].id,
                options: fields[i].options,
                currentOption: fields[i].currentOption,
                type: this.props.type,
                fieldContent: fields[i].fieldContent,
                editing: false
            });
        }
        this.setState({tempFields: tempFields});
        this.setState({editing: false});
    },
    edit: function() {
        this.setState({editing: true});
    },
    renderDisplay: function(field, i) {
        return (
            <ContactField key={field.id} index={i} fieldContent={field.fieldContent} currentOption={field.currentOption} options={field.options} type={field.type} editing={false} ref={"field" + i}></ContactField>
        );
    },
    renderForm: function(field, i) {
        return (
            <ContactField key={field.id} index={i} fieldContent={field.fieldContent} currentOption={field.currentOption} options={field.options} type={field.type} editing={true} onUserInput={this.updateContent} onUserSelect={this.updateOption} onUserDelete={this.removeField} ref={"field" + i}></ContactField>
        );
    },
    render: function() {
        if (this.state.editing) {
            return (
                <div className="contact-section">
                    <h3>{this.props.type}</h3>
                    <button id="buttons" onClick={this.save}>Save</button>
                    <button id="buttons" onClick={this.cancel}>Cancel</button>
                    <hr></hr>
                    {this.state.tempFields.map(this.renderForm)}
                    <button id="buttons" onClick={this.add}>Add</button>
                </div>
            )
        } else {
            return (
                <div className="contact-section">
                    <h3>{this.props.type}</h3>
                    <button id="buttons" onClick={this.edit}>Edit</button>
                    <hr></hr>
                    {this.state.fields.map(this.renderDisplay)}
                </div>
            )
        }
    }
});

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
    Application.console.log("SETTING ID TO " + id);
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
      Application.console.log("NO CONTACT VIEW");
      return this.renderNoContact();
    } else {
      Application.console.log("CONTACT VIEW");
      return this.renderContactDisplay();
    }
  }
});

ReactDOM.render(<AddressBook contactSections = {ContactSections}/>, document.getElementById('addressBook'));

// ReactDOM.render(
//     <ContactSidebar/>, document.getElementById('sidebar'));
// ReactDOM.render(
//     <ContactSection type={"Email"} options={Email}/>, document.getElementById('personal'));
// ReactDOM.render(
//     <ContactSection type={"Phone"} options={Phone}/>, document.getElementById('work'));
// ReactDOM.render(
//     <ContactSection type={"Address"} options={Address}/>, document.getElementById('address'));
// ReactDOM.render(
//     <ContactSection type={"Webpage"} options={Webpage}/>, document.getElementById('web-pages'));
// ReactDOM.render(
//     <ContactSection type={"Chat"} options={Chat}/>, document.getElementById('chat'));