/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @desc Deals with parsing between formats required for displaying contacts in
 * the UI and the vCard stored in the database. Also provides functions for
 * updating/modifying the two formats in response to user changes.
 */
function ContactParser() { };

// CLEARING OF A CONTACT

/**
 * @desc Clears all information about a contact held in the main panel
 * @param {Array} contactSections Infomation to clear
 */
ContactParser.createEmptyContactSections = function(contactSections) {
  var sections = [];
  for (var i = 0; i < contactSections.length; i++) {
      sections.push({
        name: contactSections[i].name,
        options: contactSections[i].options,
        fields: [],
        index: i,
        key: contactSections[i].key
      });
  }
  return sections;
};

/**
 * @desc Clears all information about a contact held in the header
 * @param {Array} details Infomation to clear
 */
ContactParser.createEmptyPersonalSection = function(details) {
  var pDetails = {};
  for(var i = 0; i < details.length; i++) {
    pDetails[details[i]] = {content: "", property: null, jCardIndex: null};
  }
  return pDetails;
};

// PARSING VCARD FOR THE UI

/**
 * @desc Parses a single property of a contact vCard for the UI
 * @param {Property} property The property to parse
 * @param {Array} cProperty Contact property in UI
 * @param {Array} tProperty Temporary contact property in UI (for editing purposes)
 * @param {Array} cSections Contact sections in UI
 * @param {Array} tSections Temporary contact sections in UI (for editing purposes)
 * @param {Array} pField Personal details of contact fields in UI header
 * @param {Array} tpField Temporary personal details of contact fields in UI header (for editing purposes)
 * @param {Integer} jCardIndex Index of the jCard which the property belongs to
 */
ContactParser._parseProperty = function(property, cProperty, tProperty, cSections, tSections, pField, tpField, jCardIndex) {
  var name = property.name;
  var type = property.getParameter("type");
  var content = property.getFirstValue();

  // Gets type of property (used for option display)
  if (Array.isArray(type)) {
    type = type[0];
  }
  if (type) {
    type = type.charAt(0).toUpperCase() + type.slice(1);
  }

  // Parses property
  switch (name) {
    case "email":
      this._addFieldProperty(0, type, content, cSections, jCardIndex, cProperty);
      this._addFieldProperty(0, type, content, tSections, jCardIndex, tProperty);
      break;
    case "tel":
      this._addFieldProperty(1, type, content, cSections, jCardIndex, cProperty);
      this._addFieldProperty(1, type, content, tSections, jCardIndex, tProperty);
      break;
    case "adr":
      this._addFieldProperty(2, type, content, cSections, jCardIndex, cProperty);
      this._addFieldProperty(2, type, content, tSections, jCardIndex, tProperty);
      break;
    case "url":
      this._addFieldProperty(3, type, content, cSections, jCardIndex, cProperty);
      this._addFieldProperty(3, type, content, tSections, jCardIndex, tProperty);
      break;
    case "fn":
      this._addPersonalDetail(pField, tpField, "name", jCardIndex, cProperty, tProperty, content);
      break;
    case "nn":
      this._addPersonalDetail(pField, tpField, "nickName", jCardIndex, cProperty, tProperty, content);
      break;
    case "dn":
      this._addPersonalDetail(pField, tpField, "displayName", jCardIndex, cProperty, tProperty, content);
      break;
    case "bday":
      this._addPersonalDetail(pField, tpField, "birthday", jCardIndex, cProperty, tProperty, content.toString());
      break;
    default:
      break;
  }
};

/**
 * @desc Adds a personal property to the personal and temporary contact fields for
 * the UI header of a contact
 * @param {Array} pField Personal details of contact fields in UI header
 * @param {Array} tpField Temporary personal details of contact fields in UI header (for editing purposes)
 * @param {string} type The type of personal detail
 * @param {Intger} jCardIndex Index of the jCard which the detail belongs to
 * @param {Property} cProperty Contact property in UI header
 * @param {Property} tProperty Temporary contact property in UI header (for editing purposes)
 * @param {string} content The content of the property
 */
ContactParser._addPersonalDetail = function(pField, tpField, type, jCardIndex, cProperty, tProperty, content) {
  pField[type].content = content;
  pField[type].property = cProperty;
  pField[type].jCardIndex = jCardIndex;
  tpField[type].content = content;
  tpField[type].property = tProperty;
  tpField[type].jCardIndex = jCardIndex;
}

/**
 * @desc Adds a property to the appropriate contact section for
 * displaying the contact in the UI
 * @param {Integer} index The index of the contact section to add to
 * @param {string} currentOption The option type associated with the property
 * @param {string} content The content of the property
 * @param {Array} sections The sections of the contact
 * @param {Integer} jCardIndex Index of the jCard which the detail belongs to
 * @param {Property} property Property to add
 */
