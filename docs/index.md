# [@fav/prop][repo-url] ver. 1.0.0 API document

----

### <u>assign(dest [, ...srcs) : object</u>

Copys all enumerable own property keys and symbols from one or more source objects to a destination object and returns a destination object.

***NOTE:*** *This function behaves the same way as `Object.assign` except when the first argument is nullish and when properties of first argument object are read only. If the first argument is nullish, this function replace it to an empty plain object. If properties of first argument object are read only, this function ignore them and doesn't throw Errors.*

#### Parameters:

| Parameter |   Type   | Description              |
|-----------|:--------:|--------------------------|
| *dest*    |  object  | The destination object.  |
| *srcs*    |  object  | The source object(s).    |

#### Returns:

The destination object.

**Type:** object


----
### <u>assignDeep(dest, [, ...srcs]) : object</u>

Copys all enumerable own properties deeply from one or more source objects to a destination object and returns a destination object.
This function copys not only child properties but also descendants properties of source objects.

***NOTE:*** *This function copys enumerable own properties of srcs objects (top level objects) like `Object.assign`, but copys properties of child and descendant objects (lower level objects) like primitive properties when those properties are not plain objects.
For example:*

```
var src = new function() {
  this.a = { b: 1 };
  this.c = new function() { this.d = 2 };
};
console.log(src); // => { a: { b: 1 }, c: { d: 2 } }

var dest = assignDeep({}, src);
console.log(dest); // => { a: { b: 1 }, c: { d: 2 } }

dest === src // => false
dest.a === src.a // => false
dest.c === src.c // => true
```

***NOTE:*** *If the first argument is nullish, this function replace it to an empty plain object. If properties of first argument object are read only, this function ignore them and doesn't throw Errors.*

#### Parameters:

| Parameter |   Type   | Description              |
|-----------|:--------:|--------------------------|
| *dest*    |  object  | The destination object.  |
| *srcs*    |  object  | The source object(s).    |

#### Returns:

The destination object.

**Type:** object


----
### <u>defaults(dest [, ...src]) : object</u>

Copys enumerable own properties (both keys and symbols) of source objects to a destination object when each property value is null or undefined.
If a property value of a source object is null or undefined, the property is not copied.

***NOTE:*** *This function does not throw an error when copying a source property to a destination property which is read only.*

#### Parameters:

| Parameter |   Type   | Description               |
|-----------|:--------:|---------------------------|
| *dest*    |  object  | The destination object.   |
| *src*     |  object  | The source object(s).     |

#### Returns:

The destination object.

**Type:** object


----
### <u>defaultsDeep(dest [, ...src]) : object</u>

Copys enumerable own properties (both keys and symbols) of child and descendant objects of a source object to a destination object when each property value is null or undefined.
If a property value of a source object is null or undefined, the property is not copied.

***NOTE:*** *This function does not throw an error when copying a source property to a destination property which is read only.*

#### Parameters:

| Parameter |   Type   | Description               |
|-----------|:--------:|---------------------------|
| *dest*    |  object  | The destination object.   |
| *src*     |  object  | The source object(s).     |

#### Returns:

The destination object.

**Type:** object


----
### <u>define.immutable(obj, name, value) : void</u>

Defines an read-only and unenumerable property to the specified object.

#### Parameters:

| Parameter |   Type   | Description              |
|-----------|:--------:|--------------------------|
| *obj*     |  object  | The target object.       |
| *name*    |  string  | The property name.       |
| *value*   |  *any*   | The property value.      |

### <u>define.mutable(obj, name, value) : void</u>

Defines an writable and unenumerable property to the specified object.

#### Parameters:

| Parameter |   Type   | Description              |
|-----------|:--------:|--------------------------|
| *obj*     |  object  | The target object.       |
| *name*    |  string  | The property name.       |
| *value*   |  *any*   | The property value.      |

### <u>define.override(obj, name, fn) : void</u>

