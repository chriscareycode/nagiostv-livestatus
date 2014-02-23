/** A place to stuff handlebars helpers */


 // for demo: http://jsbin.com/jeqesisa/7/edit
  // for detailed comments, see my SO answer here http://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional/21915381#21915381
  
  /* a helper to execute an IF statement with any expression
    USAGE:
   -- Yes you NEED to properly escape the string literals
   -- to access any global function or property you should use window.functionName() instead of just functionName()
   -- this example assumes you passed this context to your handlebars template( {name: 'Sam', age: '20' } ), notice age is a string, just for so I can demo parseInt later
   <p>
     {{#xif " this.name == \"Sam\" && this.age === \"12\" " }}
       BOOM
     {{else}}
       BAMM
     {{/xif}}
   </p>
   */
 
  Handlebars.registerHelper("xif", function (expression, options) {
    return Handlebars.helpers["x"].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
  });
 
  /* a helper to execute javascript expressions
   USAGE:
   -- Yes you NEED to properly escape the string literals
   -- to access any global function or property you should use window.functionName() instead of just functionName(), notice how I had to use window.parseInt() instead of parseInt()
   -- this example assumes you passed this context to your handlebars template( {name: 'Sam', age: '20' } )
   <p>Url: {{x " \"hi\" + this.name + \", \" + window.location.href + \" <---- this is your href,\" + " your Age is:" + window.parseInt(this.age, 10) "}}</p>
   OUTPUT:
   <p>Url: hi Sam, http://example.com <---- this is your href, your Age is: 20</p>
  */
 
  Handlebars.registerHelper("x", function (expression, options) {
    var fn = function(){}, result;
    try {
      fn = Function.apply(this,["window", "return " + expression + " ;"]);
    } catch (e) {
      console.warn("{{x " + expression + "}} has invalid javascript", e);
    }
 
    try {
      result = fn.bind(this)(window);
    } catch (e) {
      console.warn("{{x " + expression + "}} hit a runtime error", e);
    }
    return result;
  });

  
Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    }

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

/** compares two template variables by their string paths */
Ember.Handlebars.registerHelper('valsAreEqual', function(lvalue, rvalue, options) {

	if (arguments.length < 3) {
		throw new Error("Handlebars Helper 'valsAreEqual' needs 2 parameters");
	}

	// TODO: fix this up. Need to
	var dictionary = options.data.view.templateData.keywords;
	var deviceNetworkId, templateNetworkId;


	// take a passed parameter string, and look up its path in the dictionary
	function _determineRealValue(param) {
		var parts = param.split('.');
		if (!parts.length) {
			return param;
		}

		param = dictionary[parts.shift()];
		while (parts.length) {
			param = param[parts.shift()];
		}
		return param;
	}

	lvalue = _determineRealValue(lvalue);
	rvalue = _determineRealValue(rvalue);

	//console.log('valsAreEqual() lvalue: ' + lvalue  + " rvalue: " + rvalue);

	if (lvalue != rvalue) {
		//console.log("valsAreEqual() not equal!")
		return options.inverse(this);
	} else {
		//console.log("valsAreEqual() equal!")
		return options.fn(this);
	}
});

Handlebars.registerHelper('testHelper', function(property, options) {
  return 'foo: ' + Ember.get(options.data.view.content, property);
});