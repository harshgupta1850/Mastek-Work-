/**
 * @fileoverview extendproductListing_v15.js.
 *
 * @author
 */
console.log("Coming from override!!!!");
define(
    //---------------------
    // DEPENDENCIES
    //---------------------
    ['jquery', 'knockout', 'pubsub', 'ccConstants', 'pageLayout/product', 'ccRestClient'],

    //-----------------------
    // MODULE DEFINITION
    //-----------------------
    function($, ko, pubsub, CCConstants, Product, ccRestClient) {

        "use strict";
        var getWidget;
        console.log('1111');
        return {
            onLoad: function(widget) {
                getWidget = widget;
                widget.swatchList = ko.observableArray([]);
                widget.swatchIndex = ko.observable(0);
                widget.uniqueChildKSUsArray = ko.observableArray([]);
                widget.check = ko.observable();
                widget.productStockListing = ko.observableArray([]);
                $(document).on('click', '.brgtn-get-data-swatch', function() {
                    widget.swatchIndex(parseInt($(this).attr('data-swatch')));
                    console.log(widget.swatchList(), 'swatchList')
                    console.log(widget.swatchIndex(), 'swatchIndex')

                });
                $.Topic(pubsub.topicNames.PAGE_CHANGED).subscribe(function(obj) {
                        widget.swatchIndex(0);
                    })
                
                // Add to bag and more option
                getWidget.addToBag = function(event) {
                    console.log(widget.swatchIndex(), 'swatchIndex')
                    var swatchvalue = widget.swatchIndex();
                    console.log(swatchvalue, 'swatchvalue')
                    console.log('add', event.product);
                    console.log(event.product.childSKUs, 'childskus')
                    console.log(event.product.childSKUs[swatchvalue])
                    var selectedOptions = getWidget.getSelectedSkuOptionsSelf(event.product.productVariantOptions, event.product.childSKUs[swatchvalue].x_color, event.product.childSKUs[swatchvalue].x_size, event.product.childSKUs[swatchvalue].x_width);
                    console.log('selectedOptions', selectedOptions)
                    var selectedOptionsObj = {};
                    selectedOptionsObj['selectedOptions'] = selectedOptions;
                    console.log(selectedOptions, 'selectedOptions')
                    var newProduct = $.extend(true, {}, event.product, selectedOptionsObj)
                    newProduct.orderQuantity = 1;
                    newProduct.childSKUs = [event.product.childSKUs[swatchvalue]];
                    console.log(newProduct, 'newProduct1')
                    $.Topic(pubsub.topicNames.CART_ADD).publishWith(
                        newProduct, [{
                            message: "success"
                        }]);
                };

                getWidget.getSelectedSkuOptionsSelf = function(variantOptions, color, size, width) {
                    var selectedOptions = [],
                        listingVariantImage;
                    console.log(variantOptions, 'variantOptions')
                    if (variantOptions) {
                        for (var i = 0; i < variantOptions.length; i++) {
                            console.log(variantOptions[i], 'variantOptions')
                            console.log(color, size, width)
                            if (variantOptions[i]) {
                                for (var key in variantOptions[i].optionValueMap) {
                                    console.log(key)
                                    if (key == color || key == size || key == width) {
                                        console.log(key, 'inside')
                                        console.log(variantOptions[i].optionValueMap[key], 'value')
                                        selectedOptions.push({
                                            'optionName': variantOptions[i].optionName,
                                            'optionValue': key,
                                            'optionId': variantOptions[i].optionId,
                                            'optionValueId': variantOptions[i].optionValueMap[key]
                                        });
                                    }
                                }
                            }
                        }
                    }
                    return selectedOptions;
                };

            },

            beforeAppear: function() {
                getWidget = this;
                var owlScript = document.createElement('script');
                owlScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js');
                document.head.appendChild(owlScript);
                setTimeout(function() {
                    $('.sync-2').owlCarousel({
                        margin: 0,
                        nav: true,
                        responsive: {
                            0: {
                                items: 3
                            },
                            600: {
                                items: 3
                            },
                            1000: {
                                items: 5
                            }
                        }
                    })
                }, 3000);

                this.startHoverOverImages = function() {
                        $('#brgtn-prod-list-carousel').carousel('cycle');
                    },

                    this.stopHoverOverImages = function() {
                        $('#brgtn-prod-list-carousel').carousel('pause');
                    },

                    // remove timeout after getting correct pubsub
                    setTimeout(function() {
                        var uniqueChildKSUs = [];
                        uniqueChildKSUs.length = 0;
                        getWidget.productGrid().map(function(product) {
                            product.map(function(productCollection, index) {
                                var uniqueChildKSUsObj = {};
                                var uniqueColorPics = [];
                                var uniqueColorPicsNew = [];
                                var colorPicsNew = [];
                                if (productCollection.childSKUs().length > 1) {
                                    var uniqueArrFinal = productCollection.childSKUs().map(function(e, i) {
                                        return e.br_color_pic();
                                    }).map(function(e, i, final) {
                                        return final.indexOf(e) === i && i;
                                    }).filter(function(e) {
                                        return productCollection.childSKUs()[e];
                                    }).map(function(e) {
                                        return productCollection.childSKUs()[e].br_color_pic();
                                    });

                                    //new
                                    var uniqueArrFinal2 = productCollection.childSKUs().map(function(e, i) {
                                        return e.br_color_pic();
                                    }).map(function(e, i, final) {
                                        return final.indexOf(e) === i && i;
                                    }).filter(function(e) {
                                        return productCollection.childSKUs()[e];
                                    }).map(function(e) {
                                        return {
                                            'colorPic': productCollection.childSKUs()[e].br_color_pic(),
                                            'index': e
                                        };
                                    });

                                    uniqueColorPics = uniqueArrFinal;
                                    uniqueColorPicsNew = uniqueArrFinal2;
                                } else {
                                    uniqueColorPics = [];
                                    uniqueChildKSUsObj['index'] = index;
                                }

                                uniqueChildKSUsObj['colorPic'] = uniqueColorPics;
                                uniqueChildKSUsObj['colorPicNew'] = uniqueColorPicsNew;
                                //uniqueChildKSUsObj['index'] = index;
                                uniqueChildKSUsObj['productId'] = productCollection.id();
                                //uniqueChildKSUsObj['altImages'] = altImages;
                                uniqueChildKSUs.push(uniqueChildKSUsObj);
                                getWidget.uniqueChildKSUsArray(uniqueChildKSUs);
                                console.log('uniqueChildKSUsArray', getWidget.uniqueChildKSUsArray());
                            });
                        });
                    }, 2000);




                setTimeout(function() {
                    $('#CC-guidedNavigation-column').parent().parent().addClass('left-nav-filter').addClass('filter-transition');
                    $('#popupStack-re400035').parent().parent().addClass('right-nav-filter').addClass('filter-transition-porducts-list');
                    $('#popupStack-re400089').parent().parent().addClass('right-nav-filter').addClass('filter-transition-porducts-list');
                }, 100);

                // pubsub for search results
                // setTimeout(function(){
                //     console.log('false 123');
                //     $('#popupStack-re400089').parent().parent().parent().prepend('<div class="brgtn-sh-filter-plp col-sm-12"><div class="row"><div class="col-sm-3"><div class="brgtn-filter-by"><span class="col-xs-6 col-md-12 col-sm-12 hide">Hide Filters <img src="/file/general/brgtn-arrow-up.svg"></span><span class="col-xs-6 col-sm-12 col-md-6">Filter By <img src="/file/general/brgtn-arrow-down.svg"></span></div></div></div></div>');  
                //     $('brgtn-sh-filter').remove(); 
                // },1000)

                // pubsub for search results need to be find out and applied here
                $.Topic(pubsub.topicNames.SEARCH_RESULTS_UPDATED).subscribe(function(obj) {
                    // For the Search Result Caption
                    if (obj.message !== CCConstants.SEARCH_MESSAGE_FAIL && this.totalRecordsFound !== 0) {
                        $(".brgtn-shopping-bag-head").css('display', 'block');
                    } else {
                        $(".brgtn-shopping-bag-head").css('display', 'none');
                    }

                    // console.log('calling')
                    // console.log(this.navigation);
                    $('.brgtn-sh-filter-plp').remove();
                    if (!this.navigation || this.navigation.length == 0) {
                        console.log('false');
                        $('.brgtn-sh-filter-plp').hide();
                        $('#CC-productListing').css('border-top', '1px solid #000');
                    } else {
                        console.log('true');
                        // filter show hide
                        $('#popupStack-re400089').parent().parent().parent().prepend('<div class="brgtn-sh-filter-plp col-sm-12"><div class="row"><div class="col-sm-3"><div class="brgtn-filter-by"><span class="col-xs-6 col-md-12 col-sm-12 hide">Hide Filters <img src="/file/general/brgtn-arrow-up.svg"></span><span class="col-xs-6 col-sm-12 col-md-6">Filter By <img src="/file/general/brgtn-arrow-down.svg"></span></div></div></div></div>');
                        $('brgtn-sh-filter').remove();

                        //$('.brgtn-sh-filter-plp').show();
                        $('#CC-productListing').css('border-top', 'none');
                    }
                });

                // Pubsub For product Listing pages of different Categories, Code is same for SEARCH_RESULTS_UPDATED as per functionality
                $.Topic(pubsub.topicNames.SEARCH_RESULTS_FOR_CATEGORY_UPDATED).subscribe(function(obj) {
                    $('.brgtn-sh-filter-plp').remove();
                    if (!this.navigation || this.navigation.length == 0) {
                        console.log('false');
                        $('.brgtn-sh-filter-plp').hide();
                        $('#CC-productListing').css('border-top', '1px solid #000');
                    } else {
                        console.log('true');
                        // filter show hide
                        $('#popupStack-re400035').parent().parent().parent().prepend('<div class="brgtn-sh-filter-plp col-sm-12"><div class="row"><div class="col-sm-3"><div class="brgtn-filter-by"><span class="col-xs-6 col-md-12 col-sm-12 hide">Hide Filters <img src="/file/general/brgtn-arrow-up.svg"></span><span class="col-xs-6 col-sm-12 col-md-6">Filter By <img src="/file/general/brgtn-arrow-down.svg"></span></div></div></div></div>');
                        $('brgtn-sh-filter').remove();

                        //$('.brgtn-sh-filter-plp').show();
                        $('#CC-productListing').css('border-top', 'none');
                    }
                })
            }

        };
    }
);

























