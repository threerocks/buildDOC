/* eslint-disable global-require */
global.Promise       = require('bluebird'), 
global.mkdirp        = require('mkdirp'),
global.dox           = require('dox'),
global.colors        = require('colors/safe'),
global.path          = require('path'),
global.co            = require('co'),

global.markdownBuild = require('./../src/markdownBuild'),
global.func          = require('./func'),
global.config        = require('./config'),
global.asyncFunc     = require('./asyncfunc.js');