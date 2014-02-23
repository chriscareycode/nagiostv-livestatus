

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
	//content:[],
	actions:{
		refresh: function(){
			console.info('refresh() before');
			console.dir(this.store);
			console.dir(this.get('content').content.length);

			this.doRefresh();
/*
			this.store.find('service').then(function(e){
				console.info('find() then');
				console.dir(e);
				console.dir(e.content);
			}); // this performs the lookup but does not replace the model data.. wtf
*/

			
			
			//this.store.model.reload();

			//console.dir(data.content);

		}
	},

	doRefresh: function() {






		//this.store.unloadAll('service');
		var that = this;

		this.store.findAll('service').then(function(results){
			console.info('findAll() results');

			console.dir(results);
			//console.dir(results.content);
			console.info('all loop:');

			// clear this store we will use to compare against
			that.store.unloadAll('serviceno');

			that.store.findAll('serviceno').then(function(results2){
				
				console.info('got in here no cache');


				that.store.all('service').forEach(function(record){
					
					//record.get('stateManager').send('becameClean');
					//record.get('stateManager').send('becameDirty');

					console.dir(record);

					console.dir(record.currentState);
					//console.info(record.currentState.notFound() == true);
					//record.currentState.reloadRecord();
					//console.dir(record.currentState);
					//console.info('found is ' + (record.currentState.notFound() == false));

					console.info('results2 is ');
					console.dir(results2);

					//if (!results2.contains(record)) {
					results.forEach(function(r){

						console.info('r loop');

						console.info(r.id);
						if (!that.store.recordIsLoaded(App.Serviceno, r.id)) {
							console.info('not found, now u unload');
							r.unloadRecord();
						}
						
					});
						
					//}
				});
			
			});
		
		
				

			/*
			record.content.forEach(function(e){

				console.info('forEach');
				console.dir(e);
				console.dir(e.currentState);
				console.info(e.currentState.notFound);
			});
	*/
			//console.dir(record.get('firstObject'));
		});




	},

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

	isUpdating: function() {
		return this.get('store').isUpdating;
	}.property('store.isUpdating')
});

App.Service = DS.Model.extend({
	
	name: DS.attr(),
	
	next_check: DS.attr(),
	last_check: DS.attr(),
	last_state_change: DS.attr(),
	acknowledged: DS.attr(),
	animate: DS.attr(),
	host_name: DS.attr(),
	host_address: DS.attr(),
	display_name: DS.attr(),
	description: DS.attr(),
	
	comments_with_info_1: DS.attr(),
	comments_with_info_2: DS.attr(),
	state_type: DS.attr(),
	plugin_output: DS.attr(),
	state: DS.attr(),
	status: DS.attr(),
	status_text: DS.attr(),
	status_border: DS.attr(),
	state_duration: DS.attr(),

	statusClassText: function() {
		var cc = "";
		switch(this.get('state')) {
			case 1:
				cc = "service-warning-text";
				break;
			case 2:
				cc = "service-critical-text";
				break;
			case 3:
				cc = "service-unknown-text";
				break;
			default:
				cc = "";
		}
		return cc;
	}.property('state')
	
});
App.Serviceno = App.Service.extend({});

/*
App.Serviceno = DS.Model.extend({
	
	name: DS.attr(),
	
	next_check: DS.attr(),
	last_check: DS.attr(),
	last_state_change: DS.attr(),
	acknowledged: DS.attr(),
	animate: DS.attr(),
	host_name: DS.attr(),
	host_address: DS.attr(),
	display_name: DS.attr(),
	description: DS.attr(),
	
	comments_with_info_1: DS.attr(),
	comments_with_info_2: DS.attr(),
	state_type: DS.attr(),
	plugin_output: DS.attr(),
	state: DS.attr(),
	status: DS.attr(),
	status_text: DS.attr(),
	status_border: DS.attr(),
	state_duration: DS.attr(),

	statusClassText: function() {
		var cc = "";
		switch(this.get('state')) {
			case 1:
				cc = "service-warning-text";
				break;
			case 2:
				cc = "service-critical-text";
				break;
			case 3:
				cc = "service-unknown-text";
				break;
			default:
				cc = "";
		}
		return cc;
	}.property('state')
	
});
*/
