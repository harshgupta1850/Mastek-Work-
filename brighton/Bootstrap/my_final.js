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
        console.log('override');
        return {
            onLoad: function (widget) {

                getWidget = widget;
                getWidget.prodIdArray = ko.observableArray([]);
                getWidget.prodIdQtyArray = ko.observableArray([]);
                getWidget.add = ko.observable();
                getWidget.transNumber = '';
                getWidget.type = '';
                getWidget.br_gift_order = ko.observable(false);
                getWidget.br_all_gift_orders = ko.observable('');
                getWidget.br_all_gift_orders_length = ko.observable(0);
                getWidget.br_all_free_gift_wrap = ko.observable(false);
                getWidget.testMessage = ko.observable('');



                // Add items to cart
                widget.addItemsToCart = function () {
                    var prodListIdQty = widget.prodIdQtyArray();
                    var prodListIds = widget.prodIdArray();
                    var prodListIdsObj = {};
                    var queryString = '';
                    var prodListArray = []
                    for (var i = 0; i < (prodListIds.length); i++) {
                        if (i === 0) {
                            queryString = "id eq \"" + prodListIds[i] + "\"";
                        } else {

                            queryString = queryString + " or id eq \"" + prodListIds[i] + "\"";
                        }

                    }
                    prodListIdsObj["dataItems"] = "repositoryid";
                    prodListIdsObj["q"] = queryString;
                    if (prodListIds.length > 0) {

                        //  List of products with valid product id
                        ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS, prodListIdsObj, function (productList) {
                            var params = "";
                            productList.items.map(function (item, i) {
                                var repId = item.childSKUs[0].repositoryId;
                                if (i === productList.items.length - 1) {
                                    params += item.id + ":" + repId;
                                } else {
                                    params += item.id + ":" + repId + ",";
                                }
                            });
                            var parameters = {};
                            parameters[ccConstants.PRODUCTS_PARAM] = params;

                            // Checking the stock status of product
                            ccRestClient.request(ccConstants.ENDPOINT_PRODUCTS_AVAILABILITY, parameters, function (stockData) {
                                productList.items.map(function (product) {
                                    var selectedOptions = getWidget.getSelectedSkuOptionsSelf(product.productVariantOptions, product.childSKUs[0].x_width, product.childSKUs[0].x_color);
                                    var selectedOptionsObj = {};
                                    selectedOptionsObj['selectedOptions'] = selectedOptions;
                                    var stockStateObj = {};
                                    stockData.map(function (data) {
                                        if (data.productId === product.id) {
                                            if (data.stockStatus == 'IN_STOCK') {
                                                stockStateObj['stockState'] = data.stockStatus;
                                                var newProduct = $.extend(true, {}, product, selectedOptionsObj, stockStateObj);
                                                for (var i = 0; i < prodListIdQty.length; i++) {
                                                    if (newProduct.id == prodListIdQty[i].prodId) {
                                                        newProduct.orderQuantity = prodListIdQty[i].prodQty;
                                                    }
                                                }
                                                prodListArray.push(newProduct);
                                            } else {
                                                alert(product.id + ' is out of stock')
                                            }

                                        }
                                    })
                                })

                                //Adding product to cart
                                getWidget.cart().addItems(prodListArray);

                                //Adding transnuber and type property to shopper input
                                var item = getWidget.cart().items();
                                prodListIds.map(function (id) {
                                    item.map(function (e) {
                                        if (id == e.productId) {
                                            if (widget.transNumber !== null && widget.type !== null) {
                                                e.shopperInput = {}
                                                e.shopperInput['br_customizationNumber'] = {
                                                    transnumber: widget.transNumber,
                                                    type: widget.type
                                                }
                                                widget.cart().markDirty();
                                            }

                                        }
                                    })
                                })
                                console.log('updated items', getWidget.cart().items())
                            })
                        },
                            function (err) {
                                console.log(err)
                            });
                    }

                };

                // find SKU options
                widget.getSelectedSkuOptionsSelf = function (variantOptions, x_color, x_width) {
                    var selectedOptions = [],
                        listingVariantImage;
                    if (variantOptions) {
                        for (var i = 0; i < variantOptions.length; i++) {
                            if (variantOptions[i] && (x_color == Object.keys(variantOptions[i].optionValueMap)[i] || x_width == Object.keys(variantOptions[i].optionValueMap)[i])) {
                                selectedOptions.push({
                                    'optionName': variantOptions[i].optionName,
                                    'optionValue': Object.keys(variantOptions[i].optionValueMap)[i],
                                    'optionId': variantOptions[i].optionId,
                                    'optionValueId': variantOptions[i].optionValueMap[Object.keys(variantOptions[i].optionValueMap)[i]]
                                });
                            }
                        }
                    }
                    return selectedOptions;
                };

                //extract the query parameter from URL
                widget.getProdIdQtyFromUrl = function () {
                    var params = (new URL(window.location.href)).searchParams;
                    getWidget.add = params.get("add")
                    getWidget.transNumber = params.get("transnumber");
                    getWidget.type = params.get("type");
                    if (getWidget.add !== null) {
                        var pid_qty = getWidget.add.split(';');
                        pid_qty.map(function (data) {
                            getWidget.prodIdArray().push(data.split(':')[0]);
                            getWidget.prodIdQtyArray().push({
                                prodId: data.split(':')[0],
                                prodQty: parseInt(data.split(':')[1], 10)
                            });
                        });
                    }

                    // Calling addItems to cart if product ids and quantity coming from URL
                    if (params) {
                        getWidget.addItemsToCart();
                    }

                    // Clear the URL
                    var url = window.location.toString();
                    if (url.indexOf("?") > 0) {
                        var clean_url = url.substring(0, url.indexOf("?"));
                        window.history.replaceState({}, document.title, clean_url);
                    }
                };

                getWidget.getProdIdQtyFromUrl();




                console.log('Cart Items', getWidget.cart().items())



                //gift my options
                widget.showGiftTab = function (id, val) {
                    $('#' + id).addClass('in');
                    $('.brgtn-gift-content').not($('#' + id)).removeClass('in');
                    widget.br_gift_order(val);
                }


                //gift-options-tab
                $(document).on('click', '#brgtn-gift-options-presentation', function () {
                    if ($('.brgtn-gift-my-order-check[name="giftMyOrder"]').is(':checked')) {
                        $('#brgtn-gift-my-order').addClass('in');
                    }

                    if ($('.brgtn-gift-my-order-check[name="giftMyOrderInd"]').is(':checked')) {
                        $('#brgtn-my-items-individually').addClass('in');
                    }
                });

                $(document).on('click', '.brgtn-gift-my-order-check', function () {
                    if ($(this).is(':checked')) {
                        $('.brgtn-gift-my-order-check').not($(this)).prop('checked', false);
                        if ($(this).attr('name') === 'giftMyOrder') {
                            widget.showGiftTab('brgtn-gift-my-order', true);
                        } else if ($(this).attr('name') === 'giftMyOrderInd') {
                            widget.showGiftTab('brgtn-my-items-individually', false);
                        }
                    } else {
                        $('.brgtn-gift-content').removeClass('in');
                    }
                });

                // show remaining characters
                widget.showRemainingCharacters = function (e) {
                    var currentVal = e.target.value;
                    if (currentVal) {
                        getWidget.br_all_gift_orders(currentVal);
                        getWidget.br_all_gift_orders_length(currentVal.length);
                    }
                };

                widget.getRemainingCount = ko.computed(function () {
                    var getRemainingCharacters = 200 - getWidget.br_all_gift_orders_length();
                    return getRemainingCharacters;
                });


                //free gift wrap
                widget.freeGiftWrap = function (e, i) {
                    if (e.type === "change") {
                        if (e.target.checked) {
                            getWidget.br_all_free_gift_wrap(true);
                        } else {
                            getWidget.br_all_free_gift_wrap(false);
                        }
                    } else {
                        getWidget.br_all_free_gift_wrap(false);
                    }
                    console.log('freeGiftWrap', getWidget.br_all_free_gift_wrap());
                };

                widget.freeGiftWrapEmpty = function (e) {
                    if (e.type === "change") {
                        if (e.target.checked) {
                            widget.br_all_gift_orders('');
                        }
                    }
                }


                //save gift options
                widget.saveGiftOptions = function (event) {
                    var cartAllItems = getWidget.cart().allItems();
                    if ($('.brgtn-gift-my-order-check').is(':checked')) {
                        if (widget.br_gift_order() === true) {
                            cartAllItems.map(function (e) {
                                if (e.productData().br_gift_wrap) {
                                    e.shopperInput = {
                                        br_free_gift_wrap: true
                                    }
                                    widget.cart().markDirty();
                                }
                            });
                        } else {
                            cartAllItems.map(function (e) {
                                if (e.productData().br_gift_wrap) {
                                    var freeGiftWrapCheckInd = $('#brgtn-free-gift-wrap-check' + e.productId).is(':checked');
                                    var freeGiftWrapMsgInd = $('#brgtn-free-gift-wrap-message' + e.productId);
                                    e.shopperInput = {}
                                    e.shopperInput['br_free_gift_wrap'] = freeGiftWrapCheckInd;
                                    widget.cart().markDirty();
                                }
                            });
                        }
                    }
                    console.log('all items', getWidget.cart().allItems());
                };

                // check individual checkboxes
                $(document).on('click', '.brgtn-free-gift-wrap-box input', function () {
                    if ($(this).is(':checked')) {
                        $('#brgtn-free-gift-wrap-message' + $(this).attr('data-gift-wrap-id')).attr('disabled', false);
                        $('#brgtn-free-gift-wrap-msg-check' + $(this).attr('data-gift-wrap-id')).attr('disabled', false);
                    } else {
                        $('#brgtn-free-gift-wrap-message' + $(this).attr('data-gift-wrap-id')).attr('disabled', true).val('');
                        $('#brgtn-free-gift-wrap-msg-check' + $(this).attr('data-gift-wrap-id')).attr('disabled', true).attr('checked', false);
                    }
                });

                //clear individual val
                $(document).on('click', '.clear-ind-msg-checkbox', function () {
                    if ($(this).is(':checked')) {
                        $('#brgtn-free-gift-wrap-message' + $(this).attr('data-gift-wrap-id')).val('');
                    }
                });

                // individual textarea remaining characters
                $(document).on('keyup', '.brgtn-free-gift-wrap-message-box textarea', function () {
                    var currentLength = 200 - parseInt($(this).val().length);
                    $('#brgtn-gift-orders-inner-remainingtext' + $(this).attr('data-rem-char-id')).html(currentLength)
                });



            },
            beforeAppear: function () {
                console.log('extendshoppingCartSummary_v15.js before appear');
            },
        };
    }
);