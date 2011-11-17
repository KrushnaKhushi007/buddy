# Builder

Builder is primarily a tooling framework for the compilation of higher order js/css languages (coffeescript/stylus/less). Additionally, by mimicking the Node.js module workflow, it promotes better code organization, and enables the automatic concatenation of js code for more efficient delivery to the browser.

## Installation

```bash
$ npm -g install git@github.com:popeindustries/builder.git
```

## Usage

```bash
$ cd path/to/my/project
$ build compile
$ build watch
$ build deploy
$ build --help
```

### Setup

The only requirement for adding Builder support to a project is the presence of a **build.json** file:

```json
{
	"version": "0.3.0",
	"js": {
		"sources": ["a/coffeescript/folder", "a/js/folder"],
		"targets": [
			{
				"in": "a/coffeescript/or/js/file",
				"out": "a/js/file/or/folder"
			},
			{
				"in": "a/coffeescript/folder",
				"out": "a/folder"
			}
		]
	},
	"css": {
		"sources": ["a/stylus/folder", "a/less/folder"],
		"targets": [
			{
				"in": "a/stylus/or/less/file",
				"out": "a/css/file/or/folder"
			},
			{
				"in": "a/stylus/or/less/folder",
				"out": "a/folder"
			}
		]
	}
}
```

For each build type (js/css), you begin by specifying source paths from which your build targets are referenced.
Each build target should specify an input and corresponding output file or folder. 
Targets are run in sequence enabling you to chain builds together.
As an example, you could compile a library, then reference some library files in your project:

```json
"js": {
	"sources": ["lib/src/coffee", "lib/js", "src"],
	"targets": [
		{
			"in": "lib/src/coffee",  <--a folder of coffee-script files (including nested folders)
			"out": "lib/js"          <--a folder of compiled js files
		},
		{
			"in": "src/main.js",  <--the application entry point referencing library dependencies
			"out": "js/main.js"   <--a concatenation of referenced dependencies
		}
	]
}
```

### Modules

Builder wraps each coffee-script/js file in a module declaration based on the file location. 
Dependencies (and concatenation order) are determined by the use of ***require*** statements:

```javascript
var lib = require('./my/lib'); // in current package
var SomeClass = require('../some_class'); // in parent package

lib.doSomething();
var something = new SomeClass();
```

Specifying a module's public behaviour is achieved by decorating an *exports* object:

```javascript
var myModuleVar = 'my module';

exports.myModuleMethod = function() { 
	return myModuleVar;
};
```

or overwriting the *exports* object completely:

```javascript
var MyModule = function() {
	this.myVar = 'my instance var';
};

MyModule.prototype.myMethod = function() {
	return this.myVar;
};

module.exports = MyModule;
```

Each module is provided with a ***module***, ***exports***, and ***require*** reference.

When *require*-ing a module, keep in mind that the module id is resolved based on the following rules:
- packages begin at the root folder specified in build.json > js > sources
- uppercase filenames are converted to lowercase module ids: 
```
'my/package/Class.js' > 'my/package/class'
```
- camelcase filenames are converted to lowercase/underscore module ids: 
```
'my/package/ClassCamelCase.js' > 'my/package/class_camel_case'
```

See [node.js modules](http://nodejs.org/docs/v0.6.0/api/modules.html) for more info on modules.

## License 

(The MIT License)

Copyright (c) 2011 Pope-Industries &lt;alex@pope-industries.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
