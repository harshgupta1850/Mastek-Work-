/**
 * @fileoverview extendupdatePassword_v2.js.
 *
 * @author 
 */
define(
  //---------------------
  // DEPENDENCIES
  //---------------------
  ['knockout', 'pubsub'],

  //-----------------------
  // MODULE DEFINITION
  //-----------------------
  function (ko, PubSub) {
 
    "use strict";
    var getWidget = '';
    
    return {
      newPassword: ko.observable(''),
 
      onLoad: function(widget) {
          getWidget = widget;
        //console.log('extendupdatePassword_v2.js onLoad');
      }, 
      
      beforeAppear: function(widget) {
        //console.log('extendupdatePassword_v2.js before appear');
        
        getWidget.user().newPassword.extend({
              required: true,
              pattern:{
                  message:'Please correct the following: Password must contain at least one digit, one lower-case letter, one upper-case letter, and be at least 8 characters long.',
                  params: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/igm
                //   params:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/igm
              }
        });
        getWidget.passwordFieldLostFocus = function(data, event) {
            var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            // var data = regex.test(data.newPassword());
            var isCorrectPasswordInput = regex.test(data.newPassword());
            
            if(isCorrectPasswordInput) {
                if (this.ignoreBlur && this.ignoreBlur()) {
                    return true;
                }
                this.user().ignorePasswordValidation(false);
                return true;
            } else {
                return false;
            }
            
          };
      },
      
      
    };
  }
);