# MultiLayer Cache

[![Build Status](https://travis-ci.org/alexandrajs/aMule.svg?branch=master)](https://travis-ci.org/alexandrajs/aMule)
[![Coverage Status](https://coveralls.io/repos/github/alexandrajs/aMule/badge.svg?branch=master)](https://coveralls.io/github/alexandrajs/aMule?branch=master)
[![Code Climate](https://codeclimate.com/github/alexandrajs/aMule/badges/gpa.svg)](https://codeclimate.com/github/alexandrajs/aMule)

## Installation
```bash
$ npm i amule --save
```

## Usage
```javascript
const AMule = require('amule');
const amule = new AMule();

// Add some compatible caches
amule.use(new AIM());
amule.use(new Redis());

// Use it as single cache
```

## API docs
[AlexandraJS MultiLevel Cache API](http://alexandrajs.github.io/aMule/)
