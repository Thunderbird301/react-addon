var details = {
    name : "Name",
    workPhone : "workPhone",
    email : "Email",
    homePhone : "homePhone",
    mobile : "Mobile"}

var ContactField = React.createClass({
    render: function() {
        return (
            <div>
                <p>
                    {this.props.details.name}
                    <input type="text"/>
                </p>
                <p>
                    {this.props.details.email}
                    <input type="text"/>
                </p>
                <p>
                    {this.props.details.workPhone}
                    <input type="text"/>
                </p>
                <p>
                    {this.props.details.homePhone}
                    <input type="text"/>
                </p>
                <p>
                    {this.props.details.mobile}
                    <input type="text"/>
                </p>
            </div>
        );
    }
});

ReactDOM.render(
    <ContactField details = {details}/>, document.getElementById('contact'));
