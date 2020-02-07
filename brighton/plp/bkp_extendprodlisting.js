/**
 * @fileoverview extendproductListing_v15.js.
 *
 * @author 
 */
define(
    //---------------------
    // DEPENDENCIES
    //---------------------
    ['jquery', 'knockout','pubsub','pageLayout/product'],

    //-----------------------
    // MODULE DEFINITION
    //-----------------------
    function ($, ko, pubsub, Product) {

        "use strict";
        var getWidget;
        console.log('1111');
        return {
            onLoad: function (widget) {
                getWidget = widget;
                widget.swatchList = ko.observableArray([]);
                widget.swatchIndex = ko.observable(0);
                widget.uniqueChildKSUsArray = ko.observableArray([]);
                
                $(document).on('click', '.brgtn-get-data-swatch', function(){
                    widget.swatchIndex(parseInt($(this).attr('data-swatch')));
                });
                $.Topic(pubsub.topicNames.PAGE_CHANGED).subscribe(function(obj){
                    widget.swatchIndex(0);
                })
                
            },

            beforeAppear: function () {
                getWidget = this;
                var owlScript = document.createElement('script');
                owlScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js');
                document.head.appendChild(owlScript);
                setTimeout(function () {
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

                this.startHoverOverImages = function () {
                    $('#brgtn-prod-list-carousel').carousel('cycle'); 
                },
                
                this.stopHoverOverImages = function () {
                    $('#brgtn-prod-list-carousel').carousel('pause');
                },

                // remove timeout after getting correct pubsub
                setTimeout(function(){
                    var uniqueChildKSUs = [];
                    uniqueChildKSUs.length = 0;
                    getWidget.productGrid().map(function (product) {
                        product.map(function (productCollection, index) {
                          var uniqueChildKSUsObj = {};
                          var uniqueColorPics = [];
                          var uniqueColorPicsNew = [];
                          var colorPicsNew = [];
                          if (productCollection.childSKUs().length > 1) {
                            var uniqueArrFinal = productCollection.childSKUs().map(function (e,i) {
                                return e.br_color_pic();
                            }).map(function (e, i, final) {
                              return final.indexOf(e) === i && i;
                            }).filter(function (e) {
                              return productCollection.childSKUs()[e];
                            }).map(function (e) {
                              return productCollection.childSKUs()[e].br_color_pic();
                            });
                            
                            //new
                            var uniqueArrFinal2 = productCollection.childSKUs().map(function (e,i) {
                                return e.br_color_pic();
                            }).map(function (e, i, final) {
                              return final.indexOf(e) === i && i;
                            }).filter(function (e) {
                              return productCollection.childSKUs()[e];
                            }).map(function (e) {
                              return {'colorPic': productCollection.childSKUs()[e].br_color_pic(), 'index': e};
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
                },2000);
                
                setTimeout(function(){
                    $('#CC-guidedNavigation-column').parent().parent().addClass('left-nav-filter').addClass('filter-transition');
                    $('#popupStack-re400035').parent().parent().addClass('right-nav-filter').addClass('filter-transition-porducts-list');
                },100);
                $.Topic(pubsub.topicNames.SEARCH_RESULTS_FOR_CATEGORY_UPDATED).subscribe(function(obj){
                    $('.brgtn-sh-filter-plp').remove();
                  if (!this.navigation || this.navigation.length == 0) {
                    console.log('false');
                    $('.brgtn-sh-filter-plp').hide();
                    $('#CC-productListing').css('border-top','1px solid #000');
                  }else{
                    console.log('true');
                    // filter show hide
                    $('#popupStack-re400035').parent().parent().parent().prepend('<div class="brgtn-sh-filter-plp col-sm-12"><div class="row"><div class="col-sm-3"><div class="brgtn-filter-by"><span class="col-xs-6 col-md-12 col-sm-12 hide">Hide Filters <img src="/file/general/brgtn-arrow-up.svg"></span><span class="col-xs-6 col-sm-12 col-md-6">Filter By <img src="/file/general/brgtn-arrow-down.svg"></span></div></div></div></div>');  
                    $('brgtn-sh-filter').remove(); 
                      
                    //$('.brgtn-sh-filter-plp').show();
                    $('#CC-productListing').css('border-top','none');
                  }
                })
            }

        };
    }
);