/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
* @desc The address fields available
**/
var addressFields = ["Street", "City", "Postal Code", "Region", "Country"];

/**
* @desc Provides an editable form for an address. It has 5 fields as well as the
* ability to set a type of address from options given.
*/
var AddressForm = React.createClass({
  /**
  * @desc Saves the change in the address to temporary fields
  * @param event Event fired by user input
  **/
  saveContent: function(event) {
    var self = this;
    var address = addressFields.map(function(field) {
      return self.refs[field].value;
    });
    this.props.saveContent(address, this.props.index);
  },
  /**
  * @desc Saves the change in the address type to temporary fields
  * @param event Event fired by change in address type
  **/
  saveOption: function(event) {
    this.props.saveOption(event.target.value, this.props.index);
  },
  render: function() {
    return (
        <table id="field">
            <tr>
                <td><select onChange={this.saveOption} value={this.props.currentOption}>
                    {this.props.options.map(this.props.renderOption)}
                    </select>
                </td>
                <td>
                    <input type="text" ref={addressFields[0]} placeholder={addressFields[0]} defaultValue={this.props.fieldContent[0]} onChange={this.saveContent} className="form-control"></input>
                </td>
                <td>
                    <button className="buttons remove" onClick={this.props.remove}>-</button>
                </td>
            </tr>
            <tr>
                <td></td>
                <td><input type="text" ref={addressFields[1]} placeholder={addressFields[1]} defaultValue={this.props.fieldContent[1]} onChange={this.saveContent} className="form-control"></input></td>
            </tr>
            <tr>
                <td></td>
                <td><input type="text" ref={addressFields[2]} placeholder={addressFields[2]} defaultValue={this.props.fieldContent[2]} onChange={this.saveContent} className="form-control"></input></td>
            </tr>
            <tr>
                <td></td>
                <td><input type="text" ref={addressFields[3]} placeholder={addressFields[3]} defaultValue={this.props.fieldContent[3]} onChange={this.saveContent} className="form-control"></input></td>
            </tr>
            <tr>
                <td></td>
                <td><input type="text" ref={addressFields[4]} placeholder={addressFields[4]} defaultValue={this.props.fieldContent[4]} onChange={this.saveContent} className="form-control"></input></td>
            </tr>
        </table>
    );
  }
});
