var userInfoScope = '';
var localstream = '';
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'pubsub', 'spinner', 'CCi18n', 'storageApi', 'navigation','notifier','https://cozmo.github.io/jsQR/jsQR.js', 'ccResourceLoader!global/productCompareSharedViewModel','ccConstants' , 'ccLogger','moment'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, pubsub, spinner, CCi18n, storageApi, navigation,notifier,jsQR, productCompareSharedViewModel, CCConstants , logger,moment) {
         "use strict";
        var methodsIndicator = '#accordionTabs-re200011';
        var showErrorMessage = '';
        var LOADING_FLIGHT = "LOADING";
        var flightLoadingOptions = {
            parent: '#accordionTabs-re200011',
            selector: '#accordionTabs-re200011'
        };
	return {
	    isConCourseAgentLogin: ko.observable(false),
            isStartCapturing : ko.observable(),
            userTitle: ko.observable(''),
            isNIPaymentRedirected: ko.observable(false),
            flightType: ko.observable(),
            manuallyClicked: ko.observable(false),
            flightData: ko.observableArray([]),
            filteredflightData: ko.observableArray([]),
            currentDate: ko.observable(''),
            dateafterCurrentDate: ko.observable(''),
            twoDaysAfterCurrentDate: ko.observable(''),
            flightNumberValue: ko.observable(''),
            selectedDateString: ko.observable(''),
            selectedFlightNo: ko.observable({}),
            rate_value: ko.observable(''),
            isDeparture: ko.observable(false),
            isArrival: ko.observable(false),
            isDisable:  ko.observable(true),
            selectedCountryValue: ko.observable(''),
            passportNumberValue: ko.observable(''),
            dateOfBirthValue: ko.observable(''),
            phoneNumberValue: ko.observable(),
            phoneCodeValue: ko.observable(''),
            emiratesIdValue: ko.observable(''),
            mobileNoVerifiedValue: ko.observable(),
            airlineUrl: ko.observable(''),
            isMobile: ko.observable(false),
            isDesktop: ko.observable(true),
            productType: ko.observableArray(),
            isRaffleTicketsInCart: ko.observable(false),
            isNonRaffleProductInCart: ko.observable(false),
            oneTimePassword: ko.observable(''),
            isMobileNumberVerified: ko.observable(''),
            selectedPhoneNumberValue: ko.observable(),
            countryCodeArray: ko.observableArray(),
            selectedCountryCode: ko.observable(),
            selectedPhoneCode: ko.observable(),
            preSelectedCountryCodeValue: ko.observable(),
            mlist: ko.observableArray([ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]),
            newDateOFBirth: ko.observable(),
            
            
            // concourse code here
            beacconID:ko.observable(""),
            userTitle:ko.observable(''),
            firstName:ko.observable(''),
            lastName:ko.observable(''),
            emailAddress:ko.observable(''),
            flightNumber:ko.observable(''),
            selectedFlightNumber:ko.observable({}),
            availableFlightOnTheDay:ko.observableArray(),
            filteredAvailableFlightOnTheDay:ko.observableArray(),
            ignoreEmailValidation: ko.observable(true),
            // countryPhoneCode: ko.observableArray(),
            phoneNumber: ko.observable(),
            selectedCountryPhoneCode: ko.observable(),
            conCourseDeliveryTime: ko.observable(),
            concourseTermAndCondition:ko.observable(false),
            guestEmailAddressFocused : function() {
              var widget = this;
              widget.ignoreEmailValidation(true);
              return true;
            },
    
            guestEmailAddressLostFocus : function() {
              var widget = this;
              widget.ignoreEmailValidation(false);
              $('#CC-checkoutRegistration-email').blur();
              if($("#CC-checkoutRegistration-email-error")[0].innerText.indexOf('john@smith.com.') > -1){
                  $('#CC-userInformation-emailAddress').addClass('errorDanger');
              }else{
                  $('#CC-userInformation-emailAddress').removeClass('errorDanger');
              }
              return true;
            },
            validateFirstName : function(){
                var self = this;
                if(self.firstName()){
                    $('#CC-userInformation-firstname').removeClass('errorDanger');
                    return true;
                }
                $('#CC-userInformation-firstname').addClass('errorDanger');
                return false;
            },
            validateLastName : function(){
                var self = this;
                if(self.lastName()){
                    $('#CC-userInformation-lastname').removeClass('errorDanger');
                    return true;
                }
                $('#CC-userInformation-lastname').addClass('errorDanger');
                return false;
            },
            validateEmailAddress : function(){
                var self = this;
                if(self.order().guestEmailAddress()){
                     $('#CC-userInformation-emailAddress').removeClass('errorDanger');
                    return true;
                }
                $('#CC-userInformation-emailAddress').addClass('errorDanger');
                return true;
            },
            validateFlightDetails : function(){
                var self = this;
                if(self.selectedFlightNumber() && self.selectedFlightNumber().FLIGHT_NO){
                     $('#CC-userInformation-flightNumber').removeClass('errorDanger');
                    return true;
                }
                $('#CC-userInformation-flightNumber').addClass('errorDanger');
                return false;
            },
            validateTitle : function(){
                var self = this;
                if(self.userTitle()){
                    return true;
                }
                return false;
            },
            validateCountryCode : function(){
                var self = this;
                if(self.selectedCountryPhoneCode()){
                     $('#CC-userInformation-countryPhoneCode').removeClass('errorDanger');
                    return true;
                }
                $('#CC-userInformation-countryPhoneCode').addClass('errorDanger');
                return false;
            },
            validatePhoneNumber : function(){
                var self = this;
                if(self.phoneNumber()){
                    $('#CC-userInformation-phoneNumber').removeClass('errorDanger');
                    return true;
                }
                $('#CC-userInformation-phoneNumber').addClass('errorDanger');
                return false;
            },
            validateTermAndCondition : function(){
                var self = this;
                if(self.concourseTermAndCondition()){
                     $('#termAndConditionCheckbox').removeClass('errorDanger');
                    return true;
                }
                $('#termAndConditionCheckbox').addClass('errorDanger');
                return false;
            },
            validateConcourseSAnonymousUser : function(){
                var self = this;
                var isValidTermAndCondition = self.validateTermAndCondition();
                var isValidFirstName = self.validateFirstName();
                var isValidLastName = self.validateLastName();
                var isValidEmailAddress = self.validateEmailAddress();
                var isValidFlightDetails = self.validateFlightDetails();
                var isValidTitle = self.validateTitle();
                var isValidCountryCode = '';
                var isValidPhoneNumber = '';
                console.log('validate')
                if(self.selectedCountryPhoneCode() || self.phoneNumber()){
                    isValidCountryCode = self.validateCountryCode();
                    isValidPhoneNumber = self.validatePhoneNumber();
                }
                if(isValidTermAndCondition && isValidFirstName && isValidLastName && isValidEmailAddress && isValidFlightDetails && isValidTitle || (isValidPhoneNumber && isValidCountryCode) && isValidTermAndCondition && isValidFirstName && isValidLastName && isValidEmailAddress && isValidFlightDetails && isValidTitle){ 
                    return true;
                }      
                return false;
            },
            emailAddressFocused: function(){
                var data = this;
                if (data.ignoreBlur && data.ignoreBlur()) {
                    return true;
                }
                data.user().ignoreEmailValidation(true);
                return true;
            },

            emailAddressLostFocus: function() {
                var data = this;
                if (data && data.ignoreBlur && data.ignoreBlur()) {
                    return true;
                }
                data.user().ignoreEmailValidation(false);
                return true;
            },
            handleFlightSelection:function(flightDetails){
                var self = this;
                self.selectedFlightNumber(flightDetails);
                self.flightNumber(flightDetails.FLIGHT_NO);
                $.Topic("USER_SELECTED_FLIGHT_DETAIL").publishWith(
                  flightDetails, [{flightDetail:flightDetails,
                    message: "success"
                }]) ;
            },
            _allowCustomerToTakeDecisionAndProcessOrder:function(){
                $("#confirmOrderModal").modal('show'); 
                 $("#cc-shippingOptions-dropDown").click();
            },
            handleProcessConcourseOrder:function(){
                var self = this;
                $("#confirmOrderModal").modal('hide');
                var confirmOrderCartDetail = [];
                self.cart().items().forEach(function(item){
                    confirmOrderCartDetail.push(item.productData());
                })
                storageApi.getInstance().setItem("confirmOrderCartDetail",JSON.stringify(confirmOrderCartDetail));
                setTimeout(function(){
                    // $("#CC-checkoutOrderSummary-placeOrder button").click();
                    scopelevel.handleCreateOrder();
                },1000);
            },
            getTimeForDelivery:function(){
                var date = new Date();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var aheadMinutes = minutes + 30;
                var aheadHour = hours + 1;
                if(aheadMinutes > 60){
                    aheadHour = '' + (aheadHour + 1);
                    aheadMinutes ='' +  minutes - 30;
                }else if(aheadMinutes === 60 || aheadMinutes === 0){
                    aheadHour = ''+aheadHour + 2;
                    aheadMinutes = 0;
                }
                if(aheadHour.length === 1){
                    aheadHour = '0' + aheadHour;
                }
                return  (aheadHour + ':' +aheadMinutes);
            },
            resetUserInfoTabConCourse:function(){
                $('.productOrderTab ul li span').first().removeClass('successTab');
                $('.productOrderTab ul li span').first().addClass('badge-light');
            },
            confirmConcourseOrder:function(){
                var widget = this;
                widget.validateConcourseSAnonymousUser();
                scopelevel.order().isCashPayment(true);
                widget.order().shippingAddress().jobTitle(widget.selectedFlightNumber().Airline_Name);
                widget.order().shippingAddress().firstName(widget.firstName());
                widget.order().shippingAddress().lastName(widget.lastName());
                widget.order().shippingAddress().middleName(widget.userTitle())
                // widget.order().guestEmailAddress(widget.emailAddress());
                widget.order().shippingAddress().address1("Departure");
                widget.order().shippingAddress().address2((new Date().getMonth()+1) + '-' + new Date().getDate() + '-' + new Date().getFullYear());
                widget.order().shippingAddress().address3(widget.selectedFlightNumber().FLIGHT_NO);
                widget.order().shippingAddress().city(widget.selectedFlightNumber().CITY);
                widget.order().shippingAddress().companyName(widget.selectedFlightNumber().FLIGHT_TIME);
                if(widget.phoneNumber()){
                    widget.order().shippingAddress().phoneNumber('+'+widget.selectedCountryPhoneCode().Number_Prefix +'-'+ widget.phoneNumber());
                }
                widget.order().shippingAddress().faxNumber(widget.selectedFlightNumber().TERMINAL);
                widget.order().shippingAddress().postalCode("00000");
                widget.order().shippingAddress().selectedState("DU");
                widget.order().shippingAddress().isDefaultBillingAddress(true);
                if(widget.validateConcourseSAnonymousUser()){
                    $('.nav-tabs a[href="#confirmDeliveryTab"]').tab('show');
                     $('.productOrderTab ul li span').first().removeClass('badge-light');
                    $('.productOrderTab ul li span').first().addClass('successTab');
                    widget.conCourseDeliveryTime(widget.getTimeForDelivery());
                }
            },
            intiateDeviceCameraForQRCodeScan:function(){
                var widget = this;
                widget.beacconID('');
                var myRequest = '';
                var myRequest1 = '';
                var video = document.createElement("video");
                    var canvasElement = document.getElementById("canvas");
                    var canvasParent = document.getElementById("canvasParent");
                   
                    var camera = document.getElementById("camera");
                    if(canvasElement){
                        canvasParent.removeChild(canvasElement);
                        $('<canvas id="canvas"></canvas>').appendTo(canvasParent);
                    }
                    var outputContainer = document.getElementById("output");
                   canvasElement = document.getElementById("canvas");
                    var canvas = canvasElement.getContext("2d");
                    function drawLine(begin, end, color) {
                      canvas.beginPath();
                      canvas.moveTo(begin.x, begin.y);
                      canvas.lineTo(end.x, end.y);
                      canvas.lineWidth = 4;
                      canvas.strokeStyle = color;
                      canvas.stroke();
                    }
                    
                    // Use facingMode: environment to attemt to get the front camera on phones
                    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } }).then(function(stream) {
                      video.srcObject = stream;
                      localstream = stream;
                      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                      video.play();
                      myRequest1 = requestAnimationFrame(tick);
                    });
                
                    function tick() {
                    //   loadingMessage.innerText = "? Loading video..."; 
                      if (video.readyState === video.HAVE_ENOUGH_DATA && widget.beacconID() === '') {
                        camera.style.display = 'none';
                        canvasElement.style.display = 'block';
                
                        canvasElement.height = video.videoHeight;
                        canvasElement.width = video.videoWidth;
                        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
                        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                        var code = jsQR(imageData.data, imageData.width, imageData.height, {
                          inversionAttempts: "dontInvert",
                        });
                        if (code) {
                          drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
                          if(code.data.length === 5){
                            widget.beacconID(code.data);
                            localstream.getTracks()[0].stop();
                            // cancelAnimationFrame(myRequest);
                               camera.style.display = 'block';
                               canvasElement.style.display = 'none';
                               cancelAnimationFrame(myRequest1);
                          }
                        } 
                      }
                     myRequest = requestAnimationFrame(tick);
                    }
            },
            getTodaysFlightDetails: function() {
                var widget = this;
                var _site = widget.site().siteInfo.repositoryId === '200001' ? "CONCOURSEA":"ONLINE";
                widget.availableFlightOnTheDay([]);
                widget.selectedFlightNumber("");
                var URL = "/ccstorex/custom/v1/getflightdata/A/" + (new Date().getMonth()+1) + '-' + new Date().getDate() + '-' + new Date().getFullYear()+ '/'+_site;
                    widget.createSpinner(widget);
                    $.ajax({
                        url: URL,
                        crossDomain: true,
                        type: 'GET',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function(result) {
                            if(result.data.length){
                                widget.availableFlightOnTheDay(result.data);
                                widget.validatingSelectedDate();
                            }
                             widget.destroySpinner(widget);
                        },
                        error: function() {
                            widget.destroySpinner(widget);
                            
                        }
                    });
            },
            
            /* SHIPPING ADDRESS FORMATE
            jobTitle -- Airline_name
            Address1 --- Flight Type -  Dep / Arv
            Address2 --- Flight Date
            Address3 --- Flight Number
            city --- City
            companyName : Time
            PhoneNumber : Terminal 
            */

            handleSelectedFlight:function(flightDetail){
              var self = this;
              self.selectedFlightNo(flightDetail);
              $.Topic("USER_SELECTED_FLIGHT_DETAIL").publishWith(
                  flightDetail, [{flightDetail:flightDetail,
                    message: "success"
              }]) ;
            },
            destroySpinner: function(widget) {
                $(methodsIndicator).removeClass('loadingIndicator');
                spinner.destroyWithoutDelay($(methodsIndicator));
            },
            month_name: function(date){ 
                var self = this;
                var userDateOfBirth = date;
                var initial = userDateOfBirth.split('/');
                var userDateOfBirthValue = self.mlist()[initial[1]-1];
                self.newDateOFBirth([initial[0] + ' ' + userDateOfBirthValue + ' ' +  initial[2]])
            },
            checkKeypress: function(scope,event){
                 event.preventDefault();
            },
            createSpinnerMain: function(parent, child) {
                var widget = this;
                // $(parent).css('position', 'relative');
                if (parent === '#page') {
                    $('.cc-spinner-css').css({left: '46%'});
                    $('#cc-spinner').css({opacity: '0.85', 'background-color': '#000', 'z-index': '9999'});
                }
                if (child && child.loadingText){
                    child.loadingText = widget.translate(
                        'fetchingData', {
                            defaultValue: LOADING_TICKET
                        });
                }
                    
                spinner.create(child);
            },
            createSpinner: function(widget) {
                $(methodsIndicator).css('position', 'relative');
                flightLoadingOptions.loadingText = widget.translate(
                    'fetchingShippingMethodsText', {
                        defaultValue: LOADING_FLIGHT
                    });
                spinner.create(flightLoadingOptions);
            },
            navigateToProfile:function(index){
                storageApi.getInstance().setItem("activeProfileTab", index);
                storageApi.getInstance().setItem('isProfileEditable', 1);
                if(window.location.pathname.indexOf("/profile") > -1){
                     $("#tabNormalViewport .nav.nav-tabs li a")[+index].click();
                }
                navigation.goTo("/profile");
            },
            getCalender: function() {
                var dateafterCurrentDate = new Date();
                dateafterCurrentDate.setDate(dateafterCurrentDate.getDate() + 60);
                var twoDaysAfterCurrentDate = new Date();
                twoDaysAfterCurrentDate.setDate(twoDaysAfterCurrentDate.getDate() + 1);
                 $("#myDate").datepicker({
                    startDate: twoDaysAfterCurrentDate,
                    endDate: dateafterCurrentDate,
                    format: 'dd/mm/yyyy'
                    // autocomplete:'off',
                    // autoClose: true,
                    // keyboardNavigation: false
                });
            },

            checkResponsiveFeatures: function(viewportWidth) {
                if (viewportWidth > 978) {
                    this.isMobile(false);
                } else if (viewportWidth <= 978) {
                    this.isMobile(true);
                }
            },
            
            UpdateOrderDynamicProperty:function(widget){
    			var travelDate = localStorage.getItem('travelDate');   
    			widget.order().cart().dynamicProperties().forEach(function(property, index) {
    			    console.log('travelDate1');
    				if (travelDate && property.id() === '_travelDate' && !property.value()) {
    					widget.order().cart().dynamicProperties()[index].value(travelDate);
    				  
    				}
    				if (property.id() === "_PromoInfo" && !property.value()) {
    					var appliedPromotions = localStorage.getItem("locallyAppliedPromotionCart");
    					if (appliedPromotions) {
    						widget.order().cart().dynamicProperties()[index].value(appliedPromotions);
    					}
    				}
    			});
    			
    			console.log('travelDate2');
    			var _travelDate = false;
    			var _PromoInfo = false;
    			widget.order().cart().dynamicProperties().forEach(function(property, index) {
    				 if(property.id() === '_travelDate' && property.value()) {
    					 _travelDate = true;
    				 }
    				 if(!travelDate){
    					 _travelDate = true;
    				 }
    				 if(property.id() === '_PromoInfo' && property.value()){
    					 _PromoInfo = true;
    				 }
    			 });
    			 
    			var confirmCart = []; 
    			var isRaffleInCart = false;
        		var isNormalProductInCart = false;
        		logger.info('handleCreateOrder userinfo:: Looping in cart items...');
        		widget.order().cart().items().forEach(function(item) {
        			if (item.productId.indexOf('Car') > -1 || item.productId.indexOf('MM') > -1 || item.productId.indexOf('Bike') > -1) {
        				isRaffleInCart = true;
        			} else {
        				isNormalProductInCart = true;
        			}
        			var newItem = JSON.parse(JSON.stringify(item));
        			newItem.productData = item.productData();
        			confirmCart.push(newItem);
        		});
        		// below code line we are using in confirmation page
        		storageApi.getInstance().setItem("confirmOrderCartDetail", JSON.stringify(confirmCart));
        		console.log('setting dynamic, Properties',isNormalProductInCart,isRaffleInCart);
        		logger.info('Called handleCreateOrder userinfo... :: setting dynamic Properties');
        		if (isRaffleInCart && isNormalProductInCart) {
        			widget.order().cart().dynamicProperties().forEach(function(property) {
        				if (property.id() === "_orderType") {
        					property.value('hybrid');
        					
        				}
        			});
        		} else if (isRaffleInCart && !isNormalProductInCart) {
        			widget.order().cart().dynamicProperties().forEach(function(property) {
        				if (property.id() === "_orderType") {
        					property.value('raffle');
        					
        				}
        			});
        		} else if (!isRaffleInCart && isNormalProductInCart)  {
        			widget.order().cart().dynamicProperties().forEach(function(property) {
        				if (property.id() === "_orderType") {
        					property.value('normal');
        					
        				}
        			});
        		}
    		    ///--
    			 
    			
    			
    			////---
    			 
            },
            
            /*validation for FlightDate and FlightNumber*/
            openPayment: function(widget) {
                // Update Dynamic property
                widget.UpdateOrderDynamicProperty(widget);
                $("#CC-checkoutAddressBook-useAsBillAddress").prop('checked', false);
                $("#CC-checkoutAddressBook-useAsBillAddress").triggerHandler('click')
                
                var self = widget;
                var error = false;
                if (self.isRaffleTicketsInCart() && self.isNonRaffleProductInCart() === false) {
                    if (widget.user().loggedIn()) {
                         $('.tab-num-span').addClass('highlight');
                        var tab = document.getElementById('tabNo');
                        if(tab){
                        tab.innerHTML= widget.user().firstName() + ' ' + widget.user().lastName();
                        }
                        widget.order().shippingAddress().firstName(widget.user().firstName());
                        widget.order().shippingAddress().lastName(widget.user().lastName());
                        widget.order().shippingAddress().city("Dubai");
                        widget.order().shippingAddress().postalCode("00000");
                        widget.order().shippingAddress().selectedState("DU");
                        //widget.order().shippingAddress().phoneNumber("1234567890");
                    }
                    widget.order().shippingAddress().address1("1295 Charleston Rd" + "#" + "Mountain View" + "#" + "CA" + "#" + "US" + "#" + "94043");
                } else {
                    if (self.selectedDateString() === '') {
                        $("#CC-flightDate-input").focus();
                        $('#CC-flightDate-error').text("Date is mandatory");
                        $("#CC-flightDate-error").css("cssText", "display: block; background-color:#fff;padding: 10px;margin-bottom: 10px;border: 1px solid #D40808;border-radius: 2px;right: 0px;");
                        error = true;
                        self.topFunction();
                    }
                    if (self.flightNumberValue() === '') {
                        $("#myInput").focus();
                        $('#CC-flightNo-error').text("FlightNo. is mandatory");
                        $("#CC-flightNo-error").css("cssText", "display: block; background-color:#fff;padding: 10px;margin-bottom: 10px;border: 1px solid #D40808;border-radius: 2px;right: 0px;");
                        error = true;
                        self.topFunction();
                    } else if (!(self.selectedDate() == self.selectedFlightNo().FLIGHT_DATE && self.flightNumberValue() == self.selectedFlightNo().FLIGHT_NO)) {
                        $('#CC-flightdata-error').text("Invalid Flight Data");
                        $("#CC-flightdata-error").css("cssText", "display: block; background-color:#fff;padding: 10px;margin-bottom: 10px;border: 1px solid #D40808;border-radius: 2px;right: 0px;");
                        error = true;
                        self.topFunction();
                    } else {
                        $("#CC-flightdata-error").css("cssText", "display: none;");
                        $('.tab-num-span').addClass('highlight');
                        var tab = document.getElementById('tabNo')
                        /*  Milind EMail */
                        if ($("#region-9colCheckoutBodyWithGiftCard").length >0 ){
                            var abc  = $("#region-9colCheckoutBodyWithGiftCard").html()
                            var t = $('<div id="target" style="display:none"></div>').appendTo('body')
                            var t = $("#target")
                            t.html(abc)
                            t.find("[data-bind]").removeAttr("data-bind");
                            $('#target').contents().each(function() {
                                if(this.nodeType === Node.COMMENT_NODE) {
                                    $(this).remove();
                                }
                            });
                            
                            $('#target *').contents().each(function() {
                                if(this.nodeType === Node.COMMENT_NODE) {
                                    $(this).remove();
                                }
                            });
                            $('#target').find('img').each(function(index,ctl) { 
					            if (ctl){
					                ctl.src = ctl.src.replace('https://','{HTTPS}');    
					            }
				            });
				            
                            // var EMaildata = $('#target').html();
                            
                            // EMaildata = EMaildata.replace(/{HTTPS}/g, 'https://');
                            
                            $('#target').remove();
                            // changes done for order email
                            // widget.order().cart().dynamicProperties().forEach(function(e) {
                            //     if (e.id() === "_CartHTML") {
                            //         // e.value(EMaildata);
                            //         // var products = $('#cart-products');
                            //         // e.value({ orderSummary: $('#orderSummary').html() })
                            //     } 
                            // }) 
                        }
            //             /* Milind EMail */
                        if(tab){
                        tab.innerHTML= widget.user().firstName() + ' ' + widget.user().lastName();
                        }
                        if (widget.user().loggedIn()) {
                            widget.order().shippingAddress().firstName(widget.user().firstName());
                            widget.order().shippingAddress().lastName(widget.user().lastName());
                            widget.order().shippingAddress().postalCode("00000");
                            widget.order().shippingAddress().selectedState("DU");
                        }
                         if (widget.flightType() && self.selectedDate() && self.flightNumberValue() && self.selectedFlightNo() && self.flightNumberValue() == self.selectedFlightNo().FLIGHT_NO) {
                            widget.order().shippingAddress().jobTitle(self.selectedFlightNo().Airline_Name );
                            
                            widget.order().shippingAddress().address1(widget.flightType() + "#" + (self.user() && self.user().dynamicProperties()
                            && getDynamicProperty('_passportNumber',self.user().dynamicProperties) ? getDynamicProperty('_passportNumber',self.user().dynamicProperties) : getDynamicProperty('_emiratesId',self.user().dynamicProperties) ));
                            
                            widget.order().shippingAddress().address2(self.dateOfFlight(self.selectedDate())  + "#" + self.selectedFlightNo().GATE_NO );
                            widget.order().shippingAddress().address3(self.selectedFlightNo().FLIGHT_NO + "#" + (self.user() && self.user().dynamicProperties()
                            && getDynamicProperty('_phoneNumber',self.user().dynamicProperties)) );
                            
                            widget.order().shippingAddress().city(self.selectedFlightNo().CITY + "#" + (self.user() && self.user().dynamicProperties()
                            && getDynamicProperty('_nationality',self.user().dynamicProperties)));
                            
                            // widget.order().shippingAddress().companyName(self.selectedFlightNo().FLIGHT_TIME );
                            // widget.order().shippingAddress().phoneNumber(self.selectedFlightNo().TERMINAL ? self.selectedFlightNo().TERMINAL : "1");
                            widget.order().shippingAddress().companyName(self.selectedFlightNo().FLIGHT_TIME + '#' + (self.selectedFlightNo().TERMINAL ? self.selectedFlightNo().TERMINAL : "1"));
                            widget.order().shippingAddress().phoneNumber('');
                            storageApi.getInstance().setItem("travelDate",self.dateOfFlight(self.selectedDate()));
                            // widget.cart().dynamicProperties()[2].value(self.dateOfFlight(self.selectedDate()));
                        }

                    }

                }
				
				// Default Billing Address 
				widget.order().shippingAddress().isDefaultBillingAddress(false);
				widget.order().billingAddress().jobTitle('Mr');
				widget.order().billingAddress().firstName('noreal');
				widget.order().billingAddress().lastName('name');
				widget.order().billingAddress().middleName('')
				widget.order().billingAddress().address1('1295 Charleston Rd.');
				widget.order().billingAddress().address2('');
				widget.order().billingAddress().address3('');
				widget.order().billingAddress().city('Mountain View');
				widget.order().billingAddress().companyName('');
				widget.order().billingAddress().phoneNumber('');
				widget.order().billingAddress().faxNumber('');
				// widget.order().billingAddress().country("US");
				widget.order().billingAddress().selectedCountry('US')
				widget.order().billingAddress().postalCode("94043");
				widget.order().billingAddress().selectedState("CA");

				
				
                // $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_ADDRESS_UPDATED).publishWith();
                if (widget.isMobile() && self.validateUserFlightDetails(widget)) {
                    if (!error){
                    $("#progressTracker-re300175-stage-0 .progressTracker-button-next button").click();
                    }
                } else {
                    if (!error) self.validateUserFlightDetails(widget)
                }

            },

            topFunction: function() {
                document.body.scrollTop = 20;
                document.documentElement.scrollTop = 20;
            },

            /*Mobile Number Verification Modal*/
            closePhoneNumberModal: function() {
                if ($('#phone_number')) {
                    $('#phone_number').val('');
                }
                if (document.getElementById("phoneCodeList")) {
                    var dropDown = document.getElementById("phoneCodeList");
                    dropDown.selectedIndex = 0;
                }
                $('#phoneNumberModal').modal('hide');
            },
            handleOTPModal: function(data) {
                if (data.phoneCodeValue()) {
                    for (var i = 0; i < data.countryCodeArray().length; i++) {
                        if (data.phoneCodeValue() == data.countryCodeArray()[i].Number_Prefix) {
                            data.preSelectedCountryCodeValue(data.countryCodeArray()[i].country_val);
                        }
                    }

                }
                if(document.getElementById('errorMsg')){
                    document.getElementById('errorMsg').style.display = 'none';
                }
                $('#phoneNumberModal').modal()
            },
            handleOTPModalforMobileVerification: function(data,reSent) {
                if(document.getElementById('otpValue')){
                    document.getElementById('otpValue').value='';
                }
                if(document.getElementById('resendMsg')){
                    document.getElementById('resendMsg').style.display="none";
                }
                if (document.getElementById('otpError')) {
                    document.getElementById('otpError').style.display = 'none';
                }
                if( $("#phone_number").val() === '' ||  $("#phone_number").val() === null){
                    document.getElementById('errorMsg').style.display = 'block';
                }else{
                var mob_number = data.phoneNumberValue() ? data.phoneNumberValue() : $("#phone_number").val();
                var country_code = data.phoneCodeValue() ? data.phoneCodeValue() : data.selectedCountryCode().Number_Prefix;
                var phoneNumberwithCountryCode = country_code + mob_number;
                if (data.phoneNumberValue() === null) {
                    data.selectedPhoneNumberValue(mob_number);

                }
                if (data.phoneCodeValue() === null) {
                    data.selectedPhoneCode(country_code);

                }

                this.oneTimePassword(Math.floor(1000 + Math.random() * 9000));
                for (var i = 0; i < data.user().dynamicProperties().length; i++) {
                    if (data.user().dynamicProperties()[i].id() === '_mobileOTP') {
                        data.user().dynamicProperties()[i].value(this.oneTimePassword());
                    }
                }

                var otpData = {
                    "to": phoneNumberwithCountryCode,
                    "text": "Your one time password for mobile number verification is" + " "+ this.oneTimePassword()
                }

                $.ajax({
                    url: "/ccstorex/custom/v1/sendmobileotp",
                    type: 'POST',
                    data: otpData,
                    success: function(result) {
                        $('#phoneNumberModal').modal('hide');
                        $('#OTPModal').modal().off("hide.bs.modal").on("hide.bs.modal", function() {
                            data.closePhoneNumberModal();
                            document.getElementById('otpValue').value = '';
                        });
                        if(reSent){
                                
                               if(document.getElementById('otpError')){
                                   document.getElementById('otpError').style.display="none";
                               }
                               document.getElementById('resendMsg').style.display="block";
                            }
                    }
                });
                }

            },
            handleOTPVerification: function(data) {
                // var otp = document.getElementById('otpValue').value;
                // if (otp == this.oneTimePassword()) {
                //     if (document.getElementById('otpError')) {
                //         document.getElementById('otpError').style.display = 'none';
                //     }
                //     for (var i = 0; i < data.user().dynamicProperties().length; i++) {
                //         if (data.user().dynamicProperties()[i].id() === '_isMobileNumberVerified') {
                //             data.user().dynamicProperties()[i].value(true);
                //             this.isMobileNumberVerified(true);
                //         }
                //     }
                //     $('#OTPModal').modal('hide');

                // } else {
                //     if (document.getElementById('resendMsg')) {
                //         document.getElementById('resendMsg').style.display = "none";
                //     }
                //     document.getElementById('otpError').style.display = 'block';
                //     document.getElementById('otpValue').value = '';
                //     this.isMobileNumberVerified(false);

                // }
                //if (this.isMobileNumberVerified() === true) {
                    if (data.selectedPhoneNumberValue()) {
                        for (var i = 0; i < data.user().dynamicProperties().length; i++) {
                            if (data.user().dynamicProperties()[i].id() === '_phoneNumber') {
                                data.user().dynamicProperties()[i].value(data.selectedPhoneNumberValue());
                                data.phoneNumberValue(data.selectedPhoneNumberValue());
                            }
                        }
                    }
                    var country_code = data.selectedCountryCode() ? data.selectedCountryCode().Number_Prefix  : '';
                    data.selectedPhoneCode(country_code);
                    if (data.selectedPhoneCode()) {
                        for (var i = 0; i < data.user().dynamicProperties().length; i++) {
                            if (data.user().dynamicProperties()[i].id() === '_phoneCode') {
                                data.user().dynamicProperties()[i].value(data.selectedPhoneCode());
                                data.phoneCodeValue(data.selectedPhoneCode());
                            }
                        }
                    }

                    $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUBMIT).publishWith(data.user(), [{
                        message: "success",
                        widgetId: data.WIDGET_ID

                    }]);
                //}
            },

            /*validation for departure and arrival radiobuttons*/
            displayFlightData: function(widget) {
                var self = widget;
                if (document.getElementById('departure').checked) {
                    widget.rate_value = document.getElementById('departure').value;
                    self.isDeparture(true);
                    self.isArrival(false);
                    $('#myInput').val('');
                    $('#myDate').val('');
                    self.flightNumberValue('');
                    self.selectedDateString('');
                    self.selectedFlightNo('');
                    widget.order().shippingAddress().address1('');
                }
                if (document.getElementById('arrival').checked) {
                    widget.rate_value = document.getElementById('arrival').value;
                    self.isArrival(true);
                    self.isDeparture(false);
                    $('#myInput').val('');
                    $('#myDate').val('');
                    self.flightNumberValue('');
                    self.selectedDateString('');
                    self.selectedFlightNo('');
                    widget.order().shippingAddress().address1('');
                }
                self.isDisable(false);
            },

            /*CurrentDate Validation*/
             selectedDate: function(widget) {
                var self = this;
                /*DDF-13 starts*/
                if(self.isMobile()){
                    var myDate = moment(self.selectedDateString()).format("DD/MM/YYYY");   
                }
                else{
                    var myDate = self.selectedDateString();
                }
                /*DDF-13 ends*/
                if (!myDate) {
                    return false;
                }
                var initial = myDate.split('/');
                $("#CC-flightDate-error").css("cssText", "display: none;");
                return ([initial[1], initial[0], initial[2]].join('-'));
              
            },
             dateOfFlight: function(date) {
                  var self = this;
                  var formateDate = date.split("-");
                  return (formateDate[1] + '/' + formateDate[0] + '/' + formateDate[2]);
             },
            
            GetFlightData: function() {
                
                var widget = this;
                var _site = widget.site().siteInfo.repositoryId === '200001' ? "CONCOURSEA":"ONLINE";
                widget.flightData([]);
                widget.selectedFlightNo("");
               var flightType = widget.flightType() === "Departure" ? 'D' : 'A';
                var URL = "/ccstorex/custom/v1/getflightdata/"+ flightType + '/' + widget.selectedDate() + '/' + _site;
               
                     if (!widget.isMobile()) {
                    widget.createSpinner(widget);
                     }
                    $.ajax({
                        url: URL,
                        /* "https://10.102.26.21/flight/getFlightData/"+widget.selectedDateString(),*/
                        crossDomain: true,
                        type: 'GET',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function(result) {
                            if(result.data.length){
                                widget.flightData(result.data);
                                widget.validatingSelectedDate();
                                console.log('data is coming');
                            }else{
                                widget.validatingSelectedDate();
                            }
                             widget.destroySpinner(widget);
                        },
                        error: function() {
                            widget.destroySpinner(widget);
                            
                        }
                    });
                      
            },

            validatingSelectedDate: function() {
                var widget = this;
                if (widget.flightData().length === 0) {
                    $('#myInput').val('');
                    $('#CC-NoFlightData-error').text("No Flight is available on selected date");
                    $("#CC-NoFlightData-error").css("cssText", "display: block;right: 0px;background-color:#fff;padding: 10px;margin-bottom: 10px;border: 1px solid #D40808;border-radius: 2px;");
                    
                } else {
                    $('#CC-NoFlightData-error').text("No Flight is available on selected date");
                    $("#CC-NoFlightData-error").css("cssText", "display: none;");
                    $("#CC-flightdata-error").css("cssText", "display: none;");
                }
            },


            userProfileData: function(widget) {
                for (var i = 0; i < widget.user().dynamicProperties().length; i++) {

                    if (widget.user().dynamicProperties()[i].id() == '_nationality') {
                        widget.selectedCountryValue(widget.user().dynamicProperties()[i].value());
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_passportNumber') {
                        widget.passportNumberValue(widget.user().dynamicProperties()[i].value());
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_dateOfBirth') {
                        if(widget.user().dynamicProperties()[i].value() !== null){
                            widget.month_name(widget.user().dynamicProperties()[i].value());
                              widget.dateOfBirthValue(widget.newDateOFBirth());
                            }
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_phoneNumber') {
                        widget.phoneNumberValue(widget.user().dynamicProperties()[i].value());
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_phoneCode') {
                        widget.phoneCodeValue(widget.user().dynamicProperties()[i].value());
                    }
                     if (widget.user().dynamicProperties()[i].id() == '_emiratesId') {
                        widget.emiratesIdValue(widget.user().dynamicProperties()[i].value());
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_isMobileNumberVerified') {
                        widget.mobileNoVerifiedValue(widget.user().dynamicProperties()[i].value());
                        
                    }
                }
            },
            raffleTicketValue: function(item) {
                var widget = this;
                if (item.type === "RaffleTickets") {
                    widget.isRaffleTicketsInCart(true);

                } else {

                    widget.isNonRaffleProductInCart(true);
                    // widget.isRaffleTicketsInCart(false);
                }

            },
            validateUserFlightDetails: function(widget) {
                if (widget.isMobile()) {
                    if (widget.order().shippingAddress().address1()) {
                        return true;
                    }
                    return false;
                }
                widget.manuallyClicked(true);
                $("#accordionTabs-re200011 .panel.panel-default:nth-child(2) a")[0].click();
            },

            _nextStepPayment: function(action) {
                var self = this;
                if (!action || action !== "firstStepComplete" || !self.manuallyClicked()) {

                    return false;
                }
                if (self.order().shippingAddress().address1() && self.manuallyClicked()) {
                    self.manuallyClicked(false);

                    $("#accordionTabs-re200011 .panel.panel-default:nth-child(2) a")[0].click();
                    return true;
                }
            },
            callCountryCodeService: function() {
                var self = this;
                self.countryCodeArray([]);
                $.ajax({
                    url: "/ccstorex/custom/v1/getcountryphonecode",
                    type: 'GET',
                    success: function(result) {
                        self.countryCodeArray(result.data);
                    }
                });
            },

            onLoad: function(widget) {
                var self = widget;
                userInfoScope = widget;
               
                $('#phoneNumberModal').on('click', function(event) {
                    console.log('event');
                })
                if (widget.cart().items().length === 0) {
                    navigation.goTo('/cart');
                }
                widget.flightType.subscribe(function(){
                    self.handleFlightSelection({});
                })
                 widget.order().guestEmailAddress.extend({
                  required:{ 
                      params: true,message: CCi18n.t('ns.common:resources.emailAddressRequired')
                  },
                  maxLength:{ 
                      params: CCConstants.CYBERSOURCE_EMAIL_MAXIMUM_LENGTH, 
                      message:CCi18n.t('ns.common:resources.maxLengthEmailAdd',{
                          maxLength:CCConstants.CYBERSOURCE_EMAIL_MAXIMUM_LENGTH
                      })
                  },
                  email:{ 
                      params: true,
                      onlyIf: function () { 
                          return (!widget.ignoreEmailValidation()); 
                      }, 
                      message: CCi18n.t('ns.common:resources.emailAddressInvalid')
                  }
                });
                widget.mobileNoVerifiedValue.subscribe(function(data) {
                    if (data === false) {
                        widget.callCountryCodeService();
                    }
                })
                if(productCompareSharedViewModel.isConCourseAgentLogin()){
                    widget.isConCourseAgentLogin(true);
                }
                productCompareSharedViewModel.isConCourseAgentLogin.subscribe(function(data){
                    widget.isConCourseAgentLogin(data);
                })
                /* widget.callCountryCodeService(widget);*/
                $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUCCESSFUL).subscribe(function(data) {
                    if (data.dynamicProperties.filter(function(item) {
                            return item.id === "_isMobileNumberVerified" && item.value === true
                        }).length) {
                        widget.mobileNoVerifiedValue(true);
                    }
                    widget.closePhoneNumberModal();
                });
                
                $.Topic(pubsub.topicNames.PAYMENT_AUTH_DECLINED).subscribe(function(messageDetails){
                    console.log(JSON.stringify(messageDetails));
                    if (messageDetails && messageDetails.length >0 &&  messageDetails[0].responsedata && messageDetails[0].responsedata.displayMessage){
                        var msg = messageDetails[0].responsedata.displayMessage;
                        var code = messageDetails[0].responsedata.reasonCode;
                        showErrorMessage = msg.replace(code  ,"").replace('()','');
                        // notifier.sendError(msg );
                        
                    }
                    
                });
                $.Topic(pubsub.topicNames.PAGE_CHANGED).subscribe(function(data) {
                    if(self.isNIPaymentRedirected() === false){
                    self.flightType("");
                    self.selectedDateString("");
                    self.selectedFlightNo("");
                    self.flightNumberValue("");
                    }
                    self.userProfileData(self);
                    self.isRaffleTicketsInCart(false);
                    self.isNonRaffleProductInCart(false);
                });
                widget.checkResponsiveFeatures($(window).width());
                widget.selectedDateString.subscribe(function(data) {
                    $('#myDate').datepicker('hide');
                    $('#myInput').val('');
                    if (data) {
                         if (window.location.search.indexOf("orderId=") >= 0) {
                   
                          var params = window.location.search.split('&');
                      
                            var presult = {};
                            for (var i = 0; i < params.length; i++) {
                                var entries = params[i].split('=');
                                presult[entries[0]] = entries[1];
                            }
                            
                            var turlParameters = "";
                            try{
                                turlParameters = atob(presult.payment);
                            } catch (ex){
                                turlParameters = "orderId=&merchantTransactionId=&amount=&Status=ERROR&BankReferenceNumber=&ErrorCode=00001&PGAuthCode=&FraudDecision=&CardType=";
                            }
                            
                            var result = JSON.parse(turlParameters);
                          
                            if(result.Status === "FAILURE"){
                                 widget.GetFlightData();
                            }
                         }
                          if (window.location.search.indexOf("orderId=") === -1){
                                widget.GetFlightData();
                          }
                    }
                })
                /*  widget.selectedDateString.isData = true;
                  widget.flightNumberValue.isData = true;
                    self.selectedDateString.extend({ required: { params: true, message: CCi18n.t('ns.common:resources.firstNameRequired')}});
                  widget.selectedDateString.extend({ required: { params: true, message: CCi18n.t("Error")}});
                 widget.flightNumberValue.extend({ required: { params: true, message: "Error dsffsdsdfsdf"}}); */
                var self = widget;


                /* self.raffleTicketValue(widget); */
                self.selectedFlightNo.subscribe(function(data) {
                    data && self.flightNumberValue(data.FLIGHT_NO);
                    var airline = data && data.AIRLINE_CODE;
                    widget.airlineUrl('/file/general/airline-logo-' + airline + '.png');
                    storageApi.getInstance().setItem("userFlightDetails", JSON.stringify(data));
                });
                self.flightNumberValue.subscribe(function(data) {
                    if(data.length < 5){
                        self.selectedFlightNo("");
                    }
                    self.filteredflightData([]);
                    $("#CC-flightNo-error").css("cssText", "display: none;");
                 
                    var radioBtnSelected = $("#departure").is(":checked") ? 'D' : $("#arrival").is(":checked") ? 'A' : '';
                    if (radioBtnSelected == 'D') {
                        self.isDeparture(true);
                        self.isArrival(false);
                    }
                    if (radioBtnSelected == 'A') {
                        self.isArrival(true);
                        self.isDeparture(false);
                    }

                    if ((!widget.selectedFlightNo()) && widget.flightType() && widget.flightType() === 'Departure' && self.flightNumberValue() && self.selectedDate()) {
                        self.filteredflightData(self.flightData().filter(function(item) {
                            return item.FLIGHT_TYPE === radioBtnSelected && item.FLIGHT_DATE === self.selectedDate() && (item.FLIGHT_NO).toUpperCase().search(self.flightNumberValue().toUpperCase()) > -1
                        }));
                    } else if ((!widget.selectedFlightNo()) && widget.flightType() && widget.flightType() == 'Arrival' && self.flightNumberValue() && self.selectedDate()) {
                        self.filteredflightData(self.flightData().filter(function(item) {
                            return item.FLIGHT_TYPE === radioBtnSelected && item.FLIGHT_DATE === self.selectedDate() && (item.FLIGHT_NO).toUpperCase().search(self.flightNumberValue().toUpperCase()) > -1
                        }));
                    } else {
                        self.filteredflightData([]);
                    }
                });
                
                // conconse site
                self.flightNumber.subscribe(function(value){
                   
                    if(widget.selectedFlightNumber().FLIGHT_NO && widget.selectedFlightNumber().FLIGHT_NO.toUpperCase() !== value.toUpperCase()){
                        widget.selectedFlightNumber({});
                    }
                    widget.filteredAvailableFlightOnTheDay(widget.availableFlightOnTheDay().filter(function(flight){
                       return flight.Flight_Content.indexOf(value.toUpperCase())>-1;
                    }));
                });
            },
            beforeAppear: function() {
                var self = this;

                self.order().shippingAddress().isDefaultBillingAddress(false);
               
                if(self.site().siteInfo.id === "200001"){
                    self.getTodaysFlightDetails();
                    self.beacconID('');
                    self.userTitle('');
                    self.firstName('');
                    self.lastName('');
                    self.emailAddress('');
                    self.flightNumber('');
                    self.selectedFlightNumber({});
                    self.filteredAvailableFlightOnTheDay([]);
                    self.concourseTermAndCondition(false);
                    // self.countryPhoneCode('');
                    self.phoneNumber('');
                    self.selectedCountryPhoneCode('');
                }else{
                self.isNIPaymentRedirected(false);
                self.isDisable(true);
                if (window.location.search.indexOf("ErrorCode=00000") === -1) {
                    self.flightType("");
                    self.selectedDateString("");
                    self.selectedFlightNo("");
                    self.flightNumberValue("");
                }
                $("body").off("click", "#accordionTabs-re200011 .panel.panel-default:nth-child(2) a");
                $("body").on("click", "#accordionTabs-re200011 .panel.panel-default:nth-child(2) a", function() {
                    return self._nextStepPayment.bind(self)("firstStepComplete");
                })
              
                self.user().dynamicProperties().forEach(function(properties) {
                    if (properties.id === "_phoneNumber" && properties.value) {
                         self.phoneNumberValue(properties.value);
                    }
                    if (properties.id === "_phoneCode" && properties.value) {
                        self.phoneCodeValue(properties.value);
                    }
                })
                  

                /*
                 Read checkout query string 
                */

                var queries = {};
                $.each(document.location.search.substr(1).split('&'), function(c, q) {
                    if (q) {
                        var i = q.split('=');
                        if (i.length > 0) {
                            queries[i[0].toString()] = i[1].toString();
                        }
                    }
                });


                if (self.order().shippingAddress() && window.location.search.indexOf("orderId=") > -1) {
                   if (window.location.search.indexOf("Status=SUCCESS") > -1){ 
                        self.isNIPaymentRedirected(true);
                        
                   }else{
                       self.isDisable(false);
                   }
                    var shippingAddress = storageApi.getInstance().getItem("shippingAddress");
                    if (shippingAddress) {
                        shippingAddress = JSON.parse(shippingAddress);
                        var address1 = shippingAddress.address1.split('#')[0];
                        var address2 = shippingAddress.address2.split('#')[0];
                        var address3 = shippingAddress.address3.split('#')[0];
                        var airline_Name = shippingAddress.jobTitle;
                        var flighttime = shippingAddress.companyName;
                        var terminal = shippingAddress.phoneNumber;
                        var userFlightDetails = storageApi.getInstance().getItem("userFlightDetails");
                        self.flightType(address1);
                        self.selectedDateString(address2);
                        if (window.location.search.indexOf("Status=SUCCESS") > -1){ 
                             self.flightNumberValue(address3 + " " + flighttime + " " +airline_Name + " " + terminal);
                        }else{
                            self.flightNumberValue(address3)
                        }
                        if (userFlightDetails) {
                            self.selectedFlightNo(JSON.parse(userFlightDetails));
                        }
                        self.order().shippingAddress().jobTitle(shippingAddress.jobTitle);
                        self.order().shippingAddress().firstName(shippingAddress.firstName);
                        self.order().shippingAddress().lastName(shippingAddress.lastName);
                        self.order().shippingAddress().address1(shippingAddress.address1);
                        self.order().shippingAddress().address2(shippingAddress.address2);
                        self.order().shippingAddress().address3(shippingAddress.address3);
                        self.order().shippingAddress().city(shippingAddress.city);
                        self.order().shippingAddress().selectedCountry(shippingAddress.selectedCountry);
                        self.order().shippingAddress().selectedState(shippingAddress.selectedState);
                        self.order().shippingAddress().postalCode(shippingAddress.postalCode);
                        self.order().shippingAddress().phoneNumber(shippingAddress.phoneNumber);
                        self.order().shippingAddress().companyName(shippingAddress.companyName);
                        // self.cart().dynamicProperties()[2].value(self.dateOfFlight(address2));
                        if (window.location.search.indexOf("Status=SUCCESS") > -1){ 
                        $("#accordionTabs-re200011 .panel.panel-default:nth-child(1) a")[0].click();
                        $("#accordionTabs-re200011 .panel.panel-default:nth-child(2) a", function() {
                            return self.validateUserFlightDetails(self);
                        })
                   }
                       
                    }
                }
                }
                

               if (showErrorMessage.length >0){
                setTimeout(function(){
                     notifier.sendError(self.widgetId , showErrorMessage );
                   showErrorMessage = '';
                },3000);
                  
               }
               
            },
	 };
    }
);
