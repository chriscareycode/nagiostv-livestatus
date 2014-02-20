// Application Controller
App.ApplicationController = Ember.ArrayController.extend({

  
  
  content:[], // array now, need to make it an object and hold more than one source of data
  
  sortProperties:['current_notification_number'],
  sortAscending: true,


  title: 'NagiosTV - EmberJS & MK Livestatus',
  mk_query: 'GET status\nOutputFormat: json',
  //mk_query:'GET contacts\nColumns: name alias\nOutputFormat: json',
  //mk_query: 'GET hosts\nColumns: name address state\nOutputFormat: json',
  //mk_query:'GET hosts%0AColumns: name address state%0AOutputFormat: json',
  mk_result: null,
  mk_result_str: '',
    
    nagios_status: [],
    //nagios_services: [],

    init: function(){

      this._super();
      this.startIt();
    },

    actions:{
  
    doManualQueryLS: function(){
    
      var that=this;
    
      console.info('doManualQueryLS()');
      
      this.queryLS(this.get('mk_query'), function(data){
      
        console.log('doManualQueryLS() Success'); 
        console.dir(data);
        
        var result = '';
        for(var i=0;i<data.length;i++){
          result += data[i]+'\n';
        }
        that.set('mk_result', data);
        that.set('mk_result_str', result);
                  
      }, function(data1, data2){
        console.log('doManualQueryLS() Error');
        console.dir(data1);
        console.dir(data2);
      });
    
    }
  },
    
    last_command_check_clean: function() {
    var date = new Date(App.get('last_command_check') * 1000);
    return date;
  }.property('App.last_command_check'),
    
    flynnMode: function() {

      var count = this.get('content').length;
      console.info('count is '+count);
      if (count > 0 && count <= 26) {
        return "flynn"+count;
      } else if (count > 26) {
        return "flynn26";
      } else {
        return "flynn1";
      }
      

    }.property('content.@each'),

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

    nagios_services_unacked_empty: function() {
    
      var acked = this.get('content').filter(function(elem){
        //console.info('filter nagios_services to nagios_services_acked '+elem.get('acknowledged'));
        return elem.get('acknowledged') === 1;
      });
      return (acked.length > 0 ? true : false);

    }.property('content.@each.acknowledged'),

    nagios_services_acked_empty: function() {
    
      var acked = this.get('content').filter(function(elem){
        //console.info('filter nagios_services to nagios_services_acked '+elem.get('acknowledged'));
        return elem.get('acknowledged') === 0;
      });
      return (acked.length > 0 ? true : false);

    }.property('content.@each.acknowledged'),
  
    
    
    nagios_services_filter_unacked: function(){
    //var that =  this;
    //var regex = new RegExp(0, 'i');
    
    console.info('nagios_services_filter_unacked');
    
    return this.get('content').filter(function(elem){
      console.info('filter nagios_services to nagios_services_acked '+elem.get('acknowledged'));
      
      //return elem.get('acknowledged').match(regex);
      return elem.get('acknowledged') === 0;
    });
  }.property('content.@each.acknowledged'),
  
    nagios_services_filter_acked: function(){
            
    //var that =  this;
    //var regex = new RegExp(0, 'i');
    
    console.info('nagios_services_filter_acked');
    
    return this.get('content').filter(function(elem){
      console.info('filter nagios_services to nagios_services_acked '+elem.get('acknowledged'));
      
      //return elem.get('acknowledged').match(regex);
      return elem.get('acknowledged') === 1;
    });
  }.property('content.@each.acknowledged'),


    
    
    
    queryLS: function(query, success_callback, fail_callback) {
    
      // convert newline to urlencoded
    query = encodeURIComponent(query);
    
    $.ajax({      
      type: 'GET',
      url: "php-api/live.php?command="+query, // php
      //url: "/nagiostv-wsgi/live.py?command="+query, // python
      //url: "http://debian7/nagiostv-livestatus/php-api/live.php?command="+query, // debug
      dataType: "json",
      timeout: 5000,
      success: function(data){
        if (success_callback) success_callback(data);
      },
      error: function(data1, data2) {
        if (fail_callback) fail_callback(data1, data2);
      }
    });
    },
    
    
    
  getNagiosStatusFromMK: function() {
    var that = this;
    
    // Not Ember'ish UI updates
    $('#spinner-ss').removeClass('fadeOut');
    $('#spinner-ss').addClass('animated fadeIn');
    
    //http://10.69.0.8/wsgi/live.py?command=GET%20status%0AOutputFormat:%20json
    
    this.queryLS('GET status\nOutputFormat: json', function(data){
      
      // Not Ember'ish UI updates
      $('#spinner-ss').removeClass('fadeIn');
      $('#spinner-ss').addClass('fadeOut');
      
      // create a nice json object from this array data
      var result = {};
      for(var i=0;i<data[0].length;i++){        
        result[data[0][i]] = data[1][i];
      }

      // Debug
      App.info('getNagiosStatusFromMK result');
      App.info(result);
      
      // Set the result 
      that.set('nagios_status', Ember.Object.create(result));
      
    }, function(data1, data2){
    
    });
    
    
  },
  
  getNagiosStatusLccFromMK: function() {
    var that = this;
      
    // Not Ember'ish
    $('#spinner-lcc').removeClass('fadeOut');
    $('#spinner-lcc').addClass('animated fadeIn');
    
    //http://10.69.0.8/wsgi/live.py?command=GET%20status%0AOutputFormat:%20json
    
    this.queryLS('GET status\nColumns: last_command_check\nOutputFormat: json', function(data){
      
      // Not Ember'ish
      $('#spinner-lcc').removeClass('fadeIn');
      $('#spinner-lcc').addClass('fadeOut');
      
      // Debug
      App.info('getNagiosStatusLccFromMK() got nagios lcc:');
      App.info(data);

      // so we can observe it
      App.set('last_command_check', data[0][0]);
      
    }, function(data1, data2){
      App.info('getNagiosStatusLccFromMK() error');
      App.dir(data1);
      App.dir(data2);
    });
    
    
  },
  
  getServicesFromMK: function() {
    var that = this;
    //console.info('getIt()');
    
    
    
    $('#spinner-css').removeClass('fadeOut');
    $('#spinner-css').addClass('animated fadeIn');
    
    //http://10.69.0.8/wsgi/live.py?command=GET%20status%0AOutputFormat:%20json
    var query = 'GET services\nFilter: state = 1\nFilter: state = 2\nFilter: state = 3\nOr: 3\nOutputFormat: json';
    this.queryLS(query, function(data){
      
      $('#spinner-css').removeClass('fadeIn');
      $('#spinner-css').addClass('fadeOut');
      
      App.info('getServicesFromMK() got nagios service data:');
              
      var result = [];
      for(var i=1;i<data.length;i++){
        
        // now we are dealing with data[j] which excludes the header fields data[0]
        
        //var inner = App.ServiceObject.create();
        var inner = [];
        
        for(var j=0;j<data[0].length;j++){
          
          inner[data[0][j]] = data[i][j];
        }
        result.push(inner);
      }
      App.info(result);
              
      //that.set('nagios_services', result);
      
      that.chompIt(result);
      
      
    }, function(data1, data2){
      console.info('getServicesFromMK() failure');
      console.dir(data1);
      console.info(data2);
      console.info(data1.responseText);
      $('#spinner_css').addClass('fadeOut');
    });
    
    
  },
  
  chompIt: function(food) {
    
    
    App.info('chompIt()');
    App.dir(food);
    
    // used in chompIt()
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    var ns = this.get('content');
    
    // add new items into the array
    for(var i=0;i<food.length;i++){
      //console.info('looping');
      var size = Object.size(food[i]);
      //console.info(size);
      if (size > 0) {
      

        // duplicate check before we add the item into the array
        var match = false;
        for(var j=0;j<ns.length;j++){ 
                    
          if (food[i].host_name === ns[j].host_name &&
            food[i].description === ns[j].description) {
            
            //update the data from the match
            App.info('we got a match, updating info');
            //console.info('updating '+ns[j].get('last_state_change')+' to '+food[i].last_state_change+' ');
            //if (ns[j].get('last_state_change') === food[i].last_state_change) {
            //  console.info('they are the same, wtf');
            //}
            
            ns[j].set('acknowledged', food[i].acknowledged);
            ns[j].set('comments_with_info_0', (food[i].comments_with_info && food[i].comments_with_info[0]) ? food[i].comments_with_info[0][0] : '');
            ns[j].set('comments_with_info_1', (food[i].comments_with_info && food[i].comments_with_info[0]) ? food[i].comments_with_info[0][1] : '');
            ns[j].set('comments_with_info_2', (food[i].comments_with_info && food[i].comments_with_info[0]) ? food[i].comments_with_info[0][2] : '');
            ns[j].set('last_state_change', food[i].last_state_change);
            ns[j].set('last_check', food[i].last_check);
            ns[j].set('next_check', food[i].next_check);
            ns[j].set('state', food[i].state);
            ns[j].set('state_type', food[i].state_type);
            ns[j].set('plugin_output', food[i].plugin_output);
            match = true;
            
            // Debug info
            App.info('Updated an existing SserviceObject: ns[j] is');
            App.info(ns[j]);
          }
        }
        
        // add
        if (match === false) {
          
          // Debug info
          App.info('no match. add a new ServiceObject. food is');
          App.info(food[i]);  
          
          var so = App.ServiceObject.create();
          
          so.setProperties({
            'host_address': food[i].host_address,
            'host_name': food[i].host_name,
            'accept_passive_checks': food[i].accept_passive_checks,
            'description': food[i].description,
            'display_name': food[i].display_name,
            'last_state_change': food[i].last_state_change,
            'last_check': food[i].last_check,
            'next_check': food[i].next_check,
            'state': food[i].state,
            'state_type': food[i].state_type,
            'acknowledged': food[i].acknowledged,
            'plugin_output': food[i].plugin_output,

          });
          
          if (food[i].comments_with_info[0]) {
            if (food[i].comments_with_info[0][0]) so.set('comments_with_info_0', food[i].comments_with_info[0][0]);
            if (food[i].comments_with_info[0][1]) so.set('comments_with_info_1', food[i].comments_with_info[0][1]);
            if (food[i].comments_with_info[0][2]) so.set('comments_with_info_2', food[i].comments_with_info[0][2]);
          }
          
          ns.addObject(so);

          // Debug info
          App.info('added a new ServiceObject:');
          App.info(so); 
        }
        
      }
      
    }
    
    // remove items from the array which are now gone

    for(var i=0;i<ns.length;i++){
    
      var match = false;  
      
      for(var j=0;j<food.length;j++){
        if (typeof(ns[i]) === "undefined") continue;    
        if (typeof(ns[i].host_name) === "undefined") continue;  
        if (typeof(food[j].host_name) === "undefined") continue;
        if (food[j].host_name === ns[i].host_name &&
          food[j].description === ns[i].description) match = true;
      }
      if (match === true) App.info('found you. you are safe!');
      if (match === false) {
        //slideup
        App.info('bye bye. need to look for __ember obj:');
        App.dir(ns[i]);
                
        var die_id = ns[i].host_name +'_'+ ns[i].display_name;
        // add underscores since spaces are an id no no
        var die_id2 = die_id.replace(/ /g,"_");
        die_id2 = die_id2.replace(/\./g,"_");
        die_id2 = die_id2.replace(/:/g,"_");
        
        App.info('die_id is '+die_id);
        App.info('die_id2 is '+die_id2);
        var die_obj = ns[i];
        
        $('#'+die_id2).addClass('bounceOutLeft');
        $('#'+die_id2).slideUp('slow', function(){
          ns.removeObject(die_obj);
        });
        
      }
    }
    
    App.info('finishing chompIt() content is');
    App.dir(ns);  
    
  }, // end chompIt

  startIt: function(){

    var that = this;

    this.getNagiosStatusFromMK();
    
      var st1 = setInterval(function(){
        that.getNagiosStatusFromMK();
      }, App.refreshStatus*1000);
      this.set('interval_get_nagios_status', st1);
      
      
      // start timer for status updates
      this.getNagiosStatusLccFromMK();
      
      var st2 = setInterval(function(){
        that.getNagiosStatusLccFromMK();
      }, App.refreshLcc*1000);
      this.set('interval_get_nagios_status', st2);
      
      
      // start timer for service updates
      this.getServicesFromMK();
      
      var st3 = setInterval(function(){
        that.getServicesFromMK();
      }, App.refreshServices*1000);
      this.set('interval_get_nagios_services', st3);
      

  }
  
  
});
