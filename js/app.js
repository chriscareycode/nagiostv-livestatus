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
    App.loadHandlebar('templates/application.hbs', 'application');
    App.loadHandlebar('templates/services.hbs', 'services');
    //App.loadHandlebar('templates/service_problem.hbs', 'service_problem');
    
    // Dynamically load Components
    App.loadHandlebar('templates/components/allok-service.hbs', 'components/allok-service');
	App.loadHandlebar('templates/components/issue-service.hbs', 'components/issue-service');
	//App.loadHandlebar('templates/components/issue-serviceold.hbs', 'components/issue-serviceold');
	
	// EmberJS Routing
	App.Router.map(function() {
	  this.route("index", { path: "/" });
	});
	
	// Application Route
	
	App.ApplicationRoute = Ember.Route.extend({

		activate: function() {
			//document.title = 'Pertino - People';
		},
		deactivate: function() {
			
		},
		beforeModel: function() {
			
		},
		model: function(params) {
			return {};
		},
		setupController: function (controller) {
			controller.startIt();
		}
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
	
	// this is implied if we arent using them
	/*
	App.ApplicationView = Ember.View.extend({
		templateName:'application',

		didInsertElement: function(){
	
			console.info('App.ApplicationView didInsertElement()');
			//var that = this;
			//console.dir(this.get('controller'));
		}

	});
	*/
	
	
	
	
})();