var xmldom = require('xmldom');
var url = require('url');

function XMLConfig() {
	this._data = {};
}

XMLConfig.prototype.set = function(section, item, value) {
	if (!this._data[section]) {
		this._data[section] = {};
	}
	this._data[section][item] = value;
};

XMLConfig.prototype.get = function(section, item, defaultValue) {
	return this._data[section]? (this._data[section][item] || defaultValue) : defaultValue;
};

XMLConfig.prototype.sections = function() {
	return Object.keys(this._data);
};

XMLConfig.prototype.items = function(section) {
	return this._data[section];
};

XMLConfig.prototype.parse = function(xmlText) {
	var parser = new xmldom.DOMParser();
	this.document = parser.parseFromString(xmlText);

	this.parsePackage();
	this.parseCombines();
	this.parseLibraries();
	this.parseCompilers();
};

/**
 * [package]
 * id = 
 * source_dir = src
 * resource_dir = res
 * library_dir = lib
 */
XMLConfig.prototype.parsePackage = function() {
	var doc = this.document;
	this.set('package', 'id', doc.documentElement.getAttribute('id') || doc.documentElement.getAttribute('url'));
	var sourceElement = doc.getElementsByTagName('source')[0];
	if (sourceElement) {
		this.set('package', 'source_dir', sourceElement.getAttribute('dir'));
	}
	var resourceElement = doc.getElementsByTagName('resource')[0];
	if (resourceElement) {
		this.set('package', 'resource_dir', resourceElement.getAttribute('dir'));
	}
	var libraryElement = doc.getElementsByTagName('library')[0];
	if (libraryElement) {
		this.set('package', 'library_dir', libraryElement.getAttribute('dir'));
	}
};

/**
 * [combines]
 * a.js = b.js, c.js, d.js
 */
XMLConfig.prototype.parseCombines = function() {
	var doc = this.document;
	var sourceElement = doc.getElementsByTagName('source')[0];
	if (!sourceElement) {
		return;
	}
	var combineElements = sourceElement.getElementsByTagName('combine');
	var combineElement;
	var includeElements;
	var includeElement;
	var includePath, includeModule;
	var key, includes;
	if (combineElements) {
		for (var i = 0; i < combineElements.length; i++) {
			combineElement = combineElements[i];
			key = combineElement.getAttribute('path');
			includeElements = combineElement.getElementsByTagName('include');
			includes = [];
			for (var j = 0; j < includeElements.length; j++) {
				includeElement = includeElements[j];
				includePath = includeElement.getAttribute('path');
				includeModule = includeElements[j].getAttribute('module');
				if (includePath) {
					includes.push(includePath);
				} else {
					includes.push('module:' + includeModule);
				}
			}
			this.set('combines', key, includes.join(', '));
		}
	}
};

/**
 * [librares]
 * folder_name = other_package_id
 */
XMLConfig.prototype.parseLibraries = function() {
	var doc = this.document;
	var libraryElement = doc.getElementsByTagName('library')[0];
	var folderElements;
	var folderElement;
	if (libraryElement) {
		folderElements = libraryElement.getElementsByTagName('folder');
		folderElement;
		if (folderElements) {
			for (var i = 0; i < folderElements.length; i++) {
				folderElement = folderElements[i];
				this.set('libraries', folderElement.getAttribute('name'), folderElement.getAttribute('url'));
			}
		}
	}
};

/**
 * [builders]
 * .js = javascript
 * .css = css
 */
XMLConfig.prototype.parseCompilers = function() {
	var doc = this.document;
	var sourceElement = doc.getElementsByTagName('source')[0];
	var builderElements, builderElement;
	if (sourceElement) {
		builderElements = sourceElement.getElementsByTagName('builder');
		for (var i = 0; i < builderElements.length; i++) {
			builderElement = builderElements[i];
			this.set('builders', builderElement.getAttribute('ext'), builderElement.getAttribute('engine'));
		}
	}
};

exports.XMLConfig = XMLConfig;
