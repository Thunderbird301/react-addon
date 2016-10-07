var Header = React.createClass({
  saveContent(detail) {
    this.props.onUserInput(detail, this.refs[detail].value);
  },
  renderDisplay() {
    return (
      <div id="header">
        <div id="profile-img">
          <ProfileImage type="header" image={this.props.image}/>
        </div>
        <div id="header-text">
          <h2>{this.props.personalDetails.name.content}</h2>
          <h3>{this.props.personalDetails.nickName.content}</h3>
          <h4>{this.props.personalDetails.displayName.content}</h4>
          <h4>{this.props.personalDetails.birthday.content}</h4>
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
          <table id="field">
            <tr>
              <td><input type="text" ref="name" defaultValue={this.props.personalDetails.name.content} placeholder="Name" className="form-control" onChange={this.saveContent.bind(null, "name")}></input>
              </td>
            </tr>
            <tr>
              <td><input type="text" ref="nickName" defaultValue={this.props.personalDetails.nickName.content} placeholder="Nickname" className="form-control" onChange={this.saveContent.bind(null, "nickName")}></input>
              </td>
            </tr>
            <tr>
              <td><input type="text" ref="displayName" defaultValue={this.props.personalDetails.displayName.content} placeholder="Display name" className="form-control" onChange={this.saveContent.bind(null, "displayName")}></input>
              </td>
            </tr>
            <tr>
              <td><input type="text" ref="birthday" defaultValue={this.props.personalDetails.birthday.content} placeholder="Birthday" className="form-control" onChange={this.saveContent.bind(null, "birthday")}></input>
              </td>
            </tr>
          </table>
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
