reactTabType = {
  name: "reactTab",
  perTabPanel: "vbox",
  lastTabID: 0,
  modes: {
    reactTab: {
      type: "reactTab",
    },
  },
  open: function() {
    document.getElementById('tabmail')
      .openTab(
        'reactTab', 
        { contentPage: 'chrome://react/content/reactTab.xhtml' });
  },
  openTab: function(aTab, aArgs) {
    // First clone the page and set up the basics.
    let clone = document.getElementById("reactTab")
                        .firstChild
                        .cloneNode(true);

    clone.setAttribute("id", "reactTab" + this.lastBrowserId);
    clone.setAttribute("collapsed", false);

    let toolbox = clone.firstChild;
    toolbox.setAttribute("id",
                         "reactTabToolbox" + this.lastBrowserId);
    toolbox.firstChild
           .setAttribute("id",
                         "reactTabToolbar" + this.lastBrowserId);

    aTab.panel.appendChild(clone);
    aTab.root = clone;

    // Start setting up the browser.
    aTab.browser = aTab.panel.getElementsByTagName("browser")[0];
    aTab.toolbar = aTab.panel
                       .getElementsByClassName("reactTabToolbar")[0];

    // As we're opening this tab, showTab may not get called, so set
    // the type according to if we're opening in background or not.
    let background = ("background" in aArgs) && aArgs.background;
    aTab.browser.setAttribute("type", background ? "content-targetable" :
                                                   "content-primary");

    aTab.browser.setAttribute("id", "reactTabBrowser" + this.lastBrowserId);
    if ("onLoad" in aArgs) {
      aTab.browser.addEventListener("load", function _reactTab_onLoad (event) {
        aArgs.onLoad(event, aTab.browser);
        aTab.browser.removeEventListener("load", _reactTab_onLoad, true);
      }, true);
    }

    // TODO: l10n
    aTab.title = "react";
    aTab.browser.loadURI("chrome://react/content/reactTab.xhtml");

    this.lastBrowserId++;
  },
  closeTab: function(aTab) {
  },
  saveTabState: function(aTab) {
  },
  showTab: function(aTab) {
  },
  persistTab: function(aTab) {
  },
  restoreTab: function(aTab) {
  },
  onTitleChanged: function(aTab) {
  },
  supportsCommand: function(aCommand, aTab) {
  },
  isCommandEnabled: function(aCommand, aTab) {
  },
  doCommand: function(aCommand, aTab) {
  },
  getBrowser: function(aTab) {
  },
};

window.addEventListener("load", function(e) {
  // dump("\n\nRegistering react tab.\n\n");
  let tabmail = document.getElementById("tabmail");
  tabmail.registerTabType(reactTabType);
  // dump("\n\nAll done!\n\n");
}, false);
