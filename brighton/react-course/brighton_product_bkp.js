<!-- ko if: loaded -->
<div class="templateRegion row" id="cc-product-details" data-oc-id="cc-product-details">
    <!-- ko if: product -->

    <!-- oc layout: panels -->
    <div class="row">
        <!-- product-title -->
        <div class="oc-panel col-md-8 product-left-col" data-oc-id="panel-0-0">
            
            <h1>
                <!-- ko text: product().displayName() -->
                <!-- /ko -->h
            </h1>
            <!-- ko if: product().brand() != null -->
            <span class="brgtn-dark-grey-2 brgtn-font-lato-arial">From the</span> <a href="#" class="brand-name"><span data-bind="text:product().brand"></span></a>
            <!-- /ko -->

            <!-- Product Description-->
            <!-- ko if: product().longDescription() != null -->
            <div data-bind="html: product().longDescription" id="CC-prodDetails-description" class="product-description hidden-xs"> </div>
             <!-- /ko -->

            <!-- Product Images -->

            <div class="cc-image-area">
                <div id="image-viewer" data-bind="visible: product().primaryFullImageURL">

                    <!-- Desktop and tablet views -->
                    <!-- ko ifnot: isMobile -->
                    <div class="cc-viewer-pane hidden-xs">

                        <div id="cc-image-viewer" data-bind="imageZoom: {
        magnifierPercent: 0.35,
        magnifierEnabled: false,
        smallImageUrl: product().mediumImageURLs()[activeImgIndex()],
        fullImageUrl: product().fullImageURLs()[activeImgIndex()],
        imageMetadataDefault: {alttext: (product().product.productImagesMetadata[activeImgIndex()] && product().product.productImagesMetadata[activeImgIndex()].altText) ? product().product.productImagesMetadata[activeImgIndex()].altText : product().displayName(),
                              title:(product().product.productImagesMetadata[activeImgIndex()] && product().product.productImagesMetadata[activeImgIndex()].titleText) ? product().product.productImagesMetadata[activeImgIndex()].titleText : product().displayName()},
        imageMetadatas: product().product.productImagesMetadata,
        index: activeImgIndex,
        spinnerDelay: 200,
        smallImageUrls: product().mediumImageURLs,
        fullImageUrls: product().fullImageURLs,
        replaceImageAtIndex : false,
        errorImageUrl: '/img/no-image.jpg'}">
                            <img class="ccz-small img-responsive"
                                data-bind="attr:{ src: product().mediumImageURLs()[activeImgIndex()]}">
                            </img>

                        </div>
                    </div>
                    <!-- /ko -->

                    <!-- Mobile views -->
                    <!-- ko if: isMobile -->
                    <div data-bind="carouselSwipe" class="carousel slide visible-xs"
                        id="prodDetails-mobileCarousel">
                        <div class="carousel-inner">
                            <!-- ko foreach: product().fullImageURLs -->
                            <div class="item" data-bind="css: {'active': $index() == 0}">

                                <img class="img-responsive center-block" align="middle" data-bind="attr:{ src: $data}">
                                </img>

                                <!-- Updated removed!!! 
          <a class="cc-viewer-pane" href="#" onclick="return false">
            <div data-bind="attr: {id: 'cc-carousel-img-viewer-'+$index()}"></div>
          </a>
          -->
                            </div>
                            <!-- /ko -->
                        </div>
                        <!-- ko if: product().thumbImageURLs && (product().thumbImageURLs().length > 1) -->
                        <div class="row-fluid">
                            <ol class="carousel-indicators" data-bind="foreach: product().fullImageURLs">
                                <li data-target="#prodDetails-mobileCarousel"
                                    data-bind="css: {'active': $index() == 0}, attr: {'data-slide-to': $index}"></li>
                            </ol>
                        </div>
                        <!-- /ko -->
                    </div>
                    <!-- /ko -->

                </div>
            </div>
            
            <!-- Product Image Carousel -->
            <div id="prodDetails-imgCarousel" class="carousel slide hidden-xs"
                data-bind="visible: product().primaryFullImageURL && (product().thumbImageURLs().length > 1) , carouselSwipe"
                data-interval="false">
                <!-- ko if: imgGroups() && (imgGroups().length > 1) -->
                <a class="left carousel-control" href="#prodDetails-imgCarousel" data-slide="prev"
                    data-bind="event: {keyup: handleCarouselArrows}, widgetLocaleText:{value:'previousImageText',attr:'title'}">
                    <div class="cc-left-arrow"></div>
                </a>
                <!-- /ko -->
                <!-- Wrapper for slides -->
                <div class="carousel-inner">
                    <!-- ko foreach: imgGroups -->
                    <div class="item" data-bind="css: {'active': $index()==0}, foreach: $data">
                        <!-- ko if: $parents[1].imgMetadata && ($parents[1].imgMetadata.length>0) && $parents[1].imgMetadata[(($parentContext.$index() * 4) + $index())] -->
                        <div class="col-md-3 thumbnail-container">
                            <a tabindex="0" class="thumbnail"
                                data-bind="click: function(data,event){ $parents[1].loadImageToMain(data, event,($parentContext.$index() * 4) + $index());},
                                          event: {keyup: function(data, event){$parents[1].handleCycleImages(data, event, $index(), $parentContext.$index());}},
                                          attr: {id: 'carouselLink'+(($parentContext.$index() * 4) + $index())},
                                          css: {'active' : $parents[1].activeImgIndex() == ($parentContext.$index() * 4) + $index()}" href="#">
                                <img data-bind="attr: {src: $data, id: 'carouselImg'+(($parentContext.$index() * 4) + $index()),
            alt: $parents[1].imgMetadata[(($parentContext.$index() * 4) + $index())].altText ? $parents[1].imgMetadata[(($parentContext.$index() * 4) + $index())].altText : $parents[1].product().displayName(),
            title: $parents[1].imgMetadata[(($parentContext.$index() * 4) + $index())].titleText ? $parents[1].imgMetadata[(($parentContext.$index() * 4) + $index())].titleText : $parents[1].product().displayName()}"
                                    onError="this.onError=null;this.src='/img/no-image.jpg';">
                            </a>
                        </div>
                        <!-- /ko -->
                        <!-- ko if : !($parents[1].imgMetadata && $parents[1].imgMetadata.length>0 && $parents[1].imgMetadata[(($parentContext.$index() * 4) + $index())])-->
                        <div class="col-md-3 thumbnail-container">
                            <a tabindex="0" class="thumbnail"
                                data-bind="click: function(data,event){ $parents[1].loadImageToMain(data, event,($parentContext.$index() * 4) + $index());},
                                          event: {keyup: function(data, event){$parents[1].handleCycleImages(data, event, $index(), $parentContext.$index());}},
                                          attr: {id: 'carouselLink'+(($parentContext.$index() * 4) + $index())},
                                          css: {'active' : $parents[1].activeImgIndex() == ($parentContext.$index() * 4) + $index()}" href="#">
                                <img data-bind="attr: {src: $data, id: 'carouselImg'+(($parentContext.$index() * 4) + $index()),
            alt: ($parents[1].product().product.productImagesMetadata[$index()] && $parents[1].product().product.productImagesMetadata[$index()].altText) ? $parents[1].product().product.productImagesMetadata[$index()].altText : $parents[1].product().displayName(),
            title: ($parents[1].product().product.productImagesMetadata[$index()] && $parents[1].product().product.productImagesMetadata[$index()].titleText) ? $parents[1].product().product.productImagesMetadata[$index()].titleText : $parents[1].product().displayName()}"
                                    onError="this.onError=null;this.src='/img/no-image.jpg';">
                            </a>
                        </div>
                        <!-- /ko -->
                    </div>
                    <!-- /ko -->
                </div>
                <!-- ko if: imgGroups().length > 1 -->
                <div class="row hidden-md hidden-lg">
                    <ol class="carousel-indicators" data-bind="foreach: imgGroups" title="product images">
                        <li data-target="#prodDetails-imgCarousel"
                            data-bind="css: {'active': $index()==0}, attr: {'data-slide-to': $index}"></li>
                    </ol>
                </div>
                <!-- /ko -->

                <!-- Controls -->
                <!-- ko if: imgGroups().length > 1 -->
                <a class="right carousel-control" href="#prodDetails-imgCarousel" data-slide="next"
                    data-bind="event: {keyup: handleCarouselArrows}, widgetLocaleText:{value:'nextImageText',attr:'title'}">
                    <div class="cc-right-arrow"></div>
                </a>
                <!-- /ko -->
                
                <div class="video-img-thumb hidden-xs">
                    <a href="#myModal"  data-toggle="modal"><img data-bind="attr:{src:product().br_product_redirect_url}" /></a>                    
                </div>
                
                
                
                
                
            </div>
            <div class="mobile-video-thumb-wrapper visible-xs"><a href="#myModal"  data-toggle="modal" class="mobile-video-thumb">&nbsp;</a></div>
             <!-- Product Description-->
            <!-- ko if: product().longDescription() != null -->
            <div data-bind="html: product().longDescription" id="CC-prodDetails-description" class="product-description visible-xs"> </div>
             <!-- /ko -->

        </div>


        <div class="oc-panel col-md-4 product-right-col" data-oc-id="panel-0-1">



            <div class="pdp-price-wrapper">
                <!-- oc section: product-price -->
                <div data-bind="if: !priceRange() &amp;&amp; (!salePrice || salePrice() === null)"
                    data-oc-id="product-list-price-only" role="alert">
                    <span
                        data-bind="currency: {price: listPrice(), currencyObj: $data.site().selectedPriceListGroup().currency, nullReplace: $data.priceUnavailableText(), prependNull: false}, attr: {role: !salePrice() ? 'alert' : null}"
                        aria-atomic="true" aria-live="polite"></span>
                </div>

                <div data-bind="if: !priceRange() &amp;&amp; (salePrice &amp;&amp; salePrice() !== null)"
                    data-oc-id="product-on-sale" role="alert">
                    <span
                        data-bind="currency: {price: salePrice(), currencyObj: $data.site().selectedPriceListGroup().currency, nullReplace: $data.priceUnavailableText(), prependNull: false}"
                        role="alert" aria-atomic="true" aria-live="polite"></span>
                </div>

                <div data-bind="if: priceRange()" data-oc-id="product-price-varies" role="alert">
                    <span data-bind="element: 'brgtn-product-price-range'"></span>
                </div>
                <!-- /oc -->

                <!-- oc section: product-shipping-surcharge -->
                <div data-bind="if: shippingSurcharge()">
                    <span data-bind="element: 'product-shipping-surcharge'"></span>
                </div>
                <!-- /oc -->
                
                <!-- Power Reviews Integration -->
            <div id="pr-reviewsnippet"></div>
            <!-- Power Reviews Integration -->
                
                
            </div>
            



            <div class="skuvariantOptionSection">
                <div class="row">
                    <div class="control-group ">
                        <div id="outOfStockOriginalContainer">
                            <div> 
                                Temporarily sold out online – Available in Stores
                                <div class="row local-store-wrapper">
                                    <span>Find it at your <a href="#">Local Store</a></span>
                                </div>
                                <!--<div class="email-stock-wrapper" data-bind="click: $parents[0].handleOutOfStock">-->
                                <!--    <a href="javascript:void(0)"><span>Email me when in stock</span></a>-->
                                    
                                    <!--<button data-bind="click: $parent.handleOutOfStock" aria-disabled="true">-->
                                    <!--    <span>Add to Cart</span>-->
                                    <!--</button>-->
                                    
                                    <!--<span>-->
                                    <!--    <button type="button" data-bind="click: $parent.handleOutOfStock">Email me when in stock</button>-->
                                    <!--</span>-->
                                        <!--<a data-bind="click: $parent.handleOutOfStock">Email me when in stock</a>-->
                                <!--</div>-->
                                
                                <div class="email-stock-wrapper" data-bind="click: $parents[0].handleOutOfStock">
                                    <a href="javascript:void(0)"><span>Email me when in stock</span></a>
                                </div>
                            </div>
                        </div>
                        <!--ko if:variantOptionsArray().length>0 -->
                                <!-- ko foreach: variantOptionsArray -->
                                <!-- ko if: $data.optionDisplayName=='Color' -->
                        <div class="row color-row">
                            <div class="color-swatches">
                                <span class="control-label"
                                    data-bind="attr: {for: 'CC-prodDetails-' + $data.optionId, id: 'CC-prodDetails-label-' + $data.optionId}">Select
                                    a Color:</span>

                                <div class="color-box">
                                    <!-- ko foreach:optionValues -->

                                    <a class="brVariant skuDropdownColor" data-label="Color" 
                                        data-bind="click: function(data,event){$parent.selectedOption($data);  }, css:{ disableState : ($parents[1].showStockStatus() && !$parents[1].stockStatus()), SelectedSku: $parents[1].getSkuColor($parent.optionValues().length) ,  selectSkuValue: $parents[1].getSkuSelected($parent, $data.key),brColorUnavailable: !$data.visible() } ,attr:{ 'data-key' : $data.key }">

                                        <img class="variantImg" data-bind="attr:{src:$data['img-src']}">

                                    </a>
                                    <!-- /ko -->

                                </div>

                                <div class="brShowToolTip">            
                                    <!-- ko if: $parent.selectedSku() -->
                                    <div class="brShowSelected">
                                        <!-- ko if: $parent.selectedSku().br_style -->
                                        <span class="brHintWrap brStyleHint">
                                            <span class="brHintTitle">Style:</span><span class="brHintValue" data-bind="text:$parent.selectedSku().br_style"></span>
                                        </span>
                                        <!-- /ko-->
                                        <!-- ko if: $parent.selectedSku().x_color -->
                                        <span class="brHintWrap brColorHint">
                                            <span class="brHintTitle">Color:</span><span class="brHintValue" data-bind="text:$parent.selectedSku().x_color"></span>
                                        </span>
                                        <!-- /ko-->
                                    </div>
                                    <!-- /ko-->
                                    <div class="brShowVariant hide">
                                        <span class="brHintWrap">
                                            <span class="brHintTitle brVaraintTitle"></span><span class="brHintValue brVaraintValue"></span>
                                        </span>
                                    </div>
                                </div>
                                <div id="outOfStockColorContainer"></div>
                               
                            </div>
                        </div>
                         <!-- /ko-->
                                <!-- /ko -->
                                <!-- /ko -->
                        

                        <!--ko if:variantOptionsArray().length>0 -->
                                <!-- ko foreach: variantOptionsArray -->
                                <!-- ko if: $data.optionDisplayName=='Size' -->
                        <div class="row size-row">
                            <div class="size-width-swatches">
                                 <!-- ko if:$parents[0].product().displayName() !=='Gift Card' -->
                                <span class="control-label"
                                    data-bind="attr: {for: 'CC-prodDetails-' + $data.optionId, id: 'CC-prodDetails-label-' + $data.optionId}">Select
                                    a Size:
                                </span>
                                 <!-- /ko -->
                                 
                                <!-- ko if:$parents[0].product().displayName() =='Gift Card' -->
                                <span class="control-label">Select a Type:</span>
                                 <!-- /ko -->

                                <div class="size-width-box">
                                    <!-- ko foreach:optionValues -->
                                    <a class="brVariant skuDropdownSize" data-label="Size" 
                                        data-bind="click: function(data,event){$parent.selectedOption($data); },text:$data.key.toLowerCase().split(' ')[0], css:{ disableState : ($parents[1].showStockStatus() && !$parents[1].stockStatus()),  SelectedSku: $parents[1].getSkuSize($parent.optionValues().length) ,selectSkuValue: $parents[1].getSkuSelected($parent, $data.key), brUnavailable: !$data.visible()  }  ,  attr:{ 'data-key' : $data.key }"></a>
                                    <!-- /ko -->
                                </div>
                                <div id="outOfStockSizeContainer"></div>


                              
                            </div>
                        </div>
                          <!-- /ko-->
                                <!-- /ko -->
                                <!-- /ko -->
                         <!--ko if:variantOptionsArray().length>0 -->
                                <!-- ko foreach: variantOptionsArray -->
                                <!-- ko if: $data.optionDisplayName=='width' -->
                        <div class="row size-row">
                            <div class="size-width-swatches">
                               
                                <span class="control-label"
                                    data-bind="attr: {for: 'CC-prodDetails-' + $data.optionId, id: 'CC-prodDetails-label-' + $data.optionId}">Select
                                    Width:
                                </span>


                                <div class="size-width-box">
                                    <!-- ko foreach:optionValues -->
                                    <a class="brVariant skuDropdownWidth" data-label="Width" 
                                        data-bind="click: function(data,event){$parent.selectedOption($data); },text:$data.key.toLowerCase(), css:{ disableState : ($parents[1].showStockStatus() && !$parents[1].stockStatus()),  selectedSku: $parents[1].getSkuSelected($parent, $data.key) ,selectSkuValue: $parents[1].getSkuSelected($parent, $data.key), brUnavailable: !$data.visible()  }  ,  attr:{ 'data-key' : $data.key }"></a>
                                    <!-- /ko -->
                                </div>
                                <div id="outOfStockWidthContainer"></div>


                              
                            </div>
                        </div>
                          <!-- /ko-->
                                <!-- /ko -->
                                <!-- /ko -->




                    </div>
                </div>
            </div>


            <!-- section: product-quantity -->
            <div class="row quantity-row">
                <div class="control-group col-xs-12">
                    <label class="control-label" for="CC-prodDetails-quantity"><span
                            data-bind="widgetLocaleText: 'itemQuantityLabelText'"></span>:</label>
                </div>
                <div class="col-xs-12">
                    <input id="CC-prodDetails-quantity" type="text" class="cc-numericField form-control"
                        data-bind="textInput: itemQuantity">
                </div>
                <!-- ko if: variantOptionsArray().length == 0 || selectedSku -->
                <div class="notify col-xs-6">
                    <span id="CC-prodDetails-quantity-itemError" class="text-danger" role="alert" aria-live="assertive"
                        data-bind="validationMessage: itemQuantity"></span>
                </div>
                <!-- /ko -->
            </div>


            <!-- oc section: product-stock-availability -->
            <div data-bind="if: (showStockStatus() &amp;&amp; stockStatus() &amp;&amp; stockState()==='IN_STOCK')"
                data-oc-id="product-in-stock" class="hide">
                <span
                    data-bind="widgetLocaleText:{custom: $elementInstance.textId, value: 'instockText', attr:'innerText'}"
                    role="alert" aria-atomic="true" aria-live="polite"></span>
            </div>

            <div data-bind="if: (showStockStatus() &amp;&amp; !stockStatus() )" data-oc-id="product-out-of-stock" class="hide">
                <span
                    data-bind="widgetLocaleText:{custom: $elementInstance.textId, value: 'outofstockText', attr:'innerText'}"
                    role="alert" aria-atomic="true" aria-live="polite"></span>
            </div>
            <div data-bind="if: (showStockStatus() &amp;&amp; stockStatus() &amp;&amp; stockState()==='PREORDERABLE')"
                data-oc-id="product-preorder" class="hide">
                <span role="alert" aria-atomic="true" aria-live="polite">
                    <span
                        data-bind="widgetLocaleText:{custom: $elementInstance.textId, value: 'preorderableText', attr:'innerText'}"></span>
                    <!-- ko if: $data.availabilityDate() != null-->
                    <span data-bind="widgetLocaleText: 'availabilityDateText'"></span>
                    <span data-bind="ccDate: {date: $data.availabilityDate()}"></span>
                    <!-- /ko -->
                </span>
            </div>
            <div data-bind="if: (showStockStatus() &amp;&amp; stockStatus()&amp;&amp; stockState()==='BACKORDERABLE' )"
                data-oc-id="product-backorder" class="hide">
                <span role="alert" aria-atomic="true" aria-live="polite">
                    <span
                        data-bind="widgetLocaleText:{custom: $elementInstance.textId, value: 'backorderableText', attr:'innerText'}"></span>
                    <!-- ko if: $data.availabilityDate() != null-->
                    <span data-bind="widgetLocaleText: 'availabilityDateText'"></span>
                    <span data-bind="ccDate: {date: $data.availabilityDate()}"></span>
                    <!-- /ko -->
                </span>
            </div>
            <!-- /oc -->

            <!-- oc section: product-add-to-cart -->
            <div id="CC-prodDetails-addToCart" data-bind="inTabFlow:(validateAddToCart())">
                <button id="cc-prodDetailsAddToCart"
                    data-bind="disabled: {condition: !validateAddToCart() || isAddToCartClicked, click: handleAddToCart}"
                    class="cc-button-primary">
                    <!-- ko ifnot: stockState() === 'PREORDERABLE'-->
                    <span id="cc-prodDetails-addToCart" data-bind="widgetLocaleText: 'addToCartText'"></span>
                    <!-- /ko -->
                    <!-- ko if: stockState() === 'PREORDERABLE'-->
                    <span id="cc-prodDetails-addToCart" data-bind="widgetLocaleText: 'preOrderButtonText'"></span>
                    <!-- /ko -->
                </button>
                <a href="#" class="btn-find-store" >Find in Store</a>
                <!-- ko if:hasOwnProperty('includeStoreLocator')-->
                    <a href="#" class="btn-find-store"  data-toggle="modal" data-target="#storePickUpModal">Find in Store</a>
                <!--/ko -->
            </div>

            <div class="row additional-properties">
                <ul class="additional-properties-listing">
                    <!--ko if:selectedSku() -->
                    <!-- ko foreach:$data.productTypes() -->
                    <!-- ko foreach:$data.skuProperties -->
                    <!--ko if:$parents[1].selectedSku()[$data.id] !== null && $data.id !== "br_color_pic" && $data.id !== "br_pic1" && $data.id !== "br_pic2" && $data.id !== "br_pic3" && $data.id !== "br_pic4" && $data.id !== "br_pic5" && $data.id !== "br_pic6" && $data.id !== "br_pic7" -->
                    <li><span data-bind="text:$data.label, attr:{'data-ref-id': $data.id}"
                            class="additiona-label"></span>:<span data-bind="text:$parents[1].selectedSku()[$data.id]"
                            class="aditional-listing-result"></span></li>
                    <!-- /ko -->
                    <!-- /ko -->
                    <!-- /ko -->
                    <!-- /ko -->

                    <!--ko if:!selectedSku() -->
                    <!-- ko foreach:$data.productTypes() -->
                    <!-- ko foreach:$data.skuProperties -->
                    <!--ko if:$parents[1].product() && $parents[1].product().childSKUs()[0][$data.id]() !== null  && $data.id !== "br_color_pic" && $data.id !== "br_pic1" && $data.id !== "br_pic2" && $data.id !== "br_pic3" && $data.id !== "br_pic4" && $data.id !== "br_pic5" && $data.id !== "br_pic6" && $data.id !== "br_pic7" -->
                    <li><span data-bind="text:$data.label, attr:{'data-ref-id': $data.id}"
                            class="additiona-label"></span>:<span
                            data-bind="text:$parents[1].product().childSKUs()[0][$data.id]()"
                            class="aditional-listing-result"></span></li>
                    <!-- /ko -->
                    <!-- /ko -->
                    <!-- /ko -->
                    <!-- /ko -->
                </ul>
                
                
                <!--ko if:product().br_tlc_instructions() !== null -->
                <div class="pdp-care-wrapper">
                    <h3><span>Care</span></h3>

                    <div class="care-wrapper" data-bind="html:product().br_tlc_instructions"></div>
                </div>
                <!-- /ko -->
                 <div class="more-less-link-wrapper hide">
                    <a href="javascript:void(0)" class="more-less-link moreArrow">Show More</a>
                </div>
            </div>

            <!-- section: product-add-to-space -->
            <!-- ko if: showSWM  -->
            <br><br>
            <div class="btn-group swm-add-to-wishlist-selector">
                <button id="cc-prodDetailsAddToSpaceSelector" data-backdrop="static"
                    data-bind="disabled: {condition: !validateAddToSpace() || disableAddToSpace}, click: isAddToSpaceClicked() == false && addToSpaceClick"
                    class="btn cc-button-secondary">
                    <!-- ko ifnot: isAddToSpaceClicked -->
                    <span id="CC-prodDetails-addToSpaceSelector"
                        data-bind="widgetLocaleText:'socialAddToSpaceText'"></span>
                    <!-- /ko -->
                    <!-- ko if: isAddToSpaceClicked -->
                    <span id="CC-prodDetails-addedToSpaceSelector"
                        data-bind="widgetLocaleText:'socialAddedToSpaceText'"></span>
                    <!-- /ko -->
                </button>
                <!-- ko if: $data.user().loggedIn() -->
                <button id="cc-prodDetailsAddToSpaceDropdown" class="btn cc-button-secondary dropdown-toggle"
                    data-backdrop="static" data-toggle="dropdown"
                    data-bind="disabled: {condition: !validateAddToSpace() || disableAddToSpace}, click: $data.openAddToWishlistDropdownSelector.bind($data)">
                    <span class="caret"></span>
                    <span class="sr-only" data-bind="widgetLocaleText:'socialAddToSpaceText'"></span>
                </button>
                <ul class="dropdown-menu" role="menu" aria-labelledby="cc-prodDetailsAddToSpaceDropdown">
                    <li role="presentation" class="dropdown-header" data-bind="widgetLocaleText: 'mySpacesGroupText'">
                    </li>
                    <!-- ko foreach : {data : $data.spaceOptionsGrpMySpacesArr, as : 'mySpaces'} -->
                    <li role="presentation"><a role="menuitem" tabindex="-1" href="#"
                            data-bind="text: mySpaces.spaceNameFull, click: $parent.addToSpaceSelect.bind($parent, mySpaces.spaceid)"></a>
                    </li>
                    <!-- /ko -->
                    <li role="presentation" class="dropdown-header"
                        data-bind="visible: spaceOptionsGrpJoinedSpacesArr().length > 0, widgetLocaleText: 'joinedSpacesGroupText'">
                    </li>
                    <!-- ko foreach : {data : $data.spaceOptionsGrpJoinedSpacesArr, as : 'joinedSpaces'} -->
                    <li role="presentation"><a role="menuitem" tabindex="-1" href="#"
                            data-bind="text: joinedSpaces.spaceNameFormatted, click: $parent.addToSpaceSelect.bind($parent, joinedSpaces.spaceid)"></a>
                    </li>
                    <!-- /ko -->
                    <li role="presentation" class="divider"></li>
                    <li role="presentation"><a role="menuitem" tabindex="-1" href=""
                            data-bind="widgetLocaleText: 'createNewSpaceOptText', click: addToSpaceSelectorClick"></a>
                    </li>
                </ul>
                <!-- /ko -->
            </div>
            <!-- /ko -->



        </div>


    </div>
    <!-- /oc -->
    
    
    
    <div class="row egift-card-wrapper hide">
            <h1>
                <!-- ko text: product().displayName() -->
                <!-- /ko -->
            </h1>
            
             <!-- ko if: product().longDescription() != null -->
            <div data-bind="html: product().longDescription" id="CC-prodDetails-description" class="product-description hidden-xs"> </div>
             <!-- /ko -->
             
             <div class="egift-card-container">
                 <div class="col-xs-12 col-sm-6 egift-left-col-wrapper">
                     <div class="egift-left-col">
                         <img src="/file/general/egift_red_overlay.png" width="319" height="368" alt="E Gift Card" />
                     </div>
                 </div>
                 <div class="col-xs-12 col-sm-6 egift-right-col-wrapper">
                     <div class="egift-right-col">
                         <div class="form-group">
                            <label for="recipientName">Recipient Name<sup>*</sup>:s:</label> 
                            <input type="text" class="form-control" id="recipientName">
                         </div>
                          <div class="form-group">
                            <label for="yourMessage">Your Message:</label><sup>*</sup>
                            <textarea rows="10" cols="25" class="form-control" placeholder="Enter your message (optional)" id="yourMessage" name="yourMessage"></textarea>
                          </div>
                          <div class="form-group">
                            <label for="yourName">Your Name:</label><sup>*</sup>
                            <input type="text" class="form-control" id="yourName">
                         </div>
                     </div>
                 </div>
             </div>
            
    </div>
    
    
    <div class="row pdp-social-icons-wrapper">
        <div class="pdp-social-hr">&nbsp;</div>
        <ul class="pdp-social-icons">
            <li>
                <a href="#">
                    <svg aria-labelledby="sti1" roll="img" viewBox="0 0 24.9 24.9" width="40" height="40">
                        <title id="sti1">Send Brighton an Email</title>
                        <circle class="svga" cx="12.45" cy="12.45" r="12.2"></circle>
                        <path class="svgb"
                            d="M19.44,6.69H5A.34.34,0,0,0,4.66,7V17.34a.34.34,0,0,0,.34.34H19.44a.34.34,0,0,0,.34-.34V7A.34.34,0,0,0,19.44,6.69Zm-.34,9.48-4.26-4.26-.49.49L19,17H5.49l4.6-4.6-.49-.49L5.35,16.17V7.38H19.1Z">
                        </path>
                        <path class="svgb"
                            d="M18.41,7.38l-6.18,6.18L6,7.38H5.35v.28L12,14.29a.34.34,0,0,0,.49,0L19.1,7.65V7.38Z">
                        </path>
                    </svg>
                </a>
            </li>
            <li>
                <a target="_blank" class="soc-fb"
                    href="https://www.facebook.com/sharer/sharer.php?u=https://www.brighton.com/product/flats/36956-218287/fashionista-love-me-sneaker.html"><svg
                        aria-labelledby="sti2" roll="img" viewBox="0 0 24.9 24.9" width="40" height="40">
                        <title id="sti2">Follow Brighton on Facebook</title>
                        <circle class="svga" cx="12.45" cy="12.45" r="12.2"></circle>
                        <path class="svgb"
                            d="M9.35,7.55v2.4H7.65v2.9h1.7v8.7H13v-8.6h2.4s.2-1.4.3-2.9H13v-2a.86.86,0,0,1,.8-.7h2v-3H13C9.25,4.25,9.35,7.15,9.35,7.55Z">
                        </path>
                    </svg></a>
            </li>
            <li>
                <a href="#">
                    <svg aria-labelledby="sti6" roll="img" viewBox="0 0 24.9 24.9" width="40" height="40">
                        <title id="sti6">Follow Brighton on Pinterest</title>
                        <circle class="svga" cx="12.45" cy="12.45" r="12.2"></circle>
                        <path class="svgb"
                            d="M12.05,15.15c-.4,2.3-1,4.5-2.6,5.7-.5-3.5.7-6.1,1.3-8.9-1-1.6.1-4.9,2.1-4.1,2.5,1-2.2,6,1,6.6s4.6-5.7,2.6-7.7c-2.9-3-8.5-.1-7.8,4.2.2,1,1.2,1.4.4,2.8-1.9-.4-2.4-1.9-2.4-3.9a6.31,6.31,0,0,1,5.7-5.8c3.5-.4,6.8,1.3,7.3,4.6.5,3.7-1.6,7.8-5.4,7.5C13.25,16.05,12.85,15.55,12.05,15.15Z">
                        </path>
                    </svg>
                </a>
            </li>
            <li>
                <a target="_blank" class="soc-tw"
                    href="https://twitter.com/intent/tweet?text=Get your kicks in these lovely sneakers bearing Tom Clancy's handwr...&amp;media=https://www.brighton.com/photos/product/standard/369560S218407/flats/love-me-sneaker.jpg&amp;description=Get your kicks in these lovely sneakers bearing Tom Clancy's handwr..."><svg
                        aria-labelledby="sti3" roll="img" viewBox="0 0 24.9 24.9" width="40" height="40">
                        <title id="sti3">Follow Brighton on Twitter</title>
                        <circle class="svga" cx="12.45" cy="12.45" r="12.2"></circle>
                        <path class="svgb"
                            d="M20.45,8.15a12.09,12.09,0,0,1-1.8.5A3.91,3.91,0,0,0,20,6.95a7,7,0,0,1-2,.8,3.26,3.26,0,0,0-2.3-1,3.12,3.12,0,0,0-3.1,3.1,1.7,1.7,0,0,0,.1.7,8.61,8.61,0,0,1-6.4-3.3,2.93,2.93,0,0,0-.4,1.6,3.26,3.26,0,0,0,1.4,2.6,3.26,3.26,0,0,1-1.4-.4h0a3.21,3.21,0,0,0,2.5,3.1,2.2,2.2,0,0,1-.8.1,1.27,1.27,0,0,1-.6-.1,3.38,3.38,0,0,0,2.9,2.2A6.53,6.53,0,0,1,6,17.65h-.7a8.72,8.72,0,0,0,4.8,1.4,8.83,8.83,0,0,0,8.9-8.9v-.4A7.31,7.31,0,0,0,20.45,8.15Z">
                        </path>
                    </svg></a>
            </li>
        </ul>
    </div>
    
    <div class="row egift-card-amount-wrapper hide">
        <h2>Select Card Amount</h2>
        <div class="egift-card-amount-inner-wrapper">
                <div class="egift-card-amount-list">
                    <div class="egift-amount-box-wrapper">
                        <div class="egift-card-amount">
                            $25
                        </div>
                        <div class="egift-card-radio">
                            <div>&nbsp;</div>
                        </div>
                    </div>
                </div>
                <div class="egift-card-amount-list">
                    <div class="egift-amount-box-wrapper">
                        <div class="egift-card-amount">
                            $50
                        </div>
                        <div class="egift-card-radio">
                            <div>&nbsp;</div>
                        </div>
                    </div>
                </div>
                <div class="egift-card-amount-list">
                    <div class="egift-amount-box-wrapper">
                        <div class="egift-card-amount">
                            $75
                        </div>
                        <div class="egift-card-radio">
                            <div>&nbsp;</div>
                        </div>
                    </div>
                </div>
                <div class="egift-card-amount-list">
                    <div class="egift-amount-box-wrapper">
                        <div class="egift-card-amount">
                            $100
                        </div>
                        <div class="egift-card-radio">
                            <div>&nbsp;</div>
                        </div>
                    </div>
                </div>
                <div class="egift-card-amount-list">
                    <div class="egift-amount-box-wrapper">
                        <div class="egift-card-amount">
                            $150
                        </div>
                        <div class="egift-card-radio">
                            <div>&nbsp;</div>
                        </div>
                    </div>
                </div>
                <div class="egift-card-amount-list">
                    <div class="egift-amount-box-wrapper">
                        <div class="egift-card-amount">
                            $200
                        </div>
                        <div class="egift-card-radio">
                            <div>&nbsp;</div>
                        </div>
                    </div>
                </div>
                <div class="egift-card-amount-list">
                    <div class="egift-amount-box-wrapper">
                        <div class="egift-card-amount">
                            $300
                        </div>
                       <div class="egift-card-radio">
                            <div>&nbsp;</div>
                        </div>
                    </div>
                </div>
                <div class="egift-card-amount-list">
                    <div class="egift-amount-box-wrapper">
                        <div class="egift-card-amount">
                            $500
                        </div>
                        <div class="egift-card-radio">
                            <div>&nbsp;</div>
                        </div>
                    </div>
                </div>
        </div>
        
        <div class="row egift-card-price-wrapper text-right">
            <div class="price-description">
                eGift Card Amount: 
            </div>
            <div class="egift-price">
                <span>$25-$500</span>
            </div>
        </div>
        
        <div class="row egift-card-additional-wrapper">
            <h2>Where would you like to email your eGift Card?</h2>
            <div class="row egift-card-additional-form">
                <div class="form-row">
                    <div class="col-xs-12 col-sm-6 pl-0">
                      <label for="recipientName">Recipient Email Address<sup>*</sup></label> 
                      <input type="text" class="form-control" placeholder="First name">
                    </div>
                    <div class="col-xs-12 col-sm-6 pl-0">
                    <label for="recipientName">Verify Email Address:<sup>*</sup></label> 
                      <input type="text" class="form-control" placeholder="Last name">
                    </div>
                  </div>
            </div>
        </div>
        
        <div class="egift-card-add-cart-btn">
            <button id="cc-prodDetailsAddToCart" data-bind="disabled: {condition: !validateAddToCart() || isAddToCartClicked, click: handleAddToCart}" class="cc-button-primary" aria-disabled="true" tabindex="0">
                    <!-- ko ifnot: stockState() === 'PREORDERABLE'-->
                    <span id="cc-prodDetails-addToCart" data-bind="widgetLocaleText: 'addToCartText'">Add to Cart</span>
                    <!-- /ko -->
                    <!-- ko if: stockState() === 'PREORDERABLE'--><!-- /ko -->
                </button>
        </div>
        
    </div>
    
    <!-- /ko -->
    <!-- Modal HTML -->
    <div id="myModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                 <a href="#" class="close" data-dismiss="modal" aria-hidden="true">&nbsp;</a>
                <div class="modal-body">
                    <iframe id="cartoonVideo" width="100%"  frameborder="0"  data-bind="attr: {src: product().br_product_video_url}"></iframe>
                </div>
            </div>
        </div>
    </div>
    <!-- store changes starts here -->
    <!-- ko if:hasOwnProperty('includeStoreLocator')-->
    <div id="storePickUpModal" class="modal fade" role="dialog">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">
   <button type="button" class="close" data-dismiss="modal">&times;</button>
   <h4 class="modal-title"><span data-bind="widgetLocaleText: 'storePickerModalHeadingText'"></span></h4>
