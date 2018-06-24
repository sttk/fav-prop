# [@fav/prop][repo-url] [![Github.io][io-img]][io-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage status][coverage-img]][coverage-url]


Function set related to object properties for all versions of Node.js and major browsers.

> "fav" is an abbreviation of "favorite" and also the acronym of "for all versions".
> This package is intended to support all Node.js versions and many browsers as possible.
> At least, this package supports Node.js >= v0.10 and major Web browsers: Chrome, Firefox, IE11, Edge, Vivaldi and Safari.


## Install

To install from npm:

```sh
$ npm install --save @fav/prop
```

***NOTE:*** *npm < 2.7.0 does not support scoped package, but old version Node.js supports it. So when you use such older npm, you should download this package from [github.com][repo-url], and move it in `node_modules/@fav/prop` directory manually.*


## Usage

For Node.js:

```js
const prop = require('@fav/prop');

const enumOwnProps = prop.enumOwnProps;
enumOwnProps({ a: 1, b: 2, c: 3 }); // => ['a', 'b', 'c']
```

For Web browsers:

```html
<script src="fav.prop.min.js"></script>
<script>
var enumOwnProps = fav.prop.enumOwnProps;
enumOwnProps({ a: 1, b: 2, c: 3 }); // => ['a', 'b', 'c']
</script>
```


## API

This package provides API documents on [Github.io][api-url] or `docs/index.html` in this package.


## Checked

### Node.js (4〜)

| Platform  |   4    |   5    |   6    |   7    |   8    |   9    |   10   |
|:---------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|

### io.js (1〜3)

| Platform  |   1    |   2    |   3    |
|:---------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|

### Node.js (〜0.12)

| Platform  |  0.8   |  0.9   |  0.10  |  0.11  |  0.12  |
|:---------:|:------:|:------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|

### Web browsers

| Platform  | Chrome | Firefox | Vivaldi | Safari |  Edge  | IE11   |
|:---------:|:------:|:-------:|:-------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef; |&#x25ef; |&#x25ef;|   --   |   --   |
| Windows10 |&#x25ef;|&#x25ef; |&#x25ef; |   --   |&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef; |&#x25ef; |   --   |   --   |   --   |

## License

Copyright (C) 2018 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/fav-prop/
[api-url]: https://sttk.github.io/fav-prop/index.html
[io-img]: http://img.shields.io/badge/API-github.io-ff99cc.svg
[io-url]: https://sttk.github.io/fav-prop/index.html
[npm-img]: https://img.shields.io/badge/npm-v0.1.0-blue.svg
[npm-url]: https://www.npmjs.com/package/@fav/prop
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/licenses/MIT
[travis-img]: https://travis-ci.org/sttk/fav-prop.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/fav-prop
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/fav-prop?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/fav-prop
[coverage-img]: https://coveralls.io/repos/github/sttk/fav-prop/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/fav-prop?branch=master
