var Header = React.createClass({
  saveContent(detail) {
    this.props.onUserInput(detail, this.refs[detail].value);
  },
  saveImage() {
    this.props.onNewImage(this.imageFile);
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
          <input type="file" name="profile-picture" accept="image/*" ref={(ref) => this.imageFile = ref} onChange={(evt) => this.saveImage(evt)}/>
        </div>
        <div id="header-text">
          <table id="field">
            <tr>
              <td><input type="text" ref="name" defaultValue={this.props.personalDetails.name} placeholder="Name" className="form-control" onChange={this.saveContent.bind(null, "name")}></input>
              </td>
            </tr>
            <tr>
              <td><input type="text" ref="nickName" defaultValue={this.props.personalDetails.nickName} placeholder="Nickname" className="form-control" onChange={this.saveContent.bind(null, "nickName")}></input>
              </td>
            </tr>
            <tr>
              <td><input type="text" ref="displayName" defaultValue={this.props.personalDetails.displayName} placeholder="Display name" className="form-control" onChange={this.saveContent.bind(null, "displayName")}></input>
              </td>
            </tr>
            <tr>
              <td><input type="text" ref="birthday" defaultValue={this.props.personalDetails.birthday} placeholder="Birthday" className="form-control" onChange={this.saveContent.bind(null, "birthday")}></input>
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