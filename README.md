# aws-elasticsearch-mixin

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
