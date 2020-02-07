<!-- ko if: !$parents[0].shopperInput -->
                 <img class="img-responsive" data-bind="productVariantImageSource:
                            {src: $data, imageType: 'thumb',
                             alt: displayName,
                             errorSrc: '/img/no-image.jpg',
                             errorAlt: 'Missing Product Image'
                             },
                             attr:{id: 'CC-checkoutCartSummary-itemImage-'+id+catRefId}"></img>    
            <!-- /ko -->
            <!-- ko if: $parents[0].shopperInput -->
            <!-- ko if: $parents[0].shopperInput.br_customizationNumber -->
                <img data-bind="attr: {src: 'https://app.brighton.com/api/preview/?confirmationNum='+ $parents[0].shopperInput.br_customizationNumber.transnumber +'&type='+ $parents[0].shopperInput.br_customizationNumber.type, errorSrc: '/img/no-image.jpg'}" />
            <!-- /ko -->
            <!-- ko if: !$parents[0].shopperInput.br_customizationNumber -->
            <img class="img-responsive" data-bind="productVariantImageSource:
            {src: $data, imageType: 'thumb',
             alt: displayName,
             errorSrc: '/img/no-image.jpg',
             errorAlt: 'Missing Product Image'
             },
             attr:{id: 'CC-checkoutCartSummary-itemImage-'+id+catRefId}"></img>  
            <!-- /ko -->
        <!-- /ko -->



<!-- ko if: !$parents[1].shopperInput -->
                                            <a data-bind="ccLink : $data">
                                                <img data-bind="productVariantImageSource: {src: $data, imageType:'thumb', alt: displayName,
                                                errorSrc: '/img/no-image.jpg', errorAlt: 'Missing Product Image'},
                                                attr:{id: 'CC-shoppingCart-productImage-' + $parents[1].productId + $parents[1].catRefId + ($parents[1].commerceItemId ? $parents[1].commerceItemId: '') + $index() }"/>
                                            </a>
                                            <!-- /ko -->
                                            <!-- ko if: $parents[1].shopperInput -->
                                                <!-- ko if: $parents[1].shopperInput.br_customizationNumber -->
                                                    <a data-bind="attr: {href: 'https://app.brighton.com/api/preview/?confirmationNum='+ $parents[1].shopperInput.br_customizationNumber.transnumber +'&type='+ $parents[1].shopperInput.br_customizationNumber.type}" target="_blank"  >
                                                        <img data-bind="attr: {src: 'https://app.brighton.com/api/preview/?confirmationNum='+ $parents[1].shopperInput.br_customizationNumber.transnumber +'&type='+ $parents[1].shopperInput.br_customizationNumber.type, errorSrc: '/img/no-image.jpg'}" />
                                                    </a>
                                                <!-- /ko -->
                                                <!-- ko if: !$parents[1].shopperInput.br_customizationNumber -->
                                                    <a data-bind="ccLink : $data">
                                                        <img data-bind="productVariantImageSource: {src: $data, imageType:'thumb', alt: displayName,
                                                        errorSrc: '/img/no-image.jpg', errorAlt: 'Missing Product Image'},
                                                        attr:{id: 'CC-shoppingCart-productImage-' + $parents[1].productId + $parents[1].catRefId + ($parents[1].commerceItemId ? $parents[1].commerceItemId: '') + $index() }"/>
                                                    </a>
                                                <!-- /ko -->
                                            <!-- /ko -->