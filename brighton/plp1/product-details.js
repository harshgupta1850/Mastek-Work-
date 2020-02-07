define(["knockout", "pubsub", "ccConstants", "koValidate", "notifier", "CCi18n", "storeKoExtensions", "swmRestClient", "spinner", "pageLayout/product", "ccRestClient", "pinitjs", "viewModels/inventoryViewModel"], function(e, t, n, r, i, s, o, u, a, f, l, c, h) {
    "use strict";
    var p, d = "LOADED", v = "LOADING", m = {
        parent: "#cc-product-spinner",
        selector: "#cc-product-spinner-area"
    }, g = !1, y = 0, b = 5, w = function(e, t) {
        return e.spaceNameFull() > t.spaceNameFull() ? 1 : e.spaceNameFull() < t.spaceNameFull() ? -1 : 0
    }, E = function(e, t) {
        return e.spaceNameFull() > t.spaceNameFull() ? 1 : e.spaceNameFull() < t.spaceNameFull() ? -1 : 0
    };
    return {
        stockStatus: e.observable(!1),
        stockState: e.observable(),
        showStockStatus: e.observable(!1),
        variantOptionsArray: e.observableArray([]),
        itemQuantity: e.observable(1),
        stockAvailable: e.observable(),
        availabilityDate: e.observable(),
        selectedSku: e.observable(),
        disableOptions: e.observable(!1),
        priceRange: e.observable(!1),
        filtered: e.observable(!1),
        WIDGET_ID: "productDetails",
        isAddToCartClicked: e.observable(!1),
        containerImage: e.observable(),
        imgGroups: e.observableArray(),
        mainImgUrl: e.observable(),
        activeImgIndex: e.observable(0),
        viewportWidth: e.observable(),
        skipTheContent: e.observable(!1),
        listPrice: e.observable(),
        salePrice: e.observable(),
        backLinkActive: e.observable(!0),
        variantName: e.observable(),
        variantValue: e.observable(),
        listingVariant: e.observable(),
        shippingSurcharge: e.observable(),
        secondaryCurrencyShippingSurcharge: e.observable(),
        imgMetadata: [],
        isMobile: e.observable(!1),
        quickViewFromPurchaseList: e.observable(!1),
        isOnlineOnly: e.observable(!1),
        selectedStore: e.observable(),
        storeSearchText: e.observable(),
        stores: e.observableArray(),
        storeLookupStatus: e.observable(0),
        showSWM: e.observable(!0),
        isAddToSpaceClicked: e.observable(!1),
        disableAddToSpace: e.observable(!1),
        spaceOptionsArray: e.observableArray([]),
        spaceOptionsGrpMySpacesArr: e.observableArray([]),
        spaceOptionsGrpJoinedSpacesArr: e.observableArray([]),
        mySpaces: e.observableArray([]),
        siteFbAppId: e.observable(""),
        resourcesLoaded: function(e) {
            g = !0
        },
        onLoad: function(r) {
            p = r,
            $.Topic(t.topicNames.UPDATE_LISTING_FOCUS).subscribe(function(e) {
                r.skipTheContent(!0)
            }),
            r.showSecondaryShippingData = e.pureComputed(function() {
                return r.site().payShippingInSecondaryCurrency() && null != r.site().exchangeRate() && null != r.site().siteSecondaryCurrency()
            }),
            $.Topic(t.topicNames.PAGE_READY).subscribe(function(e) {
                var t = {};
                if (e.parameters) {
                    var n = e.parameters.split("&");
                    for (var i = 0; i < n.length; i++) {
                        var s = n[i].split("=");
                        t[s[0]] = s[1]
                    }
                }
                t.variantName && t.variantValue ? (r.variantName(decodeURI(t.variantName)),
                r.variantValue(decodeURI(t.variantValue))) : (r.variantName(""),
                r.variantValue(""))
            }),
            $.Topic(t.topicNames.SOCIAL_SPACE_ADD_SUCCESS).subscribe(function(e) {
                e.productUpdated ? (r.disableAddToSpace(!0),
                setTimeout(function() {
                    r.disableAddToSpace(!1)
                }, 3e3)) : (r.isAddToSpaceClicked(!0),
                r.disableAddToSpace(!0),
                setTimeout(function() {
                    r.isAddToSpaceClicked(!1)
                }, 3e3),
                setTimeout(function() {
                    r.disableAddToSpace(!1)
                }, 3e3))
            }),
            $.Topic(t.topicNames.USER_LOGIN_SUCCESSFUL).subscribe(function(e) {
                r.getSpaces(function() {})
            }),
            $.Topic(t.topicNames.USER_AUTO_LOGIN_SUCCESSFUL).subscribe(function(e) {
                r.getSpaces(function() {})
            }),
            $.Topic(t.topicNames.SOCIAL_REFRESH_SPACES).subscribe(function(e) {
                r.getSpaces(function() {})
            }),
            r.itemQuantity.extend({
                required: {
                    params: !0,
                    message: s.t("ns.common:resources.quantityRequireMsg")
                },
                digit: {
                    params: !0,
                    message: s.t("ns.common:resources.quantityNumericMsg")
                },
                min: {
                    params: 1,
                    message: s.t("ns.productdetails:resources.quantityGreaterThanMsg", {
                        quantity: 0
                    })
                }
            }),
            r.stockAvailable.subscribe(function(e) {
                var t = parseInt(e, 10);
                r.itemQuantity.rules.remove(function(e) {
                    return e.rule == "max"
                }),
                t > 0 && r.itemQuantity.extend({
                    max: {
                        params: t,
                        message: s.t("ns.productdetails:resources.quantityLessThanMsg", {
                            quantity: t
                        })
                    }
                })
            }),
            r.itemQuantityInCart = function(e) {
                var t = e.orderLimit ? !1 : !0;
                return r.cart().getItemQuantityInCart(r.cart().items(), e.id, e.childSKUs[0].repositoryId, t, null, r.selectedStore)
            }
            ,
            u.init(r.site().tenantId, r.isPreview(), r.locale()),
            r.fetchFacebookAppId(),
            r.shippingSurchargeMouseOver = function(e, t) {
                $(".shippingSurchargePopover").off("click"),
                $(".shippingSurchargePopover").off("keydown");
                var n = new Object;
                n.trigger = "manual",
                n.html = !0,
                n.title = e.translate("shippingSurchargePopupTitle") + "<button id='shippingSurchargePopupCloseBtn' class='close btn pull-right'>" + e.translate("escapeKeyText") + " &times;</button>",
                n.content = e.translate("shippingSurchargePopupText"),
                $(".shippingSurchargePopover").popover(n),
                $(".shippingSurchargePopover").on("click", e.shippingSurchargeShowPopover),
                $(".shippingSurchargePopover").on("keydown", e.shippingSurchargeShowPopover)
            }
            ,
            r.shippingSurchargeShowPopover = function(e) {
                if (e.type === "keydown" && e.which !== n.KEY_CODE_ENTER)
                    return;
                e.stopPropagation(),
                $(this).popover("show"),
                $("html").on("click", r.shippingSurchargeHidePopover),
                $("html").on("keydown", r.shippingSurchargeHidePopover),
                $(".shippingSurchargePopover").off("click"),
                $(".shippingSurchargePopover").off("keydown")
            }
            ,
            r.shippingSurchargeHidePopover = function(e) {
                if (e.type === "keydown" && e.which !== n.KEY_CODE_ESCAPE)
                    return;
                $(".shippingSurchargePopover").popover("hide"),
                $(".shippingSurchargePopover").on("click", r.shippingSurchargeShowPopover),
                $(".shippingSurchargePopover").on("keydown", r.shippingSurchargeShowPopover),
                $("html").off("click"),
                $("html").off("keydown"),
                $(".shippingSurchargePopover").focus()
            }
            ,
            $(window).resize(function() {
                var e = $(window)[0].innerWidth || $(window).width();
                if (r.product && r.product() && r.product().primaryFullImageURL && r.viewportWidth() != e)
                    if (e > n.VIEWPORT_TABLET_UPPER_WIDTH)
                        r.viewportWidth() <= n.VIEWPORT_TABLET_UPPER_WIDTH && (r.activeImgIndex(0),
                        r.mainImgUrl(r.product().primaryFullImageURL),
                        $("#prodDetails-imgCarousel").carousel(0),
                        $("#carouselLink0").focus());
                    else if (e >= n.VIEWPORT_TABLET_LOWER_WIDTH) {
                        if (r.viewportWidth() < n.VIEWPORT_TABLET_LOWER_WIDTH || r.viewportWidth() > n.VIEWPORT_TABLET_UPPER_WIDTH)
                            r.activeImgIndex(0),
                            r.mainImgUrl(r.product().primaryFullImageURL),
                            $("#prodDetails-imgCarousel").carousel({
                                interval: 1e9
                            }),
                            $("#prodDetails-imgCarousel").carousel(0),
                            $("#carouselLink0").focus()
                    } else
                        r.viewportWidth() > n.VIEWPORT_TABLET_LOWER_WIDTH && ($("#prodDetails-mobileCarousel").carousel({
                            interval: 1e9
                        }),
                        $("#prodDetails-mobileCarousel").carousel(0));
                r.viewportWidth(e),
                r.checkResponsiveFeatures($(window).width())
            }),
            r.isAddToPurchaseListDisabled = e.computed(function() {
                return !r.validateAddToSpace() || r.disableAddToSpace()
            }, r),
            r.viewportWidth($(window).width()),
            r.product() && (r.imgGroups(r.groupImages(r.product().thumbImageURLs())),
            r.mainImgUrl(r.product().primaryFullImageURL()));
            var i = function() {
                $("#cc-product-details :focusable").first().focus(),
                r.skipTheContent(!1)
            };
            i(),
            setTimeout(i, 1),
            r.storeSearchText.extend({
                maxLength: {
                    params: 50,
                    message: s.t("ns.common:resources.maxlengthValidationMsg", {
                        maxLength: 50
                    })
                }
            });
            var o = !1
        },
        beforeAppear: function(r) {
            var s = this;
            if (!r || r.pageId !== "category" && r.pageId !== "searchResults")
                if (s.product && s.product()) {
                    s.checkResponsiveFeatures($(window).width()),
                    this.backLinkActive(!0),
                    !s.isPreview() && !s.historyStack.length && this.backLinkActive(!1),
                    s.shippingSurcharge(null),
                    s.secondaryCurrencyShippingSurcharge(null),
                    s.activeImgIndex(0),
                    s.firstTimeRender = !0,
                    this.populateVariantOptions(s),
                    s.product() && s.imgGroups(s.groupImages(s.product().thumbImageURLs())),
                    s.loaded(!0),
                    this.itemQuantity(1),
                    this.selectedStore(null),
                    this.storeSearchText(null),
                    s.product().onlineOnly && e.isObservable(s.product().onlineOnly) && this.isOnlineOnly(s.product().onlineOnly()),
                    s.product() && s.product().childSKUs().length == 1 && (this.filtered(!1),
                    this.filterOptionValues(null),
                    s.product().childSKUs()[0].onlineOnly() && this.isOnlineOnly(s.product().childSKUs()[0].onlineOnly())),
                    i.clearSuccess(this.WIDGET_ID),
                    i.clearError(this.WIDGET_ID);
                    var o = null;
                    s.user().catalog && (o = s.user().catalog.repositoryId),
                    s.listPrice(s.product().listPrice()),
                    s.salePrice(s.product().salePrice());
                    if (s.product()) {
                        s.product().stockStatus.subscribe(function(e) {
                            s.product().stockStatus().stockStatus !== n.IN_STOCK && s.product().stockStatus().stockStatus !== n.PREORDERABLE && s.product().stockStatus().stockStatus !== n.BACKORDERABLE || s.product().stockStatus().orderableQuantity == undefined && s.product().stockStatus().productSkuInventoryStatus == undefined ? (s.stockAvailable(0),
                            s.stockState(n.OUT_OF_STOCK),
                            s.disableOptions(!0),
                            s.stockStatus(!1)) : (s.product().stockStatus().orderableQuantity ? s.stockAvailable(s.product().stockStatus().orderableQuantity) : s.stockAvailable(1),
                            s.disableOptions(!1),
                            s.stockStatus(!0),
                            s.stockState(s.product().stockStatus().stockStatus),
                            s.availabilityDate(s.product().stockStatus().availabilityDate)),
                            s.showStockStatus(!0)
                        }),
                        s.product().product && s.product().product.childSKUs && s.product().product.childSKUs.length === 1 && this.selectedSku(s.product().product.childSKUs[0]);
                        var u = s.product().childSKUs()[0];
                        if (u) {
                            var a = u.repositoryId();
                            this.variantOptionsArray().length > 0 && (a = ""),
                            this.showStockStatus(!1),
                            s.product().getAvailability(s.product().id(), a, o),
                            s.product().getPrices(s.product().id(), a)
                        } else
                            s.stockStatus(!1),
                            s.disableOptions(!0),
                            s.showStockStatus(!0);
                        this.priceRange(this.product().hasPriceRange),
                        s.mainImgUrl(s.product().primaryFullImageURL()),
                        $.Topic(t.topicNames.PRODUCT_VIEWED).publish(s.product()),
                        $.Topic(t.topicNames.PRODUCT_PRICE_CHANGED).subscribe(function() {
                            s.listPrice(s.product().listPrice()),
                            s.salePrice(s.product().salePrice()),
                            s.shippingSurcharge(s.product().shippingSurcharge()),
                            s.secondaryCurrencyShippingSurcharge(s.product().secondaryCurrencyShippingSurcharge && s.product().secondaryCurrencyShippingSurcharge() ? s.product().secondaryCurrencyShippingSurcharge() : null)
                        })
                    }
                    s.user().loggedIn() && s.getSpaces(function() {})
                }
        },
        goBack: function() {
            return $(window).scrollTop($(window).height()),
            window.history.go(-1),
            !1
        },
        cancelZoom: function(e) {
            $(e).parent().removeClass("zoomContainer-CC")
        },
        populateVariantOptions: function(e) {
            var t = e.productVariantOptions();
            e.product().variantOptionsArray = e.product().populateVariantOptions(t);
            if (t && t !== null && t.length > 0) {
                var n = [], r, i = {}, s, o, u;
                u = e.product().variantOptionsArray;
                for (var a = 0, f = u.length; a < f; a++)
                    i[u[a].actualOptionId] = u[a].originalOptionValues();
                for (var l = 0; l < t.length; l++)
                    r = undefined,
                    e.product().variantValuesOrder[t[l].optionId] && (r = e.product().variantValuesOrder[t[l].optionId]()),
                    s = this.mapOptionsToArray(t[l].optionValueMap, r ? r : i[t[l].optionId]),
                    o = this.productVariantModel(t[l].optionName, t[l].mapKeyPropertyAttribute, s, e, t[l].optionId),
                    n.push(o);
                e.variantOptionsArray(n)
            } else
                e.imgMetadata = e.product().product.productImagesMetadata,
                e.variantOptionsArray([])
        },
        productVariantModel: function(t, n, r, i, s) {
            var o = {}
              , u = {};
            o.optionDisplayName = t,
            o.parent = this,
            o.optionId = n,
            o.originalOptionValues = e.observableArray(r),
            o.actualOptionId = s;
            var a = e.observable(!0);
            r.length === 1 && a(this.checkOptionValueWithSkus(n, r[0].value)),
            a() && (o.optionCaption = i.translate("optionCaption", {
                optionName: t
            }, !0)),
            o.selectedOptionValue = e.observable(),
            o.countVisibleOptions = e.computed(function() {
                var e = 0;
                for (var t = 0; t < o.originalOptionValues().length; t++)
                    r[t].visible() == 1 && (e += 1);
                return e
            }, o),
            o.disable = e.computed(function() {
                return o.countVisibleOptions() == 0 ? !0 : !1
            }, o),
            o.selectedOption = e.computed({
                write: function(e) {
                    this.parent.filtered(!1),
                    o.selectedOptionValue(e),
                    o.actualOptionId === this.parent.listingVariant() && (e && e.listingConfiguration ? (this.parent.imgMetadata = e.listingConfiguration.imgMetadata,
                    this.parent.assignImagesToProduct(e.listingConfiguration)) : (this.parent.imgMetadata = this.parent.product().product.productImagesMetadata,
                    this.parent.assignImagesToProduct(this.parent.product().product))),
                    e == undefined ? this.parent.isUndefinedSelected = !0 : this.parent.isUndefinedSelected = !1,
                    this.parent.filterOptionValues(o.optionId)
                },
                read: function() {
                    return o.selectedOptionValue()
                },
                owner: o
            }),
            o.selectedOption.extend({
                required: {
                    params: !0,
                    message: i.translate("optionRequiredMsg", {
                        optionName: t
                    }, !0)
                }
            }),
            o.optionValues = e.computed({
                write: function(e) {
                    o.originalOptionValues(e)
                },
                read: function() {
                    return e.utils.arrayFilter(o.originalOptionValues(), function(e) {
                        return e.visible() == 1
                    })
                },
                owner: o
            });
            var f = i.productVariantOptions();
            for (var l = 0; l < f.length; l++)
                if (f[l].listingVariant) {
                    i.listingVariant(f[l].optionId);
                    break
                }
            u.thumbImageURLs = i.product().product.thumbImageURLs.length == 1 && i.product().product.thumbImageURLs[0].indexOf("/img/no-image.jpg&") > 0 ? [] : i.product().product.thumbImageURLs,
            u.smallImageURLs = i.product().product.smallImageURLs.length == 1 && i.product().product.smallImageURLs[0].indexOf("/img/no-image.jpg&") > 0 ? [] : i.product().product.smallImageURLs,
            u.mediumImageURLs = i.product().product.mediumImageURLs.length == 1 && i.product().product.mediumImageURLs[0].indexOf("/img/no-image.jpg&") > 0 ? [] : i.product().product.mediumImageURLs,
            u.largeImageURLs = i.product().product.largeImageURLs.length == 1 && i.product().product.largeImageURLs[0].indexOf("/img/no-image.jpg&") > 0 ? [] : i.product().product.largeImageURLs,
            u.fullImageURLs = i.product().product.fullImageURLs.length == 1 && i.product().product.fullImageURLs[0].indexOf("/img/no-image.jpg&") > 0 ? [] : i.product().product.fullImageURLs,
            u.sourceImageURLs = i.product().product.sourceImageURLs.length == 1 && i.product().product.sourceImageURLs[0].indexOf("/img/no-image.jpg") > 0 ? [] : i.product().product.sourceImageURLs;
            var c = [];
            if (i.product().thumbImageURLs && i.product().thumbImageURLs().length > 0)
                for (var h = 0; h < i.product().thumbImageURLs().length; h++)
                    c.push(i.product().product.productImagesMetadata[h]);
            return e.utils.arrayForEach(o.originalOptionValues(), function(e) {
                if (i.listingVariant() === s)
                    for (var t = 0; t < i.product().childSKUs().length; t++)
                        if (i.product().childSKUs()[t].productListingSku()) {
                            var n = i.product().childSKUs()[t];
                            if (n[s]() == e.key) {
                                var r = {};
                                r.thumbImageURLs = $.merge($.merge([], n.thumbImageURLs()), u.thumbImageURLs),
                                r.smallImageURLs = $.merge($.merge([], n.smallImageURLs()), u.smallImageURLs),
                                r.mediumImageURLs = $.merge($.merge([], n.mediumImageURLs()), u.mediumImageURLs),
                                r.largeImageURLs = $.merge($.merge([], n.largeImageURLs()), u.largeImageURLs),
                                r.fullImageURLs = $.merge($.merge([], n.fullImageURLs()), u.fullImageURLs),
                                r.sourceImageURLs = $.merge($.merge([], n.sourceImageURLs()), u.sourceImageURLs),
                                r.primaryFullImageURL = n.primaryFullImageURL() ? n.primaryFullImageURL() : i.product().product.primaryFullImageURL,
                                r.primaryLargeImageURL = n.primaryLargeImageURL() ? n.primaryLargeImageURL() : i.product().product.primaryLargeImageURL,
                                r.primaryMediumImageURL = n.primaryMediumImageURL() ? n.primaryMediumImageURL() : i.product().product.primaryMediumImageURL,
                                r.primarySmallImageURL = n.primarySmallImageURL() ? n.primarySmallImageURL() : i.product().product.primarySmallImageURL,
                                r.primaryThumbImageURL = n.primaryThumbImageURL() ? n.primaryThumbImageURL() : i.product().product.primaryThumbImageURL;
                                var a = [];
                                if (n.images && n.images().length > 0)
                                    for (var f = 0; f < n.images().length; f++)
                                        a.push(i.product().product.childSKUs[t].images[f].metadata);
                                r.imgMetadata = $.merge($.merge([], a), c),
                                e.listingConfiguration = r
                            }
                        }
                i.variantName() === s && e.key === i.variantValue() && o.selectedOption(e)
            }),
            o
        },
        checkOptionValueWithSkus: function(e, t) {
            var n = this.product().childSKUs()
              , r = n.length;
            for (var i = 0; i < r; i++)
                if (!n[i].dynamicPropertyMapLong[e] || n[i].dynamicPropertyMapLong[e]() === undefined)
                    return !0;
            return !1
        },
        filterOptionValues: function(e) {
            if (this.filtered())
                return;
            var t = this.variantOptionsArray();
            for (var n = 0; n < t.length; n++) {
                var r = t[n]
                  , i = this.getMatchingSKUs(t[n].optionId)
                  , s = this.updateOptionValuesFromSku(i, e, r);
                t[n].optionValues(s),
                this.filtered(!0)
            }
            this.isUndefinedSelected || this.updateSingleSelection(e)
        },
        getMatchingSKUs: function(e) {
            var t = this.product().childSKUs()
              , n = []
              , r = this.variantOptionsArray()
              , i = {};
            for (var s = 0; s < r.length; s++)
                r[s].optionId != e && r[s].selectedOption() != undefined && (i[r[s].optionId] = r[s].selectedOption().value);
            for (var o = 0; o < t.length; o++) {
                var u = !0;
                for (var a in i)
                    if (i.hasOwnProperty(a))
                        if (!t[o].dynamicPropertyMapLong[a] || t[o].dynamicPropertyMapLong[a]() != i[a]) {
                            u = !1;
                            break
                        }
                u && n.push(t[o])
            }
            return n
        },
        updateOptionValuesFromSku: function(e, t, n) {
            var r = n.optionId
              , i = []
              , s = n.originalOptionValues();
            for (var o = 0; o < e.length; o++) {
                var u = e[o].dynamicPropertyMapLong[r];
                u != undefined && i.push(u())
            }
            for (var a = 0; a < s.length; a++) {
                var f = s[a].value
                  , l = !1
                  , c = i.indexOf(f);
                c != -1 && (l = !0),
                s[a].visible(l)
            }
            return s
        },
        validForSingleSelection: function(e) {
            var t = this.variantOptionsArray();
            for (var n = 0; n < t.length; n++) {
                if (t[n].disable() || t[n].optionId != e && t[n].selectedOption() != undefined)
                    return !0;
                if (t[n].optionId != e && t[n].selectedOption() == undefined && t[n].countVisibleOptions() == 1)
                    return !0
            }
            return !1
        },
        updateSingleSelection: function(e) {
            var t = this.variantOptionsArray();
            for (var n = 0; n < t.length; n++) {
                var r = t[n].optionId;
                if (t[n].countVisibleOptions() == 1 && t[n].selectedOption() == undefined && r != e) {
                    var i = this.validForSingleSelection(r)
                      , s = t[n].originalOptionValues();
                    for (var o = 0; o < s.length; o++)
                        if (s[o].visible() == 1) {
                            t[n].selectedOption(s[o]);
                            break
                        }
                }
            }
        },
        mapOptionsToArray: function(t, n) {
            var r = [];
            for (var i = 0, s = n.length; i < s; i++)
                n[i] && n[i].key && t.hasOwnProperty(n[i].key) ? r.push({
                    key: n[i].key,
                    value: t[n[i].key],
                    visible: e.observable(!0)
                }) : n[i] && t.hasOwnProperty(n[i]) && r.push({
                    key: n[i],
                    value: t[n[i]],
                    visible: e.observable(!0)
                });
            return r
        },
        getSelectedSku: function(e) {
            var n = [];
            this.product() && (n = this.product().product.childSKUs);
            var r = {};
            for (var i = 0; i < n.length; i++) {
                r = n[i];
                for (var s = 0; s < e.length; s++)
                    if (!e[s].disable() && n[i].dynamicPropertyMapLong[e[s].optionId] != e[s].selectedOption().value) {
                        r = null;
                        break
                    }
                if (r !== null)
                    return $.Topic(t.topicNames.SKU_SELECTED).publish(this.product(), r, e),
                    r
            }
            return null
        },
        getSelectedSkuId: function(e) {
            var t = "";
            return e.selectedSku && e.selectedSku() && "" !== e.selectedSku().repositoryId && (t = e.selectedSku().repositoryId),
            t
        },
        refreshSkuPrice: function(e) {
            if (e === null)
                this.product().hasPriceRange ? this.priceRange(!0) : (this.listPrice(this.product().listPrice()),
                this.salePrice(this.product().salePrice()),
                this.priceRange(!1));
            else {
                this.priceRange(!1);
                var t = this.product().getSkuPrice(e);
                this.listPrice(t.listPrice),
                this.salePrice(t.salePrice)
            }
        },
        refreshSkuStockStatus: function(e) {
            var t, n = !0, r = this.product().stockStatus();
            e === null ? t = "stockStatus" : (t = e.repositoryId,
            r != undefined && r.productSkuInventoryStatus != undefined && (n = r.productSkuInventoryStatus[t] > 0 ? !0 : !1));
            for (var i in r)
                i == t && (r[t] != "IN_STOCK" && r[t] != "PREORDERABLE" && r[t] != "BACKORDERABLE" || !n ? (this.stockStatus(!1),
                this.stockAvailable(0),
                this.stockState("OUT_OF_STOCK")) : (this.stockStatus(!0),
                this.stockState(r[t]),
                this.availabilityDate(this.getAvailabilityDate(t)),
                e === null ? this.stockAvailable(1) : this.stockAvailable(e.quantity)));
            this.selectedStore() && null !== this.selectedStore() && (this.selectedStore().availableQuantity > 0 ? this.stockStatus(!0) : this.stockStatus(!1))
        },
        refreshSkuData: function(e) {
            this.refreshSkuPrice(e),
            this.refreshSkuStockStatus(e)
        },
        getAvailabilityDate: function(e) {
            var t = null
              , n = this.product().stockStatus().productSkuInventoryDetails;
            for (var r in n) {
                var i = n[r];
                if (i.catRefId === e) {
                    t = i.availabilityDate;
                    break
                }
            }
            return t
        },
        getSelectedSkuOptions: function(e) {
            var t = [], n;
            for (var r = 0; r < e.length; r++)
                e[r].disable() || t.push({
                    optionName: e[r].optionDisplayName,
                    optionValue: e[r].selectedOption().key,
                    optionId: e[r].actualOptionId,
                    optionValueId: e[r].selectedOption().value
                });
            return t
        },
        assignSkuIMage: function(e, t) {
            var n, r, i = {};
            n = this.productVariantOptions();
            if (n !== undefined && n !== null && n.length > 0)
                for (var s = 0; s < n.length; s++)
                    if (n[s].listingVariant) {
                        r = n[s].optionId;
                        for (var o in n[s].optionValueMap)
                            i[n[s].optionValueMap[o]] = o;
                        break
                    }
            if (e.childSKUs)
                for (var u = 0; u < e.childSKUs.length; u++)
                    if (e.childSKUs[u][r] === t[r] && !t.primaryThumbImageURL) {
                        t.primaryThumbImageURL = e.childSKUs[u].primaryThumbImageURL;
                        break
                    }
        },
        allOptionsSelected: function() {
            var t = !0;
            if (this.variantOptionsArray().length > 0) {
                var n = this.variantOptionsArray();
                for (var r = 0; r < n.length; r++)
                    if (!n[r].selectedOption.isValid() && !n[r].disable()) {
                        t = !1,
                        this.selectedSku(null);
                        break
                    }
                if (t) {
                    var i = this.getSelectedSku(n);
                    if (i === null)
                        return !1;
                    this.selectedSku(i),
                    this.product().onlineOnly && e.isObservable(this.product().onlineOnly) && this.isOnlineOnly(this.product().onlineOnly());
                    if (this.product().childSKUs && null !== this.product().childSKUs() && this.product().childSKUs().length > 0)
                        for (var s = 0; s < this.product().childSKUs().length; s++)
                            this.product().childSKUs()[s].repositoryId && e.isObservable(this.product().childSKUs()[s].repositoryId) && this.product().childSKUs()[s].repositoryId() === i.repositoryId && this.product().childSKUs()[s].onlineOnly && e.isObservable(this.product().childSKUs()[s].onlineOnly) && this.product().childSKUs()[s].onlineOnly() && this.isOnlineOnly(this.product().childSKUs()[s].onlineOnly)
                }
                this.refreshSkuData(this.selectedSku())
            }
            return t
        },
        quantityIsValid: function() {
            return this.itemQuantity() > 0 && this.itemQuantity() <= this.stockAvailable()
        },
        validateAddToCart: function() {
            var e = this.allOptionsSelected() && this.stockStatus() && this.quantityIsValid() && this.listPrice() != null;
            return this.variantOptionsArray().length > 0 && this.selectedSku() ? e = e && !this.selectedSku().configurable : e = e && !this.product().isConfigurable(),
            e || $("#cc-prodDetailsAddToCart").attr("aria-disabled", "true"),
            e
        },
        handleChangeQuantity: function(e, t) {
            var n = this.itemQuantity();
            return n < 1 ? console.log("<= 0") : n > this.stockAvailable() && console.log("> orderable quantity"),
            !0
        },
        handleAddToCart: function() {
            function d() {
                p.isAddToCartClicked(!1)
            }
            i.clearError(this.WIDGET_ID);
            var n = this.variantOptionsArray();
            i.clearSuccess(this.WIDGET_ID);
            var r = this.getSelectedSkuOptions(n)
              , o = {
                selectedOptions: r
            }
              , u = {
                availabilityDate: this.availabilityDate()
            }
              , a = {
                stockState: this.stockState()
            }
              , f = $.extend(!0, {}, this.product().product, o, u, a);
            this.selectedSku() && !this.selectedSku().primaryThumbImageURL && this.assignSkuIMage(f, this.selectedSku()),
            this.variantOptionsArray().length > 0 && (f.childSKUs = [this.selectedSku()]),
            f.orderQuantity = parseInt(this.itemQuantity(), 10),
            f.selectedStore = e.observable(this.selectedStore());
            var l = this.itemQuantityInCart(f)
              , c = f.orderLimit && f.orderLimit < this.stockAvailable() ? f.orderLimit : this.stockAvailable();
            if (l + parseInt(this.itemQuantity(), 10) > c) {
                var h = s.t("ns.productdetails:resources.totalItemQuantityExceeded", {
                    stockAvailable: c,
                    itemQuantityInCart: l
                });
                i.sendError(this.WIDGET_ID, h, !0);
                return
            }
            $.Topic(t.topicNames.CART_ADD).publishWith(f, [{
                message: "success"
            }]),
            this.isAddToCartClicked(!0);
            var p = this;
            setTimeout(d, 3e3),
            p.isInDialog() && $(".modal").modal("hide")
        },
        getSpaces: function(t) {
            var n = this
              , r = function(r) {
                var i = []
                  , s = [];
                if (r.response.code.indexOf("200") === 0) {
                    var o = r.items;
                    o.forEach(function(t, r) {
                        var o = {
                            spaceid: t.spaceId,
                            spaceNameFull: e.observable(t.spaceName),
                            spaceNameFormatted: e.computed(function() {
                                return t.spaceName + " (" + t.creatorFirstName + " " + t.creatorLastName + ")"
                            }, n),
                            creatorid: t.creatorId,
                            accessLevel: t.accessLevel,
                            spaceOwnerFirstName: t.creatorFirstName,
                            spaceOwnerLastName: t.creatorLastName
                        };
                        t.creatorId == u.apiuserid ? i.push(o) : s.push(o)
                    }),
                    i.sort(w),
                    s.sort(E),
                    n.spaceOptionsGrpMySpacesArr(i),
                    n.spaceOptionsGrpJoinedSpacesArr(s);
                    var a = []
                      , f = {
                        label: n.translate("mySpacesGroupText"),
                        children: e.observableArray(n.spaceOptionsGrpMySpacesArr())
                    }
                      , l = {
                        label: n.translate("joinedSpacesGroupText"),
                        children: e.observableArray(n.spaceOptionsGrpJoinedSpacesArr())
                    }
                      , c = []
                      , h = {
                        spaceid: "createnewspace",
                        spaceNameFull: e.observable(n.translate("createNewSpaceOptText"))
                    };
                    c.push(h);
                    var p = {
                        label: "",
                        children: e.observableArray(c)
                    };
                    a.push(f),
                    a.push(l),
                    a.push(p),
                    n.spaceOptionsArray(a),
                    n.mySpaces(i),
                    t && t()
                }
            }
              , i = function(e, t, n) {};
            u.request("GET", "/swm/rs/v1/sites/{siteid}/spaces", "", r, i, {})
        },
        openAddToWishlistDropdownSelector: function() {
            var e = this;
            e.spaceOptionsArray().length === 0 && e.getSpaces()
        },
        validateAddToSpace: function() {
            var e = !0;
            if (this.variantOptionsArray().length > 0) {
                var t = this.variantOptionsArray();
                for (var n = 0; n < t.length; n++)
                    if (!t[n].selectedOption.isValid() && !t[n].disable()) {
                        e = !1;
                        break
                    }
                if (e) {
                    var r = this.getSelectedSku(t);
                    if (r == null)
                        return !1;
                    var i = this.product().getSkuPrice(r);
                    if (i.listPrice === null)
                        return !1
                }
            } else if (this.listPrice() == null)
                return !1;
            this.variantOptionsArray().length > 0 && this.selectedSku() ? e = e && !this.selectedSku().configurable : e = e && this.product() && !this.product().isConfigurable();
            var s = this.itemQuantity();
            if (s.toString() != "")
                if (!s.toString().match(/^\d+$/) || Number(s) < 0)
                    return !1;
            var o = e && this.product().childSKUs().length > 0;
            return o || $("#cc-prodDetailsAddToSpace").attr("aria-disabled", "true"),
            o
        },
        validateAndSetSelectedSku: function(e) {
            var t = !0;
            if (this.variantOptionsArray().length > 0) {
                var n = this.variantOptionsArray();
                for (var r = 0; r < n.length; r++)
                    if (!n[r].selectedOption.isValid() && !n[r].disable()) {
                        t = !1,
                        this.selectedSku(null);
                        break
                    }
                if (t) {
                    var i = this.getSelectedSku(n);
                    if (i === null)
                        return !1;
                    this.selectedSku(i)
                }
                e && this.refreshSkuData(this.selectedSku())
            }
            return t
        },
        addToSpaceClick: function(e) {
            var n = this.variantOptionsArray();
            i.clearSuccess(this.WIDGET_ID);
            var r = this.getSelectedSkuOptions(n)
              , s = {
                selectedOptions: r
            }
              , o = $.extend(!0, {}, this.product().product, s);
            o.desiredQuantity = this.itemQuantity(),
            this.variantOptionsArray().length > 0 && (o.childSKUs = [this.selectedSku()]),
            o.productPrice = o.salePrice != null ? o.salePrice : o.listPrice,
            $.Topic(t.topicNames.SOCIAL_SPACE_ADD).publishWith(o, [{
                message: "success"
            }])
        },
        addToSpaceSelectorClick: function(e) {
            var n = this.variantOptionsArray();
            i.clearSuccess(this.WIDGET_ID);
            var r = this.getSelectedSkuOptions(n)
              , s = {
                selectedOptions: r
            }
              , o = $.extend(!0, {}, this.product().product, s);
            o.desiredQuantity = this.itemQuantity(),
            this.variantOptionsArray().length > 0 && (o.childSKUs = [this.selectedSku()]),
            o.productPrice = o.salePrice != null ? o.salePrice : o.listPrice,
            $.Topic(t.topicNames.SOCIAL_SPACE_SELECTOR_ADD).publishWith(o, [{
                message: "success"
            }])
        },
        addToSpaceSelect: function(e, n) {
            var r = this.variantOptionsArray();
            i.clearSuccess(this.WIDGET_ID);
            var s = this.getSelectedSkuOptions(r)
              , o = {
                selectedOptions: s
            }
              , u = $.extend(!0, {}, this.product().product, o);
            u.desiredQuantity = this.itemQuantity(),
            this.variantOptionsArray().length > 0 && (u.childSKUs = [this.selectedSku()]),
            u.productPrice = u.salePrice != null ? u.salePrice : u.listPrice,
            $.Topic(t.topicNames.SOCIAL_SPACE_ADD_TO_SELECTED_SPACE).publishWith(u, [n])
        },
        fetchFacebookAppId: function() {
            var e = this
              , t = n.EXTERNALDATA_PRODUCTION_FACEBOOK;
            e.isPreview() && (t = n.EXTERNALDATA_PREVIEW_FACEBOOK),
            l.request(n.ENDPOINT_MERCHANT_GET_EXTERNALDATA, null, e.fetchFacebookAppIdSuccessHandler.bind(e), e.fetchFacebookAppIdErrorHandler.bind(e), t)
        },
        fetchFacebookAppIdSuccessHandler: function(e) {
            var t = this;
            t.siteFbAppId(e.serviceData.applicationId)
        },
        fetchFacebookAppIdErrorHandler: function(e) {
            logger.debug("Failed to get Facebook appId.", result)
        },
        shareProductFbClick: function() {
            var e = this
              , t = window.location.protocol
              , n = window.location.host
              , r = "";
            window.siteBaseURLPath && window.siteBaseURLPath !== "/" && (r = window.siteBaseURLPath);
            var i = encodeURIComponent(t + "//" + n + r + e.product().route())
              , s = e.siteFbAppId()
              , o = "https://www.facebook.com/sharer/sharer.php?app_id=" + s + "&u=" + i
              , u = window.open(o, "facebookWin", "width=720, height=500");
            u && u.focus()
        },
        shareProductTwitterClick: function() {
            var e = this
              , t = encodeURIComponent(e.product().displayName())
              , n = window.location.protocol
              , r = window.location.host
              , i = "";
            window.siteBaseURLPath && window.siteBaseURLPath !== "/" && (i = window.siteBaseURLPath);
            var s = encodeURIComponent(n + "//" + r + i + e.product().route())
              , o = window.open("https://twitter.com/share?url=" + s + "&text=" + t, "twitterWindow", "width=720, height=500");
            o && o.focus()
        },
        shareProductPinterestClick: function() {
            var e = this
              , t = encodeURIComponent(e.product().displayName())
              , n = window.location.protocol
              , r = window.location.host
              , i = "";
            window.siteBaseURLPath && window.siteBaseURLPath !== "/" && (i = window.siteBaseURLPath);
            var s = encodeURIComponent(n + "//" + r + i + e.product().route())
              , o = encodeURIComponent(n + "//" + r + i + e.product().primaryLargeImageURL())
              , u = window.open("https://pinterest.com/pin/create/button/?url=" + s + "&description=" + t + "&media=" + o, "pinterestWindow", "width=720, height=500");
            u && u.focus()
        },
        shareProductEmailClick: function() {
            var e = this
              , t = []
              , n = window.location.protocol
              , r = window.location.host
              , i = "";
            window.siteBaseURLPath && window.siteBaseURLPath !== "/" && (i = window.siteBaseURLPath);
            var s = n + "//" + r + i + e.product().route();
            t.push("mailto:?"),
            t.push("subject="),
            t.push(encodeURIComponent(e.translate("shareProductEmailSubject", {
                productName: e.product().displayName()
            }))),
            t.push("&body=");
            var o = [];
            o.push(e.translate("shareProductEmailBodyIntro", {
                productName: e.product().displayName()
            })),
            o.push("\n\n"),
            o.push(s),
            t.push(encodeURIComponent(o.join(""))),
            window.location.href = t.join("")
        },
        handleLoadEvents: function(e) {
            e.toUpperCase() === v ? (a.create(m),
            $("#cc-product-spinner").css("z-index", 1)) : e.toUpperCase() === d && this.removeSpinner()
        },
        loadImage: function() {
            if (g) {
                var e = $("#cc-image-viewer").html();
                e ? this.loadViewer(this.handleLoadEvents.bind(this)) : this.viewportWidth() > n.VIEWPORT_TABLET_UPPER_WIDTH ? this.loadMagnifier() : this.viewportWidth() >= n.VIEWPORT_TABLET_LOWER_WIDTH ? this.loadZoom() : this.loadCarouselZoom()
            } else
                y++ < b && setTimeout(this.loadImage, 500)
        },
        groupImages: function(t) {
            var n = this
              , r = [];
            if (t)
                for (var i = 0; i < t.length; i++)
                    i % 4 == 0 ? r.push(e.observableArray([t[i]])) : r[r.length - 1]().push(t[i]);
            return r
        },
        handleCarouselArrows: function(e, t) {
            t.keyCode == 37 && $("#prodDetails-imgCarousel").carousel("prev"),
            t.keyCode == 39 && $("#prodDetails-imgCarousel").carousel("next")
        },
        handleCycleImages: function(e, t, n, r) {
            var i = n + r * 4;
            t.keyCode == 37 && (i == 0 ? ($("#prodDetails-imgCarousel").carousel("prev"),
            $("#carouselLink" + (this.product().thumbImageURLs.length - 1)).focus()) : n == 0 ? ($("#prodDetails-imgCarousel").carousel("prev"),
            $("#carouselLink" + (i - 1)).focus()) : $("#carouselLink" + (i - 1)).focus()),
            t.keyCode == 39 && (n == 3 ? ($("#prodDetails-imgCarousel").carousel("next"),
            $("#carouselLink" + (i + 1)).focus()) : i == this.product().thumbImageURLs.length - 1 ? ($("#prodDetails-imgCarousel").carousel("next"),
            $("#carouselLink0").focus()) : $("#carouselLink" + (i + 1)).focus())
        },
        loadImageToMain: function(e, t, n) {
            return this.activeImgIndex(n),
            this.mainImgUrl(this.product().fullImageURLs[n]),
            !1
        },
        assignImagesToProduct: function(e) {
            this.firstTimeRender == 1 && (this.product().primaryFullImageURL(e.primaryFullImageURL),
            this.product().primaryLargeImageURL(e.primaryLargeImageURL),
            this.product().primaryMediumImageURL(e.primaryMediumImageURL),
            this.product().primarySmallImageURL(e.primarySmallImageURL),
            this.product().primaryThumbImageURL(e.primaryThumbImageURL),
            this.firstTimeRender = !1),
            this.product().thumbImageURLs(e.thumbImageURLs),
            this.product().smallImageURLs(e.smallImageURLs),
            this.product().mediumImageURLs(e.mediumImageURLs),
            this.product().largeImageURLs(e.largeImageURLs),
            this.product().fullImageURLs([]),
            this.product().fullImageURLs(e.fullImageURLs),
            this.product().sourceImageURLs(e.sourceImageURLs),
            this.mainImgUrl(e.primaryFullImageURL),
            this.imgGroups(this.groupImages(e.thumbImageURLs)),
            this.activeImgIndex(0),
            this.activeImgIndex.valueHasMutated()
        },
        checkResponsiveFeatures: function(e) {
            e > 978 ? this.isMobile(!1) : e <= 978 && this.isMobile(!0)
        },
        priceUnavailableText: function() {
            return s.t("ns.productdetails:resources.priceUnavailable")
        },
        isInDialog: function() {
            return $("#CC-prodDetails-addToCart").closest(".modal").length
        },
        getSelectedProducts: function() {
            if (!!this.validateAddToPurchaseList()) {
                var e = this.variantOptionsArray()
                  , t = this.getSelectedSkuOptions(e)
                  , n = {
                    selectedOptions: t
                }
                  , r = $.extend(!0, {}, this.product().product, n);
                r.desiredQuantity = parseInt(this.itemQuantity(), 10),
                this.variantOptionsArray().length > 0 && (r.childSKUs = [this.selectedSku()]);
                var s = {
                    productId: r.id,
                    catRefId: r.childSKUs[0].repositoryId,
                    quantityDesired: r.desiredQuantity,
                    displayName: r.displayName
                }
                  , o = [];
                return o.push(s),
                o
            }
            i.sendError(this.WIDGET_ID, this.translate("productAddError"))
        },
        validateAddToPurchaseList: function() {
            var e = !0;
            if (this.variantOptionsArray().length > 0) {
                var t = this.variantOptionsArray();
                for (var n = 0; n < t.length; n++)
                    if (!t[n].selectedOption.isValid() && !t[n].disable()) {
                        e = !1;
                        break
                    }
                if (e) {
                    var r = this.getSelectedSku(t);
                    if (r === null)
                        return !1
                }
            }
            this.variantOptionsArray().length > 0 && this.selectedSku() ? e = e && !this.selectedSku().configurable : e = e && !this.product().isConfigurable();
            var i = this.itemQuantity();
            if (i.toString() != "")
                if (!i.toString().match(/^\d+$/) || Number(i) < 0)
                    return !1;
            var s = e && this.product().childSKUs().length > 0;
            return s
        },
        displayStoreSelector: function() {
            var t = this;
            t.storeLookupStatus(0);
            var n = null;
            t.selectedSku && t.selectedSku() && "" !== t.selectedSku().repositoryId && (n = t.selectedSku().repositoryId);
            var r = new h
              , i = function(e) {
                t.stores.removeAll();
                if (null !== e && e.length > 0)
                    for (var n = 0; n < e.length; n++)
                        t.stores.push(e[n])
            }
              , s = function(e) {
                t.storeLookupStatus(e.storeLookupStatus)
            };
            r.getLocationInventoryForUserQuery({
                searchText: t.storeSearchText(),
                noOfStoresToDisplay: t.noOfStoresToDisplay && e.isObservable(t.noOfStoresToDisplay) ? t.noOfStoresToDisplay() : 10,
                siteId: t.site().siteInfo.id,
                catalogId: t.user().catalogId(),
                locationType: "store",
                pickUp: !0,
                comparator: "CO",
                searchableFields: ["city", "postalCode", "name"],
                productSkuIds: t.product().id() + ":" + n
            }, i.bind(t), s.bind(t)),
            $("#storePickUpModal").on("shown.bs.modal", function() {
                $("#CC-storeSelect").focus()
            })
        },
        handleStoreSelection: function(t) {
            var n = this;
            n.selectedStore(t),
            n.stockState(t.availabilityStatusMsg);
            if (t && t.inventoryDetails && t.inventoryDetails.length > 0)
                for (var r = 0; r < t.inventoryDetails.length; r++) {
                    var i = t.inventoryDetails[r];
                    i.locationId === t.store.locationId && n.availabilityDate(i.availabilityDate)
                }
            null !== n.product().stockStatus() && (n.product().stockStatus()[n.selectedSku().repositoryId] = t.availabilityStatusMsg,
            n.product().stockStatus().productSkuInventoryStatus && (n.product().stockStatus().productSkuInventoryStatus[n.selectedSku().repositoryId] = t.availableQuantity)),
            n.selectedSku().quantity = t.availableQuantity;
            if (t && t.inventoryDetails && t.inventoryDetails.length > 0)
                for (var s = 0; s < t.inventoryDetails.length; s++)
                    t.locationId === t.inventoryDetails[s].locationId && n.setStockAvailability(t.availabilityStatusMsg, t.inventoryDetails[s].orderableQuantity);
            if (n.product() && n.product().configurable()) {
                var o = "";
                n.selectedSku && e.isObservable(n.selectedSku) && (o += n.selectedSku().repositoryId);
                var u = {};
                u.selectedStore = t,
                n.cart().cpqConfigMap.set(o, u)
            }
            t.availabilityStatusMsg !== "OUT_OF_STOCK" ? n.stockStatus(!0) : n.stockStatus(!1),
            n.handleStorePickupClose()
        },
        handleStoreRemoval: function() {
            var e = this;
            e.selectedStore(null);
            var t = new h
              , r = function(t) {
                if (t && t.length > 0)
                    for (var r = 0; r < t.length; r++) {
                        var i = t[r];
                        e.product().id() === i.productId && e.selectedSku().repositoryId === i.catRefId && (e.setStockAvailability(i.stockStatus, i.orderableQuantity),
                        e.stockState(i.stockStatus),
                        e.availabilityDate(i.availabilityDate),
                        null !== e.product().stockStatus() && (e.product().stockStatus()[e.selectedSku().repositoryId] = i.stockStatus,
                        e.product().stockStatus().productSkuInventoryStatus && (e.product().stockStatus().productSkuInventoryStatus[e.selectedSku().repositoryId] = i.inStockQuantity ? i.inStockQuantity : 0)),
                        e.selectedSku().quantity = i.inStockQuantity ? i.inStockQuantity : 0,
                        i.stockStatus === n.IN_STOCK || i.stockStatus === n.PREORDERABLE || i.stockStatus === n.BACKORDERABLE ? e.stockStatus(!0) : e.stockStatus(!1))
                    }
            }
              , i = function(e) {
                console.log("ERROR IN FETCHING INVENTORY DETAILS")
            };
            t.getStockStatuses({
                productSkuIds: e.product().id() + ":" + e.selectedSku().repositoryId,
                catalogId: e.user().catalogId()
            }, r.bind(this), i.bind(this))
        },
        setStockAvailability: function(e, t) {
            var r = this;
            if (e === n.IN_STOCK || e === n.PREORDERABLE || e === n.BACKORDERABLE)
                t ? r.stockAvailable(t) : r.stockAvailable(1)
        },
        handleClose: function() {
            $("#cc-cpqmodalpane").modal("hide")
        },
        handleStorePickupClose: function() {
            this.storeSearchText(""),
            $("#storePickUpModal").modal("hide")
        },
        handleKeyPress: function(e, t) {
            var r = this
              , i = t.which ? t.which : t.keyCode;
            switch (i) {
            case n.KEY_CODE_ENTER:
                r.displayStoreSelector(),
                $("#storePickUpModal").modal("show")
            }
            return !0
        }
    }
})
