/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function ContactParser() { };

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

ContactParser.createEmptyPersonalSection = function(details) {
  var pDetails = {};
  for(var i = 0; i < details.length; i++) {
    pDetails[details[i]] = {content: "", property: null, jCardIndex: null};
  }
  return pDetails;
};

ContactParser.getPhotoURL = function(photo) {
  if (photo) {
      return URL.createObjectURL(photo)
  }
  return "images/1.jpg";
}

ContactParser.getContactDetails = function(id, ab) {
  var self = this;
  var contactSections = this.createEmptyContactSections(ab.props.contactSections);
  var tempContactSections = this.createEmptyContactSections(ab.props.contactSections);
  var personalSection = this.createEmptyPersonalSection(ab.props.personalDetails);
  var tempPersonalSection = this.createEmptyPersonalSection(ab.props.personalDetails);

  Addressbook.open(indexedDB).then(function(addrbook) {
    addrbook.getById(id).then(function(contact) {
        var con = new Contact(contact.toJSON())
        var tempContact = new Contact(contact.toJSON())
      // Gets contact details
      for (var j = 0; j <contact.jcards.length; j++) {
        var details = contact.jcards[j].getAllProperties();
        var cProps = con.jcards[j].getAllProperties();
        var tProps = tempContact.jcards[j].getAllProperties();
        for (var i = 0; i < details.length; i++) {
          self._parseProperty(details[i], cProps[i], tProps[i], contactSections, tempContactSections, personalSection, tempPersonalSection, j);
        }
      }
      // Gets contact profile image
      var photoUrl = self.getPhotoURL(contact.photo);
      // Stores contact information in UI
      ab.setState({
        contact: con,
        tempContact: tempContact,
        contactSections: contactSections,
        tempContactSections: tempContactSections,
        personalSection: personalSection,
        tempPersonalSection: tempPersonalSection,
        photoUrl: photoUrl
      });
    });
  });
};

ContactParser.updateContact = function(contact, ab) {
  var self = this;
    Addressbook.open(indexedDB).then(function(addrbook) {
      addrbook.update(contact).then(function(id) {
        ab.setState({photoUrl: self.getPhotoURL(contact.photo)});
      }); // maybe check success here?
    });
}

ContactParser._parseProperty = function(property, cProperty, tProperty, cFields, tFields, pField, tpField, jCardIndex) {
  var name = property.name;
  var type = property.getParameter("type");
  var content = property.getFirstValue();
  if (Array.isArray(type)) {
    type = type[0];
  }
  if (type) {
    type = type.charAt(0).toUpperCase() + type.slice(1);
  }

  switch (name) {
    case "email":
      this._addFieldProperty(0, type, content, cFields, jCardIndex, cProperty);
      this._addFieldProperty(0, type, content, tFields, jCardIndex, tProperty);
      break;
    case "tel":
      this._addFieldProperty(1, type, content, cFields, jCardIndex, cProperty);
      this._addFieldProperty(1, type, content, tFields, jCardIndex, tProperty);
      break;
    case "adr":
      this._addFieldProperty(2, type, content, cFields, jCardIndex, cProperty);
      this._addFieldProperty(2, type, content, tFields, jCardIndex, tProperty);
      break;
    case "url":
      this._addFieldProperty(3, type, content, cFields, jCardIndex, cProperty);
      this._addFieldProperty(3, type, content, tFields, jCardIndex, tProperty);
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

ContactParser._addPersonalDetail = function(pField, tField, type, jCardIndex, cProperty, tProperty, content) {
  pField[type].content = content;
  pField[type].property = cProperty;
  pField[type].jCardIndex = jCardIndex;
  tField[type].content = content;
  tField[type].property = tProperty;
  tField[type].jCardIndex = jCardIndex;
}

ContactParser._addFieldProperty = function(index, currentOption, content, fields, jCardIndex, property) {
  var fieldID = fields[index].fields.length;
  fields[index].fields.push({
    currentOption: currentOption,
    content: content,
    fieldID: fieldID,
    property: property,
    jCardIndex: jCardIndex,
    property: property
  });
};

ContactParser.updateValue = function(tempContact, property, jCardIndex, content) {
    property.setValue(content);
};

ContactParser.removeContactDetail = function(tempContact, property, jCardIndex) {
  tempContact.jcards[jCardIndex].removeProperty(property);
};

ContactParser.addContactDetail = function(tempContact, name, content, type) {
  var property = tempContact.jcards[0].addPropertyWithValue(name, content);
  property.setParameter("type", type);
  return property;
};

ContactParser.updateOption = function(tempContact, property, jCardIndex, option) {
  property.setParameter("type", option);
}

ContactParser.rename = function(id, name, contactsList) {
  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].id == id) {
      contactsList[i].name = name;
      return;
    }
  }
};

ContactParser.deleteContact = function(contactsList, id) {
  var index = contactsList.findIndex(function(contact) {
    return contact.id == id;
  });
  contactsList.splice(index, 1);
  return contactsList;
};

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

ContactParser.equals = function(element, index, array) {
  if(Array.isArray(element)) {
    return element.every(ContactParser.equals, this[index]);
  }
  return element == this[index];
}
