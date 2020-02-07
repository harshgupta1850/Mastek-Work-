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
            onLoad: function(widget) {
                getWidget = widget;
                getWidget.prodIdArray = ko.observableArray([]);
                getWidget.prodIdQtyArray = ko.observableArray([]);
                getWidget.add = ko.observable();
                getWidget.transNumber = ko.observable();
                getWidget.type = ko.observable();

                // Funtion to extract the query parameter from URL

                getWidget.getProdIdQtyFromUrl = function() {
                    var url = window.location.href;
                    var params = (new URL(window.location.href)).searchParams;
                    getWidget.add = params.get("add")
                    getWidget.transNumber = params.get("transnumber");
                    getWidget.type = params.get("type");
                    if (getWidget.add !== null) {
                        var pid_qty = getWidget.add.split(';');
                        pid_qty.map(function(data) {
                            getWidget.prodIdArray().push(data.split(':')[0]);
                            getWidget.prodIdQtyArray().push({
                                prodId: data.split(':')[0],
                                prodQty: data.split(':')[1]
                            });
                        });
                    }

                };

                getWidget.getProdIdQtyFromUrl();

                // Function to find out SKU options



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


                // Function to add item in cart




                widget.additem = function() {
                    var prodListIdQty = this.prodIdQtyArray();
                    var prodListIds = this.prodIdArray();
                    var prodListIdsObj = {};
                    var prodListArray = [];
                    var queryString = '';
                    for (var i = 0; i < (prodListIds.length); i++) {
                        if (i === 0) {
                            queryString = "id eq \"" + prodListIds[i] + "\"";
                        } else {
                            queryString = queryString + " or id eq \"" + prodListIds[i] + "\"";
                        }
                    }
                    prodListIdsObj["q"] = queryString;
                    prodListIdsObj["dataItems"] = "repositoryid";
                    if (prodListIdsObj !== null) {
                        var stockArr = []
                        prodListIds.map(function(id) {
                            // Check the stock status of product based on prodId by calling API
                            ccRestClient.request("/ccstoreui/v1/stockStatus/" + id, '', function(data) {
                                console.log('data',data)
                                stockArr.push({
                                    id: id,
                                    stockstate: data.stockStatus
                                })
                            });
                        })
                    console.log('prodListIdsObj',prodListIdsObj)
                        // Fetch the list of the product based on prodid which are coming from URL by calling api

                        ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, prodListIdsObj, function(resp) {
                                console.log('product response', resp);
                                var localItems = [];
                                localItems = resp.items;
                                for (var j = 0; j < localItems.length; j++) {
                                    var Options = localItems[j].productVariantOptions;
                                    var selectedOptions = getWidget.getSelectedSkuOptionsSelf(Options);
                                    var selectedOptionsObj = {
                                        'selectedOptions': selectedOptions
                                    };
                                    for (var k = 0; k < stockArr.length; k++) {
                                        if (stockArr[k].id === localItems[j].id) {
                                            var stockStateObj = {
                                                'stockState': stockArr[k].stockstate
                                            }
                                        }
                                    }
                                    var newProduct = $.extend(true, {}, localItems[j], selectedOptionsObj, stockStateObj);
                                    for (var i = 0; i < prodListIdQty.length; i++) {
                                        if (newProduct.id == prodListIdQty[i].prodId) {
                                            newProduct.orderQuantity = parseInt(prodListIdQty[i].prodQty, 10);
                                        }
                                    }
                                    prodListArray.push(newProduct)
                                }
                                getWidget.cart().addItems(prodListArray);
                                setTimeout(function() {
                                    getWidget.addCartItem();
                                    getWidget.cart().allItems();
                                }, 3000);
                            },
                            function(err) {
                                console.log(err)
                            });
                    }
                };

                //function to add TransNumber and type to the commerce item from URL

                widget.addCartItem = function() {
                    for (var l = 0; l < this.prodIdArray().length; l++) {
                        for (var k = 0; k < getWidget.cart().allItems().length; k++) {
                            if (getWidget.cart().allItems()[k].productId == this.prodIdArray()[l]) {
                                if (this.transNumber !== null && this.transNumber !== '') {
                                    var objectData = {};
                                    objectData['transNumber'] = this.transNumber;
                                    objectData['type'] = this.type;
                                    getWidget.cart().allItems()[k].externalData = objectData;
                                }
                                break;
                            }
                        }
                    }
                }
            },
            beforeAppear: function() {
                getWidget.additem();
                console.log('extendshoppingCartSummary_v15.js before appear');
            },
        };
    }
);