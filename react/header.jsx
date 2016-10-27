/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var Header = React.createClass({
  saveContent(detail) {
    this.props.onUserInput(detail, this.refs[detail].value);
  },
  saveImage() {
    this.props.onNewImage(this.imageFile);
  },
  clickedImage(){
    //clicks the input file upload button.
    this.imageFile.click();
  },
  renderDisplay() {
    return (
      <div id="header">
          <ProfileImage type="header" id="profile-img" className="profile-img" image={this.props.image}/>
        <div id="header-text">
          <h3>{this.props.personalDetails.name.content}</h3>
          <h4>{this.props.personalDetails.nickName.content}</h4>
          <h4>{this.props.personalDetails.displayName.content}</h4>
          <h5>{this.props.personalDetails.birthday.content}</h5>

          <description className="headerstyle">Tags</description>
          <button className="buttons tag" >Private</button>
          <button className="buttons tag" >Friends</button>
        </div>
    </div>
    );
  },
  renderForm() {
    var click = this.clickedImage.bind(this);
    return (
      <div id="header">
        <div id="profile-img">
          <ProfileImage imageClick={click} type="header" id="profile-img" className="profile-img editing" image={this.props.image}/>
          <input className="buttons upload" type="file" ref={(ref) => this.imageFile = ref} name="profile-picture" accept="image/*" onChange={(evt) => this.saveImage(evt)}/>
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
            <tr>
              <td>
                <description className="headerstyle">Tag</description>
                 <button className="buttons tag" onClick={this.save}>Private</button>
                 <button className="buttons remove" >-</button>
                 <button className="buttons tag" onClick={this.save}>Friends</button>
                 <button className="buttons remove" >-</button>
                 <button className="buttons add" > + </button>
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
