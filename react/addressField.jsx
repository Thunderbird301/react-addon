/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
           <p>{addressLine}</p>
         </div>);
       })
      }
    </p>
   </div>
 );
}
