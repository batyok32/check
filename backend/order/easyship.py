import requests
# import simplejson as json
import json
from datetime import datetime
from .models import ShippingLabel, OrderItem, OrderItemBox, Wholestore
from administration.models import LabelCreateFail
from decimal import Decimal
from products.countries import countries
from django.conf import settings
import time
from pyzipcode import ZipCodeDatabase


zcdb = ZipCodeDatabase()

def get_country_code(origin_country_name):
    for country in countries:
        if country['name'] == origin_country_name:
            return country['code']
    return None


def buy_label(order_item_id):
    orderItem = OrderItem.objects.select_related('product', 'order', 'seller').get(id=order_item_id)

    url = "https://api.easyship.com/2023-01/shipments"

    payload = {
         "origin_address": {
            "line_1": orderItem.origin_address_line1,
            "line_2": orderItem.origin_address_line2,
            "state": orderItem.origin_state,
            "city": orderItem.origin_city,
            "postal_code": orderItem.origin_zip_code,
            "country_alpha2": get_country_code(orderItem.origin_country) ,
            "contact_name": orderItem.seller.user.first_name + orderItem.seller.user.last_name,
            "company_name": orderItem.seller.store_name,
            "contact_phone": orderItem.seller.phone_number,
            "contact_email": orderItem.seller.user.email
        },
        "destination_address": {
            "line_1": orderItem.order.destination_address_line1,
            "line_2": orderItem.order.destination_address_line2,
            "state": orderItem.order.destination_state,
            "city": orderItem.order.destination_city,
            "postal_code": orderItem.order.destination_zip_code,
            "country_alpha2": get_country_code(orderItem.order.destination_country) ,
            "contact_name": orderItem.order.destination_full_name,
            "company_name": None,
            "contact_phone": orderItem.order.destination_phone_number,
            "contact_email": orderItem.order.customer.email
        },
        
        "set_as_residential": False,

        "regulatory_identifiers": {
            "eori": None,
            "ioss": None,
            "vat_number": None
        },
        "buyer_regulatory_identifiers": {
            "ein": None,
            "vat_number": None
        },
        "incoterms": "DDU",
        "insurance": { "is_insured": False },
        
        "order_data": {
            "buyer_selected_courier_name": None,
            "platform_name": "YuuSell",
            "order_created_at": None
        },
        "courier_selection": {
            "allow_courier_fallback": False,
            "apply_shipping_rules": True,
            "list_unavailable_couriers": False,
            "selected_courier_id":orderItem.shipping_courier_id,

        },
        "shipping_settings": {
            "additional_services": { "qr_code": None },
             "units": {
                        "weight": orderItem.product.weight_unit,
                        "dimensions": orderItem.product.dimensions_unit
                    },
            "buy_label": False,
            "buy_label_synchronous": True,
            "printing_options": {
                "format": "png",
                "label": "4x6",
                "commercial_invoice": "A4",
                "packing_slip": "4x6"
            }
        },
        "parcels": [
            {
                "total_actual_weight": float(orderItem.product.box_weight),
                "box": {
                    "length":float(orderItem.product.box_length) ,
                    "width": float(orderItem.product.box_width) ,
                    "height": float(orderItem.product.box_height) ,
                    "weight":float(orderItem.product.box_weight) 
                },
                "items": [
                    {
                        "description": orderItem.product_name,
                        "category": None,
                        "hs_code": orderItem.product.category.hs_code,
                        "contains_battery_pi966": None,
                        "contains_battery_pi967": None,
                        "contains_liquids": None,
                        "sku": f"{orderItem.product.id}",
                        "origin_country_alpha2": get_country_code( orderItem.origin_country) ,
                        "quantity": 1,
                        "declared_currency": "USD",
                        "declared_customs_value":  float(orderItem.total_price)
                    }
                ]
            },
    
        ]
    }

    print("PAYLOAD MTF", payload)
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        # "authorization": "Bearer sand_PKx87/e9og8g8P40d08oWOSKempoCT1u5foiNMpoKoo="
        "authorization": "Bearer prod_5XanSn1gHVKPW8e5eL5AyTrqVWwD9q3b15E8rb7fFME="
    }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code > 205:
        print("SHIPPING LABEL CREATE ERROR", response.text)
        LabelCreateFail.objects.create(error=response.text, notes='Label create status more than 205', order_item=orderItem)
        return "Error"

    response_json = response.json()

    if "shipment" not in response_json:
        LabelCreateFail.objects.create(error=response.text, notes='Response does not contain "shipment" key', order_item=orderItem)
        print("Response does not contain 'shipment' key")
        return "Error"

    shipment = response_json["shipment"]
    shipment_id = shipment.get("easyship_shipment_id", "TEST shipment_id")

    # Check if courier is not None before accessing its keys
    if shipment.get("courier"):
        courier_id = shipment["courier"].get("id", "TEST courier_id")
        courier_name = shipment["courier"].get("name", "TEST courier_name")
    else:
        courier_id = "TEST courier_id"
        courier_name = "TEST courier_name"

    label_state = shipment.get("label_state", "TEST label_state")

    # Function to get shipping documents
    def get_shipping_documents(shipment_id):
        url = f"https://api.easyship.com/2023-01/shipments/{shipment_id}"
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return None

        response_json = response.json()
        if "shipment" in response_json:
            shipping_documents = response_json["shipment"].get("shipping_documents", [])
            if shipping_documents:
                return shipping_documents[0]
        return None
    
    max_retries = 10
    retry_interval = 60
    # Retry mechanism to get shipping documents
    shipping_document = None
    for _ in range(max_retries):
        shipping_document = get_shipping_documents(shipment_id)
        if shipping_document:
            break
        time.sleep(retry_interval)

    if not shipping_document:
        print("Failed to get shipping documents after retries")
        return "Error"

    # Extract shipping document details
    shipping_document_url = shipping_document.get("url", "TEST DOC")
    shipping_document_format = shipping_document.get("format", "TEST FORMAT")
    shipping_document_size = shipping_document.get("page_size", "TEST SIZE")

    tracking_page_url = shipment.get("tracking_page_url", "TEST tracking_page_url")

    # Extract trackings if they exist
    trackings = shipment.get("trackings", [])
    if trackings:
        tracking = trackings[0].get("tracking_number", "TEST TRACKING")
    else:
        tracking = "TEST TRACKING"

    # Create and save ShippingLabel object
    label = ShippingLabel.objects.create(
        shipment_id=shipment_id,
        order_item=orderItem,
        courier_id=courier_id,
        courier_name=courier_name,
        label_state=label_state,
        shipping_document=shipping_document_url,
        shipping_document_format=shipping_document_format,
        shipping_document_size=shipping_document_size,
        tracking_page_url=tracking_page_url,
        tracking=tracking
    )
    label.save()
    return "Success"

  
