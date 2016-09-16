var Header = React.createClass({
  render() {
    return (
      <div id="header">
        <div id="profile-img">
          <ProfileImage image={this.props.image}/>
        </div>
        <div id="header-text">
          <h2>{this.props.fn} {this.props.ln}</h2>
          <h3>{this.props.nn}</h3>
          <h4>{this.props.dn}</h4>
          <h4>{this.props.bday}</h4>
        </div>
    </div>
    );
  }
});

ReactDOM.render(
    <Header />, document.getElementById('header-text'));