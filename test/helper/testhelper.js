// Some test helper
'use strict';
var assert = require('chai').assert;
var CleanCSS = require('clean-css');
var fs = require('fs');
var path = require('path');
var nn = require('normalize-newline');

function readAndRemove(file) {
    var content = read(file);
    fs.unlinkSync(path.join(__dirname, '..', file));
    return content;
}

function read(file, minify) {
    var content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    return minify ? new CleanCSS().minify(content).styles : content;
}

/**
 * Do some tests on the result
 * @param target
 * @param expected
 * @param done
 * @returns {Function}
 */
function assertCritical(target, expected, done) {
    return function (err, output) {
        assert.isNull(err, !!err && err);
        assert.isDefined(output, 'Should produce output');

        var dest = readAndRemove(path.join('fixtures', target));

        assert.strictEqual(nn(dest), nn(expected));
        assert.strictEqual(nn(output), nn(expected));

        done();
    };
}

module.exports = {
    assertCritical: assertCritical,
    read: read
};
