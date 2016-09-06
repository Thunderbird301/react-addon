/** -------------- CONTACT SECTION -------------------------*/
var ContactSection = React.createClass({
    // getInitialState: function() {
    //     var fields = [];
    //     var tempFields = [];
    //     var content = "";
    //     if(this.props.type == "Address"){
    //       content = [];
    //       for(var i = 0; i < 5; i++) {
    //           content.push("");
    //       }
    //     }
    //     fields.push({
    //         id: this.nextId(),
    //         options: this.props.options,
    //         currentOption: this.props.options[0],
    //         type: this.props.type,
    //         fieldContent: content,
    //         editing: false
    //     });
    //     tempFields.push({
    //         id: this.nextId(),
    //         options: this.props.options,
    //         currentOption: this.props.options[0],
    //         type: this.props.type,
    //         fieldContent: content,
    //         editing: false
    //     });

    //     return {fields: fields, editing: false, tempFields: tempFields};
    // },
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
        if (this.props.editing) {
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
                    {this.state.fields.map(this.renderDisplay)}//fix this
                </div>
            )
        }
    }
});
