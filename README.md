# MultiLayer Cache
[![Build Status](https://travis-ci.org/alexandrajs/mlc.svg?branch=master)](https://travis-ci.org/alexandrajs/mlc)
[![Coverage Status](https://coveralls.io/repos/github/alexandrajs/mlc/badge.svg?branch=master)](https://coveralls.io/github/alexandrajs/mlc?branch=master)
[![Code Climate](https://codeclimate.com/github/alexandrajs/mlc/badges/gpa.svg)](https://codeclimate.com/github/alexandrajs/mlc)
## Installation
```bash
$ npm i alexandra-mlc
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