def find_nearest_zip(target_zip, zip_list):
    # Start with a large radius and decrease until at least one zip code is found
    radius = 1
    while True:
        nearby_zips = [z.zip for z in zcdb.get_zipcodes_around_radius(target_zip, radius)]
        common_zips = set(nearby_zips).intersection(set(map(str, zip_list)))
        if common_zips:
            return min(common_zips, key=lambda x: abs(int(x) - int(target_zip)))
        radius += 1

def get_nearest_wholestore(zip_code, country):
    all_wholestores = Wholestore.objects.filter(country=country)
    if len(all_wholestores) > 0:
        if country.lower() == 'us':
            try:
                nearest_zip = find_nearest_zip(str(zip_code), [store.zip_code for store in all_wholestores])
                nearest_store = Wholestore.objects.get(zip_code=nearest_zip)
                return nearest_store
            except Exception as e:
                print(f"Error: {e}")
        return all_wholestores[0]
    else:
        return None
    
    
def buy_label_for_wholestore(order_item_id, box_id):
    orderItem = OrderItem.objects.select_related('product', 'order', 'seller').get(id=order_item_id)
    box = OrderItemBox.objects.get(id=box_id)

    wholestore = get_nearest_wholestore(zip_code=orderItem.origin_zip_code, country=get_country_code(orderItem.origin_country))
    
    if not wholestore:
        return "Error"

    url = "https://api.easyship.com/2023-01/shipments"

    payload = {
         "origin_address": {
            "line_1": orderItem.origin_address_line1,
            "line_2": orderItem.origin_address_line2,
            "state": orderItem.origin_state,
            "city": orderItem.origin_city,
            "postal_code": orderItem.origin_zip_code,
            "country_alpha2": get_country_code(orderItem.origin_country) ,
            "contact_name": orderItem.seller.user.first_name + orderItem.seller.user.last_name,
            "company_name": orderItem.seller.store_name,
            "contact_phone": orderItem.seller.phone_number,
            "contact_email": orderItem.seller.user.email
        },
        "destination_address": {
            "line_1": wholestore.address,
            "line_2": None,
            "state": wholestore.state,
            "city": wholestore.city,
            "postal_code": wholestore.zip_code,
            "country_alpha2":wholestore.country ,
            "contact_name": wholestore.person_name,
            "company_name": "YuuSell",
            "contact_phone": wholestore.phone_number,
            "contact_email": settings.DEFAULT_FROM_EMAIL
        },
        
        "set_as_residential": False,

        "regulatory_identifiers": {
            "eori": None,
            "ioss": None,
            "vat_number": None
        },
        "buyer_regulatory_identifiers": {
            "ein": None,
            "vat_number": None
        },
        "incoterms": "DDU",
        "insurance": { "is_insured": False },
        
        "order_data": {
            "buyer_selected_courier_name": None,
            "platform_name": "YuuSell",
            "order_created_at": None
        },
        "courier_selection": {
            "allow_courier_fallback": False,
            "apply_shipping_rules": True,
            "list_unavailable_couriers": False,
            "selected_courier_id":None,

        },
        "shipping_settings": {
            "additional_services": { "qr_code": None },
             "units": {
                        "weight": orderItem.product.weight_unit,
                        "dimensions": orderItem.product.dimensions_unit
                    },
            "buy_label": False,
            "buy_label_synchronous": True,
            "printing_options": {
                "format": "png",
                "label": "4x6",
                "commercial_invoice": "A4",
                "packing_slip": "4x6"
            }
        },
        "parcels": [
            {
                "total_actual_weight": float(box.weight),
                "box": {
                    "length":float(box.length) ,
                    "width": float(box.width) ,
                    "height": float(box.height) ,
                    "weight":float(box.weight) 
                },
                "items": [
                    {
                        "description": orderItem.product_name,
                        "category": None,
                        "hs_code": orderItem.product.category.hs_code,
                        "contains_battery_pi966": None,
                        "contains_battery_pi967": None,
                        "contains_liquids": None,
                        "sku": f"{orderItem.product.id}",
                        "origin_country_alpha2": get_country_code(orderItem.origin_country) ,
                        "quantity": 1,
                        "declared_currency": "USD",
                        "declared_customs_value":  float(orderItem.total_price)
                    }
                ]
            },
    
        ]
    }

    print("PAYLOAD MTF", payload)
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        # "authorization": "Bearer sand_PKx87/e9og8g8P40d08oWOSKempoCT1u5foiNMpoKoo="
        "authorization": "Bearer prod_5XanSn1gHVKPW8e5eL5AyTrqVWwD9q3b15E8rb7fFME="
    }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code > 205:
        print("SHIPPING LABEL CREATE ERROR", response.text)
        LabelCreateFail.objects.create(error=response.text, notes='Label create status more than 205', order_item=orderItem)
        return "Error"

    response_json = response.json()

    if "shipment" not in response_json:
        LabelCreateFail.objects.create(error=response.text, notes='Response does not contain "shipment" key', order_item=orderItem)
        print("Response does not contain 'shipment' key")
        return "Error"

    shipment = response_json["shipment"]
    shipment_id = shipment.get("easyship_shipment_id", "TEST shipment_id")

    if shipment.get("courier"):
        courier_id = shipment["courier"].get("id", "TEST courier_id")
        courier_name = shipment["courier"].get("name", "TEST courier_name")
    else:
        courier_id = "TEST courier_id"
        courier_name = "TEST courier_name"

    label_state = shipment.get("label_state", "TEST label_state")


    # Function to get shipping documents
    def get_shipping_documents(shipment_id):
        url = f"https://api.easyship.com/2023-01/shipments/{shipment_id}"
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return None

        response_json = response.json()
        if "shipment" in response_json:
            shipping_documents = response_json["shipment"].get("shipping_documents", [])
            if shipping_documents:
                return shipping_documents[0]
        return None
    max_retries = 10
    retry_interval = 60
    # Retry mechanism to get shipping documents
    shipping_document = None
    for _ in range(max_retries):
        shipping_document = get_shipping_documents(shipment_id)
        if shipping_document:
            break
        time.sleep(retry_interval)

    if not shipping_document:
        print("Failed to get shipping documents after retries")
        return "Error"

    # Extract shipping document details
    shipping_document_url = shipping_document.get("url", "TEST DOC")
    shipping_document_format = shipping_document.get("format", "TEST FORMAT")
    shipping_document_size = shipping_document.get("page_size", "TEST SIZE")

    tracking_page_url = shipment.get("tracking_page_url", "TEST tracking_page_url")

    # Extract trackings if they exist
    trackings = shipment.get("trackings", [])
    if trackings:
        tracking = trackings[0].get("tracking_number", "TEST TRACKING")
    else:
        tracking = "TEST TRACKING"

    # Create and save ShippingLabel object
    label = ShippingLabel.objects.create(
        shipment_id=shipment_id,
        order_item=orderItem,
        courier_id=courier_id,
        courier_name=courier_name,
        label_state=label_state,
        shipping_document=shipping_document_url,
        shipping_document_format=shipping_document_format,
        shipping_document_size=shipping_document_size,
        tracking_page_url=tracking_page_url,
        tracking=tracking,
        box=box
    )
    label.save()
    return "Success"
    

