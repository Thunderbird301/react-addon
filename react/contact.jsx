var details = {
    name : "Name",
    workPhone : "workPhone",
    email : "Email",
    homePhone : "homePhone",
    mobile : "Mobile"}

var ContactField = React.createClass({
  getInitialState: function() {
        return {editing: false}
    },
  save: function() {
      this.props.content = ReactDOM.findDOMNode(this.refs.newText).value;
      this.setState({editing: false});
  },
  edit: function() {
        this.setState({editing: true});
  },
  renderDisplay: function() {
        return (
            <div className="field">
                <p>{this.props.fieldName} : {this.props.content}</p>
                <span>
                    <button onClick={this.edit}>Edit</button>
               </span>
            </div>
            );
  },
  renderForm: function() {
        return (
            <div className="field">
            <p>{this.props.fieldName}</p>
            <input type="text" ref="newText" defaultValue={this.props.content} 
            className="form-control"></input>
            <button onClick={this.save}>Save</button>
            </div>
            )
  },
  render: function() {
        if (this.state.editing) {
            return this.renderForm();
        }
        else {
            return this.renderDisplay();
        }
    }
});

ReactDOM.render(
    <ContactField fieldName="Name" content=""/>, document.getElementById('contact'));
