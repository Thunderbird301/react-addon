/**
* @desc Provides a scrollable sidebar of all contacts as well as a locked header
* to support actions on contacts
*/
var ContactSidebar = (props) => (
  <div>
    <SidebarHeader add={props.add} export={props.export} import={props.import}/>
    <br />
    <div id="contacts-list">
      <ul>
        {props.contactNames.map(function(contact) {
          return <ContactButton contact={contact} image={props.image} viewContact={props.viewContact} selected={contact.id == props.currentID}/>
        })}
      </ul>
    </div>
  </div>
);

