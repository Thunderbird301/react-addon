/**
* @desc Provides a scrollable sidebar of all contacts as well as a locked header
* to support actions on contacts
*/
var ContactSidebar = (props) => (
  <div>
    <SidebarHeader add={props.add} export={props.export} import={props.import} search={props.search} searchText={props.searchText}/>
    <br />
    <div id="contacts-list">
      <ul>
        {props.contactNames.map(function(contact) {
          return <ContactButton
            contact={contact}
            image={contact.photo}
            viewContact={props.viewContact}
            selected={props.selected && props.selected.indexOf(contact.uuid) > -1}
            />
          })
        }
      </ul>
    </div>
  </div>
);
