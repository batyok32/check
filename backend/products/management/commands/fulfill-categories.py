from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category, CategoryOption
from .data import categories_data, category_options_data

class Command(BaseCommand):
    help = 'Populates the database with categories, subcategories, and category options for an e-commerce shop.'

    def handle(self, *args, **kwargs):
        self.print_names()
        # self.populate_categories()
        # self.populate_category_options()
        self.stdout.write(self.style.SUCCESS('Successfully populated categories and category options.'))

    def populate_categories(self):
        for category_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=category_data["name"],
                hs_code=category_data["hs_code"],
                slug=slugify(category_data["name"]),
                image="no-image.jpg",  # Include the image field here
            )
            for subcategory_data in category_data.get("subcategories", []):
                Category.objects.get_or_create(
                    name=subcategory_data["name"],
                    hs_code=subcategory_data["hs_code"],
                    parent=category,
                    slug=slugify(subcategory_data["name"]),
                    image="no-image.jpg",  # Include the image field here
                )

    def populate_category_options(self):
        for category_name, options in category_options_data.items():
            category = Category.objects.get(name=category_name)
            for option in options:
                CategoryOption.objects.get_or_create(
                    name=option["name"],
                    category=category,
                    default_values=option["default_values"],
                )

    def print_names(self):
        cat_list= """
Elektronika
Smartfonlar
Noutbuklar
Planşetler
Stol kompýuterleri
Monitorlar
Çap edijiler
Kameralar
Nauşnik
Gepleýjiler
Akylly sagatlar
Pilotsyz uçarlar
Oýun konsollary
VR nauşnikleri
Elektron okyjylar
Daşarky gaty diskler
Oryat kartlary
Tor enjamlary
Proýektorlar
Akylly öý enjamlary
Geýip bolýan tehnologiýa
Moda
Egin-eşik
Aýakgap
Garnituralar
Torbalar
Şaý-sepler
Sagatlar
Günlük äýnekleri
Şlýapalar
Guşak
Şarflar
Jorap
Içki eşik
Suw köýnegi
Formal eşik
Sport eşikleri
Uky eşikleri
Enelik geýimi
Etnik eşik
Geýimler
Goşmaça ölçegli geýim
Öý we bag
Mebel
Aşhana gap-gaçlary
Bagçylyk
Öý bezegi
Eddingorgan-düşek
Vanna esbaplary
Yşyklandyryş
Daşky mebel
Gurallar
Öýi abadanlaşdyrmak
Saklamak we gurama
Haýwanat üpjünçiligi
Ösümlikler
Howuzlar we spalar
Zyýan berijilerden goramak
Möwsümleýin bezeg
Arassalaýjy enjamlar
Howpsuzlyk we Howpsuzlyk
Öý enjamlary
Barbekýu we açyk nahar
Sport we açyk meýdanda
Fitnes enjamlary
Kemping enjamlary
Tigir sürmek
Balyk tutmak
Gezelenç
Gözellik we şahsy ideg
Derini bejermek
Makiýaup
Saçlara ideg
Hoşboý yslar
Şahsy arassaçylyk
Oýnawaçlar we oýunlar
Hereket şekilleri
Tagta oýunlary
Gurjaklar
Bulaşyklar
Daşky oýunjaklar
Kitaplar we kanselýariýa
Çeper kitaplar
Çeper däl kitaplar
Çagalar üçin kitaplar
Notebooklar
Wrazuw gurallary
Iýmit we içgi
Iýmit önümleri
Içgiler
Gurme iýmitleri
Saglyk iýmitleri
Konserwirlenen we gaplanan iýmitler
Saglyk we saglyk
Witaminler we goşundylar
Şahsy ideg
Fitnes we iýmitleniş
Lukmançylyk enjamlary
Saglyk enjamlary
Awtoulag
Awtoulag enjamlary
Awtoulag elektronikasy
Awtoulaglara ideg
Motosikl bölekleri
Şinalar we tigirler
"""
        cat_list = cat_list.strip().split('\n')
        i = 0
        for  category_data in categories_data:
            print(f'"{category_data["name"]}":"{cat_list[i]}",')
            i+=1
            for subcategory_data in category_data.get("subcategories", []):
                print(f'"{subcategory_data["name"]}":"{cat_list[i]}",')
                i+=1
