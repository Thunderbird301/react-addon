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
 * @param contactSections Infomation to clear
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
 * @param details Infomation to clear
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
 * @param property The property to parse
 * @param cProperty Contact property in UI
 * @param tProperty Temporary contact property in UI (for editing purposes)
 * @param cSections Contact sections in UI
 * @param tSections Temporary contact sections in UI (for editing purposes)
 * @param pField Personal details of contact fields in UI header
 * @param tpField Temporary personal details of contact fields in UI header (for editing purposes)
 * @param jCardIndex Index of the jCard which the property belongs to
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
 * @param pField Personal details of contact fields in UI header
 * @param tpField Temporary personal details of contact fields in UI header (for editing purposes)
 * @param type The type of personal detail
 * @param jCardIndex Index of the jCard which the detail belongs to
 * @param cProperty Contact property in UI header
 * @param tProperty Temporary contact property in UI header (for editing purposes)
 * @param content The content of the property
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
 * @param index The index of the contact section to add to
 * @param currentOption The option type associated with the property
 * @param content The content of the property
 * @param sections The sections of the contact
 * @param jCardIndex Index of the jCard which the detail belongs to
 * @param property Property to add
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
 * @desc Updates the value of an existing property
 * @param property The property to be updated
 * @param content The new content of the property
 */
ContactParser.updateValue = function(property, content) {
  property.setValue(content);
};

/**
 * @desc Removes a property from a contact
 * @param tempContact The temporary contact (for editing purposes) to be modified
 * @param property The property to be removed
 * @param jCardIndex The index of the jCard which contains the property to be removed
 */
ContactParser.removeContactDetail = function(tempContact, property, jCardIndex) {
  tempContact.jcards[jCardIndex].removeProperty(property);
};

/**
 * @desc Adds a new property to a contact
 * @param tempContact The temporary contact (for editing purposes) to be modified
 * @param name The name of the new property
 * @param content The content of the property
 * @param type The option type associated with the property
 * @returns {Property} property - newly added property
 */
ContactParser.addContactDetail = function(tempContact, name, content, type) {
  var property = tempContact.jcards[0].addPropertyWithValue(name, content);
  property.setParameter("type", type);
  return property;
};

/**
 * @desc Updates the option type of an existing property
 * @param property The property to be updated
 * @param option The new option type of the property
 */
ContactParser.updateOption = function(property, option) {
  property.setParameter("type", option);
}

// UPDATING UI TO REFLECT CHANGE

/**
 * @desc Renames a contact on the sidebar
 * @param id The id of the contact to be renamed
 * @param name The new name of the contact
 * @param contactsList The list of contacts displayed on the sidebar
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
 * @param contactsList The list of contacts displayed on the sidebar
 * @param id The id of the contact to be deleted
 * @returns {Array} contactsList - the list of contacts with the desired contact removed
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
 * @desc Finds a property within a contact
 * @param property The property to find
 * @param contact The contact to search through
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
 * @param element The property to check
 * @param index The index of the other property
 */
ContactParser.equals = function(element, index) {
  if(Array.isArray(element)) {
    return element.every(ContactParser.equals, this[index]);
  }
  return element == this[index];
}
