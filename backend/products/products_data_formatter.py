from .models import CategoryOption, ProductFile

def formatProductCreateFormData(data, parsed_data):
    options = []
    i = 0
    while f'productOptions[{i}].name' in data:
        options.append({
            'category_option': data.pop(f'productOptions[{i}].category_option', None),
            'value': data.pop(f'productOptions[{i}].value'),
            'name':data.pop(f'productOptions[{i}].name'),
        })
        i += 1
    parsed_data['options'] = options

    bulk_purchace_policies = []
    i = 0
    while f'bulkPurchasePolicies[{i}].minimumQuantity' in data:
        bulk_policy = {
            'minimum_quantity': data.pop(f'bulkPurchasePolicies[{i}].minimumQuantity'),
            'price': data.pop(f'bulkPurchasePolicies[{i}].price'),
            'min_lead_time': data.pop(f'bulkPurchasePolicies[{i}].min_lead_time'),
            'max_lead_time': data.pop(f'bulkPurchasePolicies[{i}].max_lead_time'),
        }

        # Append container details if present
        container_name_key = f'bulkPurchasePolicies[{i}].container_name'
        if container_name_key in data:
            bulk_policy['container_name'] = data.pop(container_name_key)
            bulk_policy['container_height'] = data.pop(f'bulkPurchasePolicies[{i}].container_height')
            bulk_policy['container_length'] = data.pop(f'bulkPurchasePolicies[{i}].container_length')
            bulk_policy['container_width'] = data.pop(f'bulkPurchasePolicies[{i}].container_width')
            bulk_policy['container_weight'] = data.pop(f'bulkPurchasePolicies[{i}].container_weight')

        bulk_purchace_policies.append(bulk_policy)
        i += 1

    parsed_data['bulks'] = bulk_purchace_policies

    variation_categories = []
    i = 0
    while f'variationCategories[{i}].name' in data:
        variations = []
        b = 0
        while f'variationCategories[{i}].variations[{b}].name' in data:
            variations.append({
                'name':data.pop(f'variationCategories[{i}].variations[{b}].name'),
            })
            b+=1
        variation_categories.append({
            'name': data.pop(f'variationCategories[{i}].name'),
            'variations': variations,
        })
        i += 1
    parsed_data['variations'] = variation_categories


    cross_variation_quantity_data = []
    i = 0
    # print("hello mtf 1", data)
    while f'combinationQuantities[{i}].combination' in data:
        # print("hello mtf 2", data)
        cross_variation_quantity_data.append({
            'variations': data.pop(f'combinationQuantities[{i}].combination'),
            'in_stock': data.pop(f'combinationQuantities[{i}].in_stock'),
        })
        i += 1
    parsed_data['cross_variation_data'] = cross_variation_quantity_data


    files = []
    file_types = []
    i = 0
    while f'files[{i}]' in data:
        files.append(data.pop(f'files[{i}]'))
        file_types.append(data.pop(f'file_types[{i}]'))
        i += 1
    parsed_data['files'] = files
    parsed_data['file_types'] = file_types


    # Handle file uploads

    return parsed_data


