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
    function(ko, ccRestClient, ccConstants, pubsub) {

        "use strict";
        var getWidget;

        return {
            pid: ko.observableArray([]),
            stockState: ko.observable(),
            onLoad: function(widget) {
                getWidget = widget;
                getWidget.pid = ko.observableArray([]);
                getWidget.pty = ko.observableArray([]);
                getWidget.transNumber=ko.observable(),
                getWidget.type=ko.observable(),
                widget.get_pid = function(finalWidget) {
                    widget = finalWidget;
                    var url = window.location.href;
                    console.log('url', url)
                    var pid_qty = url.substring(url.indexOf('=') + 1).split(';');
                    var params = (new URL(window.location.href)).searchParams;
                    getWidget.transNumber = params.get("transnumber");
                    getWidget.type= params.get("type");
                    pid_qty.map(function(data) {
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
                widget.getSelectedSkuOptionsSelf = function(variantOptions) {
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
                widget.additem = function() {

                    var prodListIQ = this.pty();
                    var prodList = this.pid();
                    var prodListIds = {};
                    var prodListArray = [];
                    console.log('product ids', prodListIds)
                    console.log('product qty', prodListIQ)
                    prodListIds[ccConstants.PRODUCT_IDS] = prodList;
                    prodListIds["dataItems"] = "repositoryid";
                    ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, prodListIds, function(resp) {
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
                    var catRefIdArray = [];
                    var commerceItemIdArray = [];
                    for (var k = 0; k < getWidget.cart().allItems().length; k++) {
                        for (var l = 0; l < prodList.length; l++) {
                            if (getWidget.cart().allItems()[k].productId == prodList[l]) {
                                catRefIdArray.push(getWidget.cart().allItems()[k].catRefId)
                                commerceItemIdArray.push(getWidget.cart().allItems()[k].commerceItemId)
                            }
                        }
                    }
                    console.log('prodList', prodList)
                    console.log('catRefIdArray', catRefIdArray)
                    console.log('commerceItemIdArray', commerceItemIdArray)
                    console.log(getWidget.cart().allItems());
                    console.log(getWidget.cart().getCartItem(prodList, catRefIdArray, commerceItemIdArray))

                    getWidget.getCartItem = function(prodId, catRefId, commerceItemId) {
                        for (var m = 0; m < getWidget.cart().allItems().length; m++) {
                            for (var n = 0; n < prodList.length; n++) {
                                if (getWidget.cart().allItems()[m].productId === prodId[n] &&
                                    getWidget.cart().allItems()[m].catRefId === catRefId[n] &&
                                    getWidget.cart().allItems()[m].commerceItemId === commerceItemId[n]) {
                                    getWidget.cart().allItems()[m].transNumber = this.transNumber;
                                    getWidget.cart().allItems()[m].type = this.type;
                                    console.log('getcartitem', getWidget.cart().allItems()[m])
                                }
                            }
                        }
                        console.log('hi', getWidget.cart().allItems())
                    }
                    getWidget.getCartItem(prodList, catRefIdArray, commerceItemIdArray);

                };
                getWidget.get_pid();
            },
            beforeAppear: function() {
                getWidget.additem();
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
            onLoad: function (widget) {
                getWidget = widget;
                getWidget.pid = ko.observableArray([]);
                getWidget.pty = ko.observableArray([]);
                getWidget.transNumber = ko.observable(),
                getWidget.type = ko.observable(),           
                getWidget.get_pid = function () {
                    var url = window.location.href;
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
                    return getWidget.pid;
                };
                getWidget.get_pid();
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
                    prodListIds[ccConstants.PRODUCT_IDS] = prodList;
                    prodListIds["dataItems"] = "repositoryid";
                    ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, prodListIds, function (resp) {
                        console.log('product response', resp);
                        for (var j = 0; j < resp.length; j++) {
                            var Options = resp[j].productVariantOptions;
                            var selectedOptions = getWidget.getSelectedSkuOptionsSelf(Options);
                            var selectedOptionsObj = {
                                'selectedOptions': selectedOptions
                            };
                            var stockStateObj = {
                                'stockState': ''
                            };
                            var newProduct = $.extend(true, {}, resp[j], selectedOptionsObj, stockStateObj);
                            for (var i = 0; i < prodListIQ.length; i++) {
                                if (newProduct.id == prodListIQ[i].prodId) {
                                    newProduct.orderQuantity = parseInt(prodListIQ[i].prodQty, 10);
                                    var objectData={};
                                    objectData['transNumber'] = getWidget.transNumber;
                                    objectData['type'] = getWidget.type;
                                    console.log('objectData',objectData)
                                    newProduct.externalData = objectData;
                                    console.log(newProduct)
                                }
                            }

                            prodListArray.push(newProduct);
                        }
                        getWidget.cart().addItems(prodListArray);
                        setTimeout(function(){
                            console.log("Initial Cart Items===>", getWidget.cart().allItems());
                            getWidget.addCartItem();
                        },5000);                        
                    });
                   
                };
                widget.addCartItem = function () {
                    for (var l = 0; l < this.pid().length; l++) {
                        for (var k = 0; k < getWidget.cart().allItems().length; k++) {
                            if (getWidget.cart().allItems()[k].productId == this.pid()[l]) {
                                var objectData={};
                                objectData['transNumber'] = this.transNumber;
                                objectData['type'] = this.type;
                                getWidget.cart().allItems()[k].externalData = objectData;
                                break;
                            }

                        }
                    }
                    console.log("Updated Cart Items===>", getWidget.cart().allItems());
                }                          
            },
            beforeAppear: function () {
                getWidget.additem();
                console.log('extendshoppingCartSummary_v15.js before appear');
                
            },
        };

    }
);