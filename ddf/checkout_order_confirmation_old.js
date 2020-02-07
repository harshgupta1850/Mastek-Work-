define(

  // -------------------------------------------------------------------
  // DEPENDENCIES
  // -------------------------------------------------------------------
  [ 'knockout', 'CCi18n', 'ccConstants', 'ccResourceLoader!global/productCompareSharedViewModel','storageApi' ,'spinner','navigation' ],

  // -------------------------------------------------------------------
  // MODULE DEFINITION
  // -------------------------------------------------------------------
  function(ko, CCi18n, ccConstants, productCompareSharedViewModel,storageApi,spinner,navigation) {

    "use strict";
    var preOrderItemTotalMap = [];
    var orderCreationmain = '#page';
    return {
        raffleTicketsTotal:ko.observable(),
        allAvailablePromotions:ko.observableArray(),
        preOrderItemTotal:ko.observable(),
        perOrderCartVAT:ko.observable(0),
        raffleTicketsVATTotal:ko.observable(0),
        /*DDF-497 starts here*/
        cartAnniversaryDiscountAmount:ko.observable(0),
        /*DDF-497 ends here*/
        preOrderCartDiscount:ko.observable(0),
        conCourseProducts:ko.observableArray(),
        raffleTicketInCart:ko.observableArray(),
        nonRaffleProductsInCart:ko.observableArray(),
        claimedCouponMultiPromotions: ko.observableArray([]),
        implicitPromotionList: ko.observableArray([]),
        newPromotion: function(promotionDesc, promotionId, promotionLevel, totalAdjustment, promotionApplied) {
        var blankPromotion = new Object();
        blankPromotion.promotionDesc = promotionDesc?promotionDesc:'';
        blankPromotion.promotionId = promotionId?promotionId:'';
        blankPromotion.promotionLevel = promotionLevel?promotionLevel:'';
        blankPromotion.totalAdjustment = totalAdjustment?totalAdjustment:'0';
        blankPromotion.promotionApplied = promotionApplied?promotionApplied:false;
        return ko.mapping.fromJS(blankPromotion);
      },
       destroySpinner: function(parent) {
            var widget = this;
            $(parent).removeClass('loadingIndicator');
            spinner.destroyWithoutDelay($(parent));
        },
        getOrderCreatedDate:function(date){
            if(date){
                return date.split("T")[0];
            }
            return date;
        },
        getOrderCreatedTime:function(time){
            if(time){
                var date = new Date(time);
                return date.getHours() + ':' + date.getMinutes();
            }
            return time;
        },
        getProductTotalPrice:function(unitPrice, VAT , productId){
                var self = this;
                var locallyAppliedPromotions = localStorage.getItem('confirmedAppliedPromotion');
                var itemTotalPrice = 0;
                var quantity=0;
                if(locallyAppliedPromotions){
                    locallyAppliedPromotions = JSON.parse(locallyAppliedPromotions);
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
                                }
                             break;
                            }
                        }
                    }
                }
                preOrderItemTotalMap = preOrderItemTotalMap.filter(function(pro){
                    return pro.productId !== productId;
                })
                preOrderItemTotalMap.push({
                    productId: productId,
                    itemTotal :itemTotalPrice * quantity
                });
                
                var preOrderTotal = 0;
                preOrderItemTotalMap.forEach(function(item,index){
                    preOrderTotal = preOrderTotal + item.itemTotal;
                });
                self.preOrderItemTotal(preOrderTotal);
                return itemTotalPrice * quantity;
            },
        getItemUnitPrice:function(itemTotal, VAT , productId){
            var locallyAppliedPromotions = localStorage.getItem('confirmedAppliedPromotion');
            if(locallyAppliedPromotions){
                locallyAppliedPromotions = JSON.parse(locallyAppliedPromotions);
                if(locallyAppliedPromotions.length){
                    for(var i=0; i < locallyAppliedPromotions.length ; i++){
                        if(locallyAppliedPromotions[i].itemCode === productId){
                            var itemPrice = locallyAppliedPromotions[i].unitListPrice;
                           
                            if(locallyAppliedPromotions[i].discounts.length){
                                for(var j=0; j < locallyAppliedPromotions[i].discounts.length ; j++){
                                    var discount = locallyAppliedPromotions[i].discounts[j];
                                    if(discount.discountType !== 'SPECIAL_DISCOUNT'){
                                        itemPrice = itemPrice - (discount.extendedDiscountAmount/locallyAppliedPromotions[i].quantity);
                                    }
                                }
                            }
                         break;
                        }
                    }
                }
            }
            return itemPrice;
        },
      addToClaimedCouponMultiPromotions: function(coupon,widget) {
        var couponFound = false;
        for(var j = 0; j<widget.claimedCouponMultiPromotions().length; j++) {
          if(coupon.coupon == widget.claimedCouponMultiPromotions()[j].couponCode()) {
            widget.claimedCouponMultiPromotions()[j].promotions.push(widget.newPromotion(coupon.promotionDesc, coupon.promotionId, coupon.promotionLevel, coupon.totalAdjustment, true));
            couponFound = true;
            break;
          }
        }
        if(!couponFound) {
          var newCoupon = new Object()
          var promotionList = [];
          promotionList.push(widget.newPromotion(coupon.promotionDesc, coupon.promotionId, coupon.promotionLevel, coupon.totalAdjustment, true));
          newCoupon.couponCode = coupon.coupon;
          newCoupon.staus = ccConstants.COUPON_STATUS_CLAIMED;
          newCoupon.promotions = promotionList;
          widget.claimedCouponMultiPromotions.push(ko.mapping.fromJS(newCoupon));
        }
      },
      addToImplictDiscountList: function(coupon,widget) {
        widget.implicitPromotionList.push(widget.newPromotion(coupon.promotionDesc, coupon.promotionId, coupon.promotionLevel, coupon.totalAdjustment, true));
      },
      populatePromotions: function(coupons,widget) {
        if(coupons) {
          for(var i=0; i<coupons.length; i++) {
            if(coupons[i].hasOwnProperty("coupon")) {
              widget.addToClaimedCouponMultiPromotions(coupons[i],widget);
            } else {
              widget.addToImplictDiscountList(coupons[i],widget);
            }
          }
        }
      },
      orderConfirmationSectionConcourse:function(widget){
            var self = this;
            var confirmCart = storageApi.getInstance().getItem("confirmOrderCartDetail");
            self.conCourseProducts(JSON.parse(confirmCart));
      },
       orderConfirmationSection: function(widget) {
                var self = widget;
                var raffleTickets = [];
                var nonRaffleProducts = [];
                widget.destroySpinner(orderCreationmain);
                var confirmCart = storageApi.getInstance().getItem("confirmOrderCartDetail");
                var cartItems = self.confirmation().shoppingCart.items;
          
                if(confirmCart){
                    confirmCart = JSON.parse(confirmCart);
                    for(var i=0;i< confirmCart.length;i++ ){
                        if (confirmCart[i].productData.type === 'RaffleTickets') {
                             for(var j=0;j<cartItems.length;j++){
                                if (cartItems[j].catRefId === confirmCart[i].catRefId) {
                                    cartItems[j].productData = confirmCart[i].productData;
                                    raffleTickets.push(cartItems[j]);
                                    break;
                                }
                             }
                        } else {
                            for(var j=0;j<cartItems.length;j++){
                                if (cartItems[j].catRefId === confirmCart[i].catRefId) {
                                    cartItems[j].productData = confirmCart[i].productData;
                                    nonRaffleProducts.push(cartItems[j]);
                                    break;
                                }
                             }
                        }
                    }
                }
                self.raffleTicketInCart(raffleTickets);
                self.nonRaffleProductsInCart(nonRaffleProducts);
            },
      onLoad : function(widget) {
        widget.orderConfirmationSection(widget);
        widget.isGiftCardUsed = ko.computed(
          function() {
            var payments = widget.confirmation().payments;
            if (typeof(payments) != 'undefined' && payments != null){
              for ( var i = 0; i < payments.length; i++) {
                if (payments[i].paymentMethod == ccConstants.GIFT_CARD_PAYMENT_TYPE) {
                  return true;
                }
              }
            }
            
            return false;
          }, widget);

        widget.totalAmount = ko.computed(
          function() {
            var payments = widget.confirmation().payments;
            if (typeof(payments) != 'undefined' && payments != null){
              for ( var i = 0; i < payments.length; i++) {
                if (payments[i].isAmountRemaining
                    && payments[i].paymentMethod != ccConstants.GIFT_CARD_PAYMENT_TYPE) {
                  return payments[i].amount;
                }
              }
            }
            return 0;
          }, widget);
        //   this._doclearCart();
      },
      
            _doclearCart:function(){
                // debugger;
              
                var outPut = {"orderId":"111"}  // test order Id
                
                while (outPut.orderId){
                   
                    outPut = this._doclearCartCall();
                }
                
            },
            _doclearCartCall: function () {
                // var URL = 'https://10.116.205.137:7071/ddfpayment/nidata';
               
                var that = this;
                var URL = '/ccstoreui/v1/orders/current'
                var outPut = {};
                $.ajax({
                  url: URL,
                  beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + that.user().client().tokenSecret)
                },
                  // crossDomain: true,
                  type: 'DELETE',
                  async: false,
                  success: function (result) {
                    outPut = result;
                  },
                  error: function (e) {
                    logger.error('Module :: Order Conformation Page :: Clear Cart ::', e);
                  }
                });
                return outPut;
        },

      beforeAppear: function (page) {
        // this._doclearCart();
        var widget = this;
        document.querySelector('#loadingModal').classList.add('hide')
        // Need to check more on same 
        // widget.cart().isOrderSubmissionInProgress = false;
        var perOrderCartVAT = storageApi.getInstance().getItem('perOrderCartVAT');
        var raffleTicketsVATTotal = storageApi.getInstance().getItem('totalTicketCartVat');
        var preOrderCartDiscount = storageApi.getInstance().getItem('preOrderCartDiscount');
        /*DDF-497 starts here*/
        var cartAnniversaryDiscountAmount = storageApi.getInstance().getItem('cartAnniversaryDiscount');
        /*DDF-497 ends here*/
        var appliedPromotions = storageApi.getInstance().getItem('confirmedAppliedPromotion');
        if(appliedPromotions){
            widget.allAvailablePromotions(JSON.parse(appliedPromotions));
        }
        if(perOrderCartVAT){
            widget.perOrderCartVAT(+perOrderCartVAT);
        }
        if(raffleTicketsVATTotal){
            widget.raffleTicketsVATTotal(+raffleTicketsVATTotal);
        }
        if(preOrderCartDiscount){
       
            widget.preOrderCartDiscount(+preOrderCartDiscount);
            
        }
        /*DDF-497 starts here*/
         if(cartAnniversaryDiscountAmount){
             widget.cartAnniversaryDiscountAmount(+cartAnniversaryDiscountAmount);
         }
        /*DDF-497 ends here*/
        if(widget.site().siteInfo.id === "200001"){
            setTimeout(function(){ 
                 var pathname = (window.location.pathname).toLowerCase();
                widget.orderConfirmationSectionConcourse();
                if (pathname.indexOf("/confirmation") > -1) {
                navigation.goTo('/home');
                }
            }, 20000);
            
        }else{
            widget.orderConfirmationSection(widget);
        }
        // widget.cart().emptyCart(); // Clear cart on Order conformation page (Doc ID 2350939.1)  // Milind 
        widget.claimedCouponMultiPromotions.splice(0);
        widget.implicitPromotionList.splice(0);
        widget.populatePromotions(widget.confirmation().discountInfo.orderDiscountDescList,widget);
        var raffleTicketsTotal = 0;
        $('<script> gtag("event", "conversion", { "send_to": "AW-959697632/L64pCOKbtGMQ4KXPyQM", "transaction_id": '+widget.confirmation().id+' }); </script>  ').appendTo('head');
        $('<script> gtag("event", "conversion", {"allow_custom_scripts": true, "send_to": "DC-4533083/conve0/thank0+standard"  });</script>'+
        '<noscript><img src="https://ad.doubleclick.net/ddm/activity/src=4533083;type=conve0;cat=thank0;dc_lat=;dc_rdid=;'+
        'tag_for_child_directed_treatment=;tfua=;npa=;ord=1?" width="1" height="1" alt=""/></noscript>').appendTo('head');
        
        // facebook tag
        var _facebook_tag_content = [];
        widget.confirmation().shoppingCart.items.forEach(function(item){
            if(item.productId.indexOf('Car') > -1 || item.productId.indexOf('Bike') > -1 || item.productId.indexOf('MM') > -1){
                raffleTicketsTotal = raffleTicketsTotal + item.listPrice;
            }
            _facebook_tag_content.push({
                id:item.productId,
                quantity:item.quantity
            });
        });
        
        fbq('track', 'Purchase', {
            value: widget.confirmation().priceInfo.total,
            currency: widget.confirmation().priceInfo.currencyCode,
            contents: _facebook_tag_content
          });
        widget.raffleTicketsTotal(raffleTicketsTotal);
      },
    };
  });