ContactParser._addFieldProperty = function(index, currentOption, content, sections, jCardIndex, property) {
  var fieldID = sections[index].fields.length;
  sections[index].fields.push({
    currentOption: currentOption,
    content: content,
    fieldID: fieldID,
    property: property,
    jCardIndex: jCardIndex,
    property: property
  });
};

// MODYFING A CONTACT

/**
 * @desc Updates the value of an existing property that is from a contact section
 * @param {AddressBook} ab The addressbook UI component
 * @param {Integer} index The index of the temporary contact section to update
 * @param {Integer} fieldID The index of the field in the temporary contact section to update
 * @param {string} content The content to update the property with
 */
ContactParser.updateContent = function(ab, index, fieldID, content) {
  var tSection = ab.state.tempContactSections[index];
  var field = tSection.fields[fieldID];
  field.content = content;
  var tSections = ab.state.tempContactSections;
  tSections[index] = tSection;
  var tempContact = ab.state.tempContact;

  field.property.setValue(content);
  ab.setState({
    tempContactSections: tSections,
    tempContact: tempContact
  });
};

/**
 * @desc Updates the value of an existing property that is a personal detail
 * @param {AddressBook} ab The addressbook UI component
 * @param {string} detail The detail to update
 * @param {string} content The content to update the property with
 */
ContactParser.updatePersonalDetail = function(ab, detail, content) {
  var tDetails = ab.state.tempPersonalSection;
  tDetails[detail].content = content;
  var tempContact = ab.state.tempContact;
  tDetails[detail].property.setValue(content);
  ab.setState({
    tempPersonalSection: tDetails,
    tempContact: tempContact
  });
};

/**
 * @desc Updates the option associated with a property
 * @param {AddressBook} ab The addressbook UI component
 * @param {string} option The option to update to
 * @param {Integer} index The index of the temporary contact section to update
 * @param {Integer} fieldID The index of the field in the temporary contact section to update
 */
ContactParser.updateOption = function(ab, option, index, fieldID) {
    var tSection = ab.state.tempContactSections[index];
    var field = tSection.fields[fieldID];
    field.currentOption = option;
    var tSections = ab.state.tempContactSections;
    var tempContact = ab.state.tempContact;
    tSections[index] = tSection;
    field.property.setParameter("type", option);
    ab.setState({
      tempContactSections: tSections,
      tempContact: tempContact
    });
};

/**
 * @desc Updates the profile image of a contact
 * @param {AddressBook} ab The addressbook UI component
 * @param {Blob} image The new image for the contact
 */
ContactParser.updateProfileImage = function(ab, image) {
  var imageFile = image.files[0];
  var tempContact = ab.state.tempContact;
  tempContact.photo = imageFile;
  var contactsList = ab.state.contactsList;
  ab.setState({
    tempContact: tempContact,
    contactsList: contactsList
  });
};

/**
 * @desc Removes a property from a contact
 * @param {Contact} tempContact The temporary contact (for editing purposes) to be modified
 * @param {Integer} tempSectionIndex The index of the temporary section of a contact to add to
 * @param {Array} tempSections All sections of the contact
 * @param {Integer} propertyID The id of the property to be removed
 * @param {AddressBook} ab The addressbook UI component
 */
ContactParser.removeContactDetail = function(tempContact, tempSectionIndex, tempSections, propertyID, ab) {
  // Removes property from UI
  var tempSection = tempSections[tempSectionIndex];
  var field = tempSection.fields.splice(propertyID, 1)[0];
  tempSections[tempSectionIndex] = tempSection;

  // Removes property from contact
  tempContact.jcards[field.jCardIndex].removeProperty(field.property);

  ab.setState({
    tempContactSections: tempSections,
    tempContact: tempContact
  });
};

/**
 * @desc Adds a new property to a contact
 * @param {Contact} tempContact The temporary contact (for editing purposes) to be modified
 * @param {Integer} tempSectionIndex The index of the temporary section of a contact to add to
 * @param {Array} tempSections All sections of the contact
 * @param {AddressBook} ab The addressbook UI component
 */
ContactParser.addContactDetail = function(tempContact, tempSectionIndex, tempSections, ab) {
  // Sets content
  var tempSection = tempSections[tempSectionIndex];
  var content = "";
  if(tempSection.name == "Address"){
    content = [];
    for(var i = 0; i < 5; i++) {
        content.push("");
    }
  }

  // Adds property to contact
  var name = tempSection.key;
  var type = tempSection.options[0];
  var property = tempContact.jcards[0].addPropertyWithValue(name, content);
  property.setParameter("type", type);

  // Adds property to contact in UI
  var fieldID = tempSection.fields.length;
  tempSection.fields.push({
      currentOption: type,
      content: content,
      fieldID: fieldID,
      jCardIndex: 0,
      property: property
  });
  tempSections[tempSectionIndex] = tempSection;

  ab.setState({
    tempContactSections: tempSections,
    tempContact: tempContact
  });
};