def formatProductUpdateFormData(data, parsed_data):
    options = []
    i = 0
    while f'productOptions[{i}].name' in data:
        id_value = data.pop(f'productOptions[{i}].id', None)
        id = id_value if id_value and id_value != 'undefined' and id_value !='null' else None

        category_option_value = data.pop(f'productOptions[{i}].category_option', None)
        category_option = category_option_value if category_option_value and category_option_value != 'null'  else None
        if category_option:
            category_option = CategoryOption.objects.get(id=category_option)

        if id:
            options.append({
                'category_option': category_option,
                'value': data.pop(f'productOptions[{i}].value'),
                'name':data.pop(f'productOptions[{i}].name'),
                'id':id,
            })
        else:
            options.append({
                'category_option': category_option,
                'value': data.pop(f'productOptions[{i}].value'),
                'name':data.pop(f'productOptions[{i}].name'),
            })


        i += 1
    parsed_data['options'] = options

    files = []
    i = 0
    while f'files[{i}]' in data:
        id_value = data.pop(f'file_ids[{i}]', None)
        id = id_value if id_value and id_value != 'undefined' and id_value !='null' else None
        file_type = data.pop(f'file_types[{i}]')

        if id:
            image_value = data.pop(f'files[{i}]')
            if image_value.startswith(('http://', 'https://')):
                files.append({
                    "id":id,
                    'not_update':True,
                    "file_type":file_type
                })
            else:
                files.append({
                    "file": image_value,
                    "id":id,
                    "file_type":file_type

                })

        else:
            files.append({
                "file": data.pop(f'files[{i}]'),
                "file_type":file_type
            })

        i += 1
    parsed_data['files'] = files


    variation_categories = []
    only_variation_categories = []
    i = 0
    while f'variationCategories[{i}].name' in data:
        variations = []
        b = 0
        while f'variationCategories[{i}].variations[{b}].name' in data:
            id_value = data.pop(f'variationCategories[{i}].variations[{b}].id', None)
            id = id_value if id_value and id_value != 'undefined' and id_value !='null' else None
            
            if id:
                variations.append({
                    'id':id,
                    'name':data.pop(f'variationCategories[{i}].variations[{b}].name'),
                })
            else:
                variations.append({
                    'name':data.pop(f'variationCategories[{i}].variations[{b}].name'),
                })
            b+=1

        id_value = data.pop(f'variationCategories[{i}].id', None)
        id = id_value if id_value and id_value != 'undefined' and id_value !='null' else None
        name = data.pop(f'variationCategories[{i}].name')
        if id:
            variation_categories.append({
                'id': id,
                'name': name,
                'variations': variations,
            })
            only_variation_categories.append({
                'id': id,
                'name': name,
            })
        else:
            variation_categories.append({
                'name': name,
                'variations': variations,
            })
            only_variation_categories.append({
                'name': name,
            })
        i += 1
    parsed_data['variations'] = variation_categories
    parsed_data['only_variation_categories'] = only_variation_categories


    cross_variation_quantity_data = []
    i = 0
    # print("hello mtf 1", data)
    while f'combinationQuantities[{i}].combination' in data:
        # print("hello mtf 2", data)
        variation_names = data.pop(f'combinationQuantities[{i}].combination').split('-')

        id_value = data.pop(f'combinationQuantities[{i}].id', None)
        id = id_value if id_value and id_value != 'undefined' and id_value !='null' else None


        if id:
            cross_variation_quantity_data.append({
            'variations': ", ".join(variation_names),
            'in_stock': data.pop(f'combinationQuantities[{i}].in_stock'),
            'id': id,
        })
        else:
            cross_variation_quantity_data.append({
            'variations': ", ".join(variation_names),
            'in_stock': data.pop(f'combinationQuantities[{i}].in_stock'),
        })
        i += 1
    parsed_data['cross_variation_data'] = cross_variation_quantity_data


    bulk_purchace_policies = []
    i = 0
    while f'bulkPurchasePolicies[{i}].minimumQuantity' in data:
        id_value = data.pop(f'bulkPurchasePolicies[{i}].id')
        id = id_value if id_value and id_value != 'undefined' and id_value !='null' else None

        if id:
            bulk_policy = {
            'minimum_quantity': data.pop(f'bulkPurchasePolicies[{i}].minimumQuantity'),
            'price': data.pop(f'bulkPurchasePolicies[{i}].price'),
            'min_lead_time': data.pop(f'bulkPurchasePolicies[{i}].min_lead_time'),
            'max_lead_time': data.pop(f'bulkPurchasePolicies[{i}].max_lead_time'),
            'id': id,
        }
            container_name_key = f'bulkPurchasePolicies[{i}].container_name'
            if container_name_key in data:
                bulk_policy['container_name'] = data.pop(container_name_key)
                bulk_policy['container_height'] = data.pop(f'bulkPurchasePolicies[{i}].container_height')
                bulk_policy['container_length'] = data.pop(f'bulkPurchasePolicies[{i}].container_length')
                bulk_policy['container_width'] = data.pop(f'bulkPurchasePolicies[{i}].container_width')
                bulk_policy['container_weight'] = data.pop(f'bulkPurchasePolicies[{i}].container_weight')
            bulk_purchace_policies.append(bulk_policy)
        else:
            bulk_policy = {
            'minimum_quantity': data.pop(f'bulkPurchasePolicies[{i}].minimumQuantity'),
            'price': data.pop(f'bulkPurchasePolicies[{i}].price'),
            'min_lead_time': data.pop(f'bulkPurchasePolicies[{i}].min_lead_time'),
            'max_lead_time': data.pop(f'bulkPurchasePolicies[{i}].max_lead_time'),
        }
            container_name_key = f'bulkPurchasePolicies[{i}].container_name'
            if container_name_key in data:
                bulk_policy['container_name'] = data.pop(container_name_key)
                bulk_policy['container_height'] = data.pop(f'bulkPurchasePolicies[{i}].container_height')
                bulk_policy['container_length'] = data.pop(f'bulkPurchasePolicies[{i}].container_length')
                bulk_policy['container_width'] = data.pop(f'bulkPurchasePolicies[{i}].container_width')
                bulk_policy['container_weight'] = data.pop(f'bulkPurchasePolicies[{i}].container_weight')

            bulk_purchace_policies.append(bulk_policy)
        i += 1
    parsed_data['bulks'] = bulk_purchace_policies





    # Handle file uploads

    print("PARSED DATA", parsed_data)
    return parsed_data