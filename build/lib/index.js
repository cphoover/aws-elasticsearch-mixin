'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = elasticSearchMixin;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _elasticsearch = require('elasticsearch');

var _elasticsearch2 = _interopRequireDefault(_elasticsearch);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _simpleValidator = require('simple-validator');

var _simpleValidator2 = _interopRequireDefault(_simpleValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var httpAwsEsBuilder = require('http-aws-es-di/connector');

function elasticSearchMixin(self, settings, AWS) {
	self.AWS = AWS;
	if (!_lodash2.default.isObject(settings)) {
		throw new Error('must provide elasticsearch configuration');
	}

	self.esHost = settings.host;
	self.awsRegion = settings.region;
	self.accessKey = settings.access_key;
	self.secretKey = settings.secret_key;
	self.signRequest = !!settings.signed;
	self.useEnvCreds = !!settings.use_env_creds;

	_simpleValidator2.default.required(self, 'esHost', _lodash2.default.isString);
	if (self.signRequest) {
		self.AWS = AWS;
		_simpleValidator2.default.required(self, 'AWS', _lodash2.default.isObject);
		_simpleValidator2.default.required(self, 'awsRegion', _lodash2.default.isString);
		if (self.useEnvCreds) {
			self.myCredentials = new self.AWS.EnvironmentCredentials('AWS');
		} else {
			_simpleValidator2.default.required(self, 'accessKey', _lodash2.default.isString);
			_simpleValidator2.default.required(self, 'secretKey', _lodash2.default.isString);
		}
	}

	self.getESClient = function () {

		return _bluebird2.default.try(function () {
			var clientConfig = {
				hosts: self.esHost
			};

			if (self.signRequest) {
				clientConfig.connectionClass = httpAwsEsBuilder(self.AWS);
				clientConfig.amazonES = {
					region: self.awsRegion
				};

				if (self.useEnvCreds) {
					clientConfig.amazonES.credentials = self.myCredentials;
				} else {
					clientConfig.amazonES.accessKey = self.accessKey;
					clientConfig.amazonES.secretKey = self.secretKey;
				}
			}

			return new _elasticsearch2.default.Client(clientConfig); // eslint-disable-line new-cap
		});
	};
}