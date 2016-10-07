class ProfileImage extends React.Component {
  handleURLRevoke() {
    URL.revokeObjectURL(this.props.image);
  }
  render() {
    return (
      <img className="profile-img" onload={this.handleURLRevoke} src={this.props.image}/>
    );
  }
}


