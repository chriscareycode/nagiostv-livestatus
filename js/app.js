// working mod_wsgi to query mk_livestatus
// http://10.69.0.8/wsgi/live.py?command=GET%20contacts%0AColumns:%20name%20alias


(function() {


	// Create the EmberJS Application
	window.App = Ember.Application.create({
		LOG_TRANSITIONS: true
	});
	
	App.refreshServices = 15;
	App.refreshHosts = 15;
	App.refreshLcc = 10;
	App.refreshStatus = 300;
	
	App.debug = false;

	App.info = function(data){
		if (App.debug && console && console.info) console.info(data);
	};
	App.log = function(data){
		if (App.debug && console && console.log) console.log(data);
	};
	App.dir = function(data){
		if (App.debug && console && console.dir) console.dir(data);
	};

	App.loadHandlebar = function(hsbFile, name) {
		$.ajax({
			type: "GET",
			url: hsbFile,
			success: function(data) {
				Ember.TEMPLATES[name] = Ember.Handlebars.compile(data);
			},
			async:false,
			cache:false
		});
	};
	// Dynamically load Templates
	App.loadHandlebar('templates/index.hbs', 'index');
	App.loadHandlebar('templates/application.hbs', 'application');
	App.loadHandlebar('templates/dashboard/index.hbs', 'dashboard/index');
	App.loadHandlebar('templates/dashboard.hbs', 'dashboard');
	
	// Dynamically load Components
	App.loadHandlebar('templates/components/allok-service.hbs', 'components/allok-service');
	App.loadHandlebar('templates/components/issue-service.hbs', 'components/issue-service');
	App.loadHandlebar('templates/components/service-issue.hbs', 'components/service-issue'); //Ember Data
	
	// EmberJS Routing
	App.Router.map(function() {
		this.route("index", { path: "/" });
		this.resource("dashboard", { path: "/dashboard" }, function() {
			this.route("index", { path: "/" });
		});
	});

	
	
	
	
	
	
	
	
	App.ServiceObject = Ember.Object.extend({
	
		
		
		// this is in use
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
	
	
	
	
	
	
})();
