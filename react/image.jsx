class Layout extends React.Component {
  render() {
    const imageStyle = {
      borderRadius: "50%"
    };
    return (
      <div>
        <h1>It's working!</h1>
        <img src={'images/1.jpg'} style={imageStyle}/>
      </div>

    );
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Layout/>,app);


//
// var contact = React.createClass({
//   render: function() {
//     return (
//       // <h1> Joely Huang </h1>
//       <p>
//         Hello, <input type="text" placeholder="Your name here" />!
//       </p>
//     );
//   }
// });
// ReactDOM.render(
//   <contact />,
//   document.getElementById('main')
// );
