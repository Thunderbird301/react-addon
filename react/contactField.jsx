/** -------------- CONTACT FIELDS -------------------------*/

var ContactField = React.createClass({
    saveContent: function(content) {
      this.props.onUserInput(content, this.props.index);
    },
    saveOption: function(event) {
        this.props.onUserSelect(event.target.value, this.props.index);
    },
    remove: function() {
        this.props.onUserDelete(this.props.index);
    },
    renderOption: function(option) {
        return (
            <option value={option}>{option}</option>
        );
    },
    renderDisplay : function() {
        if (this.props.type == "Address") {
            <AddressField fieldContent={this.props.fieldContent} currentOption={this.props.currentOption}/>
        }
        return (
            <div id="field">
                <p>{this.props.currentOption}
                    : {this.props.fieldContent}</p>
            </div>
        );
    }, renderForm : function() {
        if (this.props.type == "Address") {
            return <AddressForm currentOption={this.props.currentOption} saveOption={this.saveOption} renderOption={this.renderOption}
              options={this.props.options} remove={this.remove} saveContent={this.saveContent} fieldContent={this.props.fieldContent}/>
        }
        return (
            <table id="field">
                <tr>
                    <td><select onChange={this.saveOption} value={this.props.currentOption}>
                        {this.props.options.map(this.renderOption)}
                    </select></td>
                    <td><input type="text" ref="newText" defaultValue={this.props.fieldContent} className="form-control" onChange={this.saveContent}></input></td>
                    <td><button id="buttons" onClick={this.remove}>-</button></td>
                </tr>
            </table>
        )
    }, render : function() {
        if (this.props.editing) {
            return this.renderForm();
        } else {
            return this.renderDisplay();
        }
    }
});