

/*
App.LivestatusAdapter = DS.Adapter.extend({
//App.ApplicationAdapter = DS.Adapter.extend({
//App.ApplicationAdapter = DS.RESTAdapter.extend({
	
	//namespace: 'livestatus/',
	baseurl: 'php-api/livestatus.html?q=',

	find: function(store, type, id) {

		console.info('find() from LivestatusAdapter');

		var url = this.baseurl + [type, id].join('/');

		return new Ember.RSVP.Promise(function(resolve, reject) {
			jQuery.getJSON(url).then(function(data) {
				Ember.run(null, resolve, data);
			}, function(jqXHR) {
				jqXHR.then = null; // tame jQuery's ill mannered promises
				Ember.run(null, reject, jqXHR);
			});
		});
	},

	findAll: function(store, type, sinceToken) {
		
		console.info('findAll() from LivestatusAdapter');

		var url = this.baseurl + type;
		var query = { since: sinceToken };
		return new Ember.RSVP.Promise(function(resolve, reject) {
			jQuery.getJSON(url, query).then(function(data) {
				Ember.run(null, resolve, data);
			}, function(jqXHR) {
				jqXHR.then = null; // tame jQuery's ill mannered promises
				Ember.run(null, reject, jqXHR);
			});
		});
	},

	findQuery: function(store, type, query) {
		var url = this.baseurl + type;
		return new Ember.RSVP.Promise(function(resolve, reject) {
			jQuery.getJSON(url, query).then(function(data) {
				Ember.run(null, resolve, data);
			}, function(jqXHR) {
				jqXHR.then = null; // tame jQuery's ill mannered promises
				Ember.run(null, reject, jqXHR);
			});
		});
	},

	createRecord: function(store, type, record) {
		var data = this.serialize(record, { includeId: true });
		var url = this.baseurl + type;

		return new Ember.RSVP.Promise(function(resolve, reject) {
			jQuery.ajax({
				type: 'POST',
				url: url,
				dataType: 'json',
				data: data
			}).then(function(data) {
				Ember.run(null, resolve, data);
			}, function(jqXHR) {
				jqXHR.then = null; // tame jQuery's ill mannered promises
				Ember.run(null, reject, jqXHR);
			});
		});
	},

	updateRecord: function(){

	},

	deleteRecord: function(store, type, record) {
		var data = this.serialize(record, { includeId: true });
		var id = record.get('id');
		var url = this.baseurl + [type, id].join('/');

		return new Ember.RSVP.Promise(function(resolve, reject) {
		jQuery.ajax({
		type: 'DELETE',
		url: url,
		dataType: 'json',
		data: data
		}).then(function(data) {
		Ember.run(null, resolve, data);
		}, function(jqXHR) {
		jqXHR.then = null; // tame jQuery's ill mannered promises
		Ember.run(null, reject, jqXHR);
		});
		});
	}
});

*/

//App.ApplicationAdapter = DS.LivestatusAdapter.extend({
	//namespace: 'nagiostv',
//});


DS.RESTAdapter.reopen({
	//url: 'api/4',
	//headers:{"HEADER": "value"}
	//namespace: '~chris/nagiostv-livestatus/php-api/fake'
	//namespace: '~chris/nagiostv-livestatus/php-api/livestatus.php?q='
	//namespace: 'debian7/livestatus.php?q='

	namespace: '/nagiostv-livestatus/php-api/livestatus.php?a=1&q='

	// for my debugging..
	//host: 'http://debian7',
	//namespace: 'nagiostv-livestatus/php-api/livestatus.php?a=1&q='
});