Redefines a property function of the specified object.

The original function can be accessed by <code>*name*.$uper</code>.

| Parameter |   Type   | Description              |
|-----------|:--------:|--------------------------|
| *obj*     |  object  | The target object.       |
| *name*    |  string  | The property name.       |
| *fn*      | function | The property function.   |

### <u>define.override(obj, namedFn) : void</u>

Redefines a property function of the specified object with named function.

The original function can be accessed by <code>*namedFn*.$uper</code>.


| Parameter |   Type   | Description              |
|-----------|:--------:|--------------------------|
| *obj*     |  object  | The target object.       |
| *namedFn* | function | The named function.      |

----
### <u>enumAllKeys(obj) : Array</u>

Lists enumerable own and inherited property keys of the given object.

This function returns property keys enumerated with "for-in", but returns an empty array if *obj* is nullish.

#### Parameter:

| Parameter |  Type  | Description                                |
|-----------|:------:|--------------------------------------------|
| *obj*     | object | The object to be listed its property keys. |

#### Return:

An array of property keys.

**Type:** Array


----
### <u>enumAllProps(obj) : Array</u>

Lists enumerable own and inherited property keys and symbols of the given object.

This function returns same properties enumerated with "for-in", but returns an empty array when *obj* is nullish.

#### Parameter:

| Parameter |  Type  | Description                                            |
|-----------|:------:|--------------------------------------------------------|
| *obj*     | object | The object to be listed its property keys and symbols. |

#### Return:

An array of property keys and symbols.

**Type:** Array


----
### <u>enumAllSymbols(obj) : Array</u>

Lists enumerable own and inherited property symbols of the given object.

This function returns same result with `Object.getOwnPropertySymbols` except that it returns an empty object when the argument is nullish. 

#### Parameter:

| Parameter |  Type  | Description                                   |
|-----------|:------:|-----------------------------------------------|
| *obj*     | object | The object to be listed its property symbols. |

#### Return:

An array of property symbols.

**Type:** Array


----
### <u>enumOwnKeys(obj) : Array</u>

Lists own enumerable property keys of a given object.

This function returns the same result of `Object.keys(obj)`, but returns an empty array if *obj* is nullish.

***NOTE:*** *The behavior of `Object.keys` is different between before and after of Node.js v0.12 when the argument is not an object.*


#### Parameter:

| Parameter |  Type  | Description                                |
|-----------|:------:|--------------------------------------------|
| *obj*     | object | The object to be listed its property keys. |

#### Return:

An array of property keys.

**Type:** Array


----
### <u>enumOwnProps(obj) : Array</u>

Lists enumerable own property keys and symbols of the given object.

This funciton returns an empty array when the argument is nullish.

#### Parameter:

| Parameter |  Type  | Description                                            |
|-----------|:------:|--------------------------------------------------------|
| *obj*     | object | The object to be listed its property keys and symbols. |

#### Return:

An array of property keys and symbols.

**Type:** Array


----
### <u>enumOwnSymbols(obj) : Array</u>

Lists enumerable own property symbols of a given object.

This function returns an empty array if *obj* is nullish.


#### Parameter:

| Parameter |  Type  | Description                                   |
|-----------|:------:|-----------------------------------------------|
| *obj*     | object | The object to be listed its property symbols. |

#### Return:

An array of property symbols.

**Type:** Array


----
### <u>getDeep(obj, propPath) : *any*</u>

Gets a property value in property tree of an object with a property path.

A property path is an array of keys/symbols which are passed from root to a target property in property tree of *obj* object.
For example, the property path of `c` in `{ a: { b: { c: 1 } } }` is `['a', 'b', 'c']`.

This function is targeted at all properties, which are enumerable and unenumerable, own and inherited.

