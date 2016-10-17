/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
* @desc Provides a sidebar button for a contact.
* It displays their profile image, name and displays their contact when clicked
**/
var ContactButton = (props) => {
  var className;
  if (props.selected) {
    className = "true";
  } else {
    className = "";
  }

  var contact = props.contact;

  return (
    <div id="contact-name" className={className} onClick={(event)=>props.viewContact(event, contact.id, contact.name)}>
      <ProfileImage type="sidebar" className="side-profile-img" image={props.image}/>
      <li className="contact-detail" key={contact.id}>{contact.name}</li>
    </div>
  );
}
