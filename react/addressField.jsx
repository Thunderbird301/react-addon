/**
* @desc Provides display of an address
*/
var AddressField = (props) => {
  var addressFields = props.fieldContent;
  return (
    <div id = "field">
     <p>{props.currentOption} : {addressFields.map(function(addressLine) {
       return (
         <div id="field">
           <p>{content}</p>
         </div>);
       })
      }
    </p>
   </div>
 );
}