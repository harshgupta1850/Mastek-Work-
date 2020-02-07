/**
 * @fileoverview extendcustomerProfile_v5.js.
 *
 * @author 
 */
define(
    //---------------------
    // DEPENDENCIESg
    //---------------------
    ['spinner','knockout', 'viewModels/productListingViewModelFactory', 'CCi18n',
        'ccConstants', 'ccRestClient', 'notifier', 'pubsub', 'pageLayout/product', 'storageApi',
        'ccResourceLoader!global/productCompareSharedViewModel'],

    //-----------------------
    // MODULE DEFINITION
    //-----------------------


    function (spinner,ko, ProductListingViewModelFactory, CCi18n, CCConstants, ccRestClient, notifier, pubsub, Product, storageApi, productCompareSharedViewModel) {
        var currentDate = new Date();
        "use strict";
        var appliedPromosOnOrder = {};
        var getDDFTicketsInformationCalled = false;
        var getOrdersCalled = false;
        var ddfTicketsSummary = '.ddf-ticket-table';
        var LOADING_TICKET = "LOADING";
        var ddfTicketsSummarySection = {
            parent: '.ddf-ticket-table',
            selector: '.ddf-ticket-table'
        };
        var userPreOrder ="#userPreOrder";
        var userPreOrderSummarySection = {
            parent: '#userPreOrder',
            selector: '#userPreOrder'
        };
         var ticketCounts = "#ticketCounts";
        var ticketCountsSection = {
            parent: '#ticketCounts',
            selector: '#ticketCounts'
        };
        return {
            allAvailablePromotions:ko.observableArray(),
            isMobile: ko.observable(false),
            isEditable: ko.observable(false),
            isChangingPassword: ko.observable(false),
            countriesList: ko.observableArray(),
            phoneCodesList: ko.observableArray(),
            internationalIdentityType:ko.observableArray(["PASSPORT NUMBER","EMIRATES ID"]),
            selectedIdentityType:ko.observable(),
            travelDetailsVisible: ko.observable(''),

            orderList: ko.observableArray(),
            previousOrderList: ko.observableArray(),
            previousOrderDetails: ko.observableArray(),
            productType: ko.observableArray(),
            orderView: ko.observable(),
            raffleProducts: ko.observableArray(),  //neha D
            nonRaffleProducts:ko.observableArray(),
            productPrice: ko.observable(0), 
            ticketPrice: ko.observable(0),
            subTotal: ko.observable(0),
            VATTotalForPreOrder: ko.observable(0),
            VATTotalRaffleTickets: ko.observable(0),
            PreOrderDiscount: ko.observable(0),
            ddfTickets: ko.observable([]),
            totalTickets: ko.observable({car: ko.observable(), bike: ko.observable(), mm: ko.observable()}),
            ticketDetails: ko.observable([]),
            ddfTicketsInfoArray:ko.observableArray(),
            
            oneTimePasswordfieldone: ko.observable(''),
            oneTimePasswordfieldtwo: ko.observable(''),
            oneTimePasswordfieldthree: ko.observable(''),
            oneTimePasswordfieldfour: ko.observable(''),
            phoneNumberEntered: ko.observable(''),
            phoneCodeEntered: ko.observable({}),
            //   oneTimePasswordValue: ko.observable(''),
            // selectedCountry:    ko.observable(''),
            selectedPhoneCode: ko.observable(''),
            selectedPhoneCodeToDisplay: ko.observable('+91'),
            // defaultPhoneNumber: ko.observable(''),
            selectedCountryValue: ko.observable(),
            oldPassword: ko.observable(''),
            newPassword: ko.observable(''),
            confirmPassword: ko.observable(''),
            passportNumber: ko.observable(''),
            // firstNameValid: ko.observable(true),
            // lastNameValid: ko.observable(true),
            passportNumberValue: ko.observable(''),
            dateOfBirthValue: ko.observable(''),
            phoneNumberValue: ko.observable(''),
            oneTimePasswordFormed: ko.observable(''),
            // phoneNumberValueFocused: ko.observable(''),
            phoneCodeValue: ko.observable(''),
            validation: ko.observable(false),
            splittedHeader: ko.observableArray(),
            splittedBody: ko.observableArray(),
            // verifiedMobile: ko.observable(false),
            mobileOtpVerified: ko.observable(true),
            passwordflag:ko.observable(false),
            passportEditValue: ko.observable(''),
            emiratesEditValue: ko.observable(''),
            printConfirmationPage:function(id){
                  var divToPrint=document.getElementById('DivIdToPrint');
                  var newWin=window.open('','Print-Window');
                  newWin.document.open();
                  newWin.document.write($('#'+id).html());
                  newWin.print();
                //   newWin.document.close();
                  
            },
              checkResponsiveFeatures: function(viewportWidth, widget) {
                if (viewportWidth > 978) {
                    this.isMobile(false);
                } else if (viewportWidth <= 978) {
                    this.isMobile(true);
                }
            },
            destroySpinner: function(parent) {
                var widget = this;
                $(parent).removeClass('loadingIndicator');
                spinner.destroyWithoutDelay($(parent));
            },
            createSpinner: function(parent,child) {
                var widget = this;
                $(parent).css('position', 'relative');
                child.loadingText = widget.translate(
                    'fetchingData', {
                        defaultValue: LOADING_TICKET
                    });
                spinner.create(child);
            },
            
            getValueOfOrderFulfillment: function(val){
                 if(val !== null){
                    var self = this;
                    var ___actualData = [];
                    val.split("Trnsctd.^")[1].split('^').forEach(function(_data){
                    	if(_data){
                    	var displayName = "";
                    	var _str = _data.split(" ");
                    	_str = _str.filter(function(item){return item!==""});
                    	var _obj = {productId:'',displayName:'',quantity:'',fulFilled:''};
                    	 _str.forEach(function(item, index){	
                    			if(index === 0){
                    				_obj.productId = item;
                    			} else if(index!==0 && index!==_str.length-1 && index!== _str.length-2){
                    				_obj.displayName = _obj.displayName + ' ' + item;
                    			} else if(index ===_str.length-1){
                    				_obj.quantity = item;
                    			}else{
                    				_obj.fulFilled = item;
                    			}
                    		});
                    		___actualData.push(_obj);   
                        }
                    })
                    self.splittedBody(___actualData)
                 }
            },
            
            getProductTotalPrice:function(productId){
                var widget = this;
                var locallyAppliedPromotions = widget.allAvailablePromotions();
                console.log(widget.allAvailablePromotions())
                // if(dynamicProperties.length){
                //     for(var i=0;i<dynamicProperties.length;i++){
                //         if(dynamicProperties[i].id === "_PromoInfo"){
                //             if(dynamicProperties[i].value.indexOf('"{')>-1){
                //               locallyAppliedPromotions = JSON.parse(JSON.parse(dynamicProperties[i].value));
                //             }else{
                //                 locallyAppliedPromotions = JSON.parse(dynamicProperties[i].value);
                //             }
                //         }
                //     }
                // }
                // locallyAppliedPromotions = locallyAppliedPromotions.cart ? locallyAppliedPromotions.cart.items : [];
                var itemTotalPrice = 0;
                var quantity=0;
                if(locallyAppliedPromotions){
                    
                    if(locallyAppliedPromotions.length){
                        for(var i=0; i < locallyAppliedPromotions.length ; i++){
                            if(locallyAppliedPromotions[i].itemCode === productId){
                                itemTotalPrice = locallyAppliedPromotions[i].unitListPrice;
                                quantity = locallyAppliedPromotions[i].quantity;
                                if(locallyAppliedPromotions[i].discounts.length){
                                    for(var j=0; j < locallyAppliedPromotions[i].discounts.length ; j++){
                                        var discount = locallyAppliedPromotions[i].discounts[j];
                                        if(discount.discountType !== 'SPECIAL_DISCOUNT'){
                                            itemTotalPrice = itemTotalPrice - (discount.extendedDiscountAmount/locallyAppliedPromotions[i].quantity);
                                        }
                                    }
                                //   itemTotalPrice = itemTotalPrice + (locallyAppliedPromotions[i].VATAmount/locallyAppliedPromotions[i].quantity);
                                }else{
                                    // itemTotalPrice = itemTotalPrice + (locallyAppliedPromotions[i].VATAmount/locallyAppliedPromotions[i].quantity);
                                }
                             break;
                            }
                        }
                    }
                }
                return itemTotalPrice * quantity;
            },
            getItemUnitPrice:function(dynamicProperties,productId){
                var locallyAppliedPromotions = {};
                if(dynamicProperties.length){
                    for(var i=0;i<dynamicProperties.length;i++){
                        if(dynamicProperties[i].id === "_PromoInfo"){
                            if(dynamicProperties[i].value.indexOf('"{')>-1){
                               locallyAppliedPromotions = JSON.parse(JSON.parse(dynamicProperties[i].value));
                            }else{
                                locallyAppliedPromotions = JSON.parse(dynamicProperties[i].value);
                            }
                        }
                    }
                }
                locallyAppliedPromotions = locallyAppliedPromotions.cart ? locallyAppliedPromotions.cart.items : [];
                var itemPrice = 0;
                if(locallyAppliedPromotions){
                    if(locallyAppliedPromotions.length){
                        for(var i=0; i < locallyAppliedPromotions.length ; i++){
                            if(locallyAppliedPromotions[i].itemCode === productId){
                                itemPrice = locallyAppliedPromotions[i].unitListPrice;
                                if(locallyAppliedPromotions[i].discounts.length){
                                    for(var j=0; j < locallyAppliedPromotions[i].discounts.length ; j++){
                                        var discount = locallyAppliedPromotions[i].discounts[j];
                                        if(discount.discountType !== 'SPECIAL_DISCOUNT'){
                                            itemPrice = itemPrice - (discount.extendedDiscountAmount/locallyAppliedPromotions[i].quantity);
                                        }
                                    }
                                    // itemPrice = itemPrice + (locallyAppliedPromotions[i].VATAmount/locallyAppliedPromotions[i].quantity);
                                }else{
                                    // itemPrice = itemPrice + (locallyAppliedPromotions[i].VATAmount/locallyAppliedPromotions[i].quantity);
                                }
                             break;
                            }
                        }
                    }
                }
            return itemPrice;
        },
        
              downloadPDF:function(data){
                var self=this;
                var pdfData={};
                pdfData.orderId = data.ORDER_ID;
                pdfData.ticketId = data.TICKET_NAME;
                if((data.TYPE).toLowerCase() === ('Car').toLowerCase()){
                    pdfData.typeOfTicket ='Car';
                    pdfData.carImage=data.largeImageURLs[0].split('&')[0];
                   
                }
                if((data.TYPE).toLowerCase() === ('MM').toLowerCase()){
                    pdfData.typeOfTicket ='MM';
                    pdfData.carImage="/file/general/general/money-back-pdf.png";
                }
                if((data.TYPE).toLowerCase() === ('Bike').toLowerCase()){
                    pdfData.typeOfTicket ='Bike';
                    pdfData.carImage=data.largeImageURLs[0].split('&')[0];
                   
                }
                pdfData.serialNumber=data.TICKET_NAME.split(' ')[0];
                pdfData.ticketNumber=data.TICKET_NAME.split(' ')[1];
                pdfData.carFullName=data.DISPLAY_NAME;
                pdfData.userName=self.user().firstName() + " " +self.user().lastName();
                pdfData.telephoneNumber=self.user().dynamicProperties()[0].value() + self.user().dynamicProperties()[1].value();
                pdfData.emailId=self.user().email();
                pdfData.nationality=self.user().dynamicProperties()[3].value();
                var orderDate = data.BLOCKED_DATE.split('T')[0];
                var newOrderDate = orderDate.split('-');
                var actualDate = newOrderDate[2] + '-' + newOrderDate[1] + '-' + newOrderDate[0];
                pdfData.date = actualDate;
                if(self.user().dynamicProperties()[5].value()){
                        pdfData.passportNumber=self.user().dynamicProperties()[5].value();
                        pdfData.labelForPassportOrEmiratesId="PassportNo"
                }
                if(self.user().dynamicProperties()[11].value()){
                        pdfData.passportNumber=self.user().dynamicProperties()[11].value();
                        pdfData.labelForPassportOrEmiratesId="EmiratesId"
                }
                pdfData.currency="AED";
                pdfData.price = data.LIST_PRICE;
                var encodedData=encodeURI(JSON.stringify(pdfData));
                var URL = "/ccstorex/custom/v1/generatePDF?details=" +encodedData
                 $.ajax({
                    url: URL,
                    success: function(result) {
                        window.open(URL);
                    }
                });
                
            },
            downloadTickets:function(data,orderDate,orderId){
                var self=this;
                var pdfData={};
                var image='';
                var newImage=''
                pdfData.orderId = orderId;
                pdfData.ticketId = data.skuProperties[1].value;
                if(data.productId.toLowerCase().indexOf('Car'.toLowerCase()) > -1){
                    pdfData.typeOfTicket ='Car';
                    image = data.primaryThumbImageURL.split('&');
                    newImage = image[0];
                     pdfData.carImage=newImage;
                }
                if(data.productId.toLowerCase().indexOf('MM'.toLowerCase()) > -1){
                    pdfData.typeOfTicket ='MM';
                    pdfData.carImage="/file/general/general/money-back-pdf.png";
                }
                if(data.productId.toLowerCase().indexOf('Bike'.toLowerCase()) > -1){
                    pdfData.typeOfTicket ='Bike';
                    image = data.primaryThumbImageURL.split('&');
                    newImage = image[0];
                    pdfData.carImage=newImage;
                }
                pdfData.serialNumber=data.skuProperties[1].value.split(' ')[0];
                pdfData.ticketNumber=data.skuProperties[1].value.split(' ')[1];
                pdfData.carFullName=data.displayName;
                pdfData.userName=self.user().firstName() + " " +self.user().lastName();
                pdfData.telephoneNumber=self.user().dynamicProperties()[0].value() + self.user().dynamicProperties()[1].value();
                pdfData.emailId=self.user().email();
                pdfData.nationality=self.user().dynamicProperties()[3].value();
                var creationDate = orderDate.split('T')[0];
                var newOrderDate = creationDate.split('-');
                var actualDate = newOrderDate[2] + '-' + newOrderDate[1] + '-' + newOrderDate[0];
                pdfData.date = actualDate;
                if(self.user().dynamicProperties()[5].value()){
                        pdfData.passportNumber=self.user().dynamicProperties()[5].value();
                        pdfData.labelForPassportOrEmiratesId="PassportNo"
                }
                if(self.user().dynamicProperties()[11].value()){
                        pdfData.passportNumber=self.user().dynamicProperties()[11].value();
                        pdfData.labelForPassportOrEmiratesId="EmiratesId"
                }
                pdfData.currency="AED";
                pdfData.price = data.listPrice;
                var encodedData=encodeURI(JSON.stringify(pdfData));
                var URL = "/ccstorex/custom/v1/generatePDF?details=" +encodedData
                 $.ajax({
                    url: URL,
                    success: function(result) {
                        window.open(URL);
                    }
                });
                  
            },
            
            initResource: function(){
                var self = this;
                self.getPhoneCodes();
                self.getCountries();
                self.onProfileRender();
            },
            getSelectedCountryCode: function () {
                var widget = this;
                var selectedCountryCode = {};
                for(var i = 0; i < widget.phoneCodesList().length ; i++){
                    if(widget.phoneCodesList()[i].Number_Prefix === widget.phoneCodeValue()){
                        selectedCountryCode = widget.phoneCodesList()[i];
                        break;
                    }
                }
               widget.phoneCodeEntered(selectedCountryCode);
            },
            beforeAppear:function(){
                getDDFTicketsInformationCalled = false;
                getOrdersCalled = false;
            },
            onProfileRender: function () {
                this.isEditable(false);
                var activeIndex = storageApi.getInstance().getItem("activeProfileTab");
                if(activeIndex){
                    $("#tabNormalViewport .nav.nav-tabs li a")[+activeIndex].click();
                    if(activeIndex === '4' && storageApi.getInstance().getItem('isProfileEditable') === '1') { 
                        this.editProfile(this);
                    } else { storageApi.getInstance().setItem('isProfileEditable', 0); }
                    
                }
                
            },
            onLoad: function (widget) {
                var self = widget;
                self.checkResponsiveFeatures($(window).width(), self);
                $("#tabNormalViewport .nav.nav-tabs li a").on("click",function(event){
                    widget.isEditable(false);
                    var index = $( "#tabNormalViewport .nav.nav-tabs li a" ).index( event.target );
                	if(index!==-1){
                    	 storageApi.getInstance().setItem("activeProfileTab", index);
                    	 $("#tabNormalViewport .nav.nav-tabs li a")[+index].click();
                	}else{
                	    index = $( "#tabNormalViewport .nav.nav-tabs li a" ).index(event.target.parentElement);
                	    storageApi.getInstance().setItem("activeProfileTab", index);
                    	$("#tabNormalViewport .nav.nav-tabs li a")[+index].click();
                    	
                	}
                	if(index != 4) storageApi.getInstance().setItem("isProfileEditable", "0");
                	if (storageApi.getInstance().getItem('isProfileEditable') === '1' && index == 4) widget.editProfile(widget);
                });
                if ($('#tabNormalViewport .col-xs-12')) {
                    $('#tabNormalViewport .col-xs-12').removeClass('col-sm-3');
                    $('#tabNormalViewport .col-xs-12').addClass('col-sm-12')
                }
                if ($('#tabNormalViewport .col-xs-12')[1]) {
                    $('#tabNormalViewport .col-xs-12').removeClass('col-sm-9');
                    $('#tabNormalViewport .col-xs-12').addClass('col-sm-12')
                }
                widget.selectedIdentityType.subscribe(function (data) {
                    widget.resetInternationalIdentityErrorAndValue(data);
                })

                widget.oldPassword.subscribe(function (data) {
                    widget.oldPassword(data);
                })

                widget.newPassword.subscribe(function (data) {
                    widget.newPassword(data);
                })

                widget.confirmPassword.subscribe(function (data) {
                    widget.confirmPassword(data);
                })
                productCompareSharedViewModel.currentProfileRaffleTickets.subscribe(function(data){
                    if(data){
                        self.ddfTicketsInfoArray(data);
                    }
                })
                productCompareSharedViewModel.currentProfileOrder.subscribe(function(data){
                    if(data.items){
                        self.orderList(data.items);
                    }
                })
            },
            
            changePasswordBlur:function(widget,data,event){
              var passw=  /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/g;
              if(event.currentTarget.value.length >5 ){
                  if(event.currentTarget.value.match(passw)){
                  event.currentTarget.nextElementSibling.style.display= "none"
                  widget.passwordflag(true);
              }else{
                  event.currentTarget.nextElementSibling.style.display= "block"
                   widget.passwordflag(false);
              }
              }else{
                 event.currentTarget.nextElementSibling.style.display= "block"
                  widget.passwordflag(false);
              }
            },
            
            onkeypressEmiratesId: function(widget, event) {
                var currentVal = event.target.value || ''
                if(currentVal.length === 3 || currentVal.length === 8 || currentVal.length === 16) event.target.value = currentVal + '-'
                $("#CC-userRegistration-passportno-error").css("cssText", "display: none;");
            },
            
            resendOtp:function(data,event){
                 var errorText = document.getElementById('cc-messages-mobileverification-error');
                if(errorText.style.display === 'block'){
                    errorText.style.display ='none';
                }
                 var otpText=document.getElementById('partitioned').value;
                if(otpText){
                    document.getElementById('partitioned').value='';
                }
                var self = this;
                 var oneTimePassword;
                 oneTimePassword= Math.floor(1000 + Math.random() * 9000);
                 self.oneTimePasswordFormed(oneTimePassword);
                for (var i = 0; i < self.user().dynamicProperties().length; i++) {
                    if (self.user().dynamicProperties()[i].id() === '_mobileOTP') {
                        self.user().dynamicProperties()[i].value(oneTimePassword);
                    }
                }

                var otpData = {
                    "to": self.phoneCodeEntered().Number_Prefix + self.phoneNumberEntered(),
                    "text": "Your one time password for mobile number verification is " + oneTimePassword
                }

                $.ajax({
                    url: "/ccstorex/custom/v1/sendmobileotp",
                    type: 'POST',
                    data: otpData,
                    success: function(result) {
                    //notifier.sendSuccess(self.WIDGET_ID, 'We have sent you a OTP again.', true);  //neha D edit
                    document.getElementById('resendMsg').style.display='block';
                    }
                });
                
            },
            
            nationalityValidation: function (widget) {
                var id = document.getElementById("CC-userRegistration-nationality");
                
                if (!widget.selectedCountryValue()) {
                    $('#CC-userRegistration-nationality-error').text("Nationality is mandatory");
                    $("#CC-userRegistration-nationality-error").css("cssText", "display: block;");
                    return false;
                } else {
                    $("#CC-userRegistration-nationality-error").css("cssText", "display: none;");
                    return true;
                }
            },

            passportNumberValidation: function () {
                const passportRegex = /^[A-Za-z0-9]{4,10}$/;
                const regex = new RegExp(passportRegex);
                this.validation(regex.test(this.passportNumberValue()));
                if (this.validation() === false) {
                    $('#CC-userRegistration-passportno-error').text("Enter valid Passport Number");
                    $("#CC-userRegistration-passportno-error").css("cssText", "display: block;");
                    return false;
                } else {
                    $("#CC-userRegistration-passportno-error").css("cssText", "display: none;");
                    return true;
                }
            },

            cancelUpdatePassword: function (widget) {
                widget.oldPassword('');
                widget.newPassword('');
                widget.confirmPassword('');
                widget.isChangingPassword(false);
            },

            updatePassword: function (widget) {
                var oldPasswordValid = false;
                var newPasswordValid = false;
                var confPasswordValid = false;
                if (widget.oldPassword() === '') {
                    $('#CC-userRegistration-oldPassword-error').text("old Password is required");
                    $("#CC-userRegistration-oldPassword-error").css("cssText", "display: block;");
                } else {
                    $("#CC-userRegistration-oldPassword-error").css("cssText", "display: none;");
                    oldPasswordValid = true;
                    widget.user().oldPassword(widget.oldPassword());
                }
                if (widget.newPassword() === '') {
                    $('#CC-userRegistration-newPassword-error').text("new Password is required");
                    $("#CC-userRegistration-newPassword-error").css("cssText", "display: block; position: relative;left: 14px;top: 10px;");
                } else if(!this.passwordflag()){
                    newPasswordValid = false;
                }else {
                    $("#CC-userRegistration-newPassword-error").css("cssText", "display: none;");
                    newPasswordValid = true;
                    widget.user().newPassword(widget.newPassword());
                }
                
                if (widget.confirmPassword() === '') {
                    $('#CC-userRegistration-confPassword-error').text("Confirm Password is required");
                    $("#CC-userRegistration-confPassword-error").css("cssText", "display: block;position: relative;left: 14px;top: 10px;");
                } else if (widget.newPassword() !== widget.confirmPassword()) {
                    $('#CC-userRegistration-confPassword-error').text("Confirm Password doesn't match New Password");
                    $("#CC-userRegistration-confPassword-error").css("cssText", "display: block;position: relative;left: 14px;top: 10px;");
                } else {
                    $("#CC-userRegistration-confPassword-error").css("cssText", "display: none;");
                    confPasswordValid = true;
                    widget.user().confirmPassword(widget.confirmPassword());
                }
                if (oldPasswordValid && newPasswordValid && confPasswordValid) {
                    $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUBMIT).publishWith(widget.user(), [{ message: "success" }]);
                    $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_FAILURE).subscribe(function (data) {
                        $('#CC-userRegistration-oldPassword-error').text(data.message);
                        $("#CC-userRegistration-oldPassword-error").css("cssText", "display: block;");
                    });
                    $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUCCESSFUL).subscribe(function (data) {
                        $("#CC-userRegistration-oldPassword-error").css("cssText", "display: none;");
                        widget.cancelUpdatePassword(widget);
                    });
                }
            },

            handleChangePassword: function (widget) {
                widget.isChangingPassword(true);
            },
            setProfileEditable: function() {
                storageApi.getInstance().setItem("isProfileEditable", 1);
            },
            editProfile: function (widget) {
                widget.isEditable(true);
                // storageApi.getInstance().setItem("isProfileEditable", "0");
                for (var i = 0; i < widget.user().dynamicProperties().length; i++) {
                    if (widget.user().dynamicProperties()[i].id() == '_nationality') {
                        widget.countriesList().forEach(function(country){
                            if(country.displayName === widget.user().dynamicProperties()[i].value()){
                           
                                widget.selectedCountryValue(country);
                               
                            }
                        })
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_passportNumber' && widget.user().dynamicProperties()[i].value()) {
                        widget.passportEditValue(widget.user().dynamicProperties()[i].value());
                        widget.selectedIdentityType("PASSPORT NUMBER");
                    }
                    if(widget.user().dynamicProperties()[i].id() == "_emiratesId" && widget.user().dynamicProperties()[i].value()) {
                            widget.emiratesEditValue(widget.user().dynamicProperties()[i].value());
                            widget.selectedIdentityType("EMIRATES ID");
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_dateOfBirth') {
                        widget.dateOfBirthValue(widget.user().dynamicProperties()[i].value())
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_phoneNumber') {
                        widget.phoneNumberValue(widget.user().dynamicProperties()[i].value())
                        // widget.defaultPhoneNumber(widget.phoneNumberValue())
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_phoneCode') {
                        widget.phoneCodeValue(widget.user().dynamicProperties()[i].value())
                    }
                }
                widget.getSelectedCountryCode();
            },
            cancelEdit: function(widget) {
                widget.isEditable(false);
                widget.passportEditValue('');
                widget.emiratesEditValue('');
                // document.getElementById("mobileNumberEmpty").style.display = "none";  //neha d
                
            },
            getCountries: function () {
                var widget = this;
                if(!widget.countriesList().length){
                    $.ajax({
                        url: "/ccstoreui/v1/countries",
                        type: 'GET',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + widget.user().client().tokenSecret);
                        },
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'JSON',
                        success: function (data) {
                            widget.countriesList(data.items);
                        }
                    });
                }
            },

            redirectToOtherTab: function (widget, tabNumber, isProfileEditable) {
                var element = document.getElementById('verticalTabs-re200047-tab-' + tabNumber);
                // var element = document.getElementById('verticalTabs-re300426-tab-' + tabNumber);
                // widget.isEditable(true);
                if(isProfileEditable === 1) {
                    widget.setProfileEditable();
                    //setTimeout(function() { widget.editProfile(widget); }, 1000)
                }
                storageApi.getInstance().setItem("tabNumber", tabNumber);
                element.childNodes[1].click();
                
                // widget.editProfile(widget);
            },

            getPhoneCodes: function () {
                var widget = this;
                if(!widget.phoneCodesList().length){
                    $.ajax({
                        url: "/ccstorex/custom/v1/getcountryphonecode",
                        type: 'GET',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + widget.user().client().tokenSecret);
                        },
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'JSON',
                        success: function (data) {
                            widget.phoneCodesList(data.data);
                        }
                    });
                }
            },

            getOrders: function (limit, successCb, errorCB) {
               var widget = this;
                if(getOrdersCalled === false){
                    getOrdersCalled = true;
                    if(typeof successCb !== "function") {
                        successCb = function (result) {
                            productCompareSharedViewModel.currentProfileOrder(result);
                            widget.destroySpinner(userPreOrder);
                        };
                    }
                    if(typeof errorCB !== "function") {
                        errorCB = function (result) {
                            widget.destroySpinner(userPreOrder);
                        };
                    }
                    if(typeof limit !== "number") {
                        limit = 100;
                    }
                    widget.createSpinner(userPreOrder,userPreOrderSummarySection);
                     
                        $.ajax({
                            method: "GET",
                            headers: {
                                Authorization: "Bearer " + widget.user().client().tokenSecret
                            },
                            url: "/ccstoreui/v1/orders",
                            success: successCb,
                            error:errorCB
                        });
                }
            },
            getOldOrders: function() {
                var widget = this;
                console.log();
                $.post("/ccstorex/custom/v1/getOpenOrders", {"emailId" : widget.user().email() }, function (orders) {
                    if (orders.data && orders.data.length > 0) {
                        $('.slidedown-pane-row').hide();
                        $(".pre-order-table").show();
                        widget.previousOrderList(orders.data);
                    } else {
                        $('.pre-orders-error').show();
                    }
                });
            },
            getRaffleDetails: function (ORDER_ID) {
                if(!ORDER_ID) return;
                var widget = this;
                var pp = 0, tp = 0; VAT = 0; VATTotal = 0; preOrderDis =0;
                $.ajax({
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + widget.user().client().tokenSecret
                    },
                    url: "/ccstoreui/v1/orders/"+ORDER_ID,
                    success: function (result) {
                        $('#verticalTabs-re200047-content-2 .customer-profile-container, .raffle-list').hide();
                        $('.raffle-details').removeClass('hide');
                        widget.orderView(result);
                      
                        
                        widget.productPrice(0);
                        widget.ticketPrice(0);
                        widget.subTotal(0);
                        widget.VATTotalRaffleTickets(0);
                        widget.VATTotalForPreOrder(0);
                        widget.PreOrderDiscount(0);
                        
                        //VAT Calculation for pre-order items
                        if(widget.orderView().dynamicProperties[4].value.indexOf('"{') > -1 ){
                            var dValues = JSON.parse(JSON.parse(widget.orderView().dynamicProperties[4].value));
                            appliedPromosOnOrder = dValues;
                            if(dValues && dValues.cart && dValues.cart.items){
                            
                                widget.allAvailablePromotions(dValues.cart.items);
                            }
                           
                        
                            dValues.cart.items.forEach(function(item){
                            VATTotal += item.VATAmount;
                            widget.VATTotalForPreOrder(VATTotal);
                            var itemTotal = item.unitListPrice;
                                 
                            //Calculation for pre-order discount.
                            item.discounts && item.discounts.forEach(function(discount){
                                if(discount.discountType === "SPECIAL_DISCOUNT"){
                                    preOrderDis += discount.extendedDiscountAmount;
                                    widget.PreOrderDiscount(preOrderDis);
                                    } else{
                                        if(item.itemCode.indexOf('Car') === -1 && item.itemCode.indexOf('MM') === -1 && item.itemCode.indexOf('Bike') === -1){
                                            itemTotal = itemTotal - (discount.extendedDiscountAmount/discount.discountedQuantity);
                                        }
                                    }
                                });
                                    widget.productPrice(widget.productPrice() + (itemTotal * item.quantity));
                                });
                                } else {
                                    var dValues = JSON.parse(widget.orderView().dynamicProperties[4].value);
                                
                                    dValues.cart.items.forEach(function(item){
                                        var itemTotal = data.unitListPrice;
                                        VATTotal += item.VATAmount;
                                        widget.VATTotalForPreOrder(VATTotal);
                                            
                                        //Calculation for pre-order discount.
                                        item.discounts && item.discounts.forEach(function(discount){
                                            if(discount.discountType === "SPECIAL_DISCOUNT"){
                                                preOrderDis += discount.extendedDiscountAmount;
                                                widget.PreOrderDiscount(preOrderDis);
                                                } else{
                                                    if(item.itemCode.indexOf('Car') === -1 && item.itemCode.indexOf('MM') === -1 && item.itemCode.indexOf('Bike') === -1){
                                                        itemTotal = itemTotal - (discount.extendedDiscountAmount/discount.discountedQuantity);
                                                    }
                                                }
                                            });
                                                widget.productPrice(widget.productPrice() + (itemTotal * item.quantity));
                                        });
                                    }
                       
                                   //Calculation for PRE-ORDER total, DDF TICKETS total and tickets VAT
                                    widget.orderView().order.items.forEach(function(data){
                                    var productType = data.productId;
                                    if(productType.indexOf('Car') > -1 || productType.indexOf('Bike') > -1 || productType.indexOf('MM') > -1){
                                        VAT += data.amount - data.listPrice;
                                        widget.VATTotalRaffleTickets(VAT);
                                        tp += data.listPrice;
                                        widget.ticketPrice(tp);
                                        
                                    } else {
                                        pp += data.amount;
                                        // widget.productPrice(pp);
                                    }
                                })
                                    total = widget.productPrice() + widget.ticketPrice();
                                    widget.subTotal(total); 
                    }
                });
            },
            showRaffleList: function () {
              $('.raffle-details').addClass('hide')
              $('#verticalTabs-re200047-content-2 .customer-profile-container, .raffle-list').show();
            },
            
            getRaffleDetailsDashboard: function (ORDER_ID) {
                if(!ORDER_ID) return;
                var widget = this;
                var pp = 0, tp = 0; VAT = 0; VATTotal = 0; preOrderDis =0;
                $.ajax({
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + widget.user().client().tokenSecret
                    },
                    url: "/ccstoreui/v1/orders/"+ORDER_ID,
                    success: function (result) {
                        $('#verticalTabs-re200047-content-0 .customer-profile-container, .raffle-list-dashboard, .order-dashboard').hide();
                        $('.raffle-details-dashboard').removeClass('hide');
                        widget.orderView(result);
                    
                        
                        widget.productPrice(0);
                        widget.ticketPrice(0);
                        widget.subTotal(0);
                        widget.VATTotalRaffleTickets(0);
                        widget.VATTotalForPreOrder(0);
                        widget.PreOrderDiscount(0);
                        
                        //VAT Calculation for pre-order items
                        if(widget.orderView().dynamicProperties[4].value.indexOf('"{') > -1 ){
                            var dValues = JSON.parse(JSON.parse(widget.orderView().dynamicProperties[4].value));
                            appliedPromosOnOrder = dValues;
                            if(dValues && dValues.cart && dValues.cart.items){
                             
                                widget.allAvailablePromotions(dValues.cart.items);
                            }
                  
                        
                                dValues.cart.items.forEach(function(item){
                                VATTotal += item.VATAmount;
                                widget.VATTotalForPreOrder(VATTotal);
                                var itemTotal = item.unitListPrice;
                                 
                                //Calculation for pre-order discount.
                                item.discounts && item.discounts.forEach(function(discount){
                                    if(discount.discountType === "SPECIAL_DISCOUNT"){
                                        preOrderDis += discount.extendedDiscountAmount;
                                        widget.PreOrderDiscount(preOrderDis);
                                        // itemTotal = itemTotal - (data.extendedDiscountAmount/data.discountedQuantity);
                                    }else{
                                        if(item.itemCode.indexOf('Car') === -1 && item.itemCode.indexOf('MM') === -1 && item.itemCode.indexOf('Bike') === -1){
                                            itemTotal = itemTotal - (discount.extendedDiscountAmount/discount.discountedQuantity);
                                        }
                                    }
                            });
                                    widget.productPrice(widget.productPrice() + (itemTotal * item.quantity));
                                   
                                });
                                } else {
                                    var dValues = JSON.parse(widget.orderView().dynamicProperties[4].value);
                                
                                        dValues.cart.items.forEach(function(item){
                                            var itemTotal = data.unitListPrice;
                                            VATTotal += item.VATAmount;
                                            widget.VATTotalForPreOrder(VATTotal);
                                            
                                            //Calculation for pre-order discount.
                                            item.discounts && item.discounts.forEach(function(discount){
                                                if(discount.discountType === "SPECIAL_DISCOUNT"){
                                                    preOrderDis += discount.extendedDiscountAmount;
                                                    widget.PreOrderDiscount(preOrderDis);
                                                    // itemTotal = itemTotal - (data.extendedDiscountAmount/data.discountedQuantity);
                                                }else{
                                                    if(item.itemCode.indexOf('Car') === -1 && item.itemCode.indexOf('MM') === -1 && item.itemCode.indexOf('Bike') === -1){
                                                        itemTotal = itemTotal - (discount.extendedDiscountAmount/discount.discountedQuantity);
                                                    }
                                                }
                                            });
                                                widget.productPrice(widget.productPrice() + (itemTotal * item.quantity));
                                        });
                                    }
                       
                                   //Calculation for PRE-ORDER total, DDF TICKETS total and tickets VAT
                                    widget.orderView().order.items.forEach(function(data){
                                    var productType = data.productId;
                                    if(productType.indexOf('Car') > -1 || productType.indexOf('Bike') > -1 || productType.indexOf('MM') > -1){
                                        VAT += data.amount - data.listPrice;
                                        widget.VATTotalRaffleTickets(VAT);
                                        tp += data.listPrice;
                                        widget.ticketPrice(tp);
                                        
                                    } else {
                                        pp += data.amount;
                                        // widget.productPrice(pp);
                                    }
                                   
                                })
                                    total = widget.productPrice() + widget.ticketPrice();
                                    widget.subTotal(total);
                    }
                    
                });
            },
            showRaffleListDashboard: function () {
              $('.raffle-details-dashboard').addClass('hide')
              $('#verticalTabs-re200047-content-0 .customer-profile-container, .raffle-list-dashboard, .order-dashboard').show();
            },
            
            getOrderDetails: function (orderId) {
                if(!orderId) return;
                var widget = this;
                var pp = 0, tp = 0; VAT = 0; VATTotal = 0; preOrderDis =0;
                $.ajax({
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + widget.user().client().tokenSecret
                    },
                    url: "/ccstoreui/v1/orders/"+orderId,
                    success: function (result) {
                        $('#verticalTabs-re200047-content-1 .customer-profile-container, .order-list').hide();
                        $('.order-details').removeClass('hide');
                        widget.orderView(result);
                        
                        widget.productPrice(0);
                        widget.ticketPrice(0);
                        widget.subTotal(0);
                        widget.VATTotalRaffleTickets(0);
                        widget.VATTotalForPreOrder(0);
                        widget.PreOrderDiscount(0);
                        
                        //VAT Calculation for pre-order items
                        if(widget.orderView().dynamicProperties[4].value.indexOf('"{') > -1 ){
                            var dValues = JSON.parse(JSON.parse(widget.orderView().dynamicProperties[4].value));
                            if(dValues && dValues.cart && dValues.cart.items){
                                widget.allAvailablePromotions(dValues.cart.items);
                            }
                            appliedPromosOnOrder = dValues;
                        
                                dValues.cart.items.forEach(function(item){
                                VATTotal += item.VATAmount;
                                widget.VATTotalForPreOrder(VATTotal);
                                var itemTotal = item.unitListPrice;
                                 
                                //Calculation for pre-order discount.
                                item.discounts && item.discounts.forEach(function(discount){
                                    if(discount.discountType === "SPECIAL_DISCOUNT"){
                                        preOrderDis += discount.extendedDiscountAmount;
                                        widget.PreOrderDiscount(preOrderDis);
                                        // itemTotal = itemTotal - (data.extendedDiscountAmount/data.discountedQuantity);
                                    }else{
                                        if(item.itemCode.indexOf('Car') === -1 && item.itemCode.indexOf('MM') === -1 && item.itemCode.indexOf('Bike') === -1){
                                            itemTotal = itemTotal - (discount.extendedDiscountAmount/discount.discountedQuantity);
                                        }
                                    }
                            });
                                    widget.productPrice(widget.productPrice() + (itemTotal * item.quantity));
                                });
                                } else {
                                    var dValues = JSON.parse(widget.orderView().dynamicProperties[4].value);
                                     if(dValues && dValues.cart && dValues.cart.items){
                                        widget.allAvailablePromotions(dValues.cart.items);
                                        }
                                        dValues.cart.items.forEach(function(item){
                                            var itemTotal = data.unitListPrice;
                                            VATTotal += item.VATAmount;
                                            widget.VATTotalForPreOrder(VATTotal);
                                            
                                            //Calculation for pre-order discount.
                                            item.discounts && item.discounts.forEach(function(discount){
                                                if(discount.discountType === "SPECIAL_DISCOUNT"){
                                                    preOrderDis += discount.extendedDiscountAmount;
                                                    widget.PreOrderDiscount(preOrderDis);
                                                    // itemTotal = itemTotal - (data.extendedDiscountAmount/data.discountedQuantity);
                                                }else{
                                                    if(item.itemCode.indexOf('Car') === -1 && item.itemCode.indexOf('MM') === -1 && item.itemCode.indexOf('Bike') === -1){
                                                        itemTotal = itemTotal - (discount.extendedDiscountAmount/discount.discountedQuantity);
                                                    }
                                                }
                                            });
                                                widget.productPrice(widget.productPrice() + (itemTotal * item.quantity));
                                        });
                                    }
                       
                                   //Calculation for PRE-ORDER total, DDF TICKETS total and tickets VAT
                                    widget.orderView().order.items.forEach(function(data){
                                    var productType = data.productId;
                                    if(productType.indexOf('Car') > -1 || productType.indexOf('Bike') > -1 || productType.indexOf('MM') > -1){
                                        VAT += data.amount - data.listPrice;
                                        widget.VATTotalRaffleTickets(VAT);
                                        tp += data.listPrice;
                                        widget.ticketPrice(tp);
                                        
                                    } else {
                                        pp += data.amount;
                                        // widget.productPrice(pp);
                                    }
                                   
                                })
                                    total = widget.productPrice() + widget.ticketPrice();
                                    widget.subTotal(total);
                                }
                });
            },
            setPreviousOrderDetails: function(order, id) {
                this.previousOrderDetails(order);
                $('.slidedown-pane-row').hide();
                $('#slidedown-'+id).slideToggle(1000);
                return false;
            },
            showOrderList: function () {
              $('.order-details').addClass('hide')
              $('#verticalTabs-re200047-content-1 .customer-profile-container, .order-list').show();
            },
            
            getOrderDetailsForDashboard: function (orderId) {
                if(!orderId) return;
                var widget = this;
                var pp = 0, tp = 0; VAT = 0; VATTotal = 0; preOrderDis =0;
                $.ajax({
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + widget.user().client().tokenSecret
                    },
                    url: "/ccstoreui/v1/orders/"+orderId,
                    success: function (result) {
                        
                        $('#verticalTabs-re200047-content-0 .customer-profile-container, .order-dashboard, .raffle-list-dashboard, #wishlist-profile-header_v1_v1-wi400149').hide();
                        $('.order-details-dashboard').removeClass('hide');
                        widget.orderView(result);
                        
                        widget.productPrice(0);
                        widget.ticketPrice(0);
                        widget.subTotal(0);
                        widget.VATTotalRaffleTickets(0);
                        widget.VATTotalForPreOrder(0);
                        widget.PreOrderDiscount(0);
                        
                        //VAT Calculation for pre-order items
                        if(widget.orderView().dynamicProperties[4].value.indexOf('"{') > -1 ){
                            var dValues = JSON.parse(JSON.parse(widget.orderView().dynamicProperties[4].value));
                            if(dValues && dValues.cart && dValues.cart.items){
                                widget.allAvailablePromotions(dValues.cart.items);
                            }
                            appliedPromosOnOrder = dValues;
                        
                                dValues.cart.items.forEach(function(item){
                                VATTotal += item.VATAmount;
                                widget.VATTotalForPreOrder(VATTotal);
                                var itemTotal = item.unitListPrice;
                                 
                                //Calculation for pre-order discount.
                                item.discounts && item.discounts.forEach(function(discount){
                                    if(discount.discountType === "SPECIAL_DISCOUNT"){
                                        preOrderDis += discount.extendedDiscountAmount;
                                        widget.PreOrderDiscount(preOrderDis);
                                        // itemTotal = itemTotal - (data.extendedDiscountAmount/data.discountedQuantity);
                                    }else{
                                        if(item.itemCode.indexOf('Car') === -1 && item.itemCode.indexOf('MM') === -1 && item.itemCode.indexOf('Bike') === -1){
                                            itemTotal = itemTotal - (discount.extendedDiscountAmount/discount.discountedQuantity);
                                        }
                                    }
                            });
                                    widget.productPrice(widget.productPrice() + (itemTotal * item.quantity));
                                });
                                } else {
                                    var dValues = JSON.parse(widget.orderView().dynamicProperties[4].value);
                                
                                        dValues.cart.items.forEach(function(item){
                                            var itemTotal = data.unitListPrice;
                                            VATTotal += item.VATAmount;
                                            widget.VATTotalForPreOrder(VATTotal);
                                            
                                            //Calculation for pre-order discount.
                                            item.discounts && item.discounts.forEach(function(discount){
                                                if(discount.discountType === "SPECIAL_DISCOUNT"){
                                                    preOrderDis += discount.extendedDiscountAmount;
                                                    widget.PreOrderDiscount(preOrderDis);
                                                    // itemTotal = itemTotal - (data.extendedDiscountAmount/data.discountedQuantity);
                                                }else{
                                                    if(item.itemCode.indexOf('Car') === -1 && item.itemCode.indexOf('MM') === -1 && item.itemCode.indexOf('Bike') === -1){
                                                        itemTotal = itemTotal - (discount.extendedDiscountAmount/discount.discountedQuantity);
                                                    }
                                                }
                                            });
                                                widget.productPrice(widget.productPrice() + (itemTotal * item.quantity));
                                        });
                                    }
                       
                                   //Calculation for PRE-ORDER total, DDF TICKETS total and tickets VAT
                                    widget.orderView().order.items.forEach(function(data){
                                    var productType = data.productId;
                                    if(productType.indexOf('Car') > -1 || productType.indexOf('Bike') > -1 || productType.indexOf('MM') > -1){
                                        VAT += data.amount - data.listPrice;
                                        widget.VATTotalRaffleTickets(VAT);
                                        tp += data.listPrice;
                                        widget.ticketPrice(tp);
                                        
                                    } else {
                                        pp += data.amount;
                                        // widget.productPrice(pp);
                                    }
                                   
                                })
                                    total = widget.productPrice() + widget.ticketPrice();
                                    widget.subTotal(total);
                    }
                });
            },
            showOrderListForDashboard: function () {
              $('.order-details-dashboard').addClass('hide')
              $('#verticalTabs-re200047-content-0 .customer-profile-container, .order-dashboard, .raffle-list-dashboard, #wishlist-profile-header_v1_v1-wi400149').show();
            },
            _modifyTicketDetails:function(productIds, purcahsedTickets){
                var widget = this;
                var mmCounter = 0;
                var carCounter = 0;
                var bikeCounter = 0;
                 $.ajax({
                        url: "/ccstoreui/v1/products?productIds="+productIds+'&fields=items.id,items.largeImageURLs',
                        type:'GET',
                        headers: {
                            Authorization: "Bearer " + widget.user().client().tokenSecret
                        },
                        success: function(result){
                            if(result.items){
                                var newData = JSON.parse(JSON.stringify(purcahsedTickets))
                                newData.forEach(function(ticket,index){
                                    for(var i=0;i<result.items.length;i++){
                                        if(ticket.SRN === result.items[i].id){
                                            ticket['largeImageURLs'] = result.items[i].largeImageURLs;
                                        }
                                    }
                                })
                                purcahsedTickets = newData;
                                // var newResponse = JSON.parse(JSON.stringify(response))
                                // newResponse.data = newData;
                                productCompareSharedViewModel.currentProfileRaffleTickets(purcahsedTickets);
                                purcahsedTickets.forEach(function(ticket){
                                    if((ticket.TYPE).toLowerCase() === ('MM').toLowerCase()){
                                        mmCounter = mmCounter + 1;
                                    }else if((ticket.TYPE).toLowerCase() === ('CAR').toLowerCase()){
                                        carCounter = carCounter + 1 ;
                                    }else {
                                        bikeCounter = bikeCounter + 1;
                                    }
                                });
                                widget.totalTickets().bike(bikeCounter);
                                widget.totalTickets().car(carCounter);
                                widget.totalTickets().mm(mmCounter);
                                widget.destroySpinner(ticketCounts);
                                widget.destroySpinner(ddfTicketsSummary);
                            }
                        },
                        error:function(errorRes){
                            var error = errorRes.responseJSON;
                            var newProductIds = productIds;
                            if(error.errorCode === '00000000'){
                                for(var i=0;i<error.errors.length;i++){
                                    var err = error.errors[i];
                                    if(err.errorCode === '20031'){
                                        if(newProductIds.indexOf(','+err.moreInfo) === -1){
                                            newProductIds = newProductIds.replace(err.moreInfo,'');
                                        }else{
                                            newProductIds = newProductIds.replace(','+err.moreInfo,'');
                                        }
                                    }
                                }
                                /*DDF-466 starts here*/
                                if(newProductIds){
                                  widget._modifyTicketDetails(newProductIds,purcahsedTickets);
                                }
                            }
                        }
                    });
            },
            getDDFTicketsInformation:function(){
                var widget = this;
                widget.createSpinner(ddfTicketsSummary,ddfTicketsSummarySection);
                widget.createSpinner(ticketCounts,ticketCountsSection);
                if(getDDFTicketsInformationCalled === false){
                    getDDFTicketsInformationCalled = true;
                var widget = this;
                var data = {
                    "type" : "Purchased"
                };
                        data.profileId = widget.user().id() ;
                            var settings = {
                              "crossDomain": true,
                              "url": "ccstorex/custom/v1/profileBasedInformation",
                              "method": "POST",
                              "headers": {
                                 "Content-Type": "application/x-www-form-urlencoded",
                                "cache-control": "no-cache",
                              },
                              "data": data
                            }
                            
                            $.ajax(settings).done(function (response) {
                                var mmCounter = 0;
                                var carCounter = 0;
                                var bikeCounter = 0;
                                
                                var purcahsedTickets = response.data || [];
                                var productIds = '';
                                purcahsedTickets.forEach(function(ticket,index){
                                     /*DDF-466 starts here*/
                                    if(ticket){
                                        if(productIds.indexOf(ticket.SRN) === -1){
                                            productIds ? productIds = productIds + ',' + ticket.SRN : productIds = ticket.SRN;
                                        }
                                    }
                                    /*DDF-466 ends here*/
                                })
                                try {
                                     /*DDF-466 starts here*/
                                    if(productIds){
                                      widget._modifyTicketDetails(productIds,purcahsedTickets);
                                    }
                                     /*DDF-466 ends here*/
                                }
                                catch(err) {
                                   productCompareSharedViewModel.currentProfileRaffleTickets(purcahsedTickets);
                                    purcahsedTickets.forEach(function(ticket){
                                        if((ticket.TYPE).toLowerCase() === ('MM').toLowerCase()){
                                            mmCounter = mmCounter + 1;
                                        }else if((ticket.TYPE).toLowerCase() === ('CAR').toLowerCase()){
                                            carCounter = carCounter + 1 ;
                                        }else {
                                            bikeCounter = bikeCounter + 1;
                                        }
                                    });
                                    widget.totalTickets().bike(bikeCounter);
                                    widget.totalTickets().car(carCounter);
                                    widget.totalTickets().mm(mmCounter);
                                }
                              });
                }
                            },
            getOrdersAndTickets: function(limit) {
               
                this.getOrders(limit);
            },
            
            cancelOrder: function (orderId, cancelReason) {
                if(!orderId) return;
                var widget = this;
                // var cancelReason = "no reason";
                $.ajax({
                    method: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                      orderId: orderId,
                      cancelReason: cancelReason
                    }),
                    headers: {
                        Authorization: "Bearer " + widget.user().client().tokenSecret
                    },
                    url: "/ccstoreui/v1/orders/cancel",
                    success: function (result) {
                 
                        if(typeof result === 'object') {
                            notifier.clearSuccess(widget.WIDGET_ID);
                            notifier.clearError(widget.WIDGET_ID);
                            notifier.sendSuccess(widget.WIDGET_ID, 'Order has been canceled successfully', true);
                            widget.orderView(result.order);   
                        }
                    },
                    error: function(err) {
                       
                        if(typeof err === 'object' && err.responseJSON) {
                        
                            notifier.clearError(widget.WIDGET_ID);
                            notifier.clearSuccess(widget.WIDGET_ID);
                            notifier.sendError(widget.WIDGET_ID, err.responseJSON.message, true);
                        }
                    }
                });
            },
            formatDate: function (date) {
                if (date && date.indexOf('Z') > -1){
                    var year = date.split("T")[0].split("-")[0].substring(2, 4);
                    var month = +date.split("T")[0].split("-")[1];
                    var day = date.split("T")[0].split("-")[2];
                    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                    return day + " " + months[month - 1] + " " + year;
                } else if(date && date.indexOf('/') > -1){
                    var year = date.split("/")[2].substring(2, 4);
                    var month = +date.split("/")[1];
                    var day = date.split("/")[0];
                    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                    return day + " " + months[month - 1] + " " + year;
                }else{
                    return '';
                }
            },
             orderTimeOnConfirmation: function(time){
                    var self=this;
                if(time){
                    var T = new Date(time);
                    var orderHour = T.getHours();
                    var orderMinute = T.getMinutes();
                    return (orderHour + ':' + orderMinute + ' Hrs');
                }
            },
            // dateOfBirth: function(widget){
            //     var dob = document.getElementById("myDate").value;
            //     widget.dateOfBirthValue(dob);
            //     if(widget.dateOfBirthValue() !== ""){
            //         $("#CC-userRegistration-dateOfbirth-error").css("cssText", "display: none;");
            //     return true;
            //     }else{
            //         $('#CC-userRegistration-dateOfbirth-error').text("Enter valid Date of Birth");
            //         $("#CC-userRegistration-dateOfbirth-error").css("cssText", "display: block;");
            //     }
            // },

            // phoneNumberValidation: function(widget){
            //     widget.phoneCodeValue(widget.phoneCodeEntered())
            //     widget.phoneNumberValue(widget.phoneNumberEntered())
            // var codeSelected= document.getElementById("CC-userRegistration-phoneCode")
            // var codeIndex= codeSelected.selectedIndex - 1
            // // var phonenumber = document.getElementById("CC-userRegistration-phoneNumber").value
            // widget.phoneNumberValue(widget.phoneNumberEntered())
            // if(codeIndex > -1){
            //     widget.phoneCodeValue(widget.phoneCodesList()[codeIndex].Number_Prefix)
            // } else {
            //     if(phonenumber){
            //         widget.phoneCodeValue(widget.phoneCodeValue() || '971')
            //     }else{
            //         widget.phoneCodeValue('')
            //     }
            // }
            //     return true;
            // },

            saveChanges: function (widget) {
                // widget.openOTPModal(widget);
                 if(document.getElementById('partitioned')){
                    document.getElementById('partitioned').value='';
                }
                var errorText = document.getElementById('cc-messages-mobileverification-error');
                if(errorText.style.display === 'block'){
                    errorText.style.display ='none';
                }
                document.getElementById('resendMsg').style.display='none';
                widget.phoneNumberEntered(document.getElementById("CC-userRegistration-phoneNumber").value)
                var codeSelected = document.getElementById("CC-userRegistration-phoneCode")
                var codeIndex = codeSelected ? codeSelected.selectedIndex - 1 : -1
                // if (codeIndex > -1) {
                //     widget.phoneCodeEntered(widget.phoneCodesList()[codeIndex].Number_Prefix)
                // } else {
                //     if (widget.phoneNumberEntered() !== '') {
                //         widget.phoneCodeEntered(widget.phoneCodeValue() || '971')
                //     } else {
                //         widget.phoneCodeEntered('')
                //     }
                // }
                if ((widget.phoneNumberValue() !== widget.phoneNumberEntered() || widget.phoneCodeValue() !== widget.phoneCodeEntered().Number_Prefix) && widget.phoneNumberEntered() !== '') {
                    widget.openOTPModal(widget);
                } else if (widget.phoneNumberEntered() === ""){
                     //neha D
                    if(widget.phoneNumberEntered() === ""){
                    document.getElementById("mobileNumberEmpty").style.display = "block";
                }
                } else {
                    widget.updateProfile(widget)
                    document.getElementById("mobileNumberEmpty").style.display = "none";
                }
            },
            resetInternationalIdentityErrorAndValue:function(){
                 $("#CC-userRegistration-passportno-error").css("cssText", "display: none;");
            },
  /*validation for passport and Emirated Number*/
        passportNumberValidation: function(passportNumber) {
            
                const passportRegex = /^[A-Za-z0-9]{4,10}$/;
                const regex = new RegExp(passportRegex);
               
                if (!regex.test(passportNumber)) {
                    $('#CC-userRegistration-passportno-error').text("Enter valid Passport Number.");
                    $("#CC-userRegistration-passportno-error").css("cssText", "display: block;");
                    return false;
                } else {
                    $("#CC-userRegistration-passportno-error").css("cssText", "display: none;");
                    return true;
                }
           
        },
        emirateIdValidation: function(emiratesId){
           
                const emiratesIdRegex = /^784-[0-9]{4}-[0-9]{7}-[0-9]{1}$/;
                const regexEm = new RegExp(emiratesIdRegex);
              
                if (!regexEm.test(emiratesId)) {
                    $('#CC-userRegistration-passportno-error').text("Enter valid Emirates Id Number");
                    $("#CC-userRegistration-passportno-error").css("cssText", "display: block;");
                    return false;
                } else {
                    $("#CC-userRegistration-passportno-error").css("cssText", "display: none;");
                    return true;
                }
           
        },
            updateProfile: function (widget) {
                //   widget.phoneNumberValidation(widget);
                var isInternationalIdentityValid = false;
                widget.user().dynamicProperties().forEach(function(data){
                    if(data.id() === "_passportNumber" && widget.selectedIdentityType() === "PASSPORT NUMBER"){
                        isInternationalIdentityValid = widget.passportNumberValidation(widget.passportEditValue());
                        if (isInternationalIdentityValid) data.value(widget.passportEditValue());
                    }
                    if(widget.selectedIdentityType() === "EMIRATES ID" && data.id() == "_emiratesId"){
                        isInternationalIdentityValid = widget.emirateIdValidation(widget.emiratesEditValue());
                        if (isInternationalIdentityValid) data.value(widget.emiratesEditValue());
                    }
                })
                var isNationalityValid = widget.nationalityValidation(widget);
                widget.phoneCodeValue(widget.phoneCodeEntered().Number_Prefix)
                //   widget.phoneNumberValue(widget.phoneNumberEntered());
                widget.phoneNumberValue(document.getElementById("CC-userRegistration-phoneNumber").value);
                //   var isPhoneNumberValid = widget.phoneNumberValidation(widget);
                //   var isDobValid = widget.dateOfBirth(widget);

                for (var i = 0; i < widget.user().dynamicProperties().length; i++) {
                    if (widget.user().dynamicProperties()[i].id() == '_nationality' && widget.selectedCountryValue()) {
                        widget.user().dynamicProperties()[i].value(widget.selectedCountryValue().displayName);
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_passportNumber' && isInternationalIdentityValid) {
                       if(widget.selectedIdentityType() === "EMIRATES ID"){
                          widget.user().dynamicProperties()[i].value(null) 
                       }
                    }
                    if(widget.user().dynamicProperties()[i].id() == "_emiratesId" && isInternationalIdentityValid){
                         if(widget.selectedIdentityType() === "PASSPORT NUMBER"){
                          widget.user().dynamicProperties()[i].value(null) 
                       }
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_dateOfBirth') {
                        widget.user().dynamicProperties()[i].value(widget.dateOfBirthValue());
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_phoneNumber') {
                        widget.user().dynamicProperties()[i].value(widget.phoneNumberValue());
                    }
                     if (widget.user().dynamicProperties()[i].id() == "_isMobileNumberVerified" && widget.phoneNumberValue()) {
                        widget.user().dynamicProperties()[i].value(true);
                    }
                    if (widget.user().dynamicProperties()[i].id() == '_phoneCode') {
                        widget.user().dynamicProperties()[i].value(widget.phoneCodeValue());
                    }
                }

                // if(widget.lastNameValid()){
                //     $("#CC-userRegistration-lastname-error").css("cssText", "display: none;");
                // }else{
                //     $('#CC-userRegistration-lastname-error').text("Enter valid Last Name");
                //     $("#CC-userRegistration-lastname-error").css("cssText", "display: block;");
                // }
                // if(widget.firstNameValid()){
                //     $("#CC-userRegistration-firstname-error").css("cssText", "display: none;");
                // }else{
                //     $('#CC-userRegistration-firstname-error').text("Enter valid First Name");
                //     $("#CC-userRegistration-firstname-error").css("cssText", "display: block;");
                // }

                if (isInternationalIdentityValid && isNationalityValid) {
                    widget.isEditable(false);
                    $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUBMIT).publishWith(widget.user(), [{ message: "success" }]);
                }
            },

            openOTPModal: function (widget) {
                widget.oneTimePasswordFormed(Math.floor(1000 + Math.random() * 9000));
                for (var i = 0; i < widget.user().dynamicProperties().length; i++) {
                    if (widget.user().dynamicProperties()[i].id() === '_mobileOTP') {
                        widget.user().dynamicProperties()[i].value(widget.oneTimePasswordFormed());
                    }
                }
                $('#OTP-modal').modal();
                // $.ajax({
                //     url: "https://api.smsglobal.com/http-api.php?&action=sendsms&user=ej4pdh5n&password=6K8ddtc8&from=DXBDUTYFREE&to=" + widget.phoneCodeEntered().Number_Prefix + widget.phoneNumberEntered() + "&text=" + widget.oneTimePasswordFormed(),
                //     //   url: " https://api.smsglobal.com/http-api.php?&action=sendsms&user=ej4pdh5n&password=6K8ddtc8&from=DXBDUTYFREE&to=917000240567&text="+widget.oneTimePasswordFormed(),
                //     type: 'POST',
                //     contentType: 'application/json; charset=utf-8',
                //     dataType: 'JSON',

                //     success: function (result) {
                        
                //     }
                // });
                var otpData = {
                    "to": widget.phoneCodeEntered().Number_Prefix + widget.phoneNumberEntered(),
                    "text": "Your one time password for mobile number verification is " + widget.oneTimePasswordFormed()
                }

                $.ajax({
                    url: "/ccstorex/custom/v1/sendmobileotp",
                    type: 'POST',
                    data: otpData,
                    success: function(result) {
                       
                    }
                });

            },

            verifyOtp: function (widget) {
                 if(document.getElementById('resendMsg') && document.getElementById('resendMsg').style.display === 'block'){
                    document.getElementById('resendMsg').style.display = 'none';
                }
                var oneTimePasswordEntered = document.getElementById('partitioned').value;
                if (widget.oneTimePasswordFormed() == oneTimePasswordEntered) {
                    $("#cc-messages-mobileverification-error").css("cssText", "display: none;");
                    widget.mobileOtpVerified(true);
                    widget.oneTimePasswordfieldone('');
                    widget.oneTimePasswordfieldtwo('');
                    widget.oneTimePasswordfieldthree('');
                    //   widget.phoneNumberValue()
                    widget.oneTimePasswordfieldfour('');
                    widget.updateProfile(widget)
                    $('#OTP-modal').modal('hide');
                }else if(oneTimePasswordEntered === ""){
                     widget.mobileOtpVerified(false)
                     $("#cc-messages-mobileverification-error").text("Please enter one time password");
                    $("#cc-messages-mobileverification-error").css("cssText", "display: block; text-align: center;");
                     
                }else {
                    widget.mobileOtpVerified(false)
                    $("#cc-messages-mobileverification-error").text("One Time password is not valid.");
                    $("#cc-messages-mobileverification-error").css("cssText", "display: block; text-align: center;");
                }
                for (var i = 0; i < widget.user().dynamicProperties().length; i++) {
                    if (widget.user().dynamicProperties()[i].id() == '_isMobileNumberVerified') {
                        widget.user().dynamicProperties()[i].value(widget.mobileOtpVerified());
                    }
                }
            }
        };
    }
);