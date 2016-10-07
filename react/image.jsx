class ProfileImage extends React.Component {
  handleURLRevoke() {
    URL.revokeObjectURL(this.props.image);
  }
  render() {
    var className;
    if(this.props.type=="sidebar"){
      className="side-profile-img";
    } else if(this.props.type=="header"){
      className="profile-img";
    }

    return (
      <img className={className} onload={this.handleURLRevoke} src={this.props.image}/>
    );
  }
}
