/**
* @desc Provides an editable form for an address. It has 5 fields as well as the
* ability to set a type of address from options given.
*/
var AddressForm = (props) => {
  var saveContent = function() {
    var address = [this.refs.street.value, this.refs.city.value, this.refs.postalCode.value, this.refs.region.value, this.refs.country.value];
            this.props.onUserInput(address, this.props.index);
    props.saveContent(address);
  }

  return (
      <table id="field">
          <tr>
              <td><select onChange={props.saveOption} value={props.currentOption}>
                  {props.options.map(props.renderOption)}
                  </select>
              </td>
              <td>
                  <input type="text" ref="street" placeholder="Street" defaultValue={props.fieldContent[0]} onChange={saveContent} className="form-control"></input>
              </td>
              <td>
                  <button id="buttons" onClick={props.remove}>-</button>
              </td>
          </tr>
          <tr>
              <td></td>
              <td><input type="text" ref="city" placeholder="City" defaultValue={props.fieldContent[1]} onChange={saveContent} className="form-control"></input></td>
          </tr>
          <tr>
              <td></td>
              <td><input type="text" ref="postalCode" placeholder="Postal Code" defaultValue={props.fieldContent[2]} onChange={saveContent} className="form-control"></input></td>
          </tr>
          <tr>
              <td></td>
              <td><input type="text" ref="region" placeholder="Region" defaultValue={props.fieldContent[3]} onChange={saveContent} className="form-control"></input></td>
          </tr>
          <tr>
              <td></td>
              <td><input type="text" ref="country" placeholder="Country" defaultValue={props.fieldContent[4]} onChange={saveContent} className="form-control"></input></td>
          </tr>
      </table>
  );
}