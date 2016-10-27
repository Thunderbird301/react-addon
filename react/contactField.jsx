/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/** -------------- CONTACT FIELDS -------------------------*/

var ContactField = React.createClass({
    saveContent: function(event) {
      this.props.onUserInput(event.target.value, this.props.index);
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
          return (
            <AddressField
              fieldContent={this.props.fieldContent}
              currentOption={this.props.currentOption}
            />
          );
        }
        return (
            <div id="field">
                <p>{this.props.currentOption}
                    : {this.props.fieldContent}</p>
            </div>
        );
    }, renderForm : function() {
        if (this.props.type == "Address") {
            return <AddressForm
              currentOption={this.props.currentOption}
              saveOption={this.props.onUserSelect}
              renderOption={this.renderOption}
              options={this.props.options}
              remove={this.remove}
              saveContent={this.props.onUserInput}
              fieldContent={this.props.fieldContent}
              index={this.props.index}
              />
        }
        return (
            <table id="field">
                <tr>
                    <td><select onChange={this.saveOption} value={this.props.currentOption}>
                        {this.props.options.map(this.renderOption)}
                    </select></td>
                    <td><input type="text" ref="newText" defaultValue={this.props.fieldContent} className="form-control" onChange={this.saveContent}></input></td>
                    <td><button className="buttons remove" onClick={this.remove}>-</button></td>
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
