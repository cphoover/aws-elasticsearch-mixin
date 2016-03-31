import assert from 'assert';
import awsElasticSearchMixin from './';
import _ from 'lodash';
import AWS from 'aws-sdk';

describe('AWSElasticSearchMixin', function suite() {

	const settings = {
		'signed' : false,
		'host' : 'localhost:9200',
		'region' : 'us-east-1',
		'access_key' : 'xxxx_access',
		'secret_key' : 'xxx_secret',
		'index' : 'github',
		'type' : 'repo'
	};

	it('can mixin into a constructor to provide a valid es client object without AWS object', function () {
		class MyClass {
			constructor(_settings, _aws) {
				awsElasticSearchMixin(this, _settings, _aws);
			}
		}

		return new MyClass(settings)
			.getESClient()
			.tap(x => _.isFunction(assert(x.bulk)))
			.tap(x => _.isFunction(assert(x.create)))
			.then(x => _.isFunction(assert(x.delete)));
	});

	it('will throw an error if ot passed in settings', function () {
		class MyClass {
			constructor(_settings, _aws) {
				awsElasticSearchMixin(this, undefined, _aws);
			}
		}

		assert.throws(() => {
			return new MyClass(settings);
		});

	});

	it('will work pass back client object with signed requests', function () {
		const tSettings = _.clone(settings);
		tSettings.signed = true;
		class MyClass {
			constructor(_settings, _aws) {
				awsElasticSearchMixin(this, _settings, _aws);
			}
		}

		return new MyClass(tSettings, AWS)
			.getESClient()
			.tap(x => _.isFunction(assert(x.bulk)))
			.tap(x => _.isFunction(assert(x.create)))
			.then(x => _.isFunction(assert(x.delete)));
	});

	it('will work when use_env_creds is set to true', function () {
		const tSettings = _.clone(settings);
		tSettings.signed = true;
		tSettings.use_env_creds = true; // eslint-disable-line camelcase
		class MyClass {
			constructor(_settings, _aws) {
				awsElasticSearchMixin(this, _settings, _aws);
			}
		}

		return new MyClass(tSettings, AWS)
			.getESClient()
			.tap(x => _.isFunction(assert(x.bulk)))
			.tap(x => _.isFunction(assert(x.create)))
			.then(x => _.isFunction(assert(x.delete)));
	});

});
