'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _2 = require('./');

var _3 = _interopRequireDefault(_2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe('AWSElasticSearchMixin', function suite() {

	var settings = {
		'signed': false,
		'host': 'localhost:9200',
		'region': 'us-east-1',
		'access_key': 'xxxx_access',
		'secret_key': 'xxx_secret',
		'index': 'github',
		'type': 'repo'
	};

	it('can mixin into a constructor to provide a valid es client object without AWS object', function () {
		var MyClass = function MyClass(_settings, _aws) {
			_classCallCheck(this, MyClass);

			(0, _3.default)(this, _settings, _aws);
		};

		return new MyClass(settings).getESClient().tap(function (x) {
			return _lodash2.default.isFunction((0, _assert2.default)(x.bulk));
		}).tap(function (x) {
			return _lodash2.default.isFunction((0, _assert2.default)(x.create));
		}).then(function (x) {
			return _lodash2.default.isFunction((0, _assert2.default)(x.delete));
		});
	});

	it('will throw an error if ot passed in settings', function () {
		var MyClass = function MyClass(_settings, _aws) {
			_classCallCheck(this, MyClass);

			(0, _3.default)(this, undefined, _aws);
		};

		_assert2.default.throws(function () {
			return new MyClass(settings);
		});
	});

	it('will work pass back client object with signed requests', function () {
		var tSettings = _lodash2.default.clone(settings);
		tSettings.signed = true;

		var MyClass = function MyClass(_settings, _aws) {
			_classCallCheck(this, MyClass);

			(0, _3.default)(this, _settings, _aws);
		};

		return new MyClass(tSettings, _awsSdk2.default).getESClient().tap(function (x) {
			return _lodash2.default.isFunction((0, _assert2.default)(x.bulk));
		}).tap(function (x) {
			return _lodash2.default.isFunction((0, _assert2.default)(x.create));
		}).then(function (x) {
			return _lodash2.default.isFunction((0, _assert2.default)(x.delete));
		});
	});

	it('will work when use_env_creds is set to true', function () {
		var tSettings = _lodash2.default.clone(settings);
		tSettings.signed = true;
		tSettings.use_env_creds = true; // eslint-disable-line camelcase

		var MyClass = function MyClass(_settings, _aws) {
			_classCallCheck(this, MyClass);

			(0, _3.default)(this, _settings, _aws);
		};

		return new MyClass(tSettings, _awsSdk2.default).getESClient().tap(function (x) {
			return _lodash2.default.isFunction((0, _assert2.default)(x.bulk));
		}).tap(function (x) {
			return _lodash2.default.isFunction((0, _assert2.default)(x.create));
		}).then(function (x) {
			return _lodash2.default.isFunction((0, _assert2.default)(x.delete));
		});
	});
});