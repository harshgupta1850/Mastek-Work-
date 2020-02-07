
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
                getWidget.pty=ko.observableArray([])
                widget.get_pid = function (finalWidget) {
                    widget = finalWidget;
                    var url = 'https://www.brighton.com/cart?add=36956-164846:1;ADELE:2';
                    var pid_qty = url.substring(url.indexOf('=') + 1).split(';');
                    pid_qty.map(function (data) {
                        getWidget.pid().push(data.split(':')[0]);
                        getWidget.pty().push({
                            "pid": data.split(':')[0],
                            "qty": data.split(':')[1]
                        });
                    });
                    console.log('pid', getWidget.pid());
                    console.log('pid', getWidget.pty());
                    return getWidget.pid,getWidget.pty;
                };
                widget.additem = function () {
                    this.prodList = ko.observable(this.pid());
                    console.log('prodlist', this.prodList());
                    console.log('pty',this.pty())
                    for(var i=0;i<this.pty().length;i++){
                        console.log('qty',this.pty()[i].qty);
                    }
                    var prodListIds = {};
                    prodListIds[ccConstants.PRODUCT_IDS] = this.prodList();
                    prodListIds["dataItems"] = "repositoryid";
                    console.log('prodListIds', prodListIds);
                    ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, 36956-164846, function (resp) {
                        for (var j = 0; j < resp.length; j++) {
                            var newProduct = $.extend(true, {}, resp[j]);
                            newProduct.orderQuantity =10;
                            $.Topic(pubsub.topicNames.CART_ADD).publishWith(
                                newProduct, [{ message: "success" }]);
                        }
                    });
                };

                getWidget.get_pid();
                getWidget.additem();
            },

            beforeAppear: function () {
                console.log('extendshoppingCartSummary_v15.js before appear');
            },
        };

    }
);
