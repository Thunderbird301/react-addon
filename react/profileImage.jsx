/**
* @desc Provides a rounded image using the provided image url
**/
var ProfileImage = (props) => (
  <img className={props.className} onload={Images.handleURLRevoke.bind(null, props.image)}
    src={props.image}/>
);
