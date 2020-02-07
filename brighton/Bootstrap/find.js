**
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