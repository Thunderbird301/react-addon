/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** -------------- CONTACT SECTION -------------------------*/
var ContactSection = React.createClass({
    add: function() {
        this.props.add(this.props.index);
    },
    removeField: function(fieldID) {
      this.props.remove(this.props.index, fieldID);
    },
    updateContent: function(newText, i) {
        this.props.updateContent(newText, this.props.index, i)
    },
    updateOption: function(option, i) {
        this.props.updateOption(option, this.props.index, i)
    },
    renderDisplay: function(field, i) {
        return (
            <ContactField key={field.id} index={i} fieldContent={field.content} currentOption={field.currentOption} options={this.props.options} type={this.props.type} editing={false} ref={"field" + i}></ContactField>
        );
    },
    renderForm: function(field, i) {
        return (
            <ContactField key={field.id} index={i} fieldContent={field.content} currentOption={field.currentOption} options={this.props.options} type={this.props.type} editing={true} onUserInput={this.updateContent} onUserSelect={this.updateOption} onUserDelete={this.removeField} ref={"field" + i}></ContactField>
        );
    },
    render: function() {
        if (this.props.editing) {
            return (
                <div className="contact-section">
                    <div className="contact-group">{this.props.type}</div>
                    {this.props.fields.map(this.renderForm)}
                    <button className="buttons" onClick={this.add}>Add</button>
                </div>
            )
        } else {
            return (
                <div className="contact-section">
                    <div className="contact-group">{this.props.type}</div>
                    {this.props.fields.map(this.renderDisplay)}
                </div>
            )
        }
    }
});
