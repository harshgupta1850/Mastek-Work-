define(["knockout", "viewModels/productListingViewModelFactory", "CCi18n", "ccConstants", "pubsub", "pageLayout/product", "storageApi", "ccStoreConfiguration"], function(e, t, n, r, i, s, o, u) {
    "use strict";
    var a = 1, f = !1, l = r.DEFAULT_ITEMS_PER_PAGE, c = 0, h = "", p, d, v = 300, m = 300, g = 600, y = 400, b = 300, w = "", E = "selectedProductsPerRow", S = !1, x = !1;
    return {
        productsPerRowArray: e.observableArray([e.observable(!1), e.observable(!1), e.observable(!1), e.observable(!1), e.observable(!1)]),
        selectedProductsPerRow: e.observable(),
        displayRefineResults: e.observable(!1),
        showListViewButton: e.observable(!1),
        showResultsPerPageSection: e.observable(!1),
        largeDimensions: e.observable("300,300"),
        mediumDimensions: e.observable("300,300"),
        imageSizes: [v, m, g, y, b],
        rowClass: e.observable("items4"),
        WIDGET_ID: "productListing",
        mobileSize: 300,
        beforeAppearLoaded: $.Deferred(),
        onLoad: function(a) {
            var v = {};
            a.productListing = new Object,
            v[r.ENDPOINT_KEY] = r.ENDPOINT_PRODUCTS_LIST_PRODUCTS,
            v[r.IDENTIFIER_KEY] = "productListingData";
            var m = u.getInstance().getFilterToUse(v);
            m && (a.productListing.filterKey = m),
            $.Topic(i.topicNames.SEARCH_RESULTS_FOR_CATEGORY_UPDATED).subscribe(function(e) {
                !this.navigation || this.navigation.length == 0 ? a.displayRefineResults(!1) : a.displayRefineResults(!0)
            }),
            $.Topic(i.topicNames.SEARCH_FAILED_TO_PERFORM).subscribe(function(e) {
                a.displayRefineResults(!1)
            });
            var g = this
              , y = [{
                id: "default",
                displayText: n.t("ns.productlisting:resources.sortByRelevanceText"),
                order: e.observable("none"),
                maintainSortOrder: !0,
                serverOnly: !0
            }, {
                id: "listPrice",
                displayText: n.t("ns.productlisting:resources.sortByPriceAscText"),
                order: e.observable("asc"),
                maintainSortOrder: !0,
                serverOnly: !0
            }, {
                id: "listPrice",
                displayText: n.t("ns.productlisting:resources.sortByPriceDescText"),
                order: e.observable("desc"),
                maintainSortOrder: !0,
                serverOnly: !0
            }]
              , b = [{
                id: "product.displayName",
                displayText: n.t("ns.productlisting:resources.sortByRelevanceText"),
                order: e.observable("none"),
                maintainSortOrder: !0,
                serverOnly: !0
            }, {
                id: "sku.activePrice",
                displayText: n.t("ns.productlisting:resources.sortByPriceAscText"),
                sortKey: "sku.activePrice",
                order: e.observable("asc"),
                maintainSortOrder: !0,
                serverOnly: !0
            }, {
                id: "sku.activePrice",
                displayText: n.t("ns.productlisting:resources.sortByPriceDescText"),
                sortKey: "sku.activePrice",
                order: e.observable("desc"),
                maintainSortOrder: !0,
                serverOnly: !0
            }];
            h = a.listType(),
            a.listingViewModel = e.observable(),
            a.listingViewModel(t.createListingViewModel(a)),
            a.listType() === r.LIST_VIEW_PRODUCTS ? a.listingViewModel().sortOptions(y) : a.listingViewModel().sortOptions(b),
            a.listingViewModel().productGridExtension = !0,
            a.listingViewModel().useGenericSort = !0,
            a.listingViewModel().isCacheEnabled = a.isViewModelCacheEnabled ? a.isViewModelCacheEnabled() : !1,
            a.listingViewModel().viewModelCacheLimit = a.viewModelCacheLimit ? a.viewModelCacheLimit() : 3,
            a.user().catalog && (a.listingViewModel().catalog = a.user().catalog.repositoryId),
            a.listingViewModel().category.subscribe(function(e) {
                e.repositoryId != a.lastCategoryId && (a.listingViewModel().itemsPerPage = +a.productsPerPage(),
                a.listingViewModel().categoryOrSearchChanged = !0),
                a.lastCategoryId = e.repositoryId
            }),
            a.sortingCallback = function(e) {}
            ,
            a.listingViewModel().itemsPerPage = +a.productsPerPage(),
            a.listingViewModel().recordsPerPage(+a.productsPerPage()),
            a.updateRefinements = function() {
                var e = {
                    recordsPerPage: l,
                    recordOffSet: c,
                    newSearch: !1,
                    navigationDescriptors: a.dimensionId(),
                    suppressResults: !0,
                    searchType: r.SEARCH_TYPE_SIMPLE
                };
                $.Topic(i.topicNames.SEARCH_CREATE_CATEGORY_LISTING).publishWith(e, [{
                    message: "success"
                }]);
                var t = {
                    categoryRoute: a.category().route,
                    categoryName: a.category().displayName,
                    repositoryId: a.category().repositoryId,
                    dimensionId: a.dimensionId()
                };
                o.getInstance().setItem("category", JSON.stringify(t)),
                $.Topic(i.topicNames.CATEGORY_UPDATED).publish(t)
            }
            ,
            a.scrollHandler = function(e) {
                var t = $(window).scrollTop()
                  , n = $(window).height()
                  , r = $("#product-grid").hasClass("active") ? "#product-grid" : "#product-list"
                  , i = $(r).height();
                t + n >= i / 5 * 4 && a.listingViewModel().incrementPage()
            }
            ,
            a.scrollHandleOnViewPort = function() {
                $(window).off("scroll.page"),
                a.listingViewModel().viewportMode() == r.TABLET_VIEW || a.listingViewModel().viewportMode() == r.PHONE_VIEW || a.isScrollEnabled && a.isScrollEnabled() ? ($(window).on("scroll.page", a.scrollHandler),
                a.listingViewModel().pageNumber = 1,
                a.listingViewModel().isLoadOnScroll(!0)) : a.listingViewModel().isLoadOnScroll(!1)
            }
            ,
            a.productGrid = e.observableArray([]),
            a.changePageForSearch = function(e) {
                $("html, body").animate({
                    scrollTop: 0
                }, "slow"),
                a.productGrid([]),
                a.listingViewModel().targetPage = 1;
                if (this.parameters.type != r.PARAMETERS_SEARCH_QUERY)
                    return;
                this.parameters.page ? (a.listingViewModel().pageNumber = parseInt(this.parameters.page),
                a.listingViewModel().targetPage = parseInt(this.parameters.page)) : a.listingViewModel().pageNumber = 1,
                a.listingViewModel().parameters = this.parameters,
                a.listType() == r.LIST_VIEW_SEARCH && (a.listingViewModel().recordsPerPage && a.listingViewModel().recordsPerPage() != null && !a.changedViaPagination && (isNaN(a.productsPerPage()) ? a.listingViewModel().recordsPerPage(r.DEFAULT_SEARCH_RECORDS_PER_PAGE) : a.listingViewModel().recordsPerPage(parseInt(a.productsPerPage()))),
                a.scrollHandleOnViewPort(),
                a.listingViewModel().load(1)),
                a.listingViewModel().paginationType(2)
            }
            ,
            $.Topic(i.topicNames.PAGE_CHANGED).subscribe(a.getPageUrlData.bind(a)),
            $.Topic(i.topicNames.PAGE_PAGINATION_CHANGE).subscribe(a.changePage.bind(a)),
            $.Topic(i.topicNames.PAGE_PARAMETERS).subscribe(function(e) {
                a.beforeAppearLoaded.done(a.changePageForSearch.bind(this))
            }),
            a.formatProducts = function(e) {
                var t = []
                  , n = e.length;
                for (var r = 0; r < n; r++)
                    e[r] && t.push(new s(e[r]));
                return t
            }
            ,
            a.resultsText = e.computed(function() {
                return a.listingViewModel().resultsText()
            }, a.listingViewModel()),
            a.updateFocus = function() {
                return $.Topic(i.topicNames.UPDATE_LISTING_FOCUS).publish(),
                !0
            }
            ,
            a.updateScrollPosition = function() {
                if (a.listingViewModel().isCacheEnabled) {
                    var e = a.listingViewModel().findCachedResultIndex();
                    e != undefined && (a.listingViewModel().cachedViewModels[e].scrollPosition = window.pageYOffset || 0)
                }
            }
            ,
            a.updateFocusAndDisableQV = function(e, t) {
                return $(".quickViewElement").hide(),
                a.updateFocus()
            }
            ,
            a.productGridComputed = e.computed(function() {
                var e, t, n, r, i = [], s = a.listingViewModel().currentProductsComputed();
                if (!s)
                    return;
                e = s.length,
                r = parseInt(a.listingViewModel().itemsPerRow(), 10),
                t = 0,
                n = t + r;
                while (n <= e)
                    i.push(s.slice(t, n)),
                    t = n,
                    n += r;
                return n > e && t < e && i.push(s.slice(t, e)),
                i
            }, a),
            a.productGridComputed.subscribe(function(e) {
                e && e.length > 0 && (a.listingViewModel().refreshValues == 1 ? (a.productGrid(e),
                a.listingViewModel().refreshValues = !1) : a.productGrid.push.apply(a.productGrid, e))
            }),
            a.adjustScrollPosition = function() {
                if (a.listingViewModel().isCacheEnabled && a.productGrid() && a.productGrid().length > 1) {
                    var e = a.listingViewModel().findCachedResultIndex();
                    e != undefined && a.listingViewModel().cachedViewModels[e].scrollPosition > 0 && ($("html, body").stop(),
                    $(window).scrollTop(a.listingViewModel().cachedViewModels[e].scrollPosition))
                }
            }
            ,
            a.categoryUpdate = function(e) {
                if (!e)
                    return;
                var n = a.listingViewModel().category();
                a.listType() !== r.LIST_VIEW_PRODUCTS && (a.listType(r.LIST_VIEW_PRODUCTS),
                a.listingViewModel(t.createListingViewModel(a))),
                (!n || n.id != e.id || f) && a.listingViewModel().resetSortOptions();
                if (!n || n.id != e.id || f || !a.listingViewModel().paginationOnly)
                    a.listingViewModel().category(e),
                    a.listingViewModel().clearOnLoad = !0,
                    a.productGrid([]),
                    a.listingViewModel().targetPage = 1,
                    a.listingViewModel().load(1),
                    a.listingViewModel().paginationType(1),
                    f = !1
            }
            ,
            a.ensureActiveTab = function() {
                !$("#product-grid").hasClass("active") && !$("#product-list").hasClass("active") && $("#product-grid").addClass("active")
            }
            ,
            a.listType() !== r.LIST_VIEW_PRODUCTS && $.Topic(i.topicNames.SEARCH_RESULTS_UPDATED).subscribe(function(e) {
                a.category(null),
                f = !0,
                a.listType() !== r.LIST_VIEW_SEARCH && (a.listType(r.LIST_VIEW_SEARCH),
                a.listingViewModel(t.createListingViewModel(a))),
                a.ensureActiveTab(),
                this.navigation && this.navigation.length > 0 || this.breadcrumbs && this.breadcrumbs.refinementCrumbs.length > 0 ? a.displayRefineResults(!0) : a.displayRefineResults(!1)
            }),
            $.Topic(i.topicNames.SEARCH_CREATE).subscribe(function(e) {
                !a.listingViewModel().changedViaDropDown && !a.changedViaPagination && !a.productViewed ? (a.listingViewModel().itemsPerPage = +a.productsPerPage(),
                a.listingViewModel().categoryOrSearchChanged = !0,
                a.changedViaPagination = !1) : a.productViewed && (a.changedViaPagination = !1,
                a.listingViewModel().categoryOrSearchChanged = !1,
                a.productViewed = !1)
            }),
            $.Topic(i.topicNames.PAGE_VIEW_CHANGED).subscribe(function(e) {
                a.changedViaPagination = !1,
                e && e.path == "searchresults" && e.parameters != null && e.parameters.indexOf("&page=") >= 0 && (a.changedViaPagination = !0,
                a.listingViewModel().categoryOrSearchChanged = !1)
            }),
            $.Topic(i.topicNames.PRODUCT_VIEWED).subscribe(function(e) {
                a.productViewed = document.location.pathname != "/searchresults" ? !0 : !1
            }),
            d = $(window).width(),
            $(window).resize(function() {
                var t = window.innerWidth || $(window).width();
                if (a.isActiveOnPage(p) && t != d) {
                    var n = a.listingViewModel().viewportMode();
                    a.listingViewModel().checkResponsiveFeatures(t),
                    n != a.listingViewModel().viewportMode() && (a.listingViewModel().viewportMode() == r.PHONE_VIEW ? (a.productsPerRowChange(r.PHONE_VIEW),
                    a.listingViewModel().itemsPerRow(r.PHONE_VIEW),
                    e.observable(a.mobileSize + "," + a.mobileSize),
                    e.observable(a.mobileSize + "," + a.mobileSize),
                    a.listingViewModel().listingImageSize(a.mobileSize),
                    a.rowClass("items2 mobile")) : a.listingViewModel().viewportMode() == r.TABLET_VIEW && (a.productsPerRowChange(r.LARGE_DESKTOP_VIEW),
                    a.listingViewModel().itemsPerRow(r.LARGE_DESKTOP_VIEW))),
                    a.scrollHandleOnViewPort(),
                    a.listingViewModel().cleanPage(),
                    d = t
                }
            }),
            a.handlePageChanged = function(e) {
                var t = this;
                e.pageId != "category" && e.pageId != "searchresults" && $(window).off("scroll.page", t.scrollHandler)
            }
            ,
            $.Topic(i.topicNames.PAGE_CHANGED).subscribe(a.handlePageChanged.bind(a)),
            a.selectedProductsPerRow(a.getSelectedProductsPerRow())
        },
        beforeAppear: function(e) {
            var t = this;
            h = t.listType(),
            t.listType() == r.LIST_VIEW_SEARCH && (t.displayRefineResults(!1),
            t.listingViewModel().titleText(""),
            t.listingViewModel().noSearchResultsText(""),
            t.listingViewModel().suggestedSearches({})),
            t.category() && t.listType() != r.LIST_VIEW_SEARCH && t.categoryUpdate(t.category()),
            t.listType() === r.LIST_VIEW_PRODUCTS && (!t.displayRefineResults() || !t.listingViewModel().paginationOnly) && (t.dimensionId() ? t.updateRefinements() : (t.displayRefineResults(!1),
            $.Topic(i.topicNames.OVERLAYED_GUIDEDNAVIGATION_CLEAR).publish())),
            t.showListViewOption && t.showListViewButton(t.showListViewOption());
            if (t.showResultsPerPageOption) {
                var n = t.isScrollEnabled && t.isScrollEnabled();
                t.showResultsPerPageSection(t.showResultsPerPageOption() && !n)
            }
            t.listingViewModel().handleResponsiveViewports(),
            t.setDefaultItemsPerRow(),
            t.beforeAppearLoaded.resolve()
        },
        getPageUrlData: function(e) {
            var t = this;
            p = e;
            if (e.pageId == r.CATEGORY_CONTEXT || e.pageId == r.SEARCH_RESULTS)
                t.listingViewModel().pageId(e.pageId),
                t.listingViewModel().contextId(e.contextId),
                t.listingViewModel().seoslug(e.seoslug)
        },
        changePage: function(e) {
            var t = this;
            $("html, body").animate({
                scrollTop: 0
            }, "slow"),
            e.page ? t.listingViewModel().pageNumber = parseInt(e.page) : (t.listingViewModel().pageNumber = 1,
            t.listingViewModel().initializeIndex()),
            t.listType() == r.LIST_VIEW_PRODUCTS && t.scrollHandleOnViewPort(),
            t.listType() == r.LIST_VIEW_PRODUCTS && e.paginationOnly && t.listingViewModel().getPage(t.listingViewModel().pageNumber),
            t.listingViewModel().paginationOnly = e.paginationOnly,
            t.listingViewModel().isLoadOnScroll() || t.productGrid([])
        },
        handleSortingHelper: function(e, t) {
            var n = this;
            n.productGrid([]),
            n.listingViewModel().handleSorting(e, t)
        },
        handleRefineResults: function(e, t) {
            return !$("#CC-overlayedGuidedNavigation-column").hasClass("open") && !$("#CC-overlayedGuidedNavigation").hasClass("CC-overlayedGuidedNavigation-mobileView") && ($("#CC-overlayedGuidedNavigation").addClass("CC-overlayedGuidedNavigation-mobileView"),
            $.Topic(i.topicNames.OVERLAYED_GUIDEDNAVIGATION_SHOW).publish()),
            ($(window)[0].innerWidth || $(window).width()) < r.VIEWPORT_TABLET_LOWER_WIDTH && ($(window).off("scroll.page"),
            $("html, body").css("overflow-y", "hidden")),
            $("#CC-overlayedGuidedNavigation-done").focus(),
            !1
        },
        priceUnavailableText: function() {
            return n.t("ns.productlisting:resources.priceUnavailable")
        },
        setItemsPerRow: function(e, t) {
            var n = this;
            n.listingViewModel().itemsPerRow(e),
            n.productGrid([]),
            n.listingViewModel().listingImageSize(null),
            n.listingViewModel().itemsPerRowInTabletView(e),
            n.listingViewModel().itemsPerRowInDesktopView(e),
            n.listingViewModel().itemsPerRowInLargeDesktopView(e),
            n.listingViewModel().listingImageSize(t),
            n.largeDimensions(t + "," + t),
            n.mediumDimensions(t + "," + t)
        },
        productsPerRowChange: function(e) {
            var t = this
              , n = "";
            if (e != t.getSelectedProductsPerRow()) {
                t.isScrollEnabled && t.isScrollEnabled() && (t.listingViewModel().currentPage(1),
                t.listingViewModel().currentPage.notifySubscribers()),
                t.listingViewModel().scrolledViewModels = [];
                if (e == 0)
                    t.setItemsPerRow(1, t.imageSizes[1]);
                else {
                    if (e == -1) {
                        t.listingViewModel().viewportMode() == r.PHONE_VIEW ? (e = 2,
                        n = " mobile") : e = 4;
                        if (!t.isScrollEnabled || t.isScrollEnabled && !t.isScrollEnabled())
                            t.listingViewModel().currentPage(1),
                            t.listingViewModel().currentPage.notifySubscribers()
                    }
                    t.setItemsPerRow(e, t.imageSizes[e])
                }
                t.rowClass("items" + e + n),
                $.each(t.productsPerRowArray(), function(n, r) {
                    t.setProductsPerRowArrayElement(n, e == n)
                }),
                o.getInstance().setItem(E, e),
                t.selectedProductsPerRow(e)
            }
        },
        getSelectedProductsPerRow: function() {
            var e = this
              , t = o.getInstance().getItem(E);
            return t == null && (e.listingViewModel().viewportMode() == r.PHONE_VIEW ? t = r.PHONE_VIEW : e.listingViewModel().viewportMode() == r.TABLET_VIEW ? t = r.LARGE_DESKTOP_VIEW : t = r.LARGE_DESKTOP_VIEW),
            t
        },
        setDefaultItemsPerRow: function() {
            var e = this
              , t = e.getSelectedProductsPerRow()
              , n = t;
            t == 0 && (e.showListViewOption() ? n = 1 : (o.getInstance().removeItem(E),
            t = e.getSelectedProductsPerRow(),
            n = t)),
            e.selectedProductsPerRow(t),
            o.getInstance().setItem(E, t),
            e.setItemsPerRow(n, e.imageSizes[t]),
            e.listingViewModel().viewportMode() == r.PHONE_VIEW ? e.rowClass("items2 mobile") : e.rowClass("items" + t),
            $.each(e.productsPerRowArray(), function(n, r) {
                e.setProductsPerRowArrayElement(n, t == n)
            })
        },
        setProductsPerRowArrayElement: function(e, t) {
            var n = this;
            n.productsPerRowArray()[e](t)
        },
        getProductsPerRowClass: function(e) {
            return this.productsPerRowArray()[e]() == 1 ? "active" : ""
        },
        getGridCss: function(e) {
            var t = this
              , n = t.getSelectedProductsPerRow();
            return e ? n != 0 ? "active" : "" : n == 0 ? "active" : ""
        },
        handleResultsPerPageHelper: function(e, t) {
            var n = this;
            n.listingViewModel().itemsPerPage != e.value && (n.productGrid([]),
            n.listingViewModel().handleResultsPerPage(e, t))
        },
        getProductsPerRowHasFocus: function(e) {
            var t = this
              , n = t.getSelectedProductsPerRow();
            return n == e
        },
        resultsPerPageCallback: function(e) {}
    }
})
