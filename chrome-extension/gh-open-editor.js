(function() {
    "use strict";

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var pjaxContainer = document.getElementById('js-repo-pjax-container');

    var obs = new MutationObserver(function(mutations, observer) {
        for(var i=0; i<mutations.length; ++i) {
            for(var j=0; j<mutations[i].addedNodes.length; ++j) {
                if(mutations[i].addedNodes[j].className == "frame") {
                    injectOpenLinks();
                }
            }
        }
    });

    obs.observe(pjaxContainer, {
      childList: true,
      subtree: true
    });

    function getRepoInformation() {
        var element = document.getElementById('js-command-bar-field');

        return {
            owner:  element.getAttribute('data-username'),
            name:   element.getAttribute('data-repo'),
            branch: element.getAttribute('data-branch'),
            sha:    element.getAttribute('data-sha'),
        };
    }

    var repo = getRepoInformation();

    function getEditorUri(repo, branch, path, line, column) {
        var uri = '';

        uri += 'github-editor://' + repo + '/' + path + '?branch=' + branch;

        if (line || column) {
            uri += '&line=' + (line || 0);

            if (column) {
                uri += '&column=' + column;
            }
        }

        return uri;
    }

    function injectOpenLinks() {
        var button, path;
        var buttonGroup = document.querySelector('[data-type="blob"] .file .meta .actions .button-group');

        for (var i = 0, node; i < buttonGroup.childNodes.length; i++) {
            node = buttonGroup.childNodes[i];

            if (node.nodeName === 'A') {
                if (node.pathname.indexOf('/' + repo.name + '/') === 0) {
                    path = node.pathname.substring(repo.name.length + 2);
                    path = path.substring(path.indexOf('/') + 1);

                    if (path.indexOf(repo.branch + '/') === 0) {
                        path = path.substring(repo.branch.length + 1);
                    } else {
                        path = '';
                    }
                }
            }
        }

        if (buttonGroup && path)
        {
            button = document.createElement('a');
            button.className = 'btn minibutton';
            button.setAttribute('data-github-open-editor', '');
            button.setAttribute('href', getEditorUri(repo.name, repo.branch, path, 0, 0));
            button.innerHTML = 'Open';

            buttonGroup.insertBefore(button, buttonGroup.firstChild);
        }
    }

    injectOpenLinks();
})();
