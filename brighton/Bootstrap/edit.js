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
            stockState: ko.observable(),
            onLoad: function (widget) {
                getWidget = widget;
                getWidget.pid = ko.observableArray([]);
                getWidget.pty = ko.observableArray([]);
                getWidget.transNumber = ko.observable(),
                    getWidget.type = ko.observable(),
                    widget.get_pid = function (finalWidget) {
                        widget = finalWidget;
                        var url = window.location.href;
                        console.log('url', url)
                        var pid_qty = url.substring(url.indexOf('=') + 1).split(';');
                        var params = (new URL(window.location.href)).searchParams;
                        getWidget.transNumber = params.get("transnumber");
                        getWidget.type = params.get("type");
                        pid_qty.map(function (data) {
                            getWidget.pid().push(data.split(':')[0]);
                            getWidget.pty().push({
                                prodId: data.split(':')[0],
                                prodQty: data.split(':')[1]
                            })
                        });
                        console.log('pty', getWidget.pty());
                        console.log('pid', getWidget.pid());
                        return getWidget.pid;
                    };
                widget.getSelectedSkuOptionsSelf = function (variantOptions) {
                    var selectedOptions = [],
                        listingVariantImage;
                    if (variantOptions) {
                        for (var i = 0; i < variantOptions.length; i++) {
                            if (variantOptions[i]) {
                                selectedOptions.push({
                                    'optionName': variantOptions[i].optionName,
                                    'optionValue': Object.keys(variantOptions[i].optionValueMap)[0],
                                    'optionId': variantOptions[i].optionId,
                                    'optionValueId': variantOptions[i].optionValueMap[Object.keys(variantOptions[i].optionValueMap)[0]]
                                });
                            }
                        }
                    }
                    return selectedOptions;
                };
                
                widget.additem = function () {

                    var prodListIQ = this.pty();
                    var prodList = this.pid();
                    var prodListIds = {};
                    var prodListArray = [];
                    console.log('product ids', prodListIds)
                    console.log('product qty', prodListIQ)
                    prodListIds[ccConstants.PRODUCT_IDS] = prodList;
                    prodListIds["dataItems"] = "repositoryid";
                    ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, prodListIds, function (resp) {
                        console.log('product response', resp);
                        for (var j = 0; j < resp.length; j++) {
                            console.log('list', prodListIds);
                            var Options = resp[j].productVariantOptions;
                            var selectedOptions = getWidget.getSelectedSkuOptionsSelf(Options);
                            var selectedOptionsObj = {
                                'selectedOptions': selectedOptions
                            };
                            console.log('widget', getWidget)
                            var stockStateObj = {
                                'stockState': ''
                            };
                            var newProduct = $.extend(true, {}, resp[j], selectedOptionsObj, stockStateObj);
                            console.log('product', newProduct);
                            console.log('length', prodListIQ.length)
                            for (var i = 0; i < prodListIQ.length; i++) {
                                if (newProduct.id == prodListIQ[i].prodId) {
                                    newProduct.orderQuantity = parseInt(prodListIQ[i].prodQty, 10);
                                    console.log('qty', newProduct.orderQuantity)
                                }
                            }
                            prodListArray.push(newProduct);
                            console.log(prodListArray)
                        }
                        getWidget.cart().addItems(prodListArray);
                    });
                    

                };
                getWidget.get_pid();
            },
            beforeAppear: function () {
                getWidget.additem();
                console.log('extendshoppingCartSummary_v15.js before appear');
            },
        };

    }
);