window.addEventListener("load", function(e) { 
    // openReactTab();
}, false);

function get3PaneTabmail() {
  let mail3Pane = Services.wm.getMostRecentWindow("mail:3pane");
  if (!mail3Pane) {
    return false;
  }

  let tabmail = mail3Pane.document.getElementById('tabmail');

  if (!tabmail) {
    return false;
  }
  return tabmail;
}

function openReactTab() {
  let tabmail = get3PaneTabmail();
  if (tabmail) {
    tabmail.openTab("reactTab", { });
  }
}