<div class="brgtn-add-to-bag text-center">
                    <!-- ko if: $data.variantOptionsArray -->
                        <!-- ko if: $data.variantOptionsArray.length === 1 -->
                            <button class="btn text-uppercase" data-bind="click: $parents[1].addToBag.bind(event)" >Add to Bag</button>
                        <!-- /ko -->
                        <!-- ko if: $data.variantOptionsArray.length > 1 -->
                            <a data-bind="attr : { id: 'CC-product-grid-title-'+id()+'-'+$parentContext.$index()+$index()}, ccLink : $data.listingSku ? $data.listingSku : $data.product, click: $parents[1].updateFocus">
                                <button class="btn text-uppercase">More Options</button>
                            </a>
                        <!-- /ko --> 
                    <!-- /ko -->
                    <!-- ko if: !$data.variantOptionsArray  -->
                        <a data-bind="attr : { id: 'CC-product-grid-title-'+id()+'-'+$parentContext.$index()+$index()}, ccLink : $data.listingSku ? $data.listingSku : $data.product, click: $parents[1].updateFocus">
                                <button class="btn text-uppercase">More Options</button>
                        </a>
                    <!-- /ko -->
              </div>







<!-- ko if: $parents[1].shopperInput -->
                                            <a data-bind="ccLink : $data">
                                                <img data-bind="productVariantImageSource: {src: $data, imageType:'thumb', alt: displayName,
                                                errorSrc: '/img/no-image.jpg', errorAlt: 'Missing Product Image'},
                                                attr:{id: 'https://app.brighton.com/api/preview/?confirmationNum=' + $parents[1].br_customizationNumber.transnumber '&type=' + $parents[1].br_customizationNumber.type }"/>
                                            </a>
                                            <!-- /ko -->