// UPDATING UI TO REFLECT CHANGE

/**
 * @desc Renames a contact on the sidebar
 * @param {Integer} id The id of the contact to be renamed
 * @param {string} name The new name of the contact
 * @param {Array} contactsList The list of contacts displayed on the sidebar
 */
ContactParser.rename = function(id, name, contactsList) {
  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].id == id) {
      contactsList[i].name = name;
      return;
    }
  }
};

/**
 * @desc Deletes a contact from the sidebar
 * @param {Array} contactsList The list of contacts displayed on the sidebar
 * @param {Integer} id The id of the contact to be deleted
 * @returns {Array} contactsList The list of contacts with the desired contact removed
 */
ContactParser.deleteContact = function(contactsList, id) {
  var index = contactsList.findIndex(function(contact) {
    return contact.id == id;
  });
  contactsList.splice(index, 1);
  return contactsList;
};

// METHODS FOR HELPING WITH SAVING A CONTACT

/**
 * @desc Saves the contact details from the temporary details for the UI
 * @param {Array} tpSection The temporary details to save
 * @param {Array} pSection The permanent details to save to
 * @param {Contact} tempContact The temporary contact to save
 * @param {Array} contactsList The list of all contacts
 * @param {string} name The name of the contact before editing
 * @param {Integer} id The id of the contact being saved
 */
 ContactParser.saveContactPersonalDetails = function(tpSection, pSection, tempContact, contactsList, name, id) {
   for (var key in tpSection) {
     if(key == "name" && (name != tpSection[key].content)) {
       name = tpSection[key].content;
       tempContact.name = name;
       this.rename(id, name, contactsList);
     }
     pSection[key] = tpSection[key];
   }
 };

 /**
 * @desc Saves the image of a contact to the sidebar/contacts list
 * @param {Array} contactsList The list of all contacts
 * @param {Contact} tempContact The temporary contact to save
 * @param {Integer} id The id of the contact being saved
 */
 ContactParser.saveContactPhotoToContactsList = function(contactsList, tempContact, id) {
   var contact = contactsList.find(function(contact) {
     return contact.id == id;
   });
   contact.photo = Images.getPhotoURL(tempContact.photo);
 };

/**
 * @desc Saves the contact sections from the temporary sections for the UI
 * @param {Array} tSections The temporary sections of the contact to save
 * @param {Array} cSections The permanent sections of the contact to save to
 * @param {Array} contact The contact to save
 */
 ContactParser.saveContactSections = function(tSections, cSections, contact) {
   for (var i = 0; i < tSections.length; i++) {
     var fields = [];
     for (var j = 0; j < tSections[i].fields.length; j++) {
       fields.push({
         currentOption: tSections[i].fields[j].currentOption,
         content: tSections[i].fields[j].content,
         fieldID: tSections[i].fields[j].fieldID,
         jCardIndex: tSections[i].fields[j].jCardIndex,
         property: this.findCloneProperty(tSections[i].fields[j].property, contact)
       });
     }
     cSections.push({
       name: tSections[i].name,
       options: tSections[i].options,
       fields: fields,
       index: i,
       key: tSections[i].key
     });
   }
 };

/**
 * @desc Cancels the editing of a contact and resets the temporary fields to
 * the original set of fields.
 * @param {AddressBook} ab The addressbook UI component
 */
 ContactParser.cancelContactEdit = function(ab) {
   var tSections = [];
   var cSections = ab.state.contactSections;
   var tpSection = this.createEmptyPersonalSection(ab.props.personalDetails);
   var pSection = ab.state.personalSection;
   var contact = ab.state.contact;
   var tempContact = new Contact(contact.toJSON());
   this.saveContactSections(cSections, tSections, tempContact);
   this.saveContactPersonalDetails(pSection, tpSection, contact, ab.state.contactsList, ab.state.name, ab.state.selectedIds[0]);

   ab.setState({
     tempContactSections: tSections,
     tempPersonalSection: tpSection,
     editing: false,
     tempContact: tempContact
   });
 }

/**
 * @desc Finds a property within a contact
 * @param {Property} property The property to find
 * @param {Contact} contact The contact to search through
 * @returns {Property} property - the identical found property
 */
ContactParser.findCloneProperty = function(property, contact) {
  for(var j = 0; j < contact.jcards.length; j++) {
    var details = contact.jcards[j].getAllProperties(property.name);
    for (var i = 0; i < details.length; i++) {
      if (details[i].getValues().every(this.equals, property.getValues())) {
        return details[i];
      }
    }
  }
};

/**
 * @desc Checks if two properties are identical
 * @this Array of properties
 * @param {Property} element The property to check
 * @param {Integer} index The index of the other property
 */
ContactParser.equals = function(element, index) {
  if(Array.isArray(element)) {
    return element.every(ContactParser.equals, this[index]);
  }
  return element == this[index];
}
