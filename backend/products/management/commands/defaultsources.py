from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category, CategoryOption
from .data import categories_data, category_options_data
import os 
from django.conf import settings


class Command(BaseCommand):
    help = 'Populates the database with categories, subcategories, and category options for an e-commerce shop.'

    def handle(self, *args, **kwargs):
        self.populate_categories()
        self.stdout.write(self.style.SUCCESS('Successfully populated categories and category options.'))

    def populate_categories(self):
        for category_data in categories_data:
            category = Category.objects.get(
                name=category_data["name"],
                hs_code=category_data["hs_code"],
            )
            if category.image:
                image_path = os.path.join(settings.MEDIA_ROOT, category.image.name)
                if os.path.exists(image_path):
                    pass
                else:
                    category.image = "product_default.png"
                    category.save()
            else:
                print("No image associated with this category.")            
            
            for subcategory_data in category_data.get("subcategories", []):
                subcategory = Category.objects.get(
                    name=subcategory_data["name"],
                    hs_code=subcategory_data["hs_code"],
                    parent=category,
                )
                if subcategory.image:
                    image_path = os.path.join(settings.MEDIA_ROOT, subcategory.image.name)
                    if os.path.exists(image_path):
                        pass
                    else:
                        subcategory.image = "product_default.png"
                        subcategory.save()
                else:
                    print("No image associated with this category.")       
