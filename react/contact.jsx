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
                    : {this.props.content}</p>
            </div>
        );
    },
    renderForm: function() {
        return (
            <div className="field">
                <p>{this.props.fieldName}: </p>
                <input type="text" ref="newText" defaultValue={this.props.content} className="form-control" onChange={this.save}></input>
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
        for(var i = 0; i < this.props.fieldNames.length; i++){
          fields.push({
              id: this.nextId(),
              fieldName: this.props.fieldNames[i],
              content: undefined,
              editing: false
          });
        }
        return {
          fields: fields,
          editing: false
        };
    },
    nextId: function() {
        this.uniqueId = this.uniqueId || 0;
        return this.uniqueId++;
    },
    update: function(newText, i) {
        var fields = this.state.fields;
        fields[i].content = newText;
        this.setState({fields: fields});
    },
    save: function() {
        var fields = this.state.fields;
        this.setState({fields: fields}, function() {
          for (var ref in this.refs) {
             var field = ReactDOM.findDOMNode(this.refs[ref]);
             field.onChange();
          }
        }.bind(this));
        this.setState({editing: false});
    },
    edit: function() {
        this.setState({editing: true});
    },
    renderDisplay: function(field, i) {
        return (
            <ContactField key={field.id} index={i} content={field.content} fieldName = {field.fieldName} editing = {false} ref={"field" + i}></ContactField>
        );
    },
    renderForm: function(field, i) {
        return (
            <ContactField key={field.id} index={i} content={field.content} fieldName = {field.fieldName} editing = {true} onUserInput={this.update} ref={"field" + i}></ContactField>
        );
    },
    render: function() {
      if(this.state.editing) {
        return (
          <div className="contact-section">
            <h1>{this.props.sectionName}</h1>
            <button onClick={this.save}>Save</button>
            {this.state.fields.map(this.renderForm)}
          </div>
        )
      } else {
        return (
          <div className="contact-section">
            <h1>{this.props.sectionName}</h1>
            <button onClick={this.edit}>Edit</button>
            {this.state.fields.map(this.renderDisplay)}
          </div>
        )
    }
  }
});

ReactDOM.render(
    <ContactSection sectionName={"Home"} fieldNames={PersonalDetails}/>, document.getElementById('personal'));
ReactDOM.render(
    <ContactSection sectionName={"Work"} fieldNames={WorkDetails}/>, document.getElementById('work'));
