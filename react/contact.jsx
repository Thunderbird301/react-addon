var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

var PersonalDetails = ["Name","Home Phone", "Mobile", "Email", "Address"];

var WorkDetails = ["Work Phone", "Work Mobile", "Email", "Address"]

var ContactField = React.createClass({
    save: function() {
        this.props.onUserInput(
          this.refs.newText.value, this.props.index
        );
    },
    renderDisplay: function() {
        return (
            <div className="field">
                <p>{this.props.fieldName}
                    : {this.props.fieldContent}</p>
            </div>
        );
    },
    renderForm: function() {
        return (
            <div className="field">
                <p>{this.props.fieldName}: </p>
                <input type="text" ref="newText" defaultValue={this.props.fieldContent} className="form-control" onChange={this.save}></input>
            </div>
        )
    },
    render: function() {
        if (this.props.editing) {
            return this.renderForm();
        } else {
            return this.renderDisplay();
        }
    }
});

var ContactSection = React.createClass({
    getInitialState: function() {
        var fields = [];
        var tempFields = [];
        for(var i = 0; i < this.props.fieldNames.length; i++){
          fields.push({
              id: this.nextId(),
              fieldName: this.props.fieldNames[i],
              fieldContent: "",
              editing: false
          });
          tempFields.push({
              id: this.nextId(),
              fieldName: this.props.fieldNames[i],
              fieldContent: "",
              editing: false
          });
        }
        return {
          fields: fields,
          editing: false,
          tempFields: tempFields
        };
    },
    nextId: function() {
        this.uniqueId = this.uniqueId || 0;
        return this.uniqueId++;
    },
    update: function(newText, i) {
        var fields = this.state.tempFields;
        fields[i].fieldContent = newText;
        this.setState({tempFields: fields});
    },
    save: function() {
        var tempFields = this.state.tempFields;
        var fields = this.state.fields;
        for(var i = 0; i < fields.length; i++) {
          fields[i].fieldContent = tempFields[i].fieldContent;
        }
        this.setState({fields: fields});
        this.setState({editing: false});
    },
    cancel: function() {
      var tempFields = this.state.tempFields;
      var fields = this.state.fields;
      for(var i = 0; i < fields.length; i++) {
        tempFields[i].fieldContent = fields[i].fieldContent;
      }
      this.setState({tempFields: tempFields});
      this.setState({editing: false});
    },
    edit: function() {
        this.setState({editing: true});
    },
    renderDisplay: function(field, i) {
        return (
            <ContactField key={field.id} index={i} fieldContent={field.fieldContent} fieldName = {field.fieldName} editing = {false} ref={"field" + i}></ContactField>
        );
    },
    renderForm: function(field, i) {
        return (
            <ContactField key={field.id} index={i} fieldContent={field.fieldContent} fieldName = {field.fieldName} editing = {true} onUserInput={this.update} ref={"field" + i}></ContactField>
        );
    },
    render: function() {
      if(this.state.editing) {
        return (
          <div className="contact-section">
            <h1>{this.props.sectionName}</h1>
            <button onClick={this.save}>Save</button>
            <button onClick={this.cancel}>Cancel</button>
            {this.state.tempFields.map(this.renderForm)}
          </div>
        )
      } else {
        return (
          <div className="contact-section">
            <h1>{this.props.sectionName}</h1>
            <button id="buttons" onClick={this.edit}>Edit</button>
            <hr></hr>
            {this.state.fields.map(this.renderDisplay)}
          </div>
        )
    }
  }
});

ReactDOM.render(
    <ContactSection sectionName={"Home"} fieldNames={PersonalDetails} />, document.getElementById('personal'));
ReactDOM.render(
    <ContactSection sectionName={"Work"} fieldNames={WorkDetails} />, document.getElementById('work'));
