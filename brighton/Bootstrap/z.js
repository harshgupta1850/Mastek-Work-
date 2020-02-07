
/**
* @fileoverview extendshoppingCartSummary_v15.js.
*
* @author 
*/
define(
    //---------------------
    // DEPENDENCIES
    //---------------------
    ['knockout', 'ccRestClient', 'ccConstants'],

    //-----------------------
    // MODULE DEFINITION
    //-----------------------
    function (ko, ccRestClient, ccConstants) {

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
            onLoad: function (widget) {
                getWidget = widget;
                var dataArray = ko.observableArray([]);
                widget.additem = function (id, quantity) {
                    ccRestClient.request('/ccstore/v1/products' + '/' + id, {}, function (data) {
                        data.quantity = quantity
                        dataArray.push(data);
                        console.log('hi', dataArray());
                        var newProduct = $.extend(true, {}, this.product().product);
                        newProduct.orderQuantity = parseInt(this.itemQuantity(), 10);


                        $.Topic(pubsub.topicNames.CART_ADD).publishWith(
                            newProduct, [{ message: "success" }]);

                        getWidget.cart().addItemsToCart(dataArray(), {}, function (error) { }, false, {});
                    });

                }
            },

            beforeAppear: function () {
                getWidget.additem('36956-164846', 10);
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
    ['knockout', 'ccRestClient', 'ccConstants', 'pubsub'],

    //-----------------------
    // MODULE DEFINITION
    //-----------------------
    function (ko, ccRestClient, ccConstants, pubsub) {

        "use strict";
        var getWidget;

        return {

            onLoad: function (widget) {
                getWidget = widget;
                widget.splitURL = function () {

                }
                widget.additem = function (id) {
                    ccRestClient.request('/ccstore/v1/products' + '/' + id, {}, function (data) {
                        var newProduct = $.extend(true, {}, data);
                        newProduct.orderQuantity = 2;
                        $.Topic(pubsub.topicNames.CART_ADD).publishWith(
                            newProduct, [{ message: "success" }]);

                    });
                };
            },

            beforeAppear: function () {
                getWidget.additem('36956-164846');
                console.log('extendshoppingCartSummary_v15.js before appear');
            },
        }

    }
);


function get_query(url) {
    var qs = url.substring(url.indexOf('=') + 1).split(';');
    for (var i = 0, result = {}; i < qs.length; i++) {
        qs[i] = qs[i].split(':');
        result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
}
get_query('https://www.brighton.com/cart?add=12345:1;209847:1;228843:1')

url = 'https://www.brighton.com/cart?add=12345:1;209847:1;228843:1'
var qs = url.substring(url.indexOf('=') + 1).split(';');
for (var i = 0, result = {}; i < qs.length; i++) {
    qs[i] = qs[i].split(':');
    result = qs[i];
}
return result;
a = "12345:1"
b = a.split(':');
{...b }

a = url;



function get_query() {
    url = 'https://www.brighton.com/cart?add=12345:1;209847:1;228843:1'
    var qs = url.substring(url.indexOf('=') + 1).split(';');
    for (var i = 0; i < qs.length; i++) {
        qs[i] = qs[i].split(':');
    }
    a = { ...qs }
    return a;
}



function get_query(url) {
    var qs = url.substring(url.indexOf('=') + 1).split(';');
    for (var i = 0; i < qs.length; i++) {
        qs[i] = { ...qs[i].split(':') };
    }
    return qs;
}

get_query('https://www.brighton.com/cart?add=12345:1;209847:1;228843:1');


function get_pid_qty(url) {
    var pid_qty = url.substring(url.indexOf('=') + 1).split(';');
    var pid_array = [];
    pid_qty.map(function (data) {
        pid_array.push({
            "pid": data.split(':')[0],
            "qty": data.split(':')[1]
        });
    });
    return pid_array;
}

get_pid_qty('https://www.brighton.com/cart?add=12345:1;209847:1;228843:1')


function get_pid_qty(url) {
    var pid_qty = url.substring(url.indexOf('=') + 1).split(';');
    var pid_array = [];
    var qty_array = [];
    pid_qty.map(function (data) {
        pid_array.push(data.split(':')[0]);
        qty_array.push(data.split(':')[1]);
    });
    console.log('pid',pid_array);
    console.log('pid',qty_array);
    return {pid_array,qty_array};
    
}

get_pid_qty('https://www.brighton.com/cart?add=12345:1;209847:1;228843:1')




/**
* @fileoverview extendshoppingCartSummary_v15.js.
*
* @author 
*/
define(
    //---------------------
    // DEPENDENCIES
    //---------------------
    ['knockout', 'ccRestClient', 'ccConstants', 'pubsub'],

    //-----------------------
    // MODULE DEFINITION
    //-----------------------
    function (ko, ccRestClient, ccConstants, pubsub) {

        "use strict";
        var getWidget;

        return {

            onLoad: function (widget) {
                getWidget = widget;
                widget.additem = function (id, quantity) {
                    ccRestClient.request('/ccstore/v1/products' + '/' + id, {}, function (data) {
                        var newProduct = $.extend(true, {}, data);
                        newProduct.orderQuantity = quantity;
                        $.Topic(pubsub.topicNames.CART_ADD).publishWith(
                            newProduct, [{ message: "success" }]);

                    });
                },


            beforeAppear: function () {

                getWidget.additem('36956-164846', 3);
                console.log('extendshoppingCartSummary_v15.js before appear');
            },
        }

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
    ['knockout', 'ccRestClient', 'ccConstants', 'pubsub'],

    //-----------------------
    // MODULE DEFINITION
    //-----------------------
    function (ko, ccRestClient, ccConstants, pubsub) {

        "use strict";
        var getWidget;

        return {

            onLoad: function (widget) {
                getWidget = widget;
                widget.additem = function (id, quantity) {
                    ccRestClient.request('/ccstore/v1/products' + '/' + id, {}, function (data) {
                        var newProduct = $.extend(true, {}, data);
                        newProduct.orderQuantity = quantity;
                        $.Topic(pubsub.topicNames.CART_ADD).publishWith(
                            newProduct, [{ message: "success" }]);

                    });
                };
                // var pid_array = [];
                // var qty_array = [];
                widget.get_pid_qty = function () {
                    var url = 'https://www.brighton.com/cart?add=12345:1';
                    var pid_qty = url.substring(url.indexOf('=') + 1).split(';');
                    var pid_array = [];
                    var qty_array = [];
                    pid_qty.map(function (data) {
                        pid_array.push(data.split(':')[0]);
                        qty_array.push(data.split(':')[1]);
                    });
                    console.log('pid', pid_array);
                    console.log('pid', qty_array);
                    return { pid_array, qty_array };

                };
                getWidget.get_pid_qty();
                console.log('array', pid_array[0].pid);
                getWidget.additem('pid_array[0].pid', 3);
            },

            beforeAppear: function () {

                //getWidget.additem('36956-164846', 3);
                console.log('extendshoppingCartSummary_v15.js before appear');
            },
        };

    }
);




onLoad: function(widget) {
    getWidget = widget;
     var prodList = [];
     var prodListIds = {};
     prodList.push('ADELE');
     prodListIds[ccConstants.PRODUCT_IDS] = prodList;
     prodListIds["dataItems"] = "repositoryid";
     ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, prodListIds, function(resp){
            console.log('RESPONSE ::::: AAAABB ', resp);
      });
    
}, 


onLoad: function (widget) {
    getWidget = widget;
    
    widget.additem = function (id, quantity) {
        var prodList = [];
        var prodListIds = {};
        prodList.push('ADELE');
        prodListIds[ccConstants.PRODUCT_IDS] = prodList;
        prodListIds["dataItems"] = "repositoryid";
        ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, prodListIds, function (resp) {
            var newProduct = $.extend(true, {}, data);
            newProduct.orderQuantity = quantity;
            $.Topic(pubsub.topicNames.CART_ADD).publishWith(
                newProduct, [{ message: "success" }]);

        });
    }



    /**
* @fileoverview extendshoppingCartSummary_v15.js.
*
* @author 
*/
    define(
        //---------------------
        // DEPENDENCIES
        //---------------------
        ['knockout', 'ccRestClient', 'ccConstants', 'pubsub'],

        //-----------------------
        // MODULE DEFINITION
        //-----------------------
        function (ko, ccRestClient, ccConstants, pubsub) {

            "use strict";
            var getWidget;

            return {
                pid: ko.observableArray([]),
                onLoad: function (widget) {
                    getWidget = widget;
                    getWidget.pid = ko.observableArray([]);
                    //console.log('pid1',widget.pid());

                    widget.get_pid_qty = function (finalWidget) {
                        widget = finalWidget;
                        var url = 'https://www.brighton.com/cart?add=12345:1;209847:1;228843:1';
                        var pid_qty = url.substring(url.indexOf('=') + 1).split(';');
                        pid_qty.map(function (data) {
                            getWidget.pid().push(data.split(':')[0]);
                            // getWidget.qty_array.push(data.split(':')[1]);
                        });
                        console.log('pid', getWidget.pid());
                        return getWidget.pid;
                    };
                    widget.additem = function (id) {
                        var prodList = [];
                        var prodListIds = {};
                        prodList.push('ADELE');
                        prodListIds[ccConstants.PRODUCT_IDS] = prodList;
                        prodListIds["dataItems"] = "repositoryid";
                        ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, prodListIds, function (resp) {
                            var newProduct = $.extend(true, {}, data);
                            newProduct.orderQuantity = quantity;
                            $.Topic(pubsub.topicNames.CART_ADD).publishWith(
                                newProduct, [{ message: "success" }]);

                        });
                    };

                    getWidget.get_pid_qty();
                    //getWidget.additem('12345', 3);
                },

                beforeAppear: function () {

                    //getWidget.additem('36956-164846', 3);
                    console.log('extendshoppingCartSummary_v15.js before appear');
                },
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
    ['knockout', 'ccRestClient', 'ccConstants', 'pubsub'],

    //-----------------------
    // MODULE DEFINITION
    //-----------------------
    function (ko, ccRestClient, ccConstants, pubsub) {

        "use strict";
        var getWidget;

        return {
            pid: ko.observableArray([]),
            onLoad: function (widget) {
                getWidget = widget;
                getWidget.pid = ko.observableArray([]);
                //console.log('pid1',widget.pid());

                widget.get_pid = function (finalWidget) {
                    widget = finalWidget;
                    var url = 'https://www.brighton.com/cart?add=36956-164846:1';
                    var pid_qty = url.substring(url.indexOf('=') + 1).split(';');
                    pid_qty.map(function (data) {
                        getWidget.pid().push(data.split(':')[0]);
                        // getWidget.qty_array.push(data.split(':')[1]);
                    });
                    console.log('pid', getWidget.pid());
                    return getWidget.pid;
                };
                widget.additem = function () {
                    //this.prodList=ko.observable('36956-164846');
                    var prodList = [];
                    //console.log('prodlist',this.prodList())
                    var prodListIds = {};
                    //this.prodListIds=ko.observable({})
                    //console.log('prodListIds',this.prodListIds())
                    prodListIds[ccConstants.PRODUCT_IDS] = '36956-164846';
                    prodListIds["dataItems"] = "repositoryid";
                    ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, '36956-164846', function (resp) {
                        var newProduct = $.extend(true, {}, resp);
                        newProduct.orderQuantity = 1;
                        $.Topic(pubsub.topicNames.CART_ADD).publishWith(
                            newProduct, [{ message: "success" }]);
                    },function(error){});
                };

                getWidget.get_pid();
                getWidget.additem();
                //getWidget.additem('12345', 3);
            },

            beforeAppear: function () {

                //getWidget.additem('36956-164846', 3);
                console.log('extendshoppingCartSummary_v15.js before appear');
            },
        };

    }
);



    widget.additem = function () {

        getWidget = widget;
        var data = [];
        data["filterKey"] = "productids";
        console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')
        var prodList = [];
        var prodListIds = {};
        prodList.push('ADELE');
        prodListIds[ccConstants.PRODUCT_IDS] = prodList;
        prodListIds["dataItems"] = "repositoryid";
        ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, prodListIds, function (resp) {
            console.log('RESPONSE ::::: AAAABB ', resp);
        });


    };






    /**
 * @fileoverview extendshoppingCartSummary_v15.js.
 *
 * @author 
 */
define(
    //---------------------
    // DEPENDENCIES
    //---------------------
    ['jquery','knockout', 'pubsub', 'ccConstants', 'ccRestClient'],
    //-----------------------
    // MODULE DEFINITION
    //-----------------------
    function ($,ko, pubsub, ccConstants, ccRestClient) {
   
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
             var data = [];
             data["filterKey"] = "productids";
             console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')
             var prodList = [];
             var prodListIds = {};
             prodList.push('ADELE','36956-164846');
             prodListIds[ccConstants.PRODUCT_IDS] = prodList;
             prodListIds["dataItems"] = "repositoryid";
             ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, prodListIds, function(resp){
                    console.log('RESPONSE ::::: AAAABB ', resp);
              });
            
        }, 
        
        
        beforeAppear: function(widget) {
          //getWidget.additem('36956-164846',10);
          console.log('extendshoppingCartSummary_v15.js before appear');
          console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRSSSSS')
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
    ['knockout', 'ccRestClient', 'ccConstants', 'pubsub'],

    //-----------------------
    // MODULE DEFINITION
    //-----------------------
    function (ko, ccRestClient, ccConstants, pubsub) {

        "use strict";
        var getWidget;

        return {
            pid: ko.observableArray([]),
            onLoad: function (widget) {
                getWidget = widget;
                getWidget.pid = ko.observableArray([]);
                //console.log('pid1',widget.pid());

                widget.get_pid = function (finalWidget) {
                    widget = finalWidget;
                    var url = 'https://www.brighton.com/cart?add=36956-164846:1';
                    var pid_qty = url.substring(url.indexOf('=') + 1).split(';');
                    pid_qty.map(function (data) {
                        getWidget.pid().push(data.split(':')[0]);
                        // getWidget.qty_array.push(data.split(':')[1]);
                    });
                    console.log('pid', getWidget.pid());
                    return getWidget.pid;
                };
               widget.additem = function () {

                    getWidget = widget;
                    var data = [];
                    data["filterKey"] = "productids";
                    console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')
                    var prodList = [];
                    var prodListIds = {};
                    //prodList.push('ADELE');
                    prodListIds[ccConstants.PRODUCT_IDS] = 36956-164846;
                    prodListIds["dataItems"] = "repositoryid";
                    ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, 'ADELE', function (resp) {
                        console.log('RESPONSE ::::: AAAABB ', resp);
                    });
};

                getWidget.get_pid();
                getWidget.additem();
                //getWidget.additem('12345', 3);
            },

            beforeAppear: function () {

                //getWidget.additem('36956-164846', 3);
                console.log('extendshoppingCartSummary_v15.js before appear');
            },
        };

    }
);