***NOTE:*** *All versions of Node.js allows to use a string array for getting or setting property, like `obj[['a','b']] == obj['a,b']`. An Symbol array is allowed as same until v4, but is not allowed on v5 and later (TypeError is thrown).
To support same behaviors for all versions, this function does not allow to use an array as a property. (Thus, a property path needs to be always one dimensional array).*

**Parameters:**

| Parameter   | Type   | Description                         |
|:------------|:------:|:------------------------------------|
| *src*       | object | A source object.                    |
| *propPath*  | Array  | A property path of keys and symbols |

**Returns:**

A property value of a specified property path.


----
### <u>listOwnKeys(obj) : Array</u>

List enumerable and unenumerable own property keys of the given object.

This function returns the same result of `Object.getOwnPropertyNames` in strict mode except that this function returns an empty array when `obj` is nullish.

***NOTE:*** *The result of `Object.getOwnPropertyNames` for a function in strict mode is different between before and after Node.js (io.js) v3.
On v3 and later it doesn't contain the properties `arguments` and `callar`.
This function excludes `arguments` and `caller` properties even not in strict mode for same behaviors on all versions of Node.js.*

***NOTE:*** *On some browsers, Chrome, Safari, Vivaldi, Edge and IE, the result of `Object.getOwnPropertyNames` for a function in non-strict mode is different from in strict mode.
It contains the properties `arguments` and `caller`. 
This function excludes `arguments` and `caller` properties even not in strict mode for same behaviors on other platforms.*

***NOTE:*** *The results of `Object.getOwnPropertyNames` for a function on IE and a no name function on Edge are different from results on other browsers and Node.js.
Those do not contain `name` property.
This function appends `name` property to the result on IE or Edge for same behaviors on target browsers and Node.js*

***NOTE:*** *The value of `name` property of a no-name function is the first assigned variable's name on Node.js v6 or later, and that value is an empty string on the eariler.
This function does no treatment about this differeneces.*

***NOTE:*** *On some browsers, Chrome, Firefox, Safari, and Vivaldi, the `name` property of a no-name function is the first assigned variable's name. On Edge, that `name` property is an empty string. On IE, that `name` property is undefined.
This function does no treatment about this differeneces.*

#### Parameter:

| Parameter |  Type  | Description                                |
|-----------|:------:|--------------------------------------------|
| *obj*     | object | The object to be listed its property keys. |

#### Return:

An array of property keys.

**Type:** Array


----
### <u>listOwnProps(obj) : Array</u>

Lists enumerable and unenumerable own property keys and symbols of the given object.

This function returns an array of keys and symbols which are same with the concatenation of `Object.getOwnPropertyNames` and `Object.getOwnPropertySymbols` results in strict mode except that this function returns an empty array when `obj` is nullish.

***NOTE:*** *The result of `Object.getOwnPropertyNames` for a function in strict mode is different between before and after Node.js (io.js) v3.
On v3 and later it doesn't contain the properties `arguments` and `caller`.
This function excludes `arguments` and `caller` properties even not in strict mode for same behaviors on all versions of Node.js.*

***NOTE:*** *On some browsers, Chrome, Safari, Vivaldi, Edge and IE, the result of `Object.getOwnPropertyNames` for a function in non-strict mode is different from in strict mode.
It contains the properties `arguments` and `caller`. 
This function excludes `arguments` and `caller` properties even not in strict mode for same behaviors on other platforms.*

***NOTE:*** *The results of `Object.getOwnPropertyNames` for a function on IE and a no name function on Edge are different from results on other browsers and Node.js.
It does not contain `name` property.
This function appends `name` property to the result on IE or Edge for same behaviors on target browsers and Node.js*

***NOTE:*** *The value of `name` property of a no-name function is the first assigned variable's name on Node.js v6 or later, and that value is an empty string on the eariler.
This function does no treatment about this differeneces.*
 
***NOTE:*** *On some browsers, Chrome, Firefox, Safari, and Vivaldi, the `name` property of a no-name function is the first assigned variable's name. On Edge, that `name` property is an empty string. On IE, that `name` property is undefined.
This function does no treatment about this differeneces.*

