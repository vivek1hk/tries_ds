"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var TrieNode = /** @class */ (function () {
    function TrieNode(value) {
        this.value = value;
        this.eow = false;
        this.filePaths = [];
        this.children = {};
    }
    return TrieNode;
}());
exports.TrieNode = TrieNode;
var CreateTries = /** @class */ (function () {
    function CreateTries() {
        this.root = new TrieNode('.');
    }
    CreateTries.prototype.traverseDirs = function (directory) {
        var _this = this;
        fs.readdirSync(directory).forEach(function (File) {
            var absolute = path.join(directory, File);
            if (fs.statSync(absolute).isDirectory())
                return _this.traverseDirs(absolute);
            else {
                _this.indexEmails(absolute);
            }
        });
        fs.writeFileSync('/home/vivek/Pioneer/tries.txt', JSON.stringify(this.root));
    };
    CreateTries.prototype.indexEmails = function (filePath) {
        var file = fs.readFileSync(filePath, 'utf-8');
        var words = file.split(' ');
        for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
            var word = words_1[_i];
            this.insert(word, filePath);
        }
    };
    CreateTries.prototype.isLetter = function (l) {
        return l.toLowerCase() != l.toUpperCase();
    };
    CreateTries.prototype.insert = function (word, filePath) {
        var _this = this;
        var currentNode = this.root;
        var characters = __spreadArrays(word).filter(function (l) { return _this.isLetter(l); }).map(function (character) { return character.toLowerCase(); });
        characters.forEach(function (character) {
            if (currentNode.children[character] == undefined) {
                currentNode.children[character] = new TrieNode(character);
            }
            currentNode = currentNode.children[character];
        });
        currentNode.eow = true;
        currentNode.filePaths.push(filePath);
    };
    CreateTries.prototype.search = function (triePath, searchTerm) {
        var _this = this;
        var trieFile = fs.readFileSync(triePath, 'utf-8');
        var trieRoot = JSON.parse(trieFile);
        var currentNode = trieRoot;
        if (!searchTerm)
            return [];
        else {
            var characters = __spreadArrays(searchTerm).filter(function (l) { return _this.isLetter(l); }).map(function (character) { return character.toLowerCase(); });
            characters.forEach(function (character) {
                if (currentNode.children[character] !== undefined) {
                    currentNode = currentNode.children[character];
                }
            });
            return currentNode.filePaths;
        }
    };
    return CreateTries;
}());
console.time('watchTries');
var createTries = new CreateTries();
var rootDirectory = '/home/vivek/Pioneer/skilling-j';
createTries.traverseDirs(rootDirectory);
console.log(createTries.search('/home/vivek/Pioneer/tries.txt', '<markskilling@hotmail.com>'));
console.timeEnd('watchTries');
