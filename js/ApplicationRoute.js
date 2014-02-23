// Application Route
	
App.ApplicationRoute = Ember.Route.extend({

	activate: function() {
		//document.title = 'Pertino - People';
	},
	deactivate: function() {
		
	},
	beforeModel: function() {
		this.transitionTo('dashboard.index');
	},
	model: function(params) {
		return {};
	},
	setupController: function (controller) {
		controller.startIt();
	}

});