</div>
<div class="modal-body">
   <div class="row item">
      <div class="col-xs-12 col-sm-12 col-md-12">
         <span data-bind="widgetLocaleText: 'searchStoreLabelText'"></span>
      </div>
   </div>
   <div class="row hidden-xs">
      <label class="control-label hidden" for="CC-storeSelect"><span data-bind="widgetLocaleText: 'storeSearchPlaceholderText'"></span>:</label>
      <div class="col-xs-8 col-sm-8 col-md-8">
         <input type="text" class="col-md-12 form-control" name="storeSearchQueryInModal" id="CC-storeSelect" aria-required="true"
            data-bind="value: storeSearchText, valueUpdate: 'afterkeydown', widgetLocaleText : {value:'storeSearchPlaceholderText', attr:'placeholder'}, event: { keydown : handleKeyPress }"/>
      </div>
      <span class="input-group-btn cell-padding">
      <button type="button" id="CC-findStoresModalButton" class="cc-button-primary button-text-nowrap" data-bind="click: displayStoreSelector, disable: !storeSearchText.isValid()">
      <span data-bind="widgetLocaleText:'findStoresButtonText'"></span>
      </button>
      </span>
   </div>
   <div class="row visible-xs">
      <label class="control-label hidden" for="CC-storeSelect-mobile"><span data-bind="widgetLocaleText: 'storeSearchPlaceholderText'"></span>:</label>
      <div class="row-item col-xs-12 col-sm-12 col-md-12">
         <input type="text" class="col-md-12 form-control" name="storeSearchQueryInModal" id="CC-storeSelect-mobile" aria-required="true"
            data-bind="value: storeSearchText, valueUpdate: 'afterkeydown', widgetLocaleText : {value:'storeSearchPlaceholderText', attr:'placeholder'}"/>
      </div>
      <span class="row-item input-group-btn cell-padding">
      <button type="button" id="CC-findStoresModalButton-mobile" class="cc-button-primary button-text-nowrap" data-bind="click: displayStoreSelector, disable: !storeSearchText.isValid()">
      <span data-bind="widgetLocaleText:'findStoresButtonText'"></span>
      </button>
      </span>
   </div>
   <div class="row-item">
      <span id="CC-storeSelect-itemError" class="text-danger" role="alert" aria-live="assertive" data-bind="validationMessage: storeSearchText"></span>
   </div>
