/**
 * Please do not delete [used for Intellisense]
 * @param {ServerRequest} request The incoming webhook request
 * @param {Object.<string, any>} settings Custom settings
 * @return void
 */


async function onRequest(request, settings) {

    const requestBody = request.json()
    const requestHeader = request.headers.get("X-Signature")
    const requestParam = request.url.searchParams.get("timestamp")


    const getOrder = async (order_id, base_url, headers) => {
        const endpoint = `${base_url}orders/${order_id}`
        console.log(endpoint)
        const url = new URL(endpoint);
        const res = await fetch(url.toString(), {
            headers: new Headers(headers),
            method: "get",
        })
        if (!res.ok) {
            throw Error(res.statusText)
        }
        return await res.json()

    }

    const getProducts = async (order_id, base_url, headers) => {
        const endpoint = `${base_url}orders/${order_id}/products`
        console.log(endpoint)
        const url = new URL(endpoint);
        const res = await fetch(url.toString(), {
            headers: new Headers(headers),
            method: "get",
        })
        if (!res.ok) {
            throw Error(res.statusText)
        }
        return await res.json()
    }

    const getCustomer = async (customer_id, base_url, headers) => {
        const endpoint = `${base_url}customers/${customer_id}`
        console.log(endpoint)
        const url = new URL(endpoint);
        const res = await fetch(url.toString(), {
            headers: new Headers(headers),
            method: "get",
        })
        if (!res.ok) {
            throw Error(res.statusText)
        }
        let customer = await res.json()

        if (customer.form_fields) {
            customer.janrain_id = findFormFields("JanrainId", customer.form_fields);
            customer.source_id = findFormFields("SourceId", customer.form_fields);
            customer.marketing_program = findFormFields("MarketingProgram", customer.form_fields);
            customer.janrain_uuid = findFormFields("JanrainUUID", customer.form_fields);
        }

        return customer;
    }

    const buildProps = async (order, products, customer) => {
        const props = {};
        orderDateModified = new Date(order.date_modified)
        orderDateCreated = new Date(order.date_created)
        if (typeof order.date_shipped === "string") {
            orderDateShipped = new Date(order.date_shipped)
        }
        else {
            orderDateShipped = ""
        }


        props['orderId'] = order.id;
        props['bigCommerceId'] = order.customer_id;
        props['orderDateCreated'] = orderDateCreated
        props['orderDateModified'] = orderDateModified
        props['orderDateShipped'] = orderDateShipped
        props['orderStatusId'] = order.status_id;
        props['orderStatus'] = order.status;
        props['orderSubtotalExcludingTax'] = order.subtotal_ex_tax;
        props['orderSubtotalIncludingTax'] = order.subtotal_inc_tax;
        props['orderBaseShippingCost'] = order.base_shipping_cost;
        props['orderShippingCostExcludingTax'] = order.shipping_cost_ex_tax;
        props['orderShippingCostIncludingTax'] = order.shipping_cost_inc_tax;
        props['orderShippingCostTax'] = order.shipping_cost_tax;
        props['orderShippingCostTaxClassId'] = order.shipping_cost_tax_class_id;
        props['orderBaseHandlingCost'] = order.base_handling_cost;
        props['orderHandlingCostExcludingTax'] = order.handling_cost_inc_tax;
        props['orderHandlingCostIncludingTax'] = order.handling_cost_inc_tax;
        props['orderHandlingCostTax'] = order.handling_cost_tax;
        props['orderHandlingCostTaxClassId'] = order.handling_cost_tax_class_id;
        props['orderBaseWrappingCost'] = order.base_wrapping_cost;
        props['orderWrappingCostExcludingTax'] = order.wrapping_cost_ex_tax;
        props['orderWrappingCostIncludingTax'] = order.wrapping_cost_inc_tax;
        props['orderWrappingCostTax'] = order.wrapping_cost_tax;
        props['orderWrappingCostTaxClassId'] = order.wrapping_cost_tax_class_id;
        props['orderTotalExcludingTax'] = order.total_ex_tax;
        props['orderTotalIncludingTax'] = order.total_inc_tax;
        props['orderTotalTax'] = order.total_tax;
        props['orderItemsTotal'] = order.items_total;
        props['orderItemsShipped'] = order.items_shipped;
        props['orderPaymentMethod'] = order.payment_method;
        props['orderPaymentProviderId'] = order.payment_provider_id;
        props['orderPaymentStatus'] = order.payment_status;
        props['orderRefundedAmount'] = order.refunded_amount;
        props['orderOrderIsDigital'] = order.order_is_digital;
        props['orderStoreCreditAmount'] = order.store_credit_amount;
        props['orderGiftCertificateAmount'] = order.gift_certificate_amount;
        props['orderIpAddress'] = order.ip_address;
        props['orderGeoipCountry'] = order.geoip_country;
        props['orderGeoipCountryIso2'] = order.geoip_country_iso2;
        props['orderCurrencyId'] = order.currency_id;
        props['orderCurrencyCode'] = order.currency_code;
        props['orderCurrencyExchangeRate'] = order.currency_exchange_rate;
        props['orderDefaultCurrencyId'] = order.default_currency_id;
        props['orderDefaultCurrencyCode'] = order.orderDefaultCurrencyCode;
        props['orderStaffNotes'] = order.staff_notes;
        props['orderCustomerMessage'] = order.customer_message;
        props['orderDiscountAmount'] = order.discount_amount;
        props['orderCouponDiscount'] = order.coupon_discount;
        props['orderShippingAddressCount'] = order.shipping_address_count
        props['orderIsDeleted'] = order.is_deleted;
        props['orderEbayOrderId'] = order.ebay_order_id;
        props['orderCartId'] = order.cart_id;
        props['isEmailOptin'] = order.is_email_opt_in;
        props['orderCreditCardType'] = order.credit_card_type;
        props['orderOrderSource'] = order.order_source;
        props['orderChannelId'] = order.channel_id;
        props['orderExternalSource'] = order.external_source;
        props['orderExternalId'] = order.external_id;
        props['orderExternalMerchantId'] = order.external_merchant_id;
        props['orderTaxProviderId'] = order.tax_provider_id;
        props['orderCustomStatus'] = order.custom_status;
        props['consumerID'] = customer.janrain_id;
        props['sourceId'] = customer.source_id;
        props['marketingProgramNumber'] = settings.marketingProgramNumber
        props['products'] = [];
        const len = products.length;
        for (var i = 0; i < len; i++) {
            props['products'].push({
                productId: products[i].id,
                productOrderId: products[i].order_id,
                productProductId: products[i].product_id,
                productVariantId: products[i].variant_id,
                productOrderAddressId: products[i].order_address_id,
                productName: products[i].name,
                productSku: products[i].sku,
                productUpc: products[i].upc,
                productType: products[i].type,
                productExcludingTax: products[i].price_ex_tax,
                productIncludingTax: products[i].price_inc_tax,
                productPriceTax: products[i].price_tax,
                productBaseTotal: products[i].base_total,
                productTotalExcludingTax: products[i].total_ex_tax,
                productTotalIncludingTax: products[i].total_inc_tax,
                productTotalTax: products[i].total_tax,
                productWeight: products[i].weight,
                productHeight: products[i].height,
                productDepth: products[i].depth,
                productQuantity: products[i].quantity,
                productBaseCostPrice: products[i].base_cost_price,
                productCostPriceIncludingTax: products[i].cost_price_inc_tax,
                productCostPriceExcludingTax: products[i].cost_price_ex_tax,
                productCostPriceTax: products[i].cost_price_tax,
                productIsRefunded: products[i].is_refunded,
                productQuantityRefunded: products[i].quantity_refunded,
                productRefundAmount: products[i].refund_amount,
                productReturnId: products[i].return_id,
                productWrappingName: products[i].wrapping_name,
                productBaseWrappingCost: products[i].base_wrapping_cost,
                productWrappingCostExcludingTax: products[i].wrapping_cost_ex_tax,
                productWrappingCostIncludingTax: products[i].wrapping_cost_inc_tax,
                productWrappingCostTax: products[i].wrapping_cost_tax,
                productWrappingMessage: products[i].wrapping_message,
                productQuantityShipped: products[i].quantity_shipped,
                productEventName: products[i].event_name,
                productEventDate: products[i].event_date,
                productFixedShippingCost: products[i].fixed_shipping_cost,
                productEbayItemId: products[i].ebay_item_id,
                productEbayTransactionId: products[i].ebay_transaction_id,
                productOptionSetId: products[i].option_set_id,
                productParentOrderProductId: products[i].parent_order_product_id,
                productIsBundledProduct: products[i].is_bundled_product,
                productBinPickingNumber: products[i].bin_picking_number,
                productExternalId: products[i].external_id,
                productFulfillmentSource: products[i].fulfillment_source
            });
        }
        return props;
    }

    const setEventName = async status_id => {
        return status_id === 10 ? "Order Completed" :
            status_id === 5 ? "Order Cancelled" :
            status_id === 4 || status_id === 14 ? "Order Refunded" :
            "Order Updated"
    }

    const setExternalIds = async customer => {
        const external_ids = []
        const createExtId = function (id, type) {
            this.id = id.toString(),
                this.type = type,
                this.collection = "users",
                this.encoding = "none"
        }
        // if (customer.janrain_id) {
        //     const consumerId = new createExtId(customer.janrain_id, "consumerId");
        //     external_ids.push(consumerId);
        // }

        if (settings.sourceId) {
            const sourceId = new createExtId(settings.source_id, "sourceId");
            external_ids.push(sourceId);
        }

        if (settings.marketingProgramNumber) {
            const marketingProgramNumber = new createExtId(settings.marketingProgramNumber, "marketingProgramNumber");
            external_ids.push(marketingProgramNumber);
        }

        // if (customer.id) {
        //     const bigCommerceId = new createExtId(customer.id, "bigCommerceId");
        //     external_ids.push(bigCommerceId);
        // }

        if(customer.phone){
            let phone_hash = crypto.createHash('sha256').update(customer.phone).digest('hex');
            const phone_id = new createExtId(phone_hash, "phone");
            external_ids.push(phone_id);
        }

        if (customer.email){
            let email_hash = crypto.createHash('sha256').update(customer.email.toLowerCase()).digest('hex');
            const email_id = new createExtId(email_hash, "emailSha256Hash");
            external_ids.push(email_id);
        }

        if (settings.countryCode){
            const country_code_id = new createExtId(settings.countryCode, "countryCode")
            external_ids.push(country_code_id);
        }

        return external_ids
    }

    const buildTraits = async (customer, timestamp) => {
        let email_hash = crypto.createHash('sha256').update(customer.email.toLowerCase()).digest('hex');
        if (customer.phone) {
            let phone_hash = crypto.createHash('sha256').update(customer.phone).digest('hex');
        } else {
            phone_hash = ""
        }

        let traits = {
            "email": customer.email,
            "emailSha256Hash": email_hash,
            "firstName": customer.first_name,
            "lastName": customer.last_name,
            "phoneNumber": customer.phone,
            "phoneNumberSha256Hash": phone_hash,
            "userId": customer.id,
            "lastActivityDate": timestamp,
            "registrationDate": new Date(customer.date_created),
            "sourceId": settings,
            "marketingProgramNumber": settings,
            "countryCode": settings

        };
        return traits;
    }

    const getCustomerAddress = async (customer_id, customer_address_id, base_url, headers) => {
        const endpoint = `${base_url}customers/${customer_id}/addresses/${customer_address_id}`
        console.log(endpoint)
        const url = new URL(endpoint);
        const res = await fetch(url.toString(), {
            headers: new Headers(headers),
            method: "get",
        })
        if (!res.ok) {
            throw Error(res.statusText)
        }
        let customerAddress = await res.json()

        return customerAddress;
    }

    const buildAddressTraits = async (customerAddress) => {
        if (customerAddress.phone) {
            let phone_hash = crypto.createHash('sha256').update(customerAddress.phone).digest('hex');
        } else {
            phone_hash = ""
        }

        let traits = {
            "firstName": customerAddress.first_name,
            "lastName": customerAddress.last_name,
            "phoneNumber": customerAddress.phone,
            "phoneNumberSha256Hash": phone_hash,
            "userId": customerAddress.customer_id,
            "bigCommerceId": customerAddress.customer_id,
            "addressLine1": customerAddress.street1,
            "addressLine2": customerAddress.street2,
            "cityName": customerAddress.city,
            "territoryName": customerAddress.state,
            "postalAreaCode": customerAddress.zip,
            "countryCode": settings
        };
        return traits;
    }

    const getSubscriber = async (subscriber_id, base_url, headers) => {
        const endpoint = `${base_url}customers/subscribers/${subscriber_id}`
        console.log(endpoint)
        const url = new URL(endpoint);
        const res = await fetch(url.toString(), {
            headers: new Headers(headers),
            method: "get",
        })
        if (!res.ok) {
            throw Error(res.statusText)
        }
        let subscriber = await res.json()

        return subscriber.data;
    }

    const buildSubscriberProps = async (subscriber) => {
        let email_hash = crypto.createHash('sha256').update(subscriber.email.toLowerCase()).digest('hex');

        let props = {
            "email": subscriber.email,
            "emailSha256Hash": email_hash,
            "userId": subscriber.id,
            "lastActivityDate": new Date(subscriber.date_modified),
            "registrationDate": new Date(subscriber.date_created),
            "sourceId": settings,
            "emailSubscriptionServiceName": settings,
            "emailSubscriptionOptNumber": settings,
            "optText":settings

        };
        return props;
    }

    let executeOrderFlow = async function (requestBody) {
        let base_url = `https://api.bigcommerce.com/stores/${settings.storeId}/v2/`
        let headers = {
            'x-auth-client': settings.authClient,
            'x-auth-token': settings.authToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        let order_id = requestBody.data.id;
        let order = await getOrder(order_id, base_url, headers);
        let products = await getProducts(order_id, base_url, headers);
        let customer_id = order.customer_id
        let customer = await getCustomer(customer_id, base_url, headers);
        let properties = await buildProps(order, products, customer);
        const eventName = await setEventName(order.status_id);
        const externalIds = await setExternalIds(customer);
        let timestamp = new Date(order.date_modified);


        Segment.track({
            event: eventName,
            userId: customer_id,
            properties: properties,
            timestamp: timestamp.toISOString(),
            context: {
                externalIds: externalIds
            }
        })
    }

    let executeCustomerFlow = async function (requestBody) {
        let base_url = `https://api.bigcommerce.com/stores/${settings.storeId}/v2/`
        let headers = {
            'x-auth-client': settings.authClient,
            'x-auth-token': settings.authToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        let customer_id = requestBody.data.id;
        let customer = await getCustomer(customer_id, base_url, headers);
        let timestamp = new Date(customer.date_modified);
        let traits = await buildTraits(customer, timestamp)
        const externalIds = await setExternalIds(customer);

        Segment.identify({
            userId: customer_id,
            traits: traits,
            timestamp: timestamp.toISOString(),
            context: {
                externalIds: externalIds
            }
        })
    }

    let executeCustomerAddressFlow = async function (requestBody) {
        let base_url = `https://api.bigcommerce.com/stores/${settings.storeId}/v2/`
        let headers = {
            'x-auth-client': settings.authClient,
            'x-auth-token': settings.authToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        let customer_id = requestBody.data.address.customer_id;
        let customer_address_id = requestBody.data.id
        let customer = await getCustomer(customer_id, base_url, headers);
        let customerAddress = await getCustomerAddress(customer_id, customer_address_id, base_url, headers);
        let timestamp = new Date(customer.date_modified);
        let traits = await buildAddressTraits(customerAddress)
        const externalIds = await setExternalIds(customer);

        Segment.identify({
            userId: customer_id,
            traits: traits,
            context: {
                externalIds: externalIds
            }
        })
    }

    let executeSubscriberFlow = async function (requestBody) {
        let base_url = `https://api.bigcommerce.com/stores/${settings.storeId}/v3/`
        let headers = {
            'x-auth-client': settings.authClient,
            'x-auth-token': settings.authToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        let subscriber_id = requestBody.data.id
        let subscriber = await getSubscriber(subscriber_id, base_url, headers);
        let properties = await buildSubscriberProps(subscriber);
        const externalIds = await setExternalIds(subscriber);

        Segment.track({
            event: "Changed Opt Status",
            userId: subscriber.id, // id of subscriber record
            properties: properties,
            context:{
                externalIds: externalIds
            }
        })
    }




    if (requestBody.data.type === 'order') {
        await executeOrderFlow(requestBody);
    }
    if (requestBody.scope === "store/customer/address/updated" || requestBody.scope === "store/customer/address/created") {
        await executeCustomerAddressFlow(requestBody)
    }
    if (requestBody.scope === "store/customer/updated" || requestBody.scope === "store/customer/created") {
        await executeCustomerFlow(requestBody)
    }
    if (requestBody.data.type === 'subscriber') {
        await executeSubscriberFlow(requestBody);
    }

}

//settings
// authClient
// authToken
// marketingProgramNumber
// sourceId
// countryCode
// optText
// emailSubscriptionOptNumber
// emailSubscriptionServiceName

