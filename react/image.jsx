class ProfileImage extends React.Component {
  render() {
    const imageStyle = {
      borderRadius: "50%"
    };
    return (
      <div>
        <img src={this.props.image} style={imageStyle}/>
      </div>

    );
  }
}


