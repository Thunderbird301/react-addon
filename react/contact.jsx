var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

var PersonalDetails = ["Name","Home Phone", "Mobile", "Email", "Address"];

var WorkDetails = ["Work Phone", "Work Mobile", "Email", "Address"]

var ContactField = React.createClass({
    getInitialState: function() {
        return {editing: false}
    },
    save: function() {
        this.props.onChange(ReactDOM.findDOMNode(this.refs.newText).value, this.props.index);
        this.setState({editing: false});
    },
    edit: function() {
        this.setState({editing: true});
    },
    renderDisplay: function() {
        return (
            <div className="field">
                <p>{this.props.fieldName}
                    : {this.props.content}</p>
                <button onClick={this.edit}>Edit</button>
            </div>
        );
    },
    renderForm: function() {
        return (
            <div className="field">
                <p>{this.props.fieldName}: </p>
                <input type="text" ref="newText" defaultValue={this.props.content} className="form-control"></input>
                <button onClick={this.save}>Save</button>
            </div>
        )
    },
    render: function() {
        if (this.state.editing) {
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
              content: undefined
          });
        }
        return {
          fields: fields
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
    eachField: function(field, i) {
        return (
            <ContactField key={field.id} index={i} content={field.content} fieldName = {field.fieldName} onChange={this.update}></ContactField>
        );
    },
    render: function() {
        return (
          <div className="contact-section">
            <h1>{this.props.sectionName}</h1>
            {this.state.fields.map(this.eachField)}
          </div>
        );
    }
});

ReactDOM.render(
    <ContactSection sectionName={"Home"} fieldNames={PersonalDetails}/>, document.getElementById('personal'));
ReactDOM.render(
    <ContactSection sectionName={"Work"} fieldNames={WorkDetails}/>, document.getElementById('work'));
