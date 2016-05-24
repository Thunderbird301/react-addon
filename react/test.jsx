var styles = StyleSheet.create({
  circle: {
      borderRadius: 4,
  },
});

var HelloWorld = React.createClass({
  render: function() {
    return (
      <p>
        Hello, <input type="text" placeholder="Your name here" />!
        It is {this.props.date.toTimeString()}
      </p>
    );
  }
});

setInterval(function() {
  ReactDOM.render(
    <HelloWorld date={new Date()} />,
    document.getElementById('test')
  );
}, 500);


var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <img src="images/1.jpg"/>
      </div>
    );
  }
});
ReactDOM.render(
  <CommentBox />,
  document.getElementById('sidebar')
);