</div>
<!-- ko if: stores().length === 0 -->
<div class="empty-stores">
   <!-- ko if: storeLookupStatus() === -1 -->
   <div align="center" class="row-item">
      <strong>
      <span data-bind="widgetLocaleText:{value: 'storeLookupFailed', params: {siteId : $data.site().siteInfo.id}, attr : 'innerText'}"></span>
      </strong>
   </div>
   <!-- /ko -->
   <!-- ko if: stores().length === 0 && storeLookupStatus() == -2 -->
   <div align="center" class="row-item">
      <strong>
      <span data-bind="widgetLocaleText:'noStoresFound'"></span>
      </strong>
   </div>
   <!-- /ko -->
</div>
<!-- /ko -->
<!-- ko if: stores().length > 0 -->
<div style="border-bottom: 1px solid #e5e5e5;"/>
   <div class="stores">
      <!-- ko foreach: stores -->
      <div class="row store-item hidden-xs">
         <div class="col-xs-5 col-sm-5 col-md-5">
            <!-- ko if: $data.store.name -->
            <span data-bind="text: $data.store.name"/><br>
            <!-- /ko -->
            <!-- ko if: $data.store.address1 -->
            <span data-bind="text: $data.store.address1"/><br>
            <!-- /ko -->
            <!-- ko if: $data.store.address2 -->
            <span data-bind="text: $data.store.address2"/><br>
            <!-- /ko -->
            <!-- ko if: $data.store.address3 -->
            <span data-bind="text: $data.store.address3"/><br>
            <!-- /ko -->
            <!-- ko if: $data.store.city ||  $data.store.postalCode-->
            <span data-bind="text: $data.store.city"/><span class="cell-padding" data-bind="text: $data.store.postalCode"/><br>
            <!-- /ko -->
            <!-- ko if: $data.store.phoneNumber -->
            <span data-bind="text: $data.store.phoneNumber"/><br>
            <!-- /ko -->
         </div>
         <!-- ko if: $data.availabilityStatusMsg !== 'OUT_OF_STOCK'  && $data.availableQuantity > 0 -->
         <!-- ko if: $data.availabilityStatusMsg === 'IN_STOCK' -->
         <div class="col-xs-4 col-sm-4 col-md-4">
            <span class="availability-check"/><span class="cell-padding" data-bind="text: $data.availableQuantity"/>
            <span data-bind="widgetLocaleText:'instockText'"></span>
         </div>
         <!-- /ko -->
         <!-- ko if: $data.availabilityStatusMsg === 'PREORDERABLE' -->
         <div class="col-xs-4 col-sm-4 col-md-4">
            <span class="availability-check"/><span class="cell-padding" data-bind="text: $data.availableQuantity"/>
            <span data-bind="widgetLocaleText:'preorderableText'"></span>
         </div>
         <!-- /ko -->
         <!-- ko if: $data.availabilityStatusMsg === 'BACKORDERABLE' -->
         <div class="col-xs-4 col-sm-4 col-md-4">
            <span class="availability-check"/><span class="cell-padding" data-bind="text: $data.availableQuantity"/>
            <span data-bind="widgetLocaleText:'backorderableText'"></span>
         </div>
         <!-- /ko -->
         <div class="col-xs-3 col-sm-3 col-md-3">
            <button type="button" class="cc-button-primary" data-bind="click: function() { $parent.handleStoreSelection($data, $parents[1])}">
            <span data-bind="widgetLocaleText:'storeSelectionButtonText'"></span>
            </button>
         </div>
         <!-- /ko -->
         <!-- ko if: $data.availabilityStatusMsg === 'OUT_OF_STOCK' || $data.availableQuantity === 0 -->
         <div class="col-xs-4 col-sm-4 col-md-4">
            <span class="non-availability-check"/><span class="cell-padding" data-bind="widgetLocaleText:'outofstockText'"></span>
         </div>
         <!-- /ko -->
      </div>
      <div class="row store-item visible-xs">
         <div class="col-xs-12 col-sm-12 col-md-12">
            <!-- ko if: $data.store.name -->
            <span data-bind="text: $data.store.name"/><br>
            <!-- /ko -->
            <!-- ko if: $data.store.address1 -->
            <span data-bind="text: $data.store.address1"/><br>
            <!-- /ko -->
            <!-- ko if: $data.store.address2 -->
            <span data-bind="text: $data.store.address2"/><br>
            <!-- /ko -->
            <!-- ko if: $data.store.address3 -->
            <span data-bind="text: $data.store.address3"/><br>
            <!-- /ko -->
            <!-- ko if: $data.store.city ||  $data.store.postalCode-->
            <span data-bind="text: $data.store.city"/><span class="cell-padding" data-bind="text: $data.store.postalCode"/><br>
            <!-- /ko -->
            <!-- ko if: $data.store.phoneNumber -->
            <span data-bind="text: $data.store.phoneNumber"/><br>
            <!-- /ko -->
         </div>
         <!-- ko if: $data.availabilityStatusMsg !== 'OUT_OF_STOCK'  && $data.availableQuantity > 0 -->
         <!-- ko if: $data.availabilityStatusMsg === 'IN_STOCK' -->
         <div class="col-xs-12 col-sm-12 col-md-12 row-item">
            <span class="availability-check"/><span class="cell-padding" data-bind="text: $data.availableQuantity"/>
            <span data-bind="widgetLocaleText:'instockText'"></span>
         </div>
         <!-- /ko -->
         <!-- ko if: $data.availabilityStatusMsg === 'PREORDERABLE' -->
         <div class="col-xs-12 col-sm-12 col-md-12 row-item">
            <span class="availability-check"/><span class="cell-padding" data-bind="text: $data.availableQuantity"/>
            <span data-bind="widgetLocaleText:'preorderableText'"></span>
         </div>
         <!-- /ko -->
         <!-- ko if: $data.availabilityStatusMsg === 'BACKORDERABLE' -->
         <div class="col-xs-12 col-sm-12 col-md-12 row-item">
            <span class="availability-check"/><span class="cell-padding" data-bind="text: $data.availableQuantity"/>
            <span data-bind="widgetLocaleText:'backorderableText'"></span>
         </div>
         <!-- /ko -->
         <div class="col-xs-12 col-sm-12 col-md-12 row-item">
            <button type="button" class="cc-button-primary" data-bind="click: function() { $parent.handleStoreSelection($data, $parents[1])}">
            <span data-bind="widgetLocaleText:'storeSelectionButtonText'"></span>
            </button>
         </div>
         <!-- /ko -->
         <!-- ko if: $data.availabilityStatusMsg === 'OUT_OF_STOCK' || $data.availableQuantity === 0 -->
         <div class="col-xs-12 col-sm-12 col-md-12 row-item">
            <span class="non-availability-check"/><span class="cell-padding" data-bind="widgetLocaleText:'outofstockText'"></span>
         </div>
         <!-- /ko -->
      </div>
      <!-- /ko -->
   </div>
   <!-- /ko -->
   <div class="modal-footer"/>
   </div>
</div>
</div>
    <!-- /ko -->
    <!-- store changes ends here -->
</div>
<!-- /ko -->

