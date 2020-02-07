/**
 * @fileoverview extendshoppingCartSummary_v15.js.
 *
 * @author 
 */
define(
    //---------------------
    // DEPENDENCIES
    //---------------------
    ['ccRestClient','ccConstants'],
  
    //-----------------------
    // MODULE DEFINITION
    //-----------------------
    function (ccRestClient,ccConstants) {
   
      "use strict";
      var getWidget;
      return {
      //  additem: function(id,quantity) {
      //       ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_GET_PRODUCT+'/'+id, catSkuListIds, function (e) {
      //           e.quantity = quantity;
      //       });
      //       getWidget.cart().addItemsToCart(e, updateDynamicProps, function (error) { }, false, updateDynamicProps);
            
      //   },
        onLoad: function() {
            getWidget = widget;
            
        }, 
        
        beforeAppear: function(widget) {
          getWidget.additem('36956-164846',10);
          console.log('extendshoppingCartSummary_v15.js before appear');
          //this.additem(36956-164846,10);
        },
        getWidget.additem : function(id,quantity){
            ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_GET_PRODUCT+'/'+id,catSkuListIds, function (e) {
            e.quantity = quantity;
        });
        getWidget.cart().addItemsToCart(e, updateDynamicProps, function (error) { }, false, updateDynamicProps);
        }
       };
    }
  );





  /**
 * @fileoverview extendshoppingCartSummary_v15.js.
 *
 * @author 
 */
define(
    //---------------------
    // DEPENDENCIES
    //---------------------
    ['ccRestClient','ccConstants'],
  
    //-----------------------
    // MODULE DEFINITION
    //-----------------------
    function (ccRestClient,ccConstants) {
   
      "use strict";
      var getWidget;
      return {
      //  additem: function(id,quantity) {
      //       ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_GET_PRODUCT+'/'+id, catSkuListIds, function (e) {
      //           e.quantity = quantity;
      //       });
      //       getWidget.cart().addItemsToCart(e, updateDynamicProps, function (error) { }, false, updateDynamicProps);
            
      //   },
        onLoad: function(widget) {
            getWidget = widget;
            widget.additem = function(id,quantity){
                ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_GET_PRODUCT+'/'+id, function (e) {
                e.quantity = quantity;
            });
            //getWidget.cart().addItemsToCart(e, updateDynamicProps, function (error) { }, false, updateDynamicProps);
            }
        }, 
        
        beforeAppear: function(widget) {
          getWidget.additem('36956-164846',10);
          console.log('extendshoppingCartSummary_v15.js before appear');
          //this.additem(36956-164846,10);
        }
        
       };
    }
  );




  
  /**
 * @fileoverview extendshoppingCartSummary_v15.js.
 *
 * @author 
 */
define(
    //---------------------
    // DEPENDENCIES
    //---------------------
    ['ccRestClient','ccConstants'],
  
    //-----------------------
    // MODULE DEFINITION
    //-----------------------
    function (ccRestClient,ccConstants) {
   
      "use strict";
      var getWidget;
      console.log('harsh');
      return {
      //  additem: function(id,quantity) {
      //       ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_GET_PRODUCT+'/'+id, catSkuListIds, function (e) {
      //           e.quantity = quantity;
      //       });
      //       getWidget.cart().addItemsToCart(e, updateDynamicProps, function (error) { }, false, updateDynamicProps);
            
      //   },
        onLoad: function(widget) {
            getWidget = widget;
            widget.additem = function(id,quantity){
                ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_GET_PRODUCT+'/'+id, function (e) {
                e.quantity = quantity;
            });
            //getWidget.cart().addItemsToCart(e, updateDynamicProps, function (error) { }, false, updateDynamicProps);
            }
        }, 
        
        beforeAppear: function(widget) {
          getWidget.additem('36956-164846',10);
          console.log('extendshoppingCartSummary_v15.js before appear');
          //this.additem(36956-164846,10);
        }
        
       };
    }
  );