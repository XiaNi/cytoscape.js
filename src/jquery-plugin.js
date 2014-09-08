;(function($, $$){ 'use strict';
  
  if( !$ ){ return; } // no jquery => don't need this

  var cyReg = function( $ele ){
    var d = $ele[0]._cyreg = $ele[0]._cyreg || {};

    return d;
  };

  // allow calls on a jQuery selector by proxying calls to $.cytoscape
  // e.g. $("#foo").cytoscape(options) => $.cytoscape(options) on #foo
  $.fn.cytoscape = function(opts){
    var $this = $(this);

    // get object
    if( opts === 'get' ){
      return cyReg( $this ).cy;
    }
    
    // bind to ready
    else if( $$.is.fn(opts) ){

      var ready = opts;
      var cy = cyReg( $this ).cy;
      
      if( cy && cy.ready() ){ // already ready so just trigger now
        cy.trigger('ready', [], ready);

      } else { // not yet ready, so add to readies list
        var data = cyReg( $this );
        var readies = data.readies = data.readies || [];

        readies.push( ready );
      } 
      
    }
    
    // proxy to create instance
    else if( $$.is.plainObject(opts) ){
      return $this.each(function(){
        var options = $.extend({}, opts, {
          container: $(this)[0]
        });
      
        cytoscape(options);
      });
    }
    
    // proxy a function call
    else {
      var rets = [];
      var args = [];
      for(var i = 1; i < arguments.length; i++){
        args[i - 1] = arguments[i];
      }
      
      $this.each(function(){
        var $ele = $(this);
        var cy = cyReg( $ele ).cy;
        var fnName = opts;
        
        if( cy && $$.is.fn( cy[fnName] ) ){
          var ret = cy[fnName].apply(cy, args);
          rets.push(ret);
        }
      });
      
      // if only one instance, don't need to return array
      if( rets.length === 1 ){
        rets = rets[0];
      } else if( rets.length === 0 ){
        rets = $(this);
      }
      
      return rets;
    }

  };
  
  // allow access to the global cytoscape object under jquery for legacy reasons
  $.cytoscape = cytoscape;
  
  // use short alias (cy) if not already defined
  if( $.fn.cy == null && $.cy == null ){
    $.fn.cy = $.fn.cytoscape;
    $.cy = $.cytoscape;
  }
  
})(typeof jQuery !== 'undefined' ? jQuery : null , cytoscape);
