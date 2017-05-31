# MultiLayer Cache
[![Build Status](https://travis-ci.org/alexandrajs/mlc.svg?branch=master)](https://travis-ci.org/alexandrajs/mlc)

## Installation
```bash
$ npm i alexandrajs-mlc
```
## Usage
```javascript
const MLC = require('alexandrajs-mlc');
const mlc = new MLC();

// Add some compatible caches
mlc.use(new AIM());
mlc.use(new Redis());

// Use it as single cache
```
## API docs
[AlexandraJS MultiLayer Cache API](http://alexandrajs.github.io/mlc/)