#### Parameter:

| Parameter |  Type  | Description                                            |
|-----------|:------:|--------------------------------------------------------|
| *obj*     | object | The object to be listed its property keys and symbols. |

#### Return:

An array of property keys and symbols.

**Type:** Array


----
### <u>listOwnSymbols(obj) : Array</u>

Lists enumerable and unenumerable own property symbols of a given object.

This function returns an empty array if *obj* is nullish.


#### Parameter:

| Parameter |  Type  | Description                                   |
|-----------|:------:|-----------------------------------------------|
| *obj*     | object | The object to be listed its property symbols. |

#### Return:

An array of property symbols.

**Type:** Array


----
### <u>omit(src, omittedProps) : object</u>

Creates a new plain object and copies enumerable own properties (keys and symbols) of *src* object, but the properties which are included in *omittedProps* are omitted.

***NOTE:*** *All versions of Node.js allows to use a string array for getting or setting property, like `obj[['a','b']] == obj['a,b']`. An Symbol array is allowed as same until v4, but is not allowed on v5 and later (TypeError is thrown).
To support same behaviors for all versions, this function does not allow to use an array as a property.*

**Parameters:**

| Parameter      |  Type  | Description                                |
|:---------------|:------:|:-------------------------------------------|
| *src*          | object | A source object.                           |
| *omittedProps* | Array  | A property keys and symbols to be omitted. | 

**Returns:**

A plain object which is copied property keys and symbols of a source object.


----
### <u>omitDeep(src, omittedPropPaths) : object</u>

Creates a new plain object and copies child and descendant enumerable own properties (keys and symbols) of *src* object deeply, but the properties which are included in *omittedPropPaths* are omitted.

*omittedPropPaths* is an array of property paths. A property path is an array of keys/symbols which are passed from root to a target property in property tree of *src* object.
For example, the property path of `c` in `{ a: { b: { c: 1 } } } => ['a', 'b', 'c']`.

For a top property, a string key or a symbol can be specified. For omitting one property, a prperty path can be specified.

***NOTE:*** *All versions of Node.js allows to use a string array for getting or setting property, like `obj[['a','b']] == obj['a,b']`. An Symbol array is allowed as same until v4, but is not allowed on v5 and later (TypeError is thrown).
To support same behaviors for all versions, this function does not allow to use an array as a property. (Thus, a property path needs to be always one dimensional array).*

**Parameters:**

| Parameter          | Type   | Description                                       |
|:-------------------|:------:|:--------------------------------------------------|
| *src*              | object | A source object.                                  |
| *omittedPropPaths* | Array  | Property paths of keys and symbols to be omitted. |

**Returns:**

A plain object which is copied properties deeply except specified.


----
### <u>pick(src, pickedProps) : object</u>

Creates a new plain object and copies enumerable own properties (keys and symbols) of *src* object, and the copied properties are only included in *pickedProps*.

***NOTE:*** *All versions of Node.js allows to use a string array for getting or setting property, like `obj[['a','b']] == obj['a,b']`. An Symbol array is allowed as same until v4, but is not allowed on v5 and later (TypeError is thrown).
To support same behaviors for all versions, this function does not allow to use an array as a property.*

**Parameters:**

| Parameter      |  Type  | Description                                |
|:---------------|:------:|:-------------------------------------------|
| *src*          | object | A source object.                           |
| *pickedProps*  | Array  | A property keys and symbols to be copied. | 

**Returns:**

A plain object which is copied property keys and symbols of a source object.


----
### <u>pickDeep(src, pickedPropPaths) : object</u>

Creates a new plain object and copies child and descendant enumerable own properties (keys and symbols) of *src* object deeply, and the properties which are included in *pickedPropPaths* are picked.

