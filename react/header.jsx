var Header = React.createClass({
  render() {
    return (
      <div id="header">
        <div id="profile-img">
          <ProfileImage image={this.props.image}/>
        </div>
        <div id="header-text">
          <h2>{this.props.personalDetails.name}</h2>
          <h3>{this.props.personalDetails.nickName}</h3>
          <h4>{this.props.personalDetails.displayName}</h4>
          <h4>{this.props.personalDetails.birthday}</h4>
        </div>
    </div>
    );
  }
});

ReactDOM.render(
    <Header />, document.getElementById('header-text'));