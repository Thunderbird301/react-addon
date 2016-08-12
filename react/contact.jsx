var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

var Email = ["Work","Home"];

var Phone = ["Work Phone", "Work Mobile"];

var ContactField = React.createClass({
    saveContent: function() {
        this.props.onUserInput(
          this.refs.newText.value, this.props.index
        );
    },
    saveOption: function(event){
      this.props.onUserSelect(
        event.target.value, this.props.index
      );
    },
    remove: function() {
      this.props.onUserDelete(
        this.props.index
      );
    },
    renderOption: function(option) {
        return (
              <option value={option}>{option}</option>
        );
    },
    renderDisplay: function() {
        return (
            <div id="field">
                <p>{this.props.currentOption}
                    : {this.props.fieldContent}</p>
            </div>
        );
    },
    renderForm: function() {
        return (
            <div id="field">
                <select onChange={this.saveOption} value={this.props.currentOption}>
                  {this.props.options.map(this.renderOption)}
               </select>
                <input type="text" ref="newText" defaultValue={this.props.fieldContent} className="form-control" onChange={this.saveContent}></input>
                <button id="buttons" onClick={this.remove}>-</button>
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
        fields.push({
            id: this.nextId(),
            options: this.props.options,
            currentOption: this.props.options[0],
            fieldContent: "",
            editing: false
        });
        tempFields.push({
            id: this.nextId(),
            options: this.props.options,
            currentOption: this.props.options[0],
            fieldContent: "",
            editing: false
        });

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
    updateContent: function(newText, i) {
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
        for(var i = 0; i < tempFields.length; i++) {
          fields.push({
            fieldContent: tempFields[i].fieldContent,
            currentOption: tempFields[i].currentOption
          });
        }
        this.setState({fields: fields});
        this.setState({editing: false});
    },
    cancel: function() {
      var tempFields = [];
      var fields = this.state.fields;
      for(var i = 0; i < fields.length; i++) {
        tempFields.push({
          fieldContent: fields[i].fieldContent,
          currentOption: fields[i].currentOption
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
            <ContactField key={field.id} index={i} fieldContent={field.fieldContent} currentOption={field.currentOption} editing = {false} ref={"field" + i}></ContactField>
        );
    },
    renderForm: function(field, i) {
        return (
            <ContactField key={field.id} index={i} fieldContent={field.fieldContent} currentOption={field.currentOption} options={field.options} editing = {true} onUserInput={this.updateContent} onUserSelect={this.updateOption} onUserDelete={this.removeField} ref={"field" + i}></ContactField>
        );
    },
    render: function() {
      if(this.state.editing) {
        return (
          <div className="contact-section">
            <h1>{this.props.sectionName}</h1>
            <button id="buttons" onClick={this.save}>Save</button>
            <button id="buttons" onClick={this.cancel}>Cancel</button>
            <hr></hr>
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
    <ContactSection sectionName={"Email"} options={Email} />, document.getElementById('personal'));
ReactDOM.render(
    <ContactSection sectionName={"Phone"} options={Phone} />, document.getElementById('work'));
