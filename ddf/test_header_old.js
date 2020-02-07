var headerScope = '';
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'pubsub', 'notifications', 'CCi18n', 'ccConstants', 'navigation', 'ccLogger', 'ccNumber', 'ccRestClient', 'storageApi', 'notifier', 'ccResourceLoader!global/productCompareSharedViewModel', ],

    // -------------------------------------------------------------------
    // MODULE DEFINITION
    // -------------------------------------------------------------------
    function($, ko, pubsub, notifications, CCi18n, CCConstants, navigation, ccLogger, ccNumber, CCRestClient, storageApi, notifier, productCompareSharedViewModel) {
        "use strict";
        var isGetPromoMessageServiceCalled = false;
        return {
            conCourseAgentDetails:ko.observable({}),
            isConCourseAgentLogin: ko.observable(false),
            isMobile: ko.observable(false),
            selectedLocalCurrency: ko.observable({}),
            linkList: ko.observableArray(),
            raffleProducts: ko.observableArray(),
            nonRaffleProducts: ko.observableArray(),
            cartVisible: ko.observable(false),
            _displayedMiniCartItems: ko.observableArray(),
            currentSection: ko.observable(1),
            totalSections: ko.observable(),
            dropdowncartItemsHeight: ko.observable(),
            gwpQualifiedMessage: ko.observable(),
            displayShoppingAtDDF: ko.observable(false),
            displayMyAccountMenuAtDDF: ko.observable(false),
            navigatetoTabNumber: ko.observable(),
            localCurrencyExchange: ko.observableArray([]),
            preOrderCartSubTotal:ko.observable(0),
            raffleTicketsVATTotal:ko.observable(0),
            preOrderCartVAT:ko.observable(0),
            preOrderCartTotal:ko.observable(0),
            preOrderCartDiscount:ko.observable(0),
            productIds: ko.observableArray(),
            allAvailablePromotions:ko.observableArray([]),
            cartImageSrc:ko.observable('/file/general/icons8-shopping_cart.svg'),
             checkResponsiveFeatures: function(viewportWidth) {
                if (viewportWidth > 978) {
                    this.isMobile(false);
                } else if (viewportWidth <= 978) {
                    this.isMobile(true);
                }
            },
      
            getItemUnitPrice:function(itemTotal, VAT , productId){
                var locallyAppliedPromotions = localStorage.getItem('locallyAppliedPromotion');
                var itemPrice = 0;
                var itemQuantity = 0;
                if(locallyAppliedPromotions){
                    locallyAppliedPromotions = JSON.parse(locallyAppliedPromotions);
                    if(locallyAppliedPromotions.length){
                        for(var i=0; i < locallyAppliedPromotions.length ; i++){
                            if(locallyAppliedPromotions[i].itemCode === productId){
                                itemPrice = locallyAppliedPromotions[i].unitListPrice;
                                itemQuantity = locallyAppliedPromotions[i].quantity;
                                if(locallyAppliedPromotions[i].discounts.length){
                                    for(var j=0; j < locallyAppliedPromotions[i].discounts.length ; j++){
                                        var discount = locallyAppliedPromotions[i].discounts[j];
                                        if(discount.discountType !== 'SPECIAL_DISCOUNT'){
                                            itemPrice = itemPrice - (discount.extendedDiscountAmount/locallyAppliedPromotions[i].quantity);
                                        }
                                    }
                                    // itemPrice = itemPrice - locallyAppliedPromotions[i].VATAmount;
                                }else{
                                    // itemPrice = itemPrice - locallyAppliedPromotions[i].VATAmount;
                                }
                             break;
                            }
                        }
                    }
                }
                return itemPrice * itemQuantity;
        },
            initHeader: function() {
              var currentUrl = window.location.href;
              var currentUser = this.user();
              if ((currentUrl.search(/login/i) !== -1 || currentUrl.search(/registration/i) !== -1) && currentUser.loggedIn()) {
                
                  navigation.goTo('/');
              }
            },
            resetCurrency:function(){
                var self = this;
                storageApi.getInstance().removeItem("activeCurrency");
                // self.selectedLocalCurrency({});
                productCompareSharedViewModel.setActiveCurrency({});
            },
            sortCartBasedOnProductType:function(){
                var self = this;
                self.nonRaffleProducts([]);
                self.raffleProducts([]);
                if(self.cart().items().length){
                    self.cart().items().forEach(function(item){
                        if(item.productData() && (!item.productData().type || (item.productData().type && item.productData().type!== "RaffleTickets"))){
                            self.nonRaffleProducts.push(item);
                        }else{
                            self.raffleProducts.push(item);
                        }
                    })
                }
            },
            handleLoginNavigation:function(){
                localStorage.removeItem("requiredLoginPage");
            },
            navigateToProfile:function(index){
                storageApi.getInstance().setItem("activeProfileTab", index);
                if(window.location.pathname.indexOf("/profile") > -1){
                     $("#tabNormalViewport .nav.nav-tabs li a")[+index].click();
                }
                navigation.goTo("/profile");
                this.showMyAccountMenuAtDDF()
            },
            handleOpenUserSetting:function(){
                document.getElementById("myBrandCollectionNav").style.width = "0px";
                document.getElementById("myCollectionNav").style.width = "0px";
                document.getElementById("myCartNav").style.width = "0px";
                if(document.getElementById("settingNav").style.width !== "500px"){
                        document.getElementById("settingNav").style.width = "500px";
                    }else if(document.getElementById("settingNav").style.width === "500px"){
                        document.getElementById("settingNav").style.width = "0px";
                    }
            },
            handleAgentLogOut:function(){
                var self = this;
                storageApi.getInstance().removeItem("accessTokenOfAgent");
                productCompareSharedViewModel.isConCourseAgentLogin(false);
                // self.cart().emptyCart(); // by Milind to test emptyCart function should not get called  
                //  storageApi.getInstance().removeItem("shoppingCart"); // by Milind to test emptyCart function should not get called
                navigation.goTo('/');
            },
            closeNav:function(){
                if(document.getElementById("myCartNav")){
                    document.getElementById("myCartNav").style.width = "0px";
                }
            },
            openNav:function(element) {
              var self = this;
                document.getElementById("myBrandCollectionNav").style.width = "0px";
                document.getElementById("myCollectionNav").style.width = "0px";
                document.getElementById("settingNav").style.width = "0px";
              if(element === "cart"){
                    document.getElementById("myBrandCollectionNav").style.width = "0px";
                    document.getElementById("myCollectionNav").style.width = "0px";
                    self.toggleDropDownCart();
                    if(document.getElementById("myCartNav").style.width !== "500px"){
                        document.getElementById("myCartNav").style.width = "500px";
                    }else if(document.getElementById("myCartNav").style.width === "500px"){
                        document.getElementById("myCartNav").style.width = "0px";
                    }
              }
            },
            newArrival:ko.observable({
                // route:"/promotions/category/NEWARRIVALS",
                route:"/searchresults?Nr=product.x_isNewArrival:1&searchType=simple&type=search",
                displayName: 'New Arrival'
            }),
            promotions:ko.observable({
                route:"/promotions/category/PROMOTIONS",
                displayName: 'Promotions'
            }),
        
            showMyAccountMenuAtDDF: function() {
                var scope = this;
                if (!scope.displayMyAccountMenuAtDDF()) {
                    scope.displayMyAccountMenuAtDDF(true);
                    $(".dropdown-content-myaccount").css("cssText", "display: block !important;");
                    // $("#loadingModal").removeClass('hide').css({'z-index': '10'}).on('click', this.megamenuClickOutside); 
                } else {
                    scope.displayMyAccountMenuAtDDF(false);
                    $(".dropdown-content-myaccount").css("cssText", "display: none !important;");
                    // $("#loadingModal").addClass('hide').css({'z-index': '10000'}).off('click'); 
                }

            },

            navigateToProfileTabs: function(widget, tabNumber) {
                storageApi.getInstance().setItem("tabNumber", tabNumber);
                var element = document.getElementById('verticalTabs-re200047-tab-' + tabNumber);
                if (element) {
                    element.childNodes[1].click();
                }
                
            },
            showDropDownCart: function() {
                var self=this;
                // self.callPromotionService(self);
                // Clear any previous timeout flag if it exists
                if(self.cart().items().length){
                if (this.cartOpenTimeout) {
                    clearTimeout(this.cartOpenTimeout);
                }

                // Tell the template its OK to display the cart.
                this.cartVisible(true);

                $('#CC-header-cart-total').attr('aria-label', CCi18n.t('ns.common:resources.miniCartOpenedText'));
                $('#CC-header-cart-empty').attr('aria-label', CCi18n.t('ns.common:resources.miniCartOpenedText'));

                notifications.emptyGrowlMessages();
                this.computeDropdowncartHeight();
                this.currentSection(1);
                this.computeMiniCartItems();
                $('#dropdowncart').addClass('active');
                this.cartImageSrc('/file/general/icons8-shopping_cart_red.svg');
                $('#dropdowncart > .content').fadeIn('slow');

                var self = this;
                // $(document).on('mouseleave', '#dropdowncart', function() {
                //     self.handleCartClosedAnnouncement();
                //     $('#dropdowncart > .content').fadeOut('slow');
                //     $(this).removeClass('active');
                // this.cartImageSrc('/file/general/icons8-shopping_cart.svg');
                // });

                // to handle the mouseout/mouseleave events for ipad for mini-cart
                var isiPad = navigator.userAgent.match(CCConstants.IPAD_STRING) !== null;
                if (isiPad) {
                    $(document).on('touchend', function(event) {
                        if (!($(event.target).closest('#dropdowncart').length)) {
                            self.handleCartClosedAnnouncement();
                            $('#dropdowncart > .content').fadeOut('slow');
                            $('#dropdowncart').removeClass('active');
                        }
                    });
                }
                }
            },
            toggleDropDownCart: function(data) {
                // this.closeAllDropdownMenu();
                var self=this;
                if(self.cart().items().length ===0){
                    this.cartImageSrc('/file/general/icons8-shopping_cart.svg');
                }
               if(self.cart().items().length >0){
                if ($('#dropdowncart').hasClass('active') && data!=='show') {
                    this.cartImageSrc('/file/general/icons8-shopping_cart.svg');
                    this.hideDropDownCart();
                    
                } else if(!$('#dropdowncart').hasClass('active')){
                    this.cartImageSrc('/file/general/icons8-shopping_cart_red.svg');
                    this.showDropDownCart();
                }
               }
            },
            hideDropDownCart: function(data,scope,event) {
                if(event && event.target){
                if(["cart-total","row productData",'col-md-12',"col-sm-12","col-md-8","col-md-9","col-md-12","col-md-9 col-sm-12","col-md-6 text-right","col-md-6","col-sm-9"].indexOf(event.target.offsetParent.className) > -1){
                    console.log('121')
                    event.stopPropagation();
                    return;
                }
                if(['col-md-12',"col-sm-12","col-md-8","col-md-9","col-md-12","col-md-9 col-sm-12","col-md-6 text-right","col-md-6","col-sm-9","cart-total","row productData","edit-cart-checkout row","col-sm-3 productImg","img-responsive"].indexOf(event.target.className) > -1 ){
                   console.log('11');
                    return;
                }
                
              
                // Tell the template the cart should no longer be visible.
                this.cartImageSrc('/file/general/icons8-shopping_cart.svg');
                this.cartVisible(false);

                $('#CC-header-cart-total').attr('aria-label', CCi18n.t('ns.common:resources.miniCartClosedText'));
                $('#CC-header-cart-empty').attr('aria-label', CCi18n.t('ns.common:resources.miniCartClosedText'));
                setTimeout(function() {
                    $('#CC-header-cart-total').attr('aria-label', CCi18n.t('ns.header:resources.miniShoppingCartTitle'));
                    $('#CC-header-cart-empty').attr('aria-label', CCi18n.t('ns.header:resources.miniShoppingCartTitle'));
                }, 1000);

                $('#dropdowncart > .content').fadeOut('slow');
                $('#dropdowncart').removeClass('active');

                // Clear the timeout flag if it exists
                if (this.cartOpenTimeout) {
                    clearTimeout(this.cartOpenTimeout);
                }
                this.closeNav();
                return true;
                }
            },
            /**
             * validate the cart items stock status as per the quantity. base on the 
             * stock status of cart items redirect to checkout or cart
             */
        //   handleValidateCart: function(data, event) {
        //         // returns if the profile has unsaved changes.
        //         console.log('data', data);
        //         var ticketServiceData = [];
        //         var miniCartData = $('[name=miniCartraffleTickets]');
        //         var checkCartData = data.cart().items();
               
        //         var cartData={};
        //         var visibleData=[];
        //         for(var i=0;i<checkCartData.length;i++){
        //           if(checkCartData[i].productData().type.toString() === "RaffleTickets"){
        //               visibleData.push(checkCartData[i].productId+' '+checkCartData[i].catRefId.split(checkCartData[i].productId)[1]);
        //           }
        //         }
        //             cartData.userId = data.user().id();
        //             cartData.status = "Blocked";
        //             cartData.ticketNumber = visibleData;
        //             var settings = {
        //                 // "async": false,
        //                 "crossDomain": true,
        //                 "url": "/ccstorex/custom/v1/updateSKUStatus",
        //                 "method": "POST",
        //                 "headers": {
        //                     "Content-Type": "application/json",
        //                     "cache-control": "no-cache"
        //                 },
        //                 "data": JSON.stringify(cartData)
        //             };
        
        
        
        //         $.ajax(settings).done(function(response) {
        //             console.log(response);
        //             ticketServiceData = response.data;
        //             console.log('ticketServiceData', ticketServiceData);
        //         });
        
        //         if (ticketServiceData.length === 0) {
        //             if (data.user().isUserProfileEdited()) {
        //                 return true;
        //             }
        //             data.cart().validatePrice = true;
        //             if (navigation.getRelativePath() == data.links().cart.route) {
        //                 data.cart().skipPriceChange(true);
        //             }
        //             $.Topic(pubsub.topicNames.LOAD_CHECKOUT).publishWith(data.cart(), [{
        //                 message: "success"
        //             }]);
                
        //         } else {
        //             for(var j=0;j<miniCartData.length;j++){
        //                 for(var k=0;k<ticketServiceData.length;k++){
        //                     console.log('miniCartData',miniCartData[j]);
        //                     if(miniCartData[j].children[1].innerText.toString() === ticketServiceData[k].DISPLAY_NAME.split(' ')[1].toString()){
        //                     miniCartData[j].classList.add('expiredTicket');
        //                     var id =miniCartData[j].children[1].innerText;
        //                     $('#'+id).css("display", "block");
        //                     $('#dropdowncart').addClass('active');
        //               }
        //                 }
        //             }
        //             console.log('invalid')
        //         }
                        
                
        //         // if (data.user().isUserProfileEdited()) {
        //         //     return true;
        //         // }
        //         // data.cart().validatePrice = true;
        //         // if (navigation.getRelativePath() == data.links().cart.route) {
        //         //     data.cart().skipPriceChange(true);
        //         // }
        //         // $.Topic(pubsub.topicNames.LOAD_CHECKOUT).publishWith(data.cart(), [{
        //         //     message: "success"
        //         // }]);
        //     },
        
        
        // -----------------------------validation changes--------------------------------
        
        handleValidateCart: function(data, event) {
                // returns if the profile has unsaved changes.
                var ticketServiceData = [];
                var miniCartData = $('[name=miniCartraffleTickets]');
                var checkCartData = data.cart().items();
               
                var cartData={};
                var visibleData=[];
                for(var i=0;i<checkCartData.length;i++){
                  if(checkCartData[i].productData().type && checkCartData[i].productData().type.toString() === "RaffleTickets"){
                       visibleData.push(checkCartData[i].productId+' '+checkCartData[i].catRefId.split(checkCartData[i].productId)[1]);
                  }
                }
                    cartData.userId = data.user().id();
                    cartData.status = "Blocked";
                    cartData.ticketNumber = visibleData;
                    var settings = {
                        // "async": false,
                        "crossDomain": true,
                        "url": "/ccstorex/custom/v1/updateSKUStatus",
                        "method": "POST",
                        "headers": {
                            "Content-Type": "application/json",
                            "cache-control": "no-cache"
                        },
                        "data": JSON.stringify(cartData)
                    };
        
        
        
                $.ajax(settings).done(function(response) {
                  
                   if (response.data.length === 0) {
                    if (data.user().isUserProfileEdited()) {
                        return true;
                    }
                    data.cart().validatePrice = true;
                    if (navigation.getRelativePath() == data.links().cart.route) {
                        data.cart().skipPriceChange(true);
                    }
                    $.Topic(pubsub.topicNames.LOAD_CHECKOUT).publishWith(data.cart(), [{
                        message: "success"
                    }]);
                
                } else {
                    for(var j=0;j<miniCartData.length;j++){
                        for(var k=0;k<response.data.length;k++){
                            if(miniCartData[j].children[1].innerText.toString() === response.data[k].DISPLAY_NAME.split(' ')[1].toString()){
                            miniCartData[j].classList.add('expiredTicket');
                            var id =miniCartData[j].children[1].innerText;
                            $('#'+id).css("display", "block");
                            $('#dropdowncart').addClass('active');
                      }
                        }
                    }
                }
                });
                
                // if (data.user().isUserProfileEdited()) {
                //     return true;
                // }
                // data.cart().validatePrice = true;
                // if (navigation.getRelativePath() == data.links().cart.route) {
                //     data.cart().skipPriceChange(true);
                // }
                // $.Topic(pubsub.topicNames.LOAD_CHECKOUT).publishWith(data.cart(), [{
                //     message: "success"
                // }]);
            },
        
        // -------------------------------------------------------------------------------
        
        
        
            // Handle search input click
            handleKeyPress: function(data, event) {
                // displays modal dialog if search is initiated with unsaved changes.
                if (data.user().isUserProfileEdited()) {
                    $("#CC-customerProfile-modal").modal('show');
                    data.user().isSearchInitiatedWithUnsavedChanges(true);
                    return false;
                }
                var keyCode;

                keyCode = (event.which ? event.which : event.keyCode);

                switch (keyCode) {
                    case CCConstants.KEY_CODE_ENTER:
                        // Enter key
                        this.handleSearch(data, event);
                        //document.activeElement.blur();
                        $("input#CC-headerWidget-Search-Mobile").blur();
                        return false;
                }
                return true;
            },
            handleDropDownCheckout: function(data, event) {
                // if(!this.user().isLoggedIn()){
                if(!this.user().loggedIn() && this.site().siteInfo.id !== '200001'){
                    this.hideDropDownCart();
                    storageApi.getInstance().setItem("requiredLoginPage","/checkout");
                    navigation.goTo('/login');
                }else{
                this.hideDropDownCart();
                this.handleValidateCart(data, event);
                }
                this.closeNav();
            },
            /**
             * Invoked to skip the repetitive navigation for assistive technologies
             */
            // Sends a message to the cart to remove this product
            handleRemoveFromCart: function() {

                $.Topic(pubsub.topicNames.CART_REMOVE).publishWith(
                    this.productData(), [{
                        "message": "success",
                        "commerceItemId": this.commerceItemId
                    }]);
            },

            // Sends a message to the cart to remove this placeholder
            handlePlaceHolderRemove: function() {
                $.Topic(pubsub.topicNames.PLACE_HOLDER_REMOVE).publish(this);
            },

            /**
             * Hand the aria announcement when the minicart is closed
             */
            handleCartClosedAnnouncement: function() {
                if ($('#dropdowncart').hasClass('active')) {
                    $('#alert-modal-change').text(CCi18n.t('ns.common:resources.miniCartClosedText'));
                    $('#CC-header-cart-total').attr('aria-label', CCi18n.t('ns.header:resources.miniShoppingCartTitle'));
                    $('#CC-header-cart-empty').attr('aria-label', CCi18n.t('ns.header:resources.miniShoppingCartTitle'));
                }
            },
            getRealTimeCurrency: function() {
                var self = this;
                var _site = self.site().siteInfo.repositoryId === '200001' ? "CONCOURSEA":"ONLINE";
                $.ajax({
                    url: "/ccstorex/custom/v1/getexchangerate/"+_site,
                    method:"GET",
                    dataType: 'json',
                    success: function(result) {
                        $.merge(productCompareSharedViewModel.allAvailableCurrency(), result.data)
                        self.localCurrencyExchange(productCompareSharedViewModel.allAvailableCurrency())
                    }
                });
            },
                 // Service for Promotions
            // callPromotionService: function(widget) {
            //     var self = this;
            //     if (self.cart() && self.cart().items().length > 0 && !isGetPromoMessageServiceCalled) {
            //         isGetPromoMessageServiceCalled = true;
            //         self.cart().items().forEach(function(data) {
            //             self.productIds.push(data.productId);
            //         })
            //         var promoData =  self.productIds().join();

            //         $.ajax({
            //             url: "/ccstorex/custom/v1/getpromomessage",
            //             type: "POST",
            //             dataType: "json",
            //             data: ({
            //                 "productIds":promoData
            //             }),
            //             success: function(result) {
            //                 if (result.data.length) {
            //                     self.allAvailablePromotions(result.data)
                                
            //                 }else{
            //                     self.allAvailablePromotions([]);
            //                 }
            //             },
            //             error: function(error) {
            //                 console.log("error resulting promotion", error);
            //             }
            //         });
            //     }
            // },
             beforeAppear: function() {
                var self = this;
                // self.callPromotionService();
                self.productIds([]);
                isGetPromoMessageServiceCalled = false;
                if (productCompareSharedViewModel.preOrderCartVAT()) {
                    self.preOrderCartVAT(productCompareSharedViewModel.preOrderCartVAT());
                }
                if(productCompareSharedViewModel.cartSubTotal()){
                    self.preOrderCartSubTotal(productCompareSharedViewModel.cartSubTotal());
                }
                if(productCompareSharedViewModel.preOrderTicketCartVAT()){
                    self.raffleTicketsVATTotal(productCompareSharedViewModel.preOrderTicketCartVAT());
                }
                if(productCompareSharedViewModel.carPreOrderCartDiscount()){
                    self.preOrderCartDiscount(productCompareSharedViewModel.carPreOrderCartDiscount());
                }
                
                if(productCompareSharedViewModel.appliedPromotionsOnCart()){
                   self.allAvailablePromotions(productCompareSharedViewModel.appliedPromotionsOnCart());
                }
            },
            // //Detect if browser is ie redirect to not supported page
            //   onRender: function(widget) {
            //         if(this.detectBrowserAgent() === 'IE') {
            //             window.location = "/browserNotSupported";
            //         }
            //     }, 
            onLoad: function(widget) {  
                var self = widget;
                    if(this.detectBrowserAgent() === 'IE') {
                        window.location = "/browserNotSupported";
                    }
                // Logout if user session is Expired
                if (self.user().isUserSessionExpired()){
                    this.handleLogout(self.user());      
                }
               productCompareSharedViewModel.cartSubTotal.subscribe(function(data){
                   self.preOrderCartSubTotal(data); 
                });
                productCompareSharedViewModel.preOrderTicketCartVAT.subscribe(function(data){
                   self.raffleTicketsVATTotal(data); 
                });
                productCompareSharedViewModel.preOrderCartVAT.subscribe(function(data){
                    self.preOrderCartVAT(data);
                });
                productCompareSharedViewModel.cartTotal.subscribe(function(data){
                    self.preOrderCartTotal(data);
                });
                productCompareSharedViewModel.carPreOrderCartDiscount.subscribe(function(data){
                    self.preOrderCartDiscount(data);
                });
                
                productCompareSharedViewModel.appliedPromotionsOnCart.subscribe(function(data){
                    self.allAvailablePromotions(data);
                });
                if(productCompareSharedViewModel.isConCourseAgentLogin()){
                    widget.isConCourseAgentLogin(true);
                }
                productCompareSharedViewModel.isConCourseAgentLogin.subscribe(function(data){
                        widget.isConCourseAgentLogin(data);
                })
                productCompareSharedViewModel.conCourseAgentDetails.subscribe(function(data){
                    widget.conCourseAgentDetails(data);
                });
                headerScope = widget;
                widget.getRealTimeCurrency();
                // $(window).resize(function() {
                //     widget.checkResponsiveFeatures($(window).width());
                // });
                widget.checkResponsiveFeatures($(window).width());
                 $.Topic(pubsub.topicNames.USER_LOGOUT_SUCCESSFUL).subscribe(function(){
                    storageApi.getInstance().removeItem("remberMeToken");
                    storageApi.getInstance().setItem("remberMe", 'false');
                    storageApi.getInstance().removeItem("requiredLoginPage");
                    // navigation.goTo("/login");  Removed by Milind. Not sure about this. 
                    navigation.goTo("/");  // Add by Milind. on Successfull logout user should get redirect to home page.. 
                    
                 });
                // save the links in an array for later
                widget.linkList.removeAll();
                $(window).on("click", function (evt){
                    if(!headerScope.isMobile() && headerScope.site().siteInfo.repositoryId!== '200001'){
                    if (($(".customerCareMenuContent")[0] && evt.target == $("#customerCareMenuDDFMenu")[0]) || ($("#customerCareMenu")[0] && evt.target == $("#customerCareMenu")[0].children[0])){
                        $(".customerCareMenuContent")[0].style.display = 'block';
                        $("#customerCareMenu")[0].style.backgroundColor = '#fff';
                        $("#customerCareMenu")[0].children[0].style.backgroundColor = '#fff';
                        $("#customerCareMenu")[0].children[0].style.color = '#000';
                        if(widget.displayMyAccountMenuAtDDF()){
                            widget.showMyAccountMenuAtDDF();
                        }
                    } else if($(".customerCareMenuContent")[0]) {
                        $(".customerCareMenuContent")[0].style.display = 'none';
                        $("#customerCareMenu")[0].style.backgroundColor = '';
                        $("#customerCareMenu")[0].children[0].style.backgroundColor = '';
                        $("#customerCareMenu")[0].children[0].style.color = '';
                        
                    }
                    if (($("#shoppingAtDDFMenu")[0] && (evt.target == $("#shoppingAtDDFMenu")[0] || evt.target == $("#shoppingAtDDFMenu")[0].children[0])) &&  $(".shoppingAtDDFMenuContent")[0]){
                        $(".shoppingAtDDFMenuContent")[0].style.display = 'block';
                        $("#shoppingAtDDFMenu")[0].style.backgroundColor = '#fff';
                        $("#shoppingAtDDFMenu")[0].children[0].style.backgroundColor = '#fff';
                        $("#shoppingAtDDFMenu")[0].children[0].style.color = '#000';
                        if(widget.displayMyAccountMenuAtDDF()){
                            widget.showMyAccountMenuAtDDF();
                        }
                    } else if($(".shoppingAtDDFMenuContent")[0]){
                        $(".shoppingAtDDFMenuContent")[0].style.display = 'none';
                        $("#shoppingAtDDFMenu")[0].style.backgroundColor = '';
                        $("#shoppingAtDDFMenu")[0].children[0].style.backgroundColor = '';
                        $("#shoppingAtDDFMenu")[0].children[0].style.color = '';
                    }
                     if (($("#CC-loginHeader-login")[0] && (evt.target == $("#CC-loginHeader-login")[0] || evt.target == $("#CC-loginHeader-login")[0].children[0])) &&  $(".dropdown-content-myaccount")[0]){
                        $(".dropdown-content-myaccount")[0].style.display = 'block';
                        //$("#loginRegistration")[0].style.backgroundColor = '#000';
                        // $("#loginRegistration")[0].style.backgroundColor = '#000';
                        $("#loginRegistration")[0].children[0].style.color = '#000';
                        
                    } else if($(".dropdown-content-myaccount")[0]){
                        $(".dropdown-content-myaccount")[0].style.display = 'none';
                        $("#loginRegistration")[0].style.backgroundColor = '';
                        $("#loginRegistration")[0].children[0].style.backgroundColor = '';
                        $("#loginRegistration")[0].children[0].style.color = '';
                    }
                    }
              });
            
                // load default currency saved by user

                var currencyPosition = localStorage.getItem("activeCurrency");
                if (currencyPosition) {
                    self.selectedLocalCurrency(JSON.parse(currencyPosition));
                    productCompareSharedViewModel.setActiveCurrency(JSON.parse(currencyPosition));
                }



                for (var propertyName in widget.links()) {
                    widget.linkList.push(widget.links()[propertyName]);
                }
                // compute function to create the text for the cart link  "0 items - $0.00" "1 item - $15.25" "2 items - $41.05"
                widget.cartLinkText = ko.computed(function() {
                    var cartSubTotal, linkText, numItems;
                    var currencySymbol = widget.cart().currency.symbol;
                    var cartSubTotal = widget.formatPrice(widget.cart().subTotal(), widget.cart().currency.fractionalDigits);
                    if (currencySymbol.match(/^[0-9a-zA-Z]+$/)) {
                        currencySymbol = currencySymbol + ' ';
                    }
                    numItems = widget.ccNumber(widget.cart().numberOfItems());
                    // use the CCi18n to format the text avoiding concatination  "0 items - $0.00"
                    // we need to get the currency symbol from the site currently set to a $
                    linkText = CCi18n.t('ns.common:resources.cartDropDownText', {
                        count: widget.cart().numberOfItems(),
                        formattedCount: numItems,
                        currency: currencySymbol,
                        totalPrice: cartSubTotal
                    });
                    return linkText;
                }, widget);
                if (widget.hasOwnProperty('miniCartNumberOfItems')) {

                    //If miniCartNumberOfItems is not configured then default value is 3
                    if (widget.miniCartNumberOfItems() === undefined) {
                        widget.miniCartNumberOfItems(3);
                    }

                    widget.miniCartNumberOfItems(parseInt(widget.miniCartNumberOfItems()));

                    // Changing height of .dropdowncartItems based on miniCartNumberOfItems
                    widget.computeDropdowncartHeight = function() {
                        var itemHeight = $("#CC-headerWidget #dropdowncart .item").css("height");
                        if (itemHeight) { //Converting height from string to integer
                            itemHeight = itemHeight.split("p");
                            itemHeight = parseInt(itemHeight[0]);
                        } else { // default height
                            itemHeight = 80;
                        }
                        self.dropdowncartItemsHeight(widget.miniCartNumberOfItems() * itemHeight + 24);
                        self.dropdowncartItemsHeight(self.dropdowncartItemsHeight() + "px");
                    };

                    /**
                     *As grouping is done based on miniCartNumberOfItems() , this
                     variable stores the maximum groups of miniCartNumberOfItems()
                     items possible based on number of items in the cart.
                     Currently miniCartNumberOfItems() has a value of 3
                     */
                    self.totalSections = ko.computed(function() {
                        if (widget.cart().allItems().length == 0) {
                            return 0;
                        } else {
                            return Math.ceil((widget.cart().allItems().length) / widget.miniCartNumberOfItems());
                        }
                    }, widget);

                    // function to display items in miniCart array when scrolling down
                    widget.miniCartScrollDown = function() {
                        // Clear any timeout flag if it exists. This is to make sure that
                        // there is no interruption while browsing cart.
                        if (widget.cartOpenTimeout) {
                            clearTimeout(widget.cartOpenTimeout);
                        }
                        self.currentSection(self.currentSection() + 1);
                        widget.computeMiniCartItems();
                        if (self._displayedMiniCartItems()[0]) {
                            $("#CC-header-dropdown-minicart-image-" + self._displayedMiniCartItems()[0].productId + self._displayedMiniCartItems()[0].catRefId).focus();
                        }
                    };

                    // function to display items in miniCart array when scrolling up
                    widget.miniCartScrollUp = function() {
                        // Clear any timeout flag if it exists. This is to make sure that
                        // there is no interruption while browsing cart.
                        if (widget.cartOpenTimeout) {
                            clearTimeout(widget.cartOpenTimeout);
                        }
                        self.currentSection(self.currentSection() - 1);
                        widget.computeMiniCartItems();
                        if (self._displayedMiniCartItems()[0]) {
                            $("#CC-header-dropdown-minicart-image-" + self._displayedMiniCartItems()[0].productId + self._displayedMiniCartItems()[0].catRefId).focus();
                        }
                    };
                    self._displayedMiniCartItems.subscribe(function(item) {
                        self.sortCartBasedOnProductType();
                    })
                    // Re-populate _displayedMiniCartItems array based on add/remove
                    widget.computeMiniCartItems = function() {
                        if (self.currentSection() <= self.totalSections()) {
                            self._displayedMiniCartItems(widget.cart().allItems().slice((self.currentSection() - 1) * widget.miniCartNumberOfItems(),
                                self.currentSection() * widget.miniCartNumberOfItems()));
                        } else {
                            if (self.totalSections()) {
                                self._displayedMiniCartItems(widget.cart().allItems().slice((self.totalSections() - 1) * widget.miniCartNumberOfItems(),
                                    self.totalSections() * widget.miniCartNumberOfItems()));
                                self.currentSection(self.totalSections());
                            } else { // Mini-cart is empty, so initialize variables
                                self._displayedMiniCartItems.removeAll();
                                self.currentSection(1);
                            }
                        }
                    };

                    /**
                     * Function that makes sure that the mini cart opens of, if set to
                     * and goes to the particular product that has just been added to cart.
                     */
                    widget.goToProductInDropDownCart = function(product) {
                        // widget.callPromotionService();
                        widget.computeMiniCartItems();

                        var skuId = product.childSKUs[0].repositoryId;
                        var cartItems = widget.cart().allItems();
                        var itemNumber = -1;
                        // Focus at start.
                        $('.cc-cartlink-anchor').focus();
                        if (widget.displayMiniCart()) {
                            for (var i = 0; i < cartItems.length; i++) {
                                if ((product.id == cartItems[i].productId) && (cartItems[i].catRefId == skuId)) {
                                    itemNumber = i;
                                    break;
                                }
                            }
                            if (itemNumber > -1) {
                                widget.showDropDownCart();
                                // Move down the number of times given
                                var prodPage = Math.floor(itemNumber / widget.miniCartNumberOfItems());
                                var prodNum = itemNumber % widget.miniCartNumberOfItems();
                                self.currentSection(prodPage + 1);
                                widget.computeMiniCartItems();
                                // Now focus on the product
                                $("#CC-header-dropdown-minicart-image-" + product.id + skuId).focus();
                                // Set the timeout if the item exists (should be there all the time.
                                // Still a fallback).
                                widget.cartOpenTimeout = setTimeout(function() {
                                    widget.hideDropDownCart();
                                    $('.cc-cartlink-anchor').focus();
                                }, widget.miniCartDuration() * 1000);
                            }
                        }
                    };

                    $.Topic(pubsub.topicNames.CART_ADD_SUCCESS).subscribe(widget.goToProductInDropDownCart);
                    $.Topic(pubsub.topicNames.CART_REMOVE_SUCCESS).subscribe(widget.computeMiniCartItems);
                    $.Topic(pubsub.topicNames.CART_UPDATE_QUANTITY_SUCCESS).subscribe(widget.computeMiniCartItems);
                    $.Topic(pubsub.topicNames.CART_UPDATED).subscribe(widget.computeMiniCartItems);
                    $.Topic(pubsub.topicNames.GWP_QUALIFIED_MESSAGE).subscribe(function(message) {
                        widget.gwpQualifiedMessage(message.summary);
                    });
                    $.Topic(pubsub.topicNames.GWP_CLEAR_QUALIFIED_MESSAGE).subscribe(function() {
                        widget.gwpQualifiedMessage(null);
                    });

                }


                // currency picker javascript here**********************************************

                var optedPriceListGroup = null;
                self.loadPicker(widget.site());
                self.handleCurrencyChange = function(currencyPosition,siteName) {
                    if (!self.selectedLocalCurrency().CURRENCYCODE || self.selectedLocalCurrency().CURRENCYCODE && (currencyPosition.CURRENCYCODE !== self.selectedLocalCurrency().CURRENCYCODE)) {
                        localStorage.setItem("activeCurrency", JSON.stringify(currencyPosition));
                        self.selectedLocalCurrency(currencyPosition);
                        productCompareSharedViewModel.setActiveCurrency(currencyPosition);
                    }
                    if(siteName && siteName === 'concourse'){
                        document.getElementById("settingNav").style.width = "0px";
                    }
                };

                productCompareSharedViewModel.activeCurrecy.subscribe(function(data) {
                    location.reload();
                })
                

                widget.site().activePriceListGroups.subscribe(function(newValue) {
                    self.loadPicker(widget.site());
                });


                // language picker javascript***************************************************************************


                //get the supported locales.
                if (widget.site().additionalLanguages) {
                    self.supportedLocales(widget.site().additionalLanguages);
                }

                //sort the supported locales.
                self.sortLocales();

                //get browser locale
                var browserLanguageRaw = (navigator.languages) ? navigator.languages[0] :
                    (navigator.userLanguage) ? navigator.userLanguage : navigator.language;
                var browserLanguage = browserLanguageRaw.replace("-", "_");
                // check if browser locale is in supported locales.
                var browserLocaleItem = $.grep(self.supportedLocales(), function(item) {
                    return item.name === browserLanguage;
                });

                //get default locale
                var defaultLocaleItem = $.grep(self.supportedLocales(), function(item) {
                    return item.name === widget.locale();
                });

                //If the locale is not set, it is no longer supported, call to update it to current SF locale
                if (!widget.user().locale() && widget.user().loggedIn()) {
                    $.Topic(pubsub.topicNames.USER_LOCALE_NOT_SUPPORTED).publish();
                }

                //get the locale from local data.
                var localDataLocaleItem = JSON.parse(CCRestClient.getStoredValue(CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE));
                // if locale is not present in localStorage, set the localStorage value to browser locale or default locale.
                if (!localDataLocaleItem || !localDataLocaleItem[0]) {
                    if (browserLocaleItem && browserLocaleItem[0]) {
                        self.selectedLocale(browserLocaleItem[0]);
                        self.selectedLocaleId(browserLocaleItem[0].localeId);
                        CCRestClient.setStoredValue(CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE, ko.toJSON(browserLocaleItem));
                    } else if (defaultLocaleItem && defaultLocaleItem[0]) {
                        self.selectedLocale(defaultLocaleItem[0]);
                        self.selectedLocaleId(defaultLocaleItem[0].localeId);
                        CCRestClient.setStoredValue(CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE, ko.toJSON(defaultLocaleItem));
                    } else {
                        $.Topic(pubsub.topicNames.USER_LOCALE_NOT_SUPPORTED).publish();
                        window.location.reload();
                    }
                } else if (!self.selectedLocale() && !self.selectedLocaleId()) {
                    // check if the locale present in local data is one of supported locales.
                    var localSupportedLocale = $.grep(self.supportedLocales(), function(item) {
                        return item.localeId === localDataLocaleItem[0].localeId;
                    });
                    if (localSupportedLocale && localSupportedLocale[0]) {
                        self.selectedLocale(localSupportedLocale[0]);
                        self.selectedLocaleId(localSupportedLocale[0].localeId);
                    } else {
                        if (CCRestClient.profileType !== CCConstants.PROFILE_TYPE_LAYOUT_PREVIEW) {
                            CCRestClient.clearStoredValue(CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE);
                            window.location.reload();
                        } else {
                            CCLogger.warn("Locale not supported for default site");
                        }
                    }
                }

                self.selectedLocaleId.subscribe(function(localeId) {
                    var selectedLocaleItem = $.grep(self.supportedLocales(), function(item) {
                        return item.localeId === localeId;
                    });
                    if (selectedLocaleItem && self.localeAlternates && Object.keys(self.localeAlternates).length > 0) {
                        for (var i = 0; i < Object.keys(self.localeAlternates).length; i++) {
                            if (selectedLocaleItem[0].name === self.localeAlternates[i].hrefLang) {
                                window.location.assign(self.localeAlternates[i].href);
                                self.selectedLocale(selectedLocaleItem[0]);
                                self.selectedLocaleId(selectedLocaleItem[0].localeId);
                            }
                        }
                    } else if (selectedLocaleItem && selectedLocaleItem.length > 0 && selectedLocaleItem[0].localeId != self.selectedLocale().localeId) {
                        self.selectedLocale(selectedLocaleItem[0]);
                        self.selectedLocaleId(selectedLocaleItem[0].localeId);
                        // Handle the localized URL
                        if (!widget.user().loggedIn()) {
                            widget.redirectToLocalizedURL(self.selectedLocale().name, defaultLocaleItem[0].name);
                        }
                    }
                }.bind(self));

                if (self.selectedLocale()) {
                    self.languageLinkText(self.selectedLocale().name.toUpperCase());
                }

                self.handleLanguageChange = function(data, localeAlternates) {
                    var self = this;
                    self.localeAlternates = localeAlternates;
                    self.redirectToLink('/' + navigation.getPath());
                    if (widget.user().isUserProfileEdited()) {
                        return true;
                    }
                    if (data) {
                        self.selectedLocaleId(data.localeId);
                    }
                    if (widget.user().loggedIn()) {
                        self.handleUpdateProfileLocale();
                    }
                    if (navigation.getRelativePath().indexOf(widget.links().searchresults.route) !== -1) {
                        var queryString = decodeURIComponent(window.location.search);
                        queryString = queryString.replace('?', '');
                        var params = queryString.split('&');
                        var newQueryString = '';
                        for (var i = 0; i < params.length; i++) {
                            if (params[i].split('=')[0] === 'Nr') {
                                if (newQueryString === '') {
                                    newQueryString = 'Nr=' + widget.processNrParameter(params[i].split('=')[1], 'language-picker');
                                } else {
                                    newQueryString = newQueryString + '&' + 'Nr=' + widget.processNrParameter(params[i].split('=')[1], 'language-picker');
                                }
                            } else {
                                if (newQueryString === '') {
                                    newQueryString = params[i];
                                } else {
                                    newQueryString = newQueryString + '&' + params[i];
                                }
                            }
                        }
                        var newURL = navigation.getBaseURL() + '/' + data.name + navigation.getPathWithoutLocale().split('?')[0] + "?" + newQueryString;
                        window.location.assign(newURL);
                    }
                };

                self.handleUpdateProfileLocale = function() {
                    widget.user().locale(self.selectedLocale().name);
                    if (widget.user().locale.isModified !== undefined) {
                        widget.user().locale.isModified(true);
                        $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUBMIT).publishWith(widget.user(), [{
                            message: "success"
                        }]);
                    }
                    if (widget.user().locale.isModified !== undefined) {
                        widget.user().locale.isModified(false);
                    }
                };

                /**
                 * Saves the profile locale to header if it is different from the current locale stored in header
                 */
                self.saveLocaleToHeader = function() {
                    var currentLocale = JSON.parse(CCRestClient.getStoredValue(CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE));
                    if (Array.isArray(currentLocale)) {
                        var currentLocale = currentLocale[0].name;
                    } else {
                        var currentLocale = currentLocale.name;
                    }
                    //In the case where the updated locale has not been saved to profile
                    if ((currentLocale !== self.selectedLocale().name)) {
                        widget.redirectToLocalizedURL(self.selectedLocale().name, currentLocale);
                    }
                    //In the case where locale has been updated from profile page
                    else if (currentLocale !== widget.user().locale()) {
                        widget.redirectToLocalizedURL(widget.user().locale(), currentLocale);
                    }
                };

                //Set the profile locale as SF locale if it is a supported locale on login.
                $.Topic(pubsub.topicNames.USER_LOGIN_SUCCESSFUL).subscribe(function(obj) {
                    if (!widget.user().locale()) {
                        $.Topic(pubsub.topicNames.USER_LOAD_SHIPPING).subscribe(self.setProfileLocaleAsStoreLocale);
                    } else {
                        self.setProfileLocaleAsStoreLocale();
                    }
                });

                self.setProfileLocaleAsStoreLocale = function() {
                    if (self.selectedLocale().name !== widget.user().locale()) {
                        for (var i = 0; i < widget.site().additionalLanguages.length; i++) {
                            if (widget.user().locale() === widget.site().additionalLanguages[i].name) {
                                widget.redirectToLocalizedURL(widget.user().locale(), self.selectedLocale().name);
                                break;
                            }
                        }
                    }
                    $.Topic(pubsub.topicNames.USER_LOAD_SHIPPING).unsubscribe();
                }

                $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUCCESSFUL).subscribe(function() {
                    //Update the profile locale to custom header
                    self.saveLocaleToHeader();
                });

                $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_INVALID).subscribe(function() {
                    //Update the profile locale to custom header
                    self.saveLocaleToHeader();
                });

                $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_FAILURE).subscribe(function() {

                    self.saveLocaleToHeader();
                });

                // login/Registration*********************************************************************


                widget.user().ignoreEmailValidation(false);
                // To display success notification after redirection from customerProfile page.
                if (widget.user().delaySuccessNotification()) {
                    notifier.sendSuccess(widget.WIDGET_ID, widget.translate('updateSuccessMsg'), true);
                    widget.user().delaySuccessNotification(false);
                }

                // Handle widget responses when registration is successful or invalid
                $.Topic(pubsub.topicNames.USER_AUTO_LOGIN_SUCCESSFUL).subscribe(function(obj) {
                    // if (obj.widgetId === widget.WIDGET_ID) {
                    //     self.userCreated(true);
                    //     self.hideLoginModal();
                    //     self.showErrorMessage(false);
                    //     notifier.clearSuccess(widget.WIDGET_ID);
                    //     notifier.sendSuccess(widget.WIDGET_ID, widget.translate('createAccountSuccess'));
                    //     $(window).scrollTop('0');
                    // }
                });

                $.Topic(pubsub.topicNames.USER_RESET_PASSWORD_SUCCESS).subscribe(function(data) {
                    // self.hideAllSections();
                    // self.hideLoginModal();
                    // notifier.sendSuccess(widget.WIDGET_ID, CCi18n.t('ns.common:resources.resetPasswordMessage'), true);
                });

                $.Topic(pubsub.topicNames.USER_RESET_PASSWORD_FAILURE).subscribe(function(data) {
                    // notifier.sendError(widget.WIDGET_ID, data.message, true);
                });

                $.Topic(pubsub.topicNames.USER_PASSWORD_GENERATED).subscribe(function(data) {
                    // $('#alert-modal-change').text(CCi18n.t('ns.common:resources.resetPasswordModalOpenedText'));
                    // widget.user().ignoreEmailValidation(false);
                    // self.hideAllSections();
                    // $('#CC-forgotPasswordSectionPane').show();
                    // $('#CC-forgotPwd-input').focus();
                    // widget.user().emailAddressForForgottenPwd('');
                    // widget.user().emailAddressForForgottenPwd.isModified(false);
                });

                $.Topic(pubsub.topicNames.USER_PASSWORD_EXPIRED).subscribe(function(data) {
                    // $('#alert-modal-change').text(CCi18n.t('ns.common:resources.resetPasswordModalOpenedText'));
                    // widget.user().ignoreEmailValidation(false);
                    // self.hideAllSections();
                    // $('#CC-forgotPasswordSectionPane').show();
                    // $('#CC-forgotPwd-input').focus();
                    // widget.user().emailAddressForForgottenPwd('');
                    // widget.user().emailAddressForForgottenPwd.isModified(false);
                });


                $.Topic(pubsub.topicNames.USER_CREATION_FAILURE).subscribe(function(obj) {
                    // if (obj.widgetId === widget.WIDGET_ID) {
                    //     widget.user().resetPassword();
                    //     self.modalMessageType("error");
                    //     self.modalMessageText(obj.message);
                    //     self.showErrorMessage(true);
                    // };
                });

                $.Topic(pubsub.topicNames.USER_LOGIN_FAILURE).subscribe(function(obj) {
                    // self.modalMessageType("error");

                    // if (obj.errorCode && obj.errorCode === CCConstants.ACCOUNT_ACCESS_ERROR_CODE) {
                    //     self.modalMessageText(CCi18n.t('ns.common:resources.accountError'));
                    // } else {
                    //     self.modalMessageText(CCi18n.t('ns.common:resources.loginError'));
                    // }

                    // self.showErrorMessage(true);
                });

                $.Topic(pubsub.topicNames.USER_LOGIN_SUCCESSFUL).subscribe(function(obj) {
                    // self.hideLoginModal();
                    // self.showErrorMessage(false);
                    // notifier.clearSuccess(widget.WIDGET_ID);
                    // $('#CC-loginHeader-myAccount').focus();
                    // $('#CC-loginHeader-myAccount-mobile').focus();
                });

                // Replacing pubsub subscription with this. PubSub's getting called multiple times, causing this method to be called multiple times,
                // causing login modal to appear and disappears at times.
                navigation.setLoginHandler(function(data) {

                    // Do a subscription to page ready.
                    $.Topic(pubsub.topicNames.PAGE_READY).subscribe(function(pageEvent) {
                        if (pageEvent) {
                            // Check if the pageId is undefined. If so, set it to empty string.
                            if (pageEvent.pageId == undefined) {
                                pageEvent.pageId = "";
                            }
                            var loginHandlerPageParts = [];
                            if (navigation.loginHandlerPage) {
                                loginHandlerPageParts = navigation.loginHandlerPage.split('/');
                            } else if (navigation.loginHandlerPage == "") {
                                loginHandlerPageParts = [""];
                            }
                            if ((navigation.loginHandlerPage == undefined) || (navigation.loginHandlerPage == null)) {
                                return;
                            }
                        }
                        if (data && data[0] && data[0].linkToRedirect) {
                            widget.user().pageToRedirect(data[0].linkToRedirect);
                            if (widget.user().loggedInUserName() != '' && !widget.user().isUserSessionExpired()) {
                                widget.user().handleSessionExpired();
                            }
                        }

                        setTimeout(function() {
                            $('#CC-headermodalpane').modal('show');
                            self.hideAllSections();
                            self.userCreated(false);
                            $('#CC-loginUserPane').show();
                            $('#CC-headermodalpane').on('shown.bs.modal', function() {
                                if (!widget.user().loggedIn() && !widget.user().isUserLoggedOut() && widget.user().login() &&
                                    widget.user().login() != '' && widget.user().isUserSessionExpired()) {
                                    widget.user().populateUserFromLocalData(true);
                                    $('#CC-login-password-input').focus();
                                    widget.user().password.isModified(false);
                                } else {
                                    $('#CC-login-input').focus();
                                    widget.user().login.isModified(false);
                                }
                                // Set the login handler page to null now
                                navigation.loginHandlerPage = null;
                            });

                            $('#CC-headermodalpane').on('hidden.bs.modal', function() {
                                if (!(self.userCreated() || widget.user().loggedIn()) &&
                                    (($('#CC-loginUserPane').css('display') == 'block') ||
                                        ($('#CC-registerUserPane').css('display') == 'block') ||
                                        ($('#CC-updatePasswordPane').css('display') == 'block') ||
                                        ($('#CC-forgotPasswordSectionPane').css('display') == 'block') ||
                                        ($('#CC-forgotPasswordMessagePane').css('display') == 'block') ||
                                        ($('#CC-updatePasswordErrorMessagePane').css('display') == 'block'))) {
                                    self.cancelLoginModal(widget);
                                }
                            });
                        }, CCConstants.PROFILE_UNAUTHORIZED_DEFAULT_TIMEOUT);
                    });
                });

                // This pubsub checks for the page parameters and if there is a token
                // in the page URL, validates it and then starts the update expired/
                // forgotten password modal.
                $.Topic(pubsub.topicNames.PAGE_PARAMETERS).subscribe(function() {
                    var token = this.parameters.occsAuthToken;
                    // Proceed only if there is a token on the parameters
                    if (token) {
                        // Validate the token to make sure that it is valid
                        // before proceeding to update the password.
                        widget.user().validateTokenForPasswordUpdate(token,
                            // Success callback
                            function(data) {
                                // Let's try and update the password.
                                $('#CC-headermodalpane').modal('show');
                                self.hideAllSections();
                                $('#CC-updatePasswordPane').show();
                                $('#CC-headermodalpane').on('shown.bs.modal', function() {
                                    $('#CC-updatePassword-email').focus();
                                });
                            },
                            // Error callback
                            function(data) {
                                // Error function - show error message
                                $('#CC-headermodalpane').modal('show');
                                self.hideAllSections();
                                $('#CC-updatePasswordErrorMessagePane').show();
                            });
                    }
                });

                $(document).on('hide.bs.modal', '#CC-headermodalpane', function() {
                    if ($('#CC-loginUserPane').css('display') == 'block') {
                        $('#alert-modal-change').text(CCi18n.t('ns.common:resources.loginModalClosedText'));
                    } else if ($('#CC-registerUserPane').css('display') == 'block') {
                        $('#alert-modal-change').text(CCi18n.t('ns.common:resources.registrationModalClosedText'));
                    } else if ($('#CC-forgotPasswordSectionPane').css('display') == 'block') {
                        $('#alert-modal-change').text(CCi18n.t('ns.common:resources.resetPasswordModalClosedText'));
                    } else if ($('#CC-updatePasswordPane').css('display') == 'block') {
                        $('#alert-modal-change').text(CCi18n.t('ns.common:resources.updatePasswordModalClosedText'));
                    }
                });
                $(document).on('show.bs.modal', '#CC-headermodalpane', function() {
                    if ($('#CC-loginUserPane').css('display') == 'block') {
                        $('#alert-modal-change').text(CCi18n.t('ns.common:resources.loginModalOpenedText'));
                    } else if ($('#CC-registerUserPane').css('display') == 'block') {
                        $('#alert-modal-change').text(CCi18n.t('ns.common:resources.registrationModalOpenedText'));
                    } else if ($('#CC-forgotPasswordSectionPane').css('display') == 'block') {
                        $('#alert-modal-change').text(CCi18n.t('ns.common:resources.resetPasswordModalOpenedText'));
                    } else if ($('#CC-updatePasswordPane').css('display') == 'block') {
                        $('#alert-modal-change').text(CCi18n.t('ns.common:resources.updatePasswordModalOpenedText'));
                    }
                });
                self._displayedMiniCartItems();
            },
            //************************************************************************************************************
            // currency picker javascript here


            defaultPriceListGroup: ko.observable(),
            activePriceListGroups: ko.observableArray([]),
            currencyDropdownVisible: ko.observable(false),
            currentCurrencyPosition: ko.observable(),


            handleDeleteConfigurableItems: function(data, event) {
                for (var i = 0; i < data.cart().items().length; i++) {
                    if (data.cart().items()[i].childItems) {
                        data.cart().removeItem(data.cart().items()[i]);
                    }
                }
                this.handleCurrencyChange(this.currentCurrencyPosition());
            },

            loadPicker: function(pSiteData) {
                var self = this;

                if (pSiteData.priceListGroup.defaultPriceListGroup) {
                    self.defaultPriceListGroup(null);
                    self.defaultPriceListGroup(pSiteData.priceListGroup.defaultPriceListGroup);
                }

                if (pSiteData.priceListGroup.activePriceListGroups.length) {
                    self.activePriceListGroups.removeAll();
                    for (var i = 0; i < pSiteData.priceListGroup.activePriceListGroups.length; i++) {
                        self.activePriceListGroups.push(pSiteData.priceListGroup.activePriceListGroups[i]);
                    }
                }

                // get the currency from local data.
                var localDataCurrencyItem = JSON.parse(CCRestClient.getStoredValue(CCConstants.LOCAL_STORAGE_CURRENCY));
                var localDataPriceListGroupId = JSON.parse(CCRestClient.getStoredValue(CCConstants.LOCAL_STORAGE_PRICELISTGROUP_ID));
                // if currency is not present in localStorage, persist the default currency and price list group id to local storage
                if (!localDataCurrencyItem && self.defaultPriceListGroup()) {
                    // Storing in site view model
                    pSiteData.selectedPriceListGroup(self.defaultPriceListGroup());
                    self.storePriceListGroupInLocalStorage(self.defaultPriceListGroup());
                } else {
                    // Check whether the currency stored in local storage is still active or not
                    var isActive = false;
                    for (var i = 0; i < self.activePriceListGroups().length; i++) {
                        if (localDataCurrencyItem.repositoryId === self.activePriceListGroups()[i].currency.repositoryId &&
                            (localDataPriceListGroupId == self.activePriceListGroups()[i].id)) {
                            // Storing in site view model
                            pSiteData.selectedPriceListGroup(self.activePriceListGroups()[i]);
                            self.storePriceListGroupInLocalStorage(self.activePriceListGroups()[i]);
                            isActive = true;
                            break;
                        }
                    }
                    // Suppose the selected currency is not active any more. Setting the default currency to be displayed
                    if (!isActive && self.defaultPriceListGroup()) {
                        // Storing in site view model as well
                        pSiteData.selectedPriceListGroup(self.defaultPriceListGroup());
                        self.storePriceListGroupInLocalStorage(self.defaultPriceListGroup());
                    }
                }

                // To remove the displayed price list from the list of active price list
                var displayedPriceListGroupId = pSiteData.selectedPriceListGroup().id;
                for (var i = 0; i < self.activePriceListGroups().length; i++) {
                    if (self.activePriceListGroups()[i].id === displayedPriceListGroupId) {
                        self.activePriceListGroups.splice(i, 1);
                    }
                }

                // Sort the currencies based on their currency code
                self.sortCurrencies();
            },

            sortCurrencies: function() {
                var self = this;
                self.activePriceListGroups.sort(function(left, right) {
                    return left.currency.currencyCode == right.currency.currencyCode ? 0 :
                        (left.currency.currencyCode < right.currency.currencyCode ? -1 : 1);
                });
            },

            /**
             * Adds the passed price list group to window local storage
             */
            storePriceListGroupInLocalStorage: function(pPriceListGroup) {
                var self = this;
                CCRestClient.setStoredValue(CCConstants.LOCAL_STORAGE_CURRENCY,
                    ko.toJSON(pPriceListGroup.currency));
                CCRestClient.setStoredValue(CCConstants.LOCAL_STORAGE_PRICELISTGROUP_ID,
                    ko.toJSON(pPriceListGroup.id));
            },

            /**
             * key press event handle
             * 
             * data - knockout data 
             * event - event data
             */
            keypressCurrencyHandler: function(data, event) {

                var self, $this, keyCode;

                self = this;
                $this = $(event.target);
                keyCode = event.which ? event.which : event.keyCode;

                if (event.shiftKey && keyCode == CCConstants.KEY_CODE_TAB) {
                    keyCode = CCConstants.KEY_CODE_SHIFT_TAB;
                }
                var lastCurrencyElementId = "CC-header-Currency-" + ((self.activePriceListGroups().length) - 1);
                switch (keyCode) {
                    case CCConstants.KEY_CODE_TAB:
                        if (($this[0].id === lastCurrencyElementId)) {
                            self.hideCurrencyDropDown();
                        }
                        break;

                    case CCConstants.KEY_CODE_SHIFT_TAB:
                        if (($this[0].id === "CC-header-currency-link")) {
                            self.hideCurrencyDropDown();
                        }
                        break;
                }
                return true;
            },

            /**
             * Shows the Currency dropdown based on visible flag
             * 
             */
            showCurrencyDropDown: function() {
                var self = this;
                $('#headerCurrencyPicker').addClass('active');

                // Tell the template its OK to display the currency picker.
                self.currencyDropdownVisible(true);
                notifications.emptyGrowlMessages();

                $(document).on('mouseleave', '#headerCurrencyPicker', function() {
                    self.hideCurrencyDropDown();
                });

                // to handle the mouseout/mouseleave events for ipad for currency-picker
                var isiPad = navigator.userAgent.match(CCConstants.IPAD_STRING) != null;
                if (isiPad) {
                    $(document).on('touchend', function(event) {
                        if (!($(event.target).closest('#headerCurrencyPicker').length)) {
                            self.hideCurrencyDropDown();
                        }
                    });
                }
            },

            /**
             * Hides the currency dropdown based on visible flag
             */
            hideCurrencyDropDown: function() {
                // Tell the template the currency should no longer be visible.
                this.currencyDropdownVisible(false);
                $('#headerCurrencyPicker').removeClass('active');
                return true;
            },

            /**
             * Toggles the currency dropdown to show/hide it upon click on link
             */
            toggleCurrencyDropDown: function(scope) {
                //this.closeAllDropdownMenu(scope);
                if ($('#headerCurrencyPicker').hasClass('active')) {
                    this.hideCurrencyDropDown();
                } else {
                    this.showCurrencyDropDown();
                }
            },


            //*********************************************************************************************************************************

            // language picker javascript
            selectedLocaleId: ko.observable(),
            selectedLocale: ko.observable(),
            languageLinkText: ko.observable(''),
            languageDropdownVisible: ko.observable(false),
            supportedLocales: ko.observableArray([]),
            localeAlternates: ko.observableArray([]),
            redirectToLink: ko.observable('#'),
            sortLocales: function() {
                var self = this;
                this.supportedLocales.sort(function(left, right) {
                    return left.displayName == right.displayName ? 0 : (left.displayName < right.displayName ? -1 : 1);
                });
            },

            /**
             * key press event handle
             * 
             * data - knockout data 
             * event - event data
             */
            keypressLanguageHandler: function(data, event) {

                var self, $this, keyCode;

                self = this;
                $this = $(event.target);
                keyCode = event.which ? event.which : event.keyCode;

                if (event.shiftKey && keyCode == CCConstants.KEY_CODE_TAB) {
                    keyCode = CCConstants.KEY_CODE_SHIFT_TAB;
                }
                var lastLocaleElementId = "CC-header-languagePicker-" + ((self.supportedLocales().length) - 1);
                switch (keyCode) {
                    case CCConstants.KEY_CODE_TAB:
                        if (($this[0].id === lastLocaleElementId)) {
                            self.hideLanguageDropDown();
                        }
                        break;

                    case CCConstants.KEY_CODE_SHIFT_TAB:
                        if ($this[0].id === "CC-header-language-link") {
                            self.hideLanguageDropDown();
                        }
                }
                return true;
            },

            /**
             * Shows the Language dropdown based on visible flag
             * 
             */
            showLanguageDropDown: function() {
                // Tell the template its OK to display the cart.
                this.languageDropdownVisible(true);

                notifications.emptyGrowlMessages();

                $('#languagedropdown').addClass('active');
                $('#languagedropdown > .content').fadeIn('slow');

                $(document).on('mouseleave', '#languagedropdown', function() {
                    $('#languagedropdown > .content').fadeOut('slow');
                    $(this).removeClass('active');
                });

                // to handle the mouseout/mouseleave events for ipad for language-picker
                var isiPad = navigator.userAgent.match(CCConstants.IPAD_STRING) != null;
                if (isiPad) {
                    $(document).on('touchend', function(event) {
                        if (!($(event.target).closest('#languagedropdown').length)) {
                            $('#languagedropdown > .content').fadeOut('slow');
                            $('#languagedropdown').removeClass('active');
                        }
                    });
                }
            },

            /**
             * Hides the language dropdown based on visible flag
             */
            hideLanguageDropDown: function() {
                // Tell the template the cart should no longer be visible.
                this.languageDropdownVisible(false);

                $('#languagedropdown > .content').fadeOut('slow');
                $('#languagedropdown').removeClass('active');

                return true;
            },

            /**
             * Toggles the language dropdown to show/hide it upon click on link
             */
            toggleLanguageDropDown: function(scope) {
                //this.closeAllDropdownMenu(scope);
                this.redirectToLink('/' + navigation.getPath());
                if ($('#languagedropdown').hasClass('active')) {
                    this.hideLanguageDropDown();
                } else {
                    this.showLanguageDropDown();
                }
            },




            //***************************************************************************************************************************************
            // login/ regsitration javascript
            modalMessageType: ko.observable(''),
            modalMessageText: ko.observable(''),
            showErrorMessage: ko.observable(false),
            userCreated: ko.observable(false),
            ignoreBlur: ko.observable(false),

            removeMessageFromPanel: function() {
                var message = this;
                var messageId = message.id();
                var messageType = message.type();
                notifier.deleteMessage(messageId, messageType);
            },

            emailAddressFocused: function(data) {
                if (this.ignoreBlur && this.ignoreBlur()) {
                    return true;
                }
                this.user().ignoreEmailValidation(true);
                return true;
            },

            emailAddressLostFocus: function(data) {
                if (this.ignoreBlur && this.ignoreBlur()) {
                    return true;
                }
                this.user().ignoreEmailValidation(false);
                return true;
            },

            passwordFieldFocused: function(data) {
                if (this.ignoreBlur && this.ignoreBlur()) {
                    return true;
                }
                this.user().ignorePasswordValidation(true);
                return true;
            },

            passwordFieldLostFocus: function(data) {
                if (this.ignoreBlur && this.ignoreBlur()) {
                    return true;
                }
                this.user().ignorePasswordValidation(false);
                return true;
            },

            confirmPwdFieldFocused: function(data) {
                if (this.ignoreBlur && this.ignoreBlur()) {
                    return true;
                }
                this.user().ignoreConfirmPasswordValidation(true);
                return true;
            },

            confirmPwdFieldLostFocus: function(data) {
                if (this.ignoreBlur && this.ignoreBlur()) {
                    return true;
                }
                this.user().ignoreConfirmPasswordValidation(false);
                return true;
            },

            handleLabelsInIEModals: function() {
                if (!!(navigator.userAgent.match(/Trident/))) {
                    $("#CC-LoginRegistrationModal label").removeClass("inline");
                }
            },

            /**
             * Registration will be called when register is clicked
             */
            registerUser: function(data, event) {
                // if ('click' === event.type || (('keydown' === event.type || 'keypress' === event.type) && event.keyCode === 13)) {
                //     notifier.clearError(this.WIDGET_ID);
                //     //removing the shipping address if anything is set
                //     data.user().shippingAddressBook([]);
                //     data.user().updateLocalData(false, false);
                //     if (data.user().validateUser()) {
                //         $.Topic(pubsub.topicNames.USER_REGISTRATION_SUBMIT).publishWith(data.user(), [{
                //             message: "success",
                //             widgetId: data.WIDGET_ID
                //         }]);
                //     }
                // }
                // return true;
            },

            /**
             * this method is invoked to hide the login modal
             */
            hideLoginModal: function() {
                $('#CC-headermodalpane').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            },

            /**
             * Invoked when Login method is called
             */
            handleLogin: function(data, event) {
                // if ('click' === event.type || (('keydown' === event.type || 'keypress' === event.type) && event.keyCode === 13)) {
                //     notifier.clearError(this.WIDGET_ID);
                //     if (data.user().validateLogin()) {
                //         data.user().updateLocalData(false, false);
                //         $.Topic(pubsub.topicNames.USER_LOGIN_SUBMIT).publishWith(data.user(), [{
                //             message: "success"
                //         }]);
                //     }
                // }
                // return true;
            },

            /**
             * Invoked when cancel button is clicked on login modal
             */
            handleCancel: function(data, event) {
                // if ('click' === event.type || (('keydown' === event.type || 'keypress' === event.type) && event.keyCode === 13)) {
                //     notifier.clearError(this.WIDGET_ID);
                //     if (data.user().isUserSessionExpired()) {
                //         $.Topic(pubsub.topicNames.USER_LOGOUT_SUBMIT).publishWith([{
                //             message: "success"
                //         }]);
                //         this.hideLoginModal();
                //     }
                // }
                // return true;
            },

            handleCancelForgottenPassword: function(data, event) {
                if ('click' === event.type || (('keydown' === event.type || 'keypress' === event.type) && event.keyCode === 13)) {
                    notifier.clearError(this.WIDGET_ID);
                    navigation.doLogin(navigation.getPath(), data.links().home.route);
                }
                return true;
            },

            /**
             * this method is triggered when the user clicks on the save 
             * on the update password model
             */
            savePassword: function(data, event) {

                if ('click' === event.type || (('keydown' === event.type || 'keypress' === event.type) && event.keyCode === 13)) {
                    notifier.clearError(this.WIDGET_ID);
                    data.user().ignoreConfirmPasswordValidation(false);
                    data.user().ignoreEmailValidation(false);
                    data.user().emailAddressForForgottenPwd.isModified(true);
                    if (data.user().isPasswordValid(true) &&
                        data.user().emailAddressForForgottenPwd &&
                        data.user().emailAddressForForgottenPwd.isValid()) {
                        data.user().updateExpiredPasswordUsingToken(data.user().token,
                            data.user().emailAddressForForgottenPwd(), data.user().newPassword(),
                            data.user().confirmPassword(),
                            function(retData) {
                                // Success function
                                data['login-registration-v2'].hideAllSections();
                                $('#CC-updatePasswordMessagePane').show();
                            },
                            function(retData) {
                                // Error function - show error message
                                data['login-registration-v2'].hideAllSections();
                                $('#CC-updatePasswordErrorMessagePane').show();
                            }
                        );
                    }
                }
                return true;
            },

            /**
             * Invoked when cancel button is called on 
             */
            cancelLoginModal: function(widget) {
                if (widget.hasOwnProperty("user")) {
                    widget.user().handleCancel();
                    if (widget.user().pageToRedirect() && widget.user().pageToRedirect() == widget.links().checkout.route && widget.cart().items().length > 0) {
                        var hash = widget.user().pageToRedirect();
                        widget.user().pageToRedirect(null);
                        navigation.goTo(hash);
                    } else {
                        navigation.cancelLogin();
                    }
                    widget.user().pageToRedirect(null);
                    notifier.clearError(widget.WIDGET_ID);
                    widget.user().clearUserData();
                    widget.user().profileRedirect();
                } else {
                    navigation.cancelLogin();
                }
            },

            /**
             * Invoked when Logout method is called
             */
            handleLogout: function(data) {
                // returns if the profile has unsaved changes.
                if (data.isUserProfileEdited()) {
                    return true;
                }
                // Clearing the auto-login success message
                notifier.clearSuccess(this.WIDGET_ID);
                // Clearing any other notifications
                notifier.clearError(this.WIDGET_ID);
                data.updateLocalData(data.loggedinAtCheckout(), false);
                $.Topic(pubsub.topicNames.USER_LOGOUT_SUBMIT).publishWith([{
                    message: "success"
                }]);
            },

            /**
             * Invoked when the modal dialog for registration is closed
             */
            cancelRegistration: function(data) {
                notifier.clearSuccess(this.WIDGET_ID);
                notifier.clearError(this.WIDGET_ID);
                this.hideLoginModal();
                data.user().reset();
                this.showErrorMessage(false);
                data.user().pageToRedirect(null);
            },

            /**
             * Invoked when registration link is clicked
             */
            clickRegistration: function(data) {
                notifier.clearSuccess(this.WIDGET_ID);
                notifier.clearError(this.WIDGET_ID);
                data.reset();
                this.hideAllSections();
                $('#CC-registerUserPane').show();
                this.showErrorMessage(false);
                $('#CC-headermodalpane').on('shown.bs.modal', function() {
                    $('#CC-userRegistration-firstname').focus();
                    data.firstName.isModified(false);
                });
            },

            /**
             * Invoked when login link is clicked
             */
            clickLogin: function(data) {
                notifier.clearSuccess(this.WIDGET_ID);
                notifier.clearError(this.WIDGET_ID);
                data.reset();
                this.hideAllSections();
                $('#CC-loginUserPane').show();
                this.showErrorMessage(false);
                $('#CC-headermodalpane').on('shown.bs.modal', function() {
                    if (!data.loggedIn() && data.login() && data.login() != '' && data.isUserSessionExpired()) {
                        data.populateUserFromLocalData(true);
                        $('#CC-login-password-input').focus();
                        data.password.isModified(false);
                    } else {
                        $('#CC-login-input').focus();
                        data.login.isModified(false);
                    }
                    // Set the login handler page to null now
                    navigation.loginHandlerPage = null;
                });
            },

            /**
             * Ignores the blur function when mouse click is up
             */
            handleMouseUp: function(data) {
                this.ignoreBlur(false);
                data.user().ignoreConfirmPasswordValidation(false);
                return true;
            },

            /**
             * Ignores the blur function when mouse click is down
             */
            handleMouseDown: function(data) {
                this.ignoreBlur(true);
                data.user().ignoreConfirmPasswordValidation(true);
                return true;
            },

            // Initializes search typeahead and the placeholder text
            initializeSearch: function() {
                this.initTypeahead.bind(this)();
                this.addPlaceholder();
            },

            initTypeahead: function() {
                var typeAhead = searchTypeahead.getInstance(this.SEARCH_SELECTOR, this.site().selectedPriceListGroup().currency);
                notifications.emptyGrowlMessages();
            },

            addPlaceholder: function() {
                $('#CC-headerWidget-Search-Desktop').placeholder();
                $('#CC-headerWidget-Search-Mobile').placeholder();
            },
            /**
             * Invoked when the search text box is in focus.
             * Used to fix the bug with growl messages not clearing on clicking
             * the search box
             */
            searchSelected: function() {
                notifications.emptyGrowlMessages();
                $.Topic(pubsub.topicNames.OVERLAYED_GUIDEDNAVIGATION_HIDE).publish([{
                    message: "success"
                }]);
            },
            /**
             * Ignores the blur function when mouse click is down outside the modal dialog(backdrop click).
             */
            handleModalDownClick: function(data, event) {
                if (event.target === event.currentTarget) {
                    this.ignoreBlur(true);
                    this.user().ignoreConfirmPasswordValidation(true);
                }
                return true;
            },

            /**
             * Invoked when register is clicked on login modal
             */
            showRegistrationSection: function(data) {
                $('#alert-modal-change').text(CCi18n.t('ns.common:resources.registrationModalOpenedText'));
                this.hideAllSections();
                $('#CC-registerUserPane').show();
                $('#CC-userRegistration-firstname').focus();
                data.user().firstName.isModified(false);
                notifier.clearError(this.WIDGET_ID);
                notifier.clearSuccess(this.WIDGET_ID);
                data.user().reset();
                this.showErrorMessage(false);
            },

            /**
             * Invoked when forgotten Password link is clicked.
             */
            showForgotPasswordSection: function(data) {
                $('#alert-modal-change').text(CCi18n.t('ns.common:resources.forgottenPasswordModalOpenedText'));
                data.ignoreEmailValidation(false);
                this.hideAllSections();
                $('#CC-forgotPasswordSectionPane').show();
                $('#CC-forgotPwd-input').focus();
                data.emailAddressForForgottenPwd('');
                data.emailAddressForForgottenPwd.isModified(false);
            },

            /**
             * Hides all the sections of  modal dialogs.
             */
            hideAllSections: function() {
                $('#CC-loginUserPane').hide();
                $('#CC-registerUserPane').hide();
                $('#CC-forgotPasswordSectionPane').hide();
                $('#CC-updatePasswordPane').hide();
                $('#CC-updatePasswordMessagePane').hide();
                $('#CC-forgotPasswordMessagePane').hide();
                $('#CC-updatePasswordErrorMessagePane').hide();
            },

            /**
             * Resets the password for the entered email id.
             */
            resetForgotPassword: function(data, event) {
                if ('click' === event.type || (('keydown' === event.type || 'keypress' === event.type) && event.keyCode === 13)) {
                    data.user().ignoreEmailValidation(false);
                    data.user().emailAddressForForgottenPwd.isModified(true);
                    if (data.user().emailAddressForForgottenPwd && data.user().emailAddressForForgottenPwd.isValid()) {
                        data.user().resetForgotPassword();
                    }
                }
                return true;
            },
            handleSearchText: function() {
                $('#CC-headerWidget-Search').val('');
            },
            // Browser Detect for blocking IE 11 and lower browsers
            detectBrowserAgent: function() {
                // Opera 8.0+
                var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
                
                // Firefox 1.0+
                var isFirefox = typeof InstallTrigger !== 'undefined';
                
                // Safari 3.0+ "[object HTMLElementConstructor]" 
                var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
                
                // Internet Explorer 6-11
                var isIE = /*@cc_on!@*/false || !!document.documentMode;
                
                // Edge 20+
                var isEdge = !isIE && !!window.StyleMedia;
                
                // Chrome 1 - 71
                var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
                
                // Blink engine detection
                var isBlink = (isChrome || isOpera) && !!window.CSS;
                
                if(isOpera) {
                    return 'OPERA';
                } else if(isFirefox) {
                    return 'FIREFOX';
                } else if (isIE) {
                    return 'IE';
                } else if (isEdge) {
                    return 'EDGE';
                } else if (isChrome) {
                    return 'CHROME';
                } else if (isBlink) {
                    return 'BLINK';
                } else {
                    return 'UNDETECTED';
                }
            }
        };
    }
);