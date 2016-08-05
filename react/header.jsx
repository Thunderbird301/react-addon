var Header = React.createClass({
  render() {
    return (
      <div>
        <h1>Firstname Lastname</h1>
        <h2>Nickname</h2>
        <h3>Displayname</h3>
        <h3>BIRTHDAY</h3>
      </div>
    );
  }
});

ReactDOM.render(
    <Header />, document.getElementById('header-text'));