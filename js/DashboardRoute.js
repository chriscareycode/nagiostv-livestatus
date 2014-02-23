

App.DashboardRoute = Ember.Route.extend({
	model: function(params) {
		console.info('App.DashboardRoute model()');
		var data = this.store.find('service');
		return data;
	},
	
	setupController: function(controller, model) {
		console.info('App.DashboardRoute setupController()');
		this._super(controller, model);
	}
});

App.DashboardIndexRoute = Ember.Route.extend({
	model: function(params) {
		console.info('App.DashboardIndexRoute model()');
		return this.modelFor('dashboard');
	},
	
	setupController: function(controller, model) {
		console.info('App.DashboardIndexRoute setupController()');
		this._super(controller, model);
	}
});

App.DashboardController = Ember.ObjectController.extend({
	
	sortProperties:['last_state_change'],
	sortAscending: true,

	actions:{
		refresh: function(){
			this.doRefresh();
		}
	},

	doRefresh: function() {

		var that = this;

		this.store.findAll('service').then(function(results){
			
			// clear this store we will use to compare against
			that.store.unloadAll('serviceno');
			// get a fresh list of services
			that.store.findAll('serviceno').then(function(results2){
				// loop through the items we have and compare against the fresh list
				that.store.all('service').forEach(function(record){		
					results.forEach(function(r){
						if (!that.store.recordIsLoaded(App.Serviceno, r.id)) {
							r.unloadRecord();
						}
					});
				});
			});
		
		}); // end findAll

	}, // doRefresh

	init: function() {
	
        console.info('@@@ DashboardController init()');
		this._super();

		var that = this;

		setInterval(function(){
			that.doRefresh();
		}, 5000)
	},

	deleteOldRows: function() {
		console.info('deleteOldRows');
	},

	

/*
	nagios_services_empty: function() {
		
		var ns = this.get('content');
		
		App.info('nagios_services_empty autofiring');
		App.info(ns);
		
		if (ns.length === 0) {
			return true;
		} else if(ns.length === 1) {
			// sometimes the last item is there and undefined
			// lame hack for a lame bug
			if (typeof(ns[0].host_address) === "undefined" || ns[0].host_address === "undefined") {
				return true;
			} else {
				return false;
			}
			
		} else {
			return false;
		}
	}.property('content', 'content.length'),
	*/

	nagios_services_unacked_empty: function() {
	
		//var unacked = this.get('content').filter(function(elem){
		//  return elem.get('acknowledged') === 0;
		//});
		//var unacked = this.get('nagios_services_filter_unacked');
		var unacked = 0;
		this.get('content').forEach(function(s){
			if (s.get('acknowledged') === 0) unacked++;

		});
		return (unacked === 0 ? true : false);
	}.property('content.@each.acknowledged'),

	nagios_services_acked_empty: function() {
	
		//var acked = this.get('content').filter(function(elem){
		//  return elem.get('acknowledged') === 1;
		//});
		var acked = 0;
		this.get('content').forEach(function(s){
			//console.dir(s);
			if (s.get('acknowledged') === 1) acked++;

		});
		return (acked === 0 ? true : false);
	}.property('content.@each.acknowledged')



});



