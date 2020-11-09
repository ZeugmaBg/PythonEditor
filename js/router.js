(function() {
  var editorRoot = $("#js-editor_root");
  var helpLink = $('#js-version_help_link');
  var router = new Navigo(window.location.origin, false);
  router.historyAPIUpdateMethod('replaceState');


  var VERSIONS = {
    "stable": "2.0",
    "supported": {
      "0.1.0": "https://python-editor-0-1-0.microbit.org",
      "1.0.0": "https://python-editor-1-0-0.microbit.org",
      "1.1.0": "https://python-editor-1-1-0.microbit.org",
      "1.1.1": "https://python-editor-1-1-1.microbit.org",
      "1.1.2": "https://python-editor-1-1-2.microbit.org",
      "1.1.3": "https://python-editor-1-1-3.microbit.org",
      "1.1.4": "https://python-editor-1-1-4.microbit.org",
      "1.1.5": "https://python-editor-1-1-5.microbit.org",
      "2.0.0": "https://python-editor-2-0-0.microbit.org",
      "2.0.1": "https://python-editor-2-0-1.microbit.org",
      "alpha": "https://python-editor-2-1-0-beta-6.microbit.org",
      "beta": "https://python-editor-2-1-0-beta-6.microbit.org"
    },
    "pointers": {
      "0": "0.1.0",
      "1": "1.1.5",
      "2": "2.0.1",
      "1.0": "1.0.0",
      "1.1": "1.1.5",
      "2.0": "2.0.1"
    }
  };

  router.on({
    "v/:version_id": function (params, query) {
      var version = resolveVersion(params.version_id);

      if (version == null) {
        showError();
        return;
      }

      updateLangAttr(query);
      var baseUrl = VERSIONS.supported[version];
      var editorUrl = appendQuery(baseUrl, query);

      // Update versioner python link to reference help for loaded version
      helpLink.attr('href', baseUrl + '/help.html');

      // Load the editor
      loadEditor(editorUrl);

      // Display message box informing user of v2 release
      if (version === '2.0.0') {
        $.getScript('/js/messagealert.js');
      } else {
        $(".banner-msg").hide();
      }
    },
    "*": function(_, query) {
      var url = "/v/" + VERSIONS.stable;
      router.navigate(appendQuery(url, query));
      $.getScript('/js/messagealert.js');
    }
  });

  router.notFound(function(query) { editorRoot.html("<h1>404</h1>"); });
  router.resolve();
 
  function updateLangAttr(langparam){
    var reg = /l=[^&;#]*/g;
    var queryString = "l=";
    var lang = langparam.match(reg);
    if (lang){
      newlang = lang[0].substring(queryString.length);
      document.getElementsByTagName("HTML")[0].setAttribute("lang", newlang);
    }
  }

  function resolveVersion(version) {
    // TODO: update me to add version bumping when required
    if (VERSIONS.pointers.hasOwnProperty(version)) {
      return VERSIONS.pointers[version];
    } else if (VERSIONS.supported.hasOwnProperty(version)) {
      return version
    }
  }

  function showError () {
    editorRoot.html('<div align="center" width="100%"><div class="warning-container"><h1>This version of the Python Editor doesn\'t exist.</h1><p>You\'ve tried to visit a version of the Python Editor that doesn\'t exist. Try the latest version of the editor at <a href="/">https://python.microbit.org/</a>.</p></div></div>');
  }

  function loadEditor(url) {
    var migration = getMigratedProject();

    console.log(migration);

    if(migration == null){
        console.log("no project");
        var iframe = "<div class=\"iframeOverlay\"></div><iframe src=\"" + url + "\" id=\"js-active_editor\" title=\"editor\" frameborder=\"0\" scrolling=\"no\" allow=\"usb\"></iframe>";
    } else if(migration.indexOf("#import") > -1){
        migration = migration.substring(migration.indexOf("#project"));
        console.log("importing");
        console.log(migration);
        var iframe = "<div class=\"iframeOverlay\"></div><iframe src=\"" + url + migration + "\" id=\"js-active_editor\" title=\"editor\" frameborder=\"0\" scrolling=\"no\" allow=\"usb\"></iframe>";
    } else {
        console.log("import ?");
        var iframe = "<div class=\"iframeOverlay\"></div><iframe src=\"/import.html" + migration + "\" id=\"js-active_editor\" title=\"editor\" frameborder=\"0\" scrolling=\"no\" allow=\"usb\"></iframe>";
    }

    return editorRoot.html(iframe);
  }

  function appendQuery(url, query) {
    if (query !== "") {
      return url.concat("?" + query);
    }

    return url;
  }

})();

// Script migration
function getMigratedProject(){
    
  var migration_url = window.location.href;
  var migration = migration_url.substring(migration_url.indexOf('#'));

  if(migration.charAt(0) == "#"){
      return migration;
  } else {
      return null;
  }

}
