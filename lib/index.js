import _ from 'lodash';
import es from 'elasticsearch';
import Bluebird from 'bluebird';
import validate from 'simple-validator';

const httpAwsEsBuilder = require('http-aws-es-di/connector');

export default function elasticSearchMixin(self, settings, AWS) {
	self.AWS = AWS;
	if (!_.isObject(settings)) {
		throw new Error('must provide elasticsearch configuration');
	}

	self.esHost = settings.host;
	self.awsRegion = settings.region;
	self.accessKey = settings.access_key;
	self.secretKey = settings.secret_key;
	self.signRequest = !!settings.signed;
	self.useEnvCreds = !!settings.use_env_creds;

	validate.required(self, 'esHost', _.isString);
	if (self.signRequest) {
		self.AWS = AWS;
		validate.required(self, 'AWS', _.isObject);
		validate.required(self, 'awsRegion', _.isString);
		if (self.useEnvCreds) {
			self.myCredentials = new self.AWS.EnvironmentCredentials('AWS');
		} else {
			validate.required(self, 'accessKey', _.isString);
			validate.required(self, 'secretKey', _.isString);
		}
	}

	self.getESClient = () => {

		return Bluebird.try(() => {
			const clientConfig = {
				hosts : self.esHost
			};

			if (self.signRequest) {
				clientConfig.connectionClass = httpAwsEsBuilder(self.AWS);
				clientConfig.amazonES = {
					region : self.awsRegion
				};

				if (self.useEnvCreds) {
					clientConfig.amazonES.credentials = self.myCredentials;
				} else {
					clientConfig.amazonES.accessKey = self.accessKey;
					clientConfig.amazonES.secretKey = self.secretKey;
				}
			}

			return new es.Client(clientConfig); // eslint-disable-line new-cap
		});
	};
}
