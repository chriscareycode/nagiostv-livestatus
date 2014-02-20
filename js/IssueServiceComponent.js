App.IssueServiceComponent = Ember.Component.extend({
	
	display: 'displayNone',
	animate: '',
	
	classNameBindings: ['display', 'animate'],
	
	didInsertElement: function() {			
		this.$().slideDown('fast');
		
		this.set('dom_id', this.$().attr('id'));
	},

	willDestroyElement: function() {
		this.$().addClass('animated');
		this.$().addClass('fadeOutLeft');
	},
	
	my_custom_id: function() {
		//console.info('my_custom_id');
		//console.info(this);
		//console.info(this.get('host_name'));
		var temp = this.get('host_name')+'_'+this.get('display_name');
		temp = temp.replace(/ /g,"_");
		temp = temp.replace(/\./g,"_");
		temp = temp.replace(/:/g,"_");
		//var temp2 = temp.replace(/ /g,"_");
		return temp;
	}.property('host_name', 'display_name', 'App.last_command_check'),
	
	last_check_clean: function() {
		var date = new Date(this.get('last_check') * 1000);
		return date;
	}.property('last_check'),
	
	next_check_clean: function() {
		var date = new Date(this.get('next_check') * 1000);
		return date;
	}.property('next_check'),
	
	last_state_change_clean: function() {
		var date = new Date(this.get('last_state_change') * 1000);
		return date;
	}.property('last_state_change'),
	
	diff_clean: function() {

		var lsc = this.get('last_state_change');
		var lcc = App.get('last_command_check');
		var seconds_ago = lcc-lsc;
		
		var days = parseInt( seconds_ago / 86400 ) % 365;
        var hours = parseInt( seconds_ago / 3600 ) % 24;
        var minutes = parseInt( seconds_ago / 60 ) % 60;
        var seconds = seconds_ago % 60;
        var result = days + "d " + 
        	(hours < 10 ? "0" + hours : hours) + "h " + 
            (minutes < 10 ? "0" + minutes : minutes) + "m " + 
            (seconds  < 10 ? "0" + seconds : seconds) + "s";

		return result;
		
	}.property('last_state_change', 'App.last_command_check'),
	
	statusClassBorder: function() {
		var cc = "";
		switch(this.get('service_status')) {
			case 1:
				cc = "service-warning-border";
				break;
			case 2:
				cc = "service-critical-border";
				break;
			case 3:
				cc = "service-unknown-border";
				break;
			default:
				cc = "";
		}
		return cc;
	}.property('service_status'),
	
	// this is in use
	stateText: function() {
		var cc = "";
		switch(this.get('service_status')) {
			case 1:
				cc = "WARNING";
				break;
			case 2:
				cc = "CRITICAL";
				break;
			case 3:
				cc = "UNKNOWN";
				break;
			default:
				cc = "";
		}
		return cc;
	}.property('service_status'),
	
	// this is in use
	state_type_text: function() {
		var cc = "";
		switch(this.get('state_type')) {
			case 0:
				cc = "SOFT";
				break;
			case 1:
				cc = "HARD";
				break;
			default:
				cc = "UNKNOWN";
		}
		return cc;
	}.property('state_type'),
	
	// this is in use
	isSoft: function() {
		var soft = false;
		if (this.get('state_type') === 0) soft = true;
		return soft;
	}.property('state_type'),

	isCritical: function() {
		return (this.get('state') === 2);
	}.property('state')
	
});
