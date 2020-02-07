var widgetLoginScope = "";
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'notifier', 'ccPasswordValidator', 'pubsub', 'CCi18n',
        'ccConstants', 'navigation', 'ccLogger', 'storageApi', 'ccResourceLoader!global/productCompareSharedViewModel' ],

    //-------------------------------------------------------------------
    // MODULE DEFINITIONon
    //-------------------------------------------------------------------sh
    function($, ko, notifier, CCPasswordValidator, pubsub, CCi18n, CCConstants, navigation, ccLogger, storageApi, productCompareSharedViewModel) {
        "use strict";
        var getWidget;
        var isOTPEmailSent = false;
        var loginSection = {
            parent: '#spinner-Container',
            selector: '#login-block'
        };
        var isGoogleLoginManullyAttempted = false;
        return {
            /*Facebook changes starts*/
            isSocialLoginAttemptSuccessFull:ko.observable(false),
            facebookLoginAttemptResult: ko.observable(''),
            /*Facebook changes ends*/
            passwordType: ko.observable('password'),
            modalMessageType: ko.observable(''),
            modalMessageText: ko.observable(''),
            showErrorMessage: ko.observable(false),
            userCreated: ko.observable(false),
            ignoreBlur: ko.observable(false),
            countriesList: ko.observableArray(),
            selectedCountry: ko.observable(),
            isSocialLoginAttemptSuccessFull:ko.observable(false),
            userTitle: ko.observable(''),
            //   titleValid:               ko.observable(false),
            passportNumber: ko.observable(),
            //   passportNumberValue:      ko.observable(''),
            oneTimePassword: ko.observable(''),
            validation: ko.observable(false),
            passValidation: ko.observable(false),
            passportDropDown: ko.observable(''),
            //   passportDropDownValue:    ko.observable(''),
            passport: ko.observable(''),
            termAndCondition: ko.observable(false),
            //   termAndConditionValue:    ko.observable(false),
            passwordValue: ko.observable(''),
            dateOfBirth: ko.observable(''),
            //   dateOfBirthValue:         ko.observable(''),
            oneTimePasswordfield: ko.observable(''),
            //   oneTimePasswordValue:     ko.observable(''),
            verifiedEmail: ko.observable(false),
            forgotPasswordSuccess: ko.observable(false),
            resetPasswordSuccess: ko.observable(false),
            resetPasswordFailure: ko.observable(false),
            loginPassword: ko.observable(''),
            //   loginPasswordValue:       ko.observable(''),
            //   loginEmailAddressValue:   ko.observable(''),
            loginEmailAddress: ko.observable(''),
            rememberMeValue: ko.observable(false),
            //   rememberMe:               ko.observable(true),
            randomstringToken: ko.observable(''),
            titlecssBindingMS: ko.observable(false),
            titlecssBindingMRS: ko.observable(false),
            titlecssBindingMR: ko.observable(false),
            emailVerifiedCheck: ko.observable(false),
            getFBLoginResult: ko.observable(''),
            passwordFailureMessage: ko.observable(''),
            emiratesId: ko.observable(''),
            onkeypressEmiratesId: function(widget, event) {
                if(event.keyCode!==8){
                    var currentVal = event.target.value || '';
                    if(currentVal.length === 3 || currentVal.length === 8 || currentVal.length === 16) event.target.value = currentVal + '-';
                    $("#CC-userRegistration-passportno-error").css("cssText", "display: none;");
                }
            },
            forgotPasswordSuccessReset: function() {
                this.forgotPasswordSuccess(false);
                // this.user().emailAddressForForgottenPwd('');
            },
            // ajax call for countries name
            getCountries: function() {
                var widget = this;
                $.ajax({
                    url: "/ccstoreui/v1/countries",
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + widget.user().client().tokenSecret);
                    },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'JSON',
                    success: function(data) {
                        widget.countriesList(data.items);
                    }
                });
            },
            resetError:function(){
                $("#CC-userRegistration-title-error").css("cssText", "display: none;");
                $("#CC-userRegistration-dateofbirth-error").css("cssText", "display: none;");
                $("#CC-userRegistration-title-error").css("cssText", "display: none;");
                $("#cc-messages-TermAndCondition").css("cssText", "display: none;");
            },
            // ajax call for send OTP-Email
            OTPEmail: function(widget, isResent) {
                
                if(isOTPEmailSent === false || isResent){
                    isOTPEmailSent =true;
                    var myKeyVals = ''
                    for (var i = 0; i < widget.user().dynamicProperties().length; i++) {
                        if (widget.user().dynamicProperties()[i].id() == "_emailOTP") {
                            myKeyVals = {
                                EmailType: 'EMailToken',
                                userName: widget.user().firstName(),
                                emailToken: widget.user().dynamicProperties()[i].value().toString(),
                                toEmail: widget.user().emailAddress()
                            }
                        }
                        if (widget.user().dynamicProperties()[i].id() == "_emailToken") {
                            var url = window.location.origin;
                            myKeyVals.emailLink = url + "/?occsAuthToken=" + widget.user().dynamicProperties()[i].value().toString();
                        }
                    }
                    $.ajax({
                        url: "/ccstorex/custom/v1/sendemailtokenemail",
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'JSON',
                        data: JSON.stringify(myKeyVals),
                        success: function(data) {
                            if(!isResent){
                                navigation.goTo('/EmailVerification');
                            }
                        }
                    });
                }
            },

            // ajax call for success Email of email-verification
            successFullyVerifiedEmail: function(widget) {
                var myKeyVals = {
                    EmailType: 'UserActive',
                    userName: widget.user().firstName(),
                    toEmail: widget.user().emailAddress()
                }

                $.ajax({
                    url: "/ccstorex/custom/v1/sendemailtokenemail",
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'JSON',
                    data: JSON.stringify(myKeyVals),
                    success: function(data) {}
                });
            },
            handleGoogleLogin:function(){
                isGoogleLoginManullyAttempted = true;
                $('.g-signin2 div').click();
            },
              getFacebookSDK: function() {
                window.fbAsyncInit = function() {
                    FB.init({
                        // appId: '734959753543056',
                        appId: '273276589773562',
                        cookie: true,
                        xfbml: true,
                        version: 'v3.2'
                    });
                    FB.AppEvents.logPageView();
                };
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {
                        return;
                    }
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "https://connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            },
            resetUserRegistrationAndLoginForm : function(){
                var self = this;
                self.user().reset();
                self.selectedCountry("");
                self.passportNumber("");
                self.emiratesId("");
                self.passportNumber("");
                self.passportDropDown("PASSPORT");
                self.dateOfBirth("");
                self.userTitle("");
            },
            beforeAppear:function(){
                var self = this;
                self.oneTimePassword('');
                isOTPEmailSent = false;
                 $('<script src="https://apis.google.com/js/platform.js" async defer></script>').appendTo('head');
                $('<meta name="google-signin-client_id" content="605527963179-aaeqf5jtqpo0bff39r2ul5ikev24lgqc.apps.googleusercontent.com">').appendTo('head');
               
            },
             getDate: function() {
                $("#datepicker").datepicker({
                    format: 'dd/mm/yyyy',
                    autoclose: true
                });
            },
                //Future dates is enabled for the date of birth calendar
            getCalender: function() {
                var dateafterCurrentDate = new Date();
                $("#myDate").datepicker({
                    endDate: dateafterCurrentDate,
                    format: 'dd/mm/yyyy',
                }).on('changeDate', function(ev){
                //widgetLoginScope.dateOfBirth($('#myDate').val());
                $('#myDate').datepicker('hide');
                });
            },
              handleSocialOCCLogin: function(social, socialUser) {
                var self = this;
                // var username = socialUser.email;
                self.resetError();
                if(social === "facebook" && socialUser.email){
                    $.ajax({
                        url: "/ccstoreui/v1/login",
                        type: 'POST',
                        contentType: 'application/x-www-form-urlencoded',
                        data: "grant_type=password&username="+socialUser.email+"&password=Default123",
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + self.user().client().tokenSecret);
                        },
                        success: function(result) {
                            if (result.access_token) {
                                self.user().login(socialUser.email);
                                self.user().password('Default123');
                               
                                $.Topic(pubsub.topicNames.USER_LOGIN_SUBMIT).publishWith(self.user(), [{
                                    message: "success"
                                }]);
                            }
                        },
                        error: function(error){
                             if (self.facebookLoginAttemptResult().first_name) {
                                    self.user().firstName(self.facebookLoginAttemptResult() && self.facebookLoginAttemptResult().first_name ? self.facebookLoginAttemptResult().first_name : '');
                                    self.user().lastName(self.facebookLoginAttemptResult() && self.facebookLoginAttemptResult().last_name ? self.facebookLoginAttemptResult().last_name : '');
                                    self.user().emailAddress(self.facebookLoginAttemptResult() && self.facebookLoginAttemptResult().email ? self.facebookLoginAttemptResult().email : '');
                                    self.user().newPassword('Default123');
                                    self.user().confirmPassword('Default123');
                                    self.dateOfBirth(self.facebookLoginAttemptResult() && self.facebookLoginAttemptResult().birthday ? self.facebookLoginAttemptResult().birthday : '');
                                    self.user().dynamicProperties().forEach(function(property){
                                        if (property.id() === '_isEmailVerified') {
                                            property.value(true);
                                            self.emailVerifiedCheck(true);
                                        }
                                        if (property.id() === '_emailOTP') {
                                            property.value('9245');
                                        }
                                        if(property.id() === '_isFacebookUser'){
                                            property.value(true);
                                        }
                                        // if(property.id() === "_profilePicture"){
                                        //     property.value(self.facebookLoginAttemptResult().image);
                                        // }
                                    });
                                    $("#myModal").modal('toggle');
                                }
                        }
                    });
                }else if(social === "facebook"){
                    self.user().firstName(self.facebookLoginAttemptResult() && self.facebookLoginAttemptResult().first_name ? self.facebookLoginAttemptResult().first_name : '');
                    self.user().lastName(self.facebookLoginAttemptResult() && self.facebookLoginAttemptResult().last_name ? self.facebookLoginAttemptResult().last_name : '');
                    self.user().emailAddress(self.facebookLoginAttemptResult() && self.facebookLoginAttemptResult().email ? self.facebookLoginAttemptResult().email : '');
                    self.user().newPassword('Default123');
                    self.user().confirmPassword('Default123');
                    self.dateOfBirth(self.facebookLoginAttemptResult() && self.facebookLoginAttemptResult().birthday ? self.facebookLoginAttemptResult().birthday : '');
                    $("#myModal").modal('toggle');
                }else if(social === "google" && socialUser.getEmail()){
                      $.ajax({
                        url: "/ccstoreui/v1/login",
                        type: 'POST',
                        contentType: 'application/x-www-form-urlencoded',
                        data: "grant_type=password&username="+socialUser.getEmail()+"&password=Default123",
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + self.user().client().tokenSecret);
                        },
                        success: function(result) {
                            if (result.access_token) {
                                self.user().login(socialUser.getEmail());
                                self.user().password('Default123');
                                $.Topic(pubsub.topicNames.USER_LOGIN_SUBMIT).publishWith(self.user(), [{
                                    message: "success"
                                }]);
                            }
                        },
                        error: function(error){
                            $.ajax({
                                url: "/ccstorex/custom/v1/getuserprofile",
                                type:"POST",
                                data: JSON.stringify({'emailID': socialUser.getEmail()}),
                                success: function(result){
                                   if(result.total === 1){
                                     
                                   }else{
                                        self.user().firstName(socialUser.getGivenName() ? socialUser.getGivenName() : '');
                                        self.user().lastName(socialUser.getFamilyName() ? socialUser.getFamilyName() : '');
                                        self.user().emailAddress(socialUser.getEmail() ? socialUser.getEmail() : '');
                                        self.user().dynamicProperties().forEach(function(property){
                                            if (property.id() === '_isEmailVerified') {
                                                property.value(true);
                                                self.emailVerifiedCheck(true);
                                            }
                                            if (property.id() === '_emailOTP') {
                                                property.value('9245');
                                            }
                                            if(property.id() === '_isGoogleUser'){
                                                property.value(true);
                                            }
                                            if(property.id() === "_profilePicture"){
                                                property.value(socialUser.getImageUrl());
                                            }
                                        });
                                        self.user().newPassword('Default123');
                                        self.user().confirmPassword('Default123');
                                        $("#myModal").modal('toggle');
                                   }
                                }});
                        }
                    });
                }
                isGoogleLoginManullyAttempted = false;
            },
            onLoad: function(widget) {
                var self = widget;
                widgetLoginScope = widget;
                self.userTitle.subscribe(function(data){
                    if(data === "MRS" || data === "MS"){
                        self.user().gender('female');
                    }else{
                        self.user().gender('male');
                    }
                })
                var openPopUps = (document.querySelectorAll('.modal-backdrop') && document.querySelectorAll('.modal-backdrop').length) ? document.querySelectorAll('.modal-backdrop') : null;
                if(openPopUps !== null) {openPopUps[0].style.display = "none"}
                window.onSignIn = function(googleUser) {
                    if(isGoogleLoginManullyAttempted){
                      var profile = googleUser.getBasicProfile();
                      self.isSocialLoginAttemptSuccessFull(true);
                      self.handleSocialOCCLogin("google",profile);
                    }
                }
                window.checkLoginState = function() {
                    FB.getLoginStatus(function(response) {
                        if (response.status === "connected") {
                            var accessToken = response.authResponse.accessToken;
                            $.ajax({
                                url: "https://graph.facebook.com/me?fields=id,name,email,birthday,first_name,last_name,gender&access_token=" + accessToken,
                                type: 'GET',
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'JSON',
                                success: function(result) {
                                    self.isSocialLoginAttemptSuccessFull(true);
                                    self.facebookLoginAttemptResult(result);
                                    self.handleSocialOCCLogin("facebook", result);
                                }
                            });
                        }
                    });
                }
                self.user().dynamicProperties().every(function(property){
                    if(property.id() === '_isEmailVerified' && property.value() === false){
                        navigation.goTo('/EmailVerification');
                    }
                });

                self.passportDropDown.subscribe(function (data) {
                    $("#CC-userRegistration-passportno-error").css("cssText", "display: none;");
                    $("#CC-userRegistration-passportno-error").css("cssText", "display: none;");
                    self.passportNumber("");
                    self.emiratesId("");
                });

                widget.user().ignoreEmailValidation(false);
                // To display success notification after redirection from customerProfile page.
                if (widget.user().delaySuccessNotification()) {
                    notifier.sendSuccess(widget.WIDGET_ID, widget.translate('updateSuccessMsg'), true);
                    widget.user().delaySuccessNotification(false);
                }
                // copy the new password value in confirmpassword value - Neha Dhakad
                // widget.user().newPassword.subscribe(function(data) {
                //     widget.user().confirmPassword(data);
                //     widget.passwordValue(data);
                // });

                // Handle widget responses when registration is successful or invalid
                $.Topic(pubsub.topicNames.USER_AUTO_LOGIN_SUCCESSFUL).subscribe(function(obj) {
                    self.userCreated(true);
                        self.hideLoginModal();
                        self.showErrorMessage(false);
                        notifier.clearSuccess(widget.WIDGET_ID);
                        notifier.sendSuccess(widget.WIDGET_ID, widget.translate('createAccountSuccess'));
                        $(window).scrollTop('0');
                        if(!isOTPEmailSent) {
                            self.OTPEmail(widget);
                        }
                });

                $.Topic(pubsub.topicNames.USER_RESET_PASSWORD_SUCCESS).subscribe(function(data) {
                    self.hideAllSections();
                    self.hideLoginModal();
                    self.forgotPasswordSuccess(true);
                    // notifier.sendSuccess(widget.WIDGET_ID, CCi18n.t('ns.common:resources.resetPasswordMessage'), true);
                });
                $.Topic(pubsub.topicNames.USER_PROFILE_PASSWORD_UPDATE_FAILURE).subscribe(function(data) {
                    self.passwordFailureMessage(data.message);
                    // notifier.sendError(widget.WIDGET_ID, data.message, true);
                });

                $.Topic(pubsub.topicNames.USER_RESET_PASSWORD_FAILURE).subscribe(function(data) {
                    notifier.sendError(widget.WIDGET_ID, data.message, true);
                });

                $.Topic(pubsub.topicNames.USER_PASSWORD_GENERATED).subscribe(function(data) {
                    $('#alert-modal-change').text(CCi18n.t('ns.common:resources.resetPasswordModalOpenedText'));
                    widget.user().ignoreEmailValidation(false);
                    self.hideAllSections();
                    $('#CC-forgotPasswordSectionPane').show();
                    $('#CC-forgotPwd-input').focus();
                    widget.user().emailAddressForForgottenPwd('');
                    widget.user().emailAddressForForgottenPwd.isModified(false);
                });

                $.Topic(pubsub.topicNames.USER_PASSWORD_EXPIRED).subscribe(function(data) {
                  
                    $('#alert-modal-change').text(CCi18n.t('ns.common:resources.resetPasswordModalOpenedText'));
                    widget.user().ignoreEmailValidation(false);
                    self.hideAllSections();
                    $('#CC-forgotPasswordSectionPane').show();
                    $('#CC-forgotPwd-input').focus();
                    widget.user().emailAddressForForgottenPwd('');
                    widget.user().emailAddressForForgottenPwd.isModified(false);
                });

                $.Topic(pubsub.topicNames.USER_LOGIN_FAILURE).subscribe(function(obj) {
                    self.modalMessageType("error");

                    if (obj.errorCode && obj.errorCode === CCConstants.ACCOUNT_ACCESS_ERROR_CODE) {
                        self.modalMessageText(CCi18n.t('ns.common:resources.accountError'));
                    } else {
                        self.modalMessageText(CCi18n.t('ns.common:resources.loginError'));
                    }

                    self.showErrorMessage(true);
                });
                $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUCCESSFUL).subscribe(function(obj) {
                    if(window.location.pathname.indexOf("/EmailVerification")>-1){
                        // self.emailVerifiedCheck(true);
                    }
                });
                $.Topic(pubsub.topicNames.USER_LOGIN_SUCCESSFUL).subscribe(function(obj) {
                      self.hideLoginModal();
                      self.showErrorMessage(false);
                      notifier.clearSuccess(widget.WIDGET_ID);
                      $('#CC-loginHeader-myAccount').focus();
                      $('#CC-loginHeader-myAccount-mobile').focus();

                });

                $.Topic(pubsub.topicNames.USER_CREATION_FAILURE).subscribe(function(obj) {
                    if (obj.widgetId === widget.WIDGET_ID) {
                        widget.user().resetPassword();
                        self.modalMessageType("error");
                        self.modalMessageText(obj.message);
                        self.showErrorMessage(true);
                    }
                });
            },
            // this function calls on click on calender icon
            getDate: function() {
                // $("#datepicker").datepicker({
                //     format: 'dd/mm/yyyy',
                //     autoclose: true
                // });
            },

                 /**
       * this method is invoked to hide the login modal
       */
      hideLoginModal: function() {
        $('#CC-headermodalpane').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
      },
            showHiddenPassword: function(event, data) {
              
                var img1 = "/file/general/icon-password.svg";
                var img2 = "/file/general/open-eye-icon-password.svg";

                var imgElement = $('#passW');
                // imgElement.src = (imgElement.src === img1)? img2 : img1;
                if (imgElement.attr('src') === img1) {
                    // imgElement.src = img2;
                    $('#passW').attr("src", img2);
                    $('#CC-login-password-input').prop('type', 'text') && $('#CC-userRegistration-password').prop('type', 'text');
                    // 
                } else {
                    // imgElement.attr('src') = img1;    
                    $('#passW').attr("src", img1);
                    $('#CC-login-password-input').prop('type', 'password') && $('#CC-userRegistration-password').prop('type', 'password');
                    // 
                }
           
            },
            /*validation for nationality*/
            nationalityValidation: function() {
                if (!this.selectedCountry()) {
                    if(this.isSocialLoginAttemptSuccessFull()){
                        $('#myModal #CC-userRegistration-nationality-error').text("Nationality is Mandatory.");
                        $("#myModal #CC-userRegistration-nationality-error").css("cssText", "display: block;");
                    }else{
                        $('#CC-userRegistration #CC-userRegistration-nationality-error').text("Nationality is Mandatory.");
                        $("#CC-userRegistration #CC-userRegistration-nationality-error").css("cssText", "display: block;");
                    }
                    return false;
                } else {
                     if(this.isSocialLoginAttemptSuccessFull()){
                    $("#myModal #CC-userRegistration-nationality-error").css("cssText", "display: none;");
                     }else{
                    $("#CC-userRegistration #CC-userRegistration-nationality-error").css("cssText", "display: none;");
                     }
                    return true;
                }
            },
            onkeypresspassportno: function(data, event) {
                //data.passportNumber(event.target.value)
                $("#CC-userRegistration-passportno-error").css("cssText", "display: none;");
            },


            /*validation for passport and Emirated Number*/
            passportNumberValidation: function(data) {
                if (this.passportDropDown() === "PASSPORT") {
                    var passportRegex = /^\S[A-Za-z0-9]{4,50}$/;
                    var regex = new RegExp(passportRegex);
                    this.validation(regex.test(this.passportNumber()));
                    if (!this.passportNumber() || this.validation() === false) {
                       if(this.isSocialLoginAttemptSuccessFull()){
                            $('#myModal #CC-userRegistration-passportno-error').text("Enter valid Passport Number.");
                            $("#myModal #CC-userRegistration-passportno-error").css("cssText", "display: block;");
                        }else{
                            $('#CC-userRegistration #CC-userRegistration-passportno-error').text("Enter valid Passport Number.");
                            $("#CC-userRegistration #CC-userRegistration-passportno-error").css("cssText", "display: block;");
                        }
                        return false;
                    } else {
                        if(this.isSocialLoginAttemptSuccessFull()){
                        $("#myModal #CC-userRegistration-passportno-error").css("cssText", "display: none;");
                        }else{
                        $("#CC-userRegistration #CC-userRegistration-passportno-error").css("cssText", "display: none;");    
                        }
                        return true;
                    }
                }
            },
            emirateIdValidation: function() {
                if (this.passportDropDown() === 'EMIRATES ID') {
                    var emiratesIdRegex = /^784-[0-9]{4}-[0-9]{7}-[0-9]{1}$/;
                    var regexEm = new RegExp(emiratesIdRegex);
                    var isTrue = regexEm.test(this.emiratesId());
                    this.validation(false);
                    
                    var countryCode = (this.selectedCountry() && typeof this.selectedCountry() === 'object' && this.selectedCountry().countryCode) || ''
                    
                    // if(countryCode === 'AE' && isTrue) this.validation(isTrue);
                    if(isTrue) this.validation(isTrue);
                   
                    if (this.validation() === false) {
                       if(this.isSocialLoginAttemptSuccessFull()){
                            $('#myModal #CC-userRegistration-passportno-error').text("Enter valid Emirate Id Number");   
                            $("#myModal #CC-userRegistration-passportno-error").css("cssText", "display: block;");
                        }else{
                            $('#CC-userRegistration #CC-userRegistration-passportno-error').text("Enter valid Emirate Id Number");   
                            $("#CC-userRegistration #CC-userRegistration-passportno-error").css("cssText", "display: block;");
                        }
                        return false;
                    } else {
                        if(this.isSocialLoginAttemptSuccessFull()){
                        $("#myModal #CC-userRegistration-passportno-error").css("cssText", "display: none;");
                        }else{
                            $("#CC-userRegistration #CC-userRegistration-passportno-error").css("cssText", "display: none;");
                        }
                        return true;
                    }
                }
            },

            /*validation for Terms and condition*/
            termAndConditionValidation: function() {
                if (!this.termAndCondition()) {
                   if(this.isSocialLoginAttemptSuccessFull()){
                        $('#myModal #cc-messages-TermAndCondition').text("Please accept terms and conditions");
                        $("#myModal #cc-messages-TermAndCondition").css("cssText", "display: block;");
                    }else{
                        $('#CC-userRegistration #cc-messages-TermAndCondition').text("Please accept terms and conditions");
                        $("#CC-userRegistration #cc-messages-TermAndCondition").css("cssText", "display: block;");
                    }
                    return false;
                } else {
                    if(this.isSocialLoginAttemptSuccessFull()){
                    $("#myModal #cc-messages-TermAndCondition").css("cssText", "display: none;");
                    }else{
                    $("#CC-userRegistration #cc-messages-TermAndCondition").css("cssText", "display: none;");    
                    }
                    return true;
                }
            },

            /*Title validation*/
            titlevalidation: function() {
                if (!this.userTitle()) {
                   if(this.isSocialLoginAttemptSuccessFull()){
                        $('#myModal #CC-userRegistration-title-error').text("Title is mandatory");
                        $("#myModal #CC-userRegistration-title-error").css("cssText", "display: block;");
                        $("#myModal #mr").css("cssText","border:2px solid red");
                    }else{
                         $('#CC-userRegistration #CC-userRegistration-title-error').text("Title is mandatory");
                        $("#CC-userRegistration #CC-userRegistration-title-error").css("cssText", "display: block;");
                        $("#CC-userRegistration #mr").css("cssText","border:2px solid red");
                    }
                    return false;
                } else {
                    if(this.isSocialLoginAttemptSuccessFull()){
                    $("#myModal #CC-userRegistration-title-error").css("cssText", "display: none;");
                    $("#myModal #mr").css("cssText", "display: none;");
                    }else{
                    $("#CC-userRegistration #CC-userRegistration-title-error").css("cssText", "display: none;");
                    $("#CC-userRegistration #mr").css("cssText", "display: none;");   
                    }
                    return true;
                }
            },

            // date of birth validation
            dateOfBirthValidation: function() {
                if (this.dateOfBirth() !== "") {
                    if(this.isSocialLoginAttemptSuccessFull()){
                    $("#myModal #CC-userRegistration-dateofbirth-error").css("cssText", "display: none;");
                    }else{
                    $("#CC-userRegistration #CC-userRegistration-dateofbirth-error").css("cssText", "display: none;");    
                    }
                    return true;
                } else {
                    if(this.isSocialLoginAttemptSuccessFull()){
                        $('#myModal #CC-userRegistration-dateofbirth-error').text("Enter valid Date of Birth");
                        $("#myModal #CC-userRegistration-dateofbirth-error").css("cssText", "display: block;");
                    }else{
                        $('#CC-userRegistration #CC-userRegistration-dateofbirth-error').text("Enter valid Date of Birth");
                        $("#CC-userRegistration #CC-userRegistration-dateofbirth-error").css("cssText", "display: block;");
                    }
                }
            },

            /*resend Email for OTP*/
            resendEmail: function(data) {
        
                this.generateOTP(data);
                this.OTPEmail(data, true);
                notifier.clearError(this.widgetId());
                notifier.clearSuccess(this.widgetId());
                notifier.sendSuccess(this.widgetId(), 'We have sent you a verification email again.');
                $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUBMIT).publishWith(data.user(), [{
                    message: "success",
                    widgetId: data.WIDGET_ID
                }]);
            },
            /*for generate one time password*/
            generateOTP: function(data) {
                // this.oneTimePassword(Math.floor(1000 + Math.random() * 9000));
                for (var i = 0; i < data.user().dynamicProperties().length; i++) {
                    if (data.user().dynamicProperties()[i].id() === '_emailOTP') {
                        data.user().dynamicProperties()[i].value(Math.floor(1000 + Math.random() * 9000));
                    }
                }
                var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
                var randomstring = '';
                var randomstringformat = '';
                for (var j = 0; j < 26; j++) {
                    var rnum = Math.floor(Math.random() * chars.length);
                    randomstring += chars.substring(rnum, rnum + 1);
                    randomstringformat = randomstring.substring(0, 9).concat("-").concat(randomstring.substring(9, 16)).concat("-").concat(randomstring.substring(16, 26));
                }
                this.randomstringToken(randomstringformat);
                for (var k = 0; k < data.user().dynamicProperties().length; k++) {
                    if (data.user().dynamicProperties()[k].id() === '_emailToken') {
                        data.user().dynamicProperties()[k].value(this.randomstringToken());
                    }
                }

            },

            /**
             * Invoked when Login method is called
             */
            handleLogin: function(data, event) {
                if ('click' === event.type || (('keydown' === event.type || 'keypress' === event.type) && event.keyCode === 13)) {
                    notifier.clearError(this.WIDGET_ID);
                    if (data.user().validateLogin()) {
                        data.user().updateLocalData(false, false);
                        $.Topic(pubsub.topicNames.USER_LOGIN_SUBMIT).publishWith(data.user(), [{
                            message: "success"
                        }]);

                    }
                }
                return true;

            },

            registerUser: function(data, event) {
                var self = this;
                var gotEmailFromFB = data && data.getFBLoginResult && data.getFBLoginResult() && data.getFBLoginResult().email;
                if ('click' === event.type || (('keydown' === event.type || 'keypress' === event.type ) && event.keyCode === 13)) {
                    var nationality = self.nationalityValidation();
                    var passPort_emiratesId = data.emiratesId() ? self.emirateIdValidation() : self.passportNumberValidation();
                    var termCondition = self.termAndConditionValidation();
                    var title = self.titlevalidation();
                    var dateofbirth = self.dateOfBirthValidation();
                    self.user().validateUser();
                    notifier.clearError(self.WIDGET_ID);
                    //removing the shipping address if anything is set
                    for (var i = 0; i < data.user().dynamicProperties().length; i++) {
            
                        if (data.user().dynamicProperties()[i].id() === '_nationality' && self.selectedCountry()) {
                            data.user().dynamicProperties()[i].value(self.selectedCountry().displayName);
                        }
                        if (data.user().dynamicProperties()[i].id() === '_nameTitle') {
                            data.user().dynamicProperties()[i].value(self.userTitle());
                        }
                        if (data.user().dynamicProperties()[i].id() === '_passportNumber' && self.passportNumber()) {
                            data.user().dynamicProperties()[i].value(self.passportNumber());
                        }
                        if (data.user().dynamicProperties()[i].id() === '_dateOfBirth') {
                            data.user().dynamicProperties()[i].value(new Date(self.dateOfBirth()).getDate() + '/' + (new Date(self.dateOfBirth()).getMonth()+1) + '/' + new Date(self.dateOfBirth()).getFullYear());
                        }
                        if (data.user().dynamicProperties()[i].id() === '_isEmailVerified' && gotEmailFromFB) {
                        //if (data.user().dynamicProperties()[i].id() === '_isEmailVerified') {
                            data.user().dynamicProperties()[i].value(true);
                            data.emailVerifiedCheck(true);
                        }
                        if (data.user().dynamicProperties()[i].id() === '_emailOTP' && gotEmailFromFB) {
                            data.user().dynamicProperties()[i].value('9245');
                        }
                        if (data.user().dynamicProperties()[i].id() === "_isFacebookUser" && gotEmailFromFB) {
                            data.user().dynamicProperties()[i].value(true);
                        }
                        if (data.user().dynamicProperties()[i].id() === "_isFacebookUser" && !gotEmailFromFB) {
                            data.user().dynamicProperties()[i].value(false);
                        }
                        if (data.user().dynamicProperties()[i].id() === "_emiratesId" && data.emiratesId()) {
                            data.user().dynamicProperties()[i].value(data.emiratesId());
                        }
                    }

                    if(!gotEmailFromFB) {
                        self.generateOTP(data);
                    }
                    data.user().shippingAddressBook([]);
                    data.user().emailMarketingMails(true);
                    data.user().updateLocalData(false, false);
                    data.user().confirmPassword(data.user().newPassword());
                    if (data.user().validateUser() && nationality && passPort_emiratesId && termCondition && title && dateofbirth) {
                        $.Topic(pubsub.topicNames.USER_REGISTRATION_SUBMIT).publishWith(data.user(), [{
                            message: "success",
                            widgetId: data.WIDGET_ID
                        }]);
                    } 
                    // else {
                    //                 console.log('ERROR');
                    //                 // document.body.scrollTop = 0,
                    //                 // document.documentElement.scrollTop = 0
                    //                 var error = document.querySelectorAll("span.text-danger");
                    //                 for(var index = 0; index < error.length; index ++){
                    //                     var firstErrorClassId = error[0].id;
                    //                   $('html,body').animate({
                    //                      scrollTop: $("#" + firstErrorClassId).offset().top
                    //                     }, 'slow');
                    //                     //  console.log("errorclasss", scrollTop)
                    //                      break;
                    //                 }
                    //                 // error[2].style.cssText =  "background-color:lightyellow;font-weight:bold;"
                                   
                    // }
                }
                return true;
            },

            // this function call when user verified there email.
            successFullyRegister: function() {
                if (otp == this.oneTimePassword()) {
                    this.verifiedEmail(true);
                    $("#cc-messages-emailverification-error").css("cssText", "display: none;");
                } else {
                    this.verifiedEmail(false);
                    $("#cc-messages-emailverification-error").text("One Time password is not valid.");
                    $("#cc-messages-emailverification-error").css("cssText", "display: block;");
                }

            },

            /**
             * Invoked at the time of Email Verification
             */
            handleUpdateProfile: function(scope, event) {
                var data = this;
                var isOTPSame = false;
                if ('click' === event.type || (('keydown' === event.type || 'keypress' === event.type) && event.keyCode === 13)) {
                    notifier.clearError(this.WIDGET_ID);
                   
                    //removing the shipping address if anything is set
                    for (var i = 0; i < data.user().dynamicProperties().length; i++) {
                        if (data.user().dynamicProperties()[i].id() == "_emailOTP") {
                            if (data.user().dynamicProperties()[i].value() == this.oneTimePassword()) {
                                isOTPSame = true;
                                $("#cc-messages-emailverification-error").css("cssText", "display: none;");
                            }else{
                                $("#cc-messages-emailverification-error").text("One Time password is not valid.");
                                $("#cc-messages-emailverification-error").css("cssText", "display: block;");
                            }
                          for (var i = 0; i < data.user().dynamicProperties().length; i++) {
                                if (data.user().dynamicProperties()[i].id() == "_isEmailVerified" && isOTPSame) {
                                    data.user().dynamicProperties()[i].value(true);
                                    $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUBMIT).publishWith(data.user(), [{
                                            message: "success",
                                            widgetId: data.WIDGET_ID
                                    }]);
                                    // this.emailVerifiedCheck(true);
                                    // this.successFullyVerifiedEmail(data);
                                }
                            }
                         break;
                        }
                    }
                }
                return true;
            },

            /**
             * this method is triggered when the user clicks on the save 
             * on the update password model
             */

            savePassword: function(data, event) {
                var self = this;

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
                                self.resetPasswordSuccess(true);
                            },
                            function(retData) {
                                self.resetPasswordFailure(true);
                            }
                        );
                    }
                }
                return true;
            },
            /**
             * Resets the password for the entered email id.
             */
            resetForgotPassword: function(data, event) {
                var widget = this;
                if ('click' === event.type || (('keydown' === event.type || 'keypress' === event.type) && event.keyCode === 13)) {
                    data.user().ignoreEmailValidation(false);
                    data.user().emailAddressForForgottenPwd.isModified(true);
                    if (data.user().emailAddressForForgottenPwd && data.user().emailAddressForForgottenPwd.isValid()) {
                        var email = data.user().emailAddressForForgottenPwd() || '';
                        var settings = {
                          "async": true,
                          "url": "/ccstorex/custom/v1/getuserprofile",
                          "method": "POST",
                          "headers": {
                            "Content-Type": "application/json",
                            "cache-control": "no-cache",
                          },
                          "data": JSON.stringify({emailID :email})
                        };
                        $.ajax(settings).done(function (response) {
                            if(response.total && response.total > 0) {
                                data.user().resetForgotPassword();
                            } else {
                                $('#CC-forgotPasswordSection #CC-forgotPwd-emailAddress-error').text('The email id doesn\'t exist. please register to login');
                                $('#CC-forgotPasswordSection #CC-forgotPwd-emailAddress-error').show();
                            } 
                        });
                    }
                }
                return true;
            },
            // this function call on check on remember me
            createLogedCookie: function() {
                var info = {};
                info.username = this.loginEmailAddress();
                info.password = this.loginPassword();
                var _e = CryptoJS.AES.encrypt(JSON.stringify(info), 'DDFZen');
                storageApi.getInstance().setItem("remberMeToken", _e);
                storageApi.getInstance().setItem("remberMe", 'true');

            },

            // invoked to show password value

            showPasswordText: function(event, data) {
               
                if (data.passwordType() === 'password') {
                    data.passwordType('text');
                } else {
                    data.passwordType('password');
                }
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

            /**
             * Ignores the blur function when mouse click is up
             */
            handleMouseUp: function(data) {
                this.ignoreBlur(false);
                this.user().ignoreConfirmPasswordValidation(false);
                return true;
            },

            /**
             * Ignores the blur function when mouse click is down
             */
            handleMouseDown: function(data) {
                this.ignoreBlur(true);
                this.user().ignoreConfirmPasswordValidation(true);
                return true;
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
            handleFacebooklogin: function() {
                if (FB) {
                    /*DDF-235/241 starts here*/
                    FB.init({
                        //appId: '734959753543056',
                        appId:'273276589773562',
                        cookie: true,
                        xfbml: true,
                        version: 'v3.2'
                    });
                    FB.AppEvents.logPageView();
                    /*DDF-235/241 ends here*/
                    FB.login(function(response) {
                        if (response && response.status == 'connected') {
                            checkLoginState();
                        }
                    }, {
                        scope: 'email',
                        return_scopes: true
                    });
                }
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
            }
            
        };
    }
);