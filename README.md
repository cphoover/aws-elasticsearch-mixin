# aws-elasticsearch-mixin

[![Build Status](https://semaphoreci.com/api/v1/cphoover/aws-elasticsearch-mixin/branches/master/badge.svg)](https://semaphoreci.com/cphoover/aws-elasticsearch-mixin)

exposes `this.getESClient` method on body of object using mixin

## Usage

```
import AWSElasticSearchMixin from 'aws-elasticsearch-mixin';

class MyClass {
	constructor(settings, AWS) {
		AWSElasticSearchMixin(this, settings.es, AWS);
	}

	run() {
		return this.getESClient()
			.then((client) => doStuff(client));
	}
}
