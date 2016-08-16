var Header = React.createClass({
  render() {
    return (
      <div>
        <h2>Firstname Lastname</h2>
        <h3>Nickname</h3>
        <h4>Displayname</h4>
        <h4>BIRTHDAY</h4>
      </div>
    );
  }
});

ReactDOM.render(
    <Header />, document.getElementById('header-text'));