*pickedPropPaths* is an array of property paths. A property path is an array of keys/symbols which are passed from root to a target property in property tree of *src* object.
For example, the property path of `c` in `{ a : { b: { c: 1 } } } => ['a', 'b', 'c']`.
For a top property, a string or a symbol can be specified.

***NOTE:*** *All versions of Node.js allows to use a string array for getting or setting property, like `obj[['a','b']] == obj['a,b']`. An Symbol array is allowed as same until v4, but is not allowed on v5 and later (TypeError is thrown).
To support same behaviors for all versions, this function does not allow to use an array as a property. (Thus, a property path needs to be always one dimensional array).*

**Parameters:**

| Parameter          | Type   | Description                                        |
|:-------------------|:------:|:---------------------------------------------------|
| *src*              | object | A source object.                                   |
| *pickedPropPaths*  | Array  | A property paths of keys and symbols to be copied. |

**Returns:**

A plain object which is copied property paths keys.


----
### <u>setDeep(obj, propPath, value) : Void</u>

Sets a property value in property tree of an object with a property path.

A property path is an array of keys/symbols which are passed from root to a target property in property tree of *obj* object.
For example, the property path of `c` in `{ a: { b: { c: 1 } } }` is `['a', 'b', 'c']`.
For a top property, a string or a symbol can be specified.

This function is targeted at all properties, which are enumerable and unenumerable, own and inherited.
If target property is read only, this function does nothing and throws no error. 

***NOTE:*** *All versions of Node.js allows to use a string array for getting or setting property, like `obj[['a','b']] == obj['a,b']`. An Symbol array is allowed as same until v4, but is not allowed  on v5 and later (TypeError is thrown). To support same behaviors for all versions, this function does not allow to use an array as a property. (Thus, a property path needs to be always one dimensional array).*

**Parameters:**

| Parameter   | Type   | Description                          |
|:------------|:------:|:-------------------------------------|
| *src*       | object | A source object.                     |
| *propPath*  | Array  | A property path of keys and symbols. |
| *value*     | *any*  | A value to be set to target property.|


----
### <u>visit(obj, fn) : Void</u>

Visits each nodes in a plain object tree.
This function deeply traces property nodes which are plain objects only, and apply a given function to enumerable and own properties (keys and symbols) of the traced property nodes.

#### Parameters:

| Parameter |   Type   | Description                                        |
|-----------|:--------:|----------------------------------------------------|
| *obj*     | object   | A plain object to be traced its properties deeply. |
| *fn*      | function | A function to be applied to visited properties.    | 

The second argument function is passed following parameters, and the return value of this function controls if this function is applied to child and descendant properties of current property.

* **APIs of the second argument function**

    **Parameter:**

    <table>
    <thead>
    <tr>
     <th>Parameter</th>
     <th>Type</th>
     <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
     <td><i>key</i></td>
     <td>string</td>
     <td>A key of current property.</td>
    </tr>
    <tr>
     <td><i>value</i></td>
     <td><i>any</i></td>
     <td>A value of current property.</td>
    </tr>
    <tr>
     <td><i>index</i></td>
     <td>number</td>
     <td>Index of current property among sibling properties.</td>
    </tr>
    <tr>
     <td><i>count</i></td>
     <td>number</td>
     <td>Count of sibling properties.</td>
    </tr>
    <tr>
     <td><i>parentKeys</i></td>
     <td>Array</td>
     <td>An array which contains keys of ancestor properties and represents a trace path to current property. Also, the length of this array suggests the <i>depth</i> of property tree.</td>
    </tr>
    <tr>
     <td><i>parentNode</i></td>
     <td>object</td>
     <td>A plain object which is a parent node.</td>
    </tr>
    </tbody>
    </table>

    **Returns:**

    True, if stop digging child and descendant properties.

    **Type:** boolean

----
[repo-url]: https://github.com/sttk/fav-prop/
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/licenses/MIT

