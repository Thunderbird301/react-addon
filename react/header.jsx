var Header = React.createClass({
  saveContent(detail) {
    this.props.onUserInput(detail, this.refs[detail].value);
  },
  renderDisplay() {
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
  },
  renderForm() {
    return (
      <div id="header">
        <div id="profile-img">
          <ProfileImage image={this.props.image}/>
        </div>
        <div id="header-text">
          <div id="field">
            <input type="text" ref="name" defaultValue={this.props.personalDetails.name} className="form-control" onChange={this.saveContent.bind(null, "name")}></input>
            <input type="text" ref="nickName" defaultValue={this.props.personalDetails.nickName} className="form-control" onChange={this.saveContent.bind(null, "nickName")}></input>
            <input type="text" ref="displayName" defaultValue={this.props.personalDetails.displayName} className="form-control" onChange={this.saveContent.bind(null, "displayName")}></input>
            <input type="text" ref="birthday" defaultValue={this.props.personalDetails.birthday} className="form-control" onChange={this.saveContent.bind(null, "birthday")}></input>
          </div>
        </div>
    </div>
    );
  },
  render() {
    if (this.props.editing) {
      return this.renderForm();
    }
    return this.renderDisplay();
  }
});

ReactDOM.render(
    <Header />, document.getElementById('header-text'));