/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @desc Deals with handling of URLs for displaying images
 **/
function Images() { };

/**
* @desc Revokes a URL given for an image
* @param {Blob} photo The image to revoke a URL for
**/
Images.handleURLRevoke = function(photo) {
  URL.revokeObjectURL(photo);
};

/**
* @desc Gets a URL to a photo if it exists, or provides a default contact image
* @param {Blob} photo The image to get a URL for
**/
Images.getPhotoURL = function(photo) {
  if (photo) {
      return URL.createObjectURL(photo)
  }
  return "images/1.jpg";
}