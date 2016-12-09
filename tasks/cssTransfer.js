/*
 * grunt-csstransfer
 * https://github.com/chensonghao/grunt-csstransfer
 *
 * Copyright (c) 2016 chensonghao
 * Licensed under the MIT license.
 */

'use strict';
var cleanCSS = require('clean-css');
var fs = require('fs');
module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('csstransfer', 'The best Grunt plugin ever.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            punctuation: '.',
            separator: ', '
        });

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            // Concat specified files.
            var src = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });
            function cssMinifier(flieIn, fileOut) {
                var flieIn = Array.isArray(flieIn) ? flieIn : [flieIn];
                var finalCode = '';
                for (var i = 0; i < flieIn.length; i++) {
                    var origCode = fs.readFileSync(flieIn[i], 'utf8');
                    finalCode += new cleanCSS().minify(origCode).styles;
                }
                finalCode = finalCode.replace(/\\/g, '\\\\');
                finalCode = finalCode.replace(/"/g, '\\"');
                fs.writeFileSync(fileOut, 'module.exports="' + finalCode + '";', 'utf8');
                grunt.log.ok('file '+fileOut+' created.');
            }
            cssMinifier(src,f.dest);
        });
    });
};
