var ContactButton = (props) => {
  var className;
  if (props.selected) {
    className = "true";
  } else {
    className = "";
  }

  var contact = props.contact;

  return (
    <div id="contact-name" className={className} onClick={props.viewContact.bind(null, contact.id, contact.name)}>
      <ProfileImage type="sidebar" className="side-profile-img" image={props.image}/>
      <li className="contact-detail" key={contact.id}>{contact.name}</li>
    </div>
  );
}