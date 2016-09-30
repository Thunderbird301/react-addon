/** -------------- CONTACT FIELDS -------------------------*/

var ContactField = React.createClass({
    saveContent: function() {
      if(this.props.type != "Address") {
        this.props.onUserInput(this.refs.newText.value, this.props.index);
      } else {
        var address = [this.refs.street.value, this.refs.city.value, this.refs.postalCode.value, this.refs.region.value, this.refs.country.value];
        this.props.onUserInput(address, this.props.index);
      }
    },
    saveOption: function(event) {
        this.props.onUserSelect(event.target.value, this.props.index);
    },
    remove: function() {
        this.props.onUserDelete(this.props.index);
    },
    renderAddressForm: function() {
        return (
            <table id="field">
                <tr>
                    <td><select onChange={this.saveOption} value={this.props.currentOption}>
                        {this.props.options.map(this.renderOption)}
                        </select>
                    </td>
                    <td>
                        <input type="text" ref="street" placeholder="Street" defaultValue={this.props.fieldContent[0]} className="form-control"></input>
                    </td>
                    <td>
                        <button id="buttons" onClick={this.remove}>-</button>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td><input type="text" ref="city" placeholder="City" defaultValue={this.props.fieldContent[1]} className="form-control"></input></td>
                </tr>
                <tr>
                    <td></td>
                    <td><input type="text" ref="postalCode" placeholder="Postal Code" defaultValue={this.props.fieldContent[2]} className="form-control"></input></td>
                </tr>
                <tr>
                    <td></td>
                    <td><input type="text" ref="region" placeholder="Region" defaultValue={this.props.fieldContent[3]} className="form-control"></input></td>
                </tr>
                <tr>
                    <td></td>                
                    <td><input type="text" ref="country" placeholder="Country" defaultValue={this.props.fieldContent[4]} className="form-control"></input></td>
                </tr>                
            </table>
        );
    },
    renderAddressField: function(content) {
        return (
            <div id="field">
                <p>{content}</p>
            </div>
        );
    },
    renderAddressDisplay: function() {
      return (
        <div id = "field">
           <p>{this.props.currentOption}</p>
          {this.props.fieldContent.map(this.renderAddressField)}
        </div>
      );
    },
    renderOption: function(option) {
        return (
            <option value={option}>{option}</option >
        );
    },
    renderDisplay : function() {
        if (this.props.type == "Address") {
            return this.renderAddressDisplay();
        }
        return (
            <div id="field">
                <p>{this.props.currentOption}
                    : {this.props.fieldContent}</p>
            </div>
        );
    }, renderForm : function() {
        if (this.props.type == "Address") {
            return this.renderAddressForm();
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



// ReactDOM.render(
//     <ContactSidebar/>, document.getElementById('sidebar'));
// ReactDOM.render(
//     <ContactSection type={"Email"} options={Email}/>, document.getElementById('personal'));
// ReactDOM.render(
//     <ContactSection type={"Phone"} options={Phone}/>, document.getElementById('work'));
// ReactDOM.render(
//     <ContactSection type={"Address"} options={Address}/>, document.getElementById('address'));
// ReactDOM.render(
//     <ContactSection type={"Webpage"} options={Webpage}/>, document.getElementById('web-pages'));
// ReactDOM.render(
//     <ContactSection type={"Chat"} options={Chat}/>, document.getElementById('chat'));