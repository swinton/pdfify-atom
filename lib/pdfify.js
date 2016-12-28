'use babel';

var exec = require('child_process').exec;

import {
    CompositeDisposable
} from 'atom';

export default {

    subscriptions: null,

    activate(state) {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register pdfify command
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'pdfify:pdfify': () => this.pdfify()
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    serialize() {
        return {};
    },

    pdfify() {
        var editor = atom.workspace.getActiveTextEditor(),
            path   = editor.getPath();

        // Ensure GitHub Markdown
        if (editor.getGrammar().name.toLowerCase() !== "github markdown") {
            atom.confirm({
                message        : "Must be a Markdown file",
                detailedMessage: "Only Markdown files can be PDFified",
                buttons        : ["OK"]
            });
            return;
        }

        // Ensure file exists
        if (typeof editor.getPath() === "undefined") {
            atom.confirm({
                message        : "File must be saved",
                detailedMessage: "Please save the file before running PDFify",
                buttons        : ["OK"]
            });
            return;
        }

        // Execute pdfify on current file
        var cmd = "pdfify %s".replace("%s", path);
        exec(cmd, function(error, stdout, stderr) {
            console.log("error", error);
            console.log("stdout", stdout);
            console.log("stderr", stderr);
            
            // Open rendered PDF if pdf-view package is installed
            if (atom.packages.isPackageActive("pdf-view")) {
                atom.open({
                    pathsToOpen: path.replace(/\.md$/, ".pdf"),
                    newWindow: false
                });
            }
        });
    }

};
