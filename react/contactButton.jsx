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
    <div id="contact-name" className={className} onClick={(event)=>props.viewContact(event, contact.uuid, contact.name)}>
      <ProfileImage type="sidebar" className="side-profile-img" image={props.image}/>
      <li className="contact-detail" key={contact.uuid}>{contact.name}</li>
    </div>
  );
}