def get_shipping_status(shipment_id):
    url = f"https://api.easyship.com/2023-01/shipments/{shipment_id}"
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer prod_5XanSn1gHVKPW8e5eL5AyTrqVWwD9q3b15E8rb7fFME="
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return None

    response_json = response.json()

    if "shipment" in response_json:
        print("SHIPMENT KEY IS PRESENT")
        delivery_state = response_json["shipment"].get("delivery_state", "not_created")
        print("DELIVERY STATE", delivery_state)
        if delivery_state:
            return delivery_state
    return None


# {
#   "shipment": {
#     "easyship_shipment_id": "ESSG10006001",
#     "buyer_regulatory_identifiers": {
#       "ein": null,
#       "vat_number": null
#     },
#     "consignee_tax_id": null,
#     "courier": {
#       "id": "01563646-58c1-4607-8fe0-cae3e33c0001",
#       "name": "Courier 1"
#     },
#     "created_at": "2022-02-22T12:21:00Z",
#     "currency": "HKD",
#     "delivery_state": "not_created",
#     "destination_address": {
#       "city": "SINGAPORE",
#       "company_name": null,
#       "contact_email": "test@test.com",
#       "contact_name": "Test McTest",
#       "contact_phone": "+6512345678",
#       "country_alpha2": "SG",
#       "line_1": "Orchard Road 5th",
#       "line_2": null,
#       "postal_code": "546080",
#       "state": "SINGAPORE"
#     },
#     "eei_reference": null,
#     "incoterms": "DDU",
#     "insurance": {
#       "is_insured": true,
#       "insured_amount": 0,
#       "insured_currency": "HKD"
#     },
#     "label_generated_at": "2022-02-22T12:21:00Z",
#     "label_paid_at": null,
#     "label_state": "generated",
#     "last_failure_http_response_messages": [
#       {
#         "code": null,
#         "content": "LETTER is not yet supported for this courier."
#       }
#     ],
#     "metadata": {},
#     "order_created_at": null,
#     "order_data": {
#       "buyer_notes": null,
#       "buyer_selected_courier_name": "test_courier",
#       "order_created_at": null,
#       "order_tag_list": [],
#       "platform_name": null,
#       "platform_order_number": null,
#       "seller_notes": null
#     },
#     "origin_address": {
#       "city": "City",
#       "company_name": "Test Plc.",
#       "contact_email": "asd@asd.com",
#       "contact_name": "Foo Bar",
#       "contact_phone": "+852-1234-5678",
#       "country_alpha2": "HK",
#       "line_1": "123 Test Street",
#       "line_2": "Block 3",
#       "postal_code": "ABC123",
#       "state": "State"
#     },
#     "parcels": [
#       {
#         "box": {
#           "id": "01563646-58c1-4607-8fe0-cae3e33c0001",
#           "name": "small_box",
#           "outer_dimensions": {
#             "length": 15,
#             "width": 7,
#             "height": 25
#           },
#           "slug": "small_box",
#           "type": "box",
#           "weight": 3
#         },
#         "items": [
#           {
#             "actual_weight": 2,
#             "category": "Mobile Phones",
#             "contains_battery_pi966": false,
#             "contains_battery_pi967": true,
#             "contains_liquids": false,
#             "declared_currency": "HKD",
#             "declared_customs_value": 100,
#             "description": "Testing Testing",
#             "dimensions": {
#               "length": 10,
#               "width": 10,
#               "height": 10
#             },
#             "hs_code": null,
#             "origin_country_alpha2": null,
#             "origin_currency": "HKD",
#             "origin_customs_value": 100,
#             "quantity": 1,
#             "sku": "12341234"
#           }
#         ],
#         "total_actual_weight": 30
#       }
#     ],
#     "pickup_state": "not_requested",
#     "rates": [
#       {
#         "additional_services_surcharge": 0,
#         "available_handover_options": [
#           "dropoff",
#           "free_pickup"
#         ],
#         "cost_rank": 2,
#         "courier_id": "01563646-58c1-4607-8fe0-cae3e33c0001",
#         "courier_logo_url": null,
#         "courier_name": "Courier 1",
#         "courier_remarks": null,
#         "currency": "USD",
#         "ddp_handling_fee": 0,
#         "delivery_time_rank": 4,
#         "description": "description",
#         "discount": null,
#         "easyship_rating": 2,
#         "estimated_import_duty": 0,
#         "estimated_import_tax": 65.96,
#         "fuel_surcharge": 1000,
#         "full_description": "full description",
#         "import_duty_charge": 0,
#         "import_tax_charge": 0,
#         "import_tax_non_chargeable": 0,
#         "incoterms": "DDU",
#         "insurance_fee": 0,
#         "is_above_threshold": true,
#         "max_delivery_time": 39,
#         "min_delivery_time": 19,
#         "minimum_pickup_fee": 0,
#         "other_surcharges": {
#           "details": [
#             {
#               "fee": 0,
#               "name": "Peak Surcharge",
#               "origin_fee": 0
#             }
#           ],
#           "total_fee": 0
#         },
#         "oversized_surcharge": 0,
#         "payment_recipient": "Easyship",
#         "provincial_sales_tax": 0,
#         "rates_in_origin_currency": {
#           "additional_services_surcharge": 0,
#           "currency": "HKD",
#           "ddp_handling_fee": 0,
#           "estimated_import_duty": 0,
#           "estimated_import_tax": 65.96,
#           "fuel_surcharge": 1400,
#           "import_duty_charge": 0,
#           "import_tax_charge": 0,
#           "import_tax_non_chargeable": 0,
#           "insurance_fee": 0,
#           "minimum_pickup_fee": 0,
#           "oversized_surcharge": 0,
#           "provincial_sales_tax": 0,
#           "remote_area_surcharge": 0,
#           "residential_discounted_fee": 0,
#           "residential_full_fee": 0,
#           "sales_tax": 0,
#           "shipment_charge": 140,
#           "shipment_charge_total": 1540,
#           "total_charge": 1540,
#           "warehouse_handling_fee": 0
#         },
#         "remote_area_surcharge": 0,
#         "remote_area_surcharges": null,
#         "residential_discounted_fee": 0,
#         "residential_full_fee": 0,
#         "sales_tax": 0,
#         "shipment_charge": 100,
#         "shipment_charge_total": 1100,
#         "total_charge": 1100,
#         "tracking_rating": 2,
#         "value_for_money_rank": 4,
#         "warehouse_handling_fee": 0
#       }
#     ],
#     "regulatory_identifiers": {
#       "eori": null,
#       "ioss": null,
#       "vat_number": null
#     },
#     "return": false,
#     "return_address": {
#       "city": "City",
#       "company_name": "Test Plc.",
#       "contact_email": "asd@asd.com",
#       "contact_name": "Foo Bar",
#       "contact_phone": "+852-1234-5678",
#       "country_alpha2": "HK",
#       "line_1": "123 Test Street",
#       "line_2": "Block 3",
#       "postal_code": "ABC123",
#       "state": "State"
#     },
#     "sender_address": {
#       "city": "City",
#       "company_name": "Test Plc.",
#       "contact_email": "asd@asd.com",
#       "contact_name": "Foo Bar",
#       "contact_phone": "+852-1234-5678",
#       "country_alpha2": "HK",
#       "line_1": "123 Test Street",
#       "line_2": "Block 3",
#       "postal_code": "ABC123",
#       "state": "State"
#     },
#     "set_as_residential": false,
#     "shipment_state": "created",
#     "shipping_documents": [
#       {
#         "base64_encoded_strings": [],
#         "category": "label",
#         "format": "url",
#         "page_size": "a4",
#         "required": true,
#         "url": "https://api.easyship.com/shipment/v1/shipments/01563646-58c1-4607-8fe0-cae3e33c0001/shipping_documents/label?page_size=a4"
#       },
#       {
#         "base64_encoded_strings": [],
#         "category": "packing_slip",
#         "format": "url",
#         "page_size": "a4",
#         "required": true,
#         "url": "https://api.easyship.com/shipment/v1/shipments/01563646-58c1-4607-8fe0-cae3e33c0001/shipping_documents/packing_slip?page_size=a4"
#       },
#       {
#         "base64_encoded_strings": [],
#         "category": "battery_form",
#         "format": "url",
#         "page_size": "a4",
#         "required": true,
#         "url": "https://api.easyship.com/shipment/v1/shipments/01563646-58c1-4607-8fe0-cae3e33c0001/shipping_documents/battery_form?page_size=a4"
#       }
#     ],
#     "shipping_settings": {
#       "b13a_filing": null
#     },
#     "tracking_page_url": "http://localhost:9003/shipment-tracking/ESSG10006001",
#     "trackings": [
#       {
#         "alternate_tracking_number": null,
#         "handler": "aramex",
#         "leg_number": 1,
#         "local_tracking_number": null,
#         "tracking_number": "TEST123",
#         "tracking_state": "active"
#       }
#     ],
#     "updated_at": "2022-02-22T12:21:00Z",
#     "warehouse_state": "none"
#   },
#   "meta": {
#     "request_id": "01563646-58c1-4607-8fe0-cae3e92c4477"
#   }
# }