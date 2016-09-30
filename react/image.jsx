class ProfileImage extends React.Component {
  handleURLRevoke() {
    URL.revokeObjectURL(this.props.image);
  }
  render() {
    const imageStyle = {
      borderRadius: "50%"
    };
    return (
      <div>
        <img onload={this.handleURLRevoke} src={this.props.image} style={imageStyle}/>
      </div>
    );
  }
}


