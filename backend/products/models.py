from django.db import models
from users.models import SellerProfile, UserAccount, Address
from django.template.defaultfilters import slugify
from django.utils.translation import gettext_lazy as _
import uuid

class ImageStatus(models.TextChoices):
    PENDING = 'Pending', _('Pending')
    PROCESSING = 'Processing', _('Processing...')
    SUCCESS = 'Success', _('Success')
    ERROR = 'Error', _('Error')

# Create your models here.
class Category(models.Model):
    name = models.CharField(_("Name"), max_length=255)
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="childrens",
        verbose_name=_("Parent"),  # Translatable field name
    )
    image = models.ImageField(
        upload_to="category_images/",
        blank=True,
        default="product_default.png",
        verbose_name=_("Image"),  # Translatable field name
    )
    slug = models.SlugField(max_length=255, unique=True, blank=True, verbose_name=_("Slug"),)

    status_of_image_processing = models.CharField(
        max_length=10,
        choices=ImageStatus.choices,
        default=ImageStatus.PENDING,
        verbose_name=_("Status of image"),
    )
    hs_code = models.CharField(max_length=10, verbose_name="HS CODE",)

    def save(self, *args, **kwargs):
        from .tasks import compress_category  # Import here, inside the method

        if not self.slug:
            self.slug = slugify(self.name)

        if self.status_of_image_processing == ImageStatus.PENDING and self.image:
            self.status_of_image_processing = ImageStatus.PROCESSING
            super(Category, self).save(*args, **kwargs)
            compress_category.delay(self.id)
        else:
            super(Category, self).save(*args, **kwargs)

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")
        ordering = ['name']

    def __str__(self):
        if self.parent:
            return f"{self.parent.name}/{self.name}"
        return f"/{self.name}"


class CategoryStatus(models.TextChoices):
    SELECT = 'SELECT', _('Select')
    MULTIPLE_SELECT = 'MULTIPLE_SELECT', _('Multiple select')
    BOOLEAN = 'BOOLEAN', _('Boolean')

class CategoryOption(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='options', verbose_name=_("Category"))

    default_values = models.TextField(blank=True, null=True, verbose_name=_("Default values"))

    class Meta:
        verbose_name = _("Category option")
        verbose_name_plural = _("Category options")

    def __str__(self):
        return f"{self.category.name} / {self.name}"
    

class Product(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    slug = models.SlugField(max_length=255,  blank=True, verbose_name=_("Slug"))
    uuid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False, verbose_name=_("UUID"))

    description = models.TextField(verbose_name=_("Description"))
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='products', verbose_name=_("Seller"))
    unit_of_measuring = models.CharField(max_length=255, default="Count", verbose_name=_("Unit of measuring"))
    country_of_origin = models.CharField(max_length=255, verbose_name=_("Country of origin"))
    in_stock = models.IntegerField(blank=True, default=0, null=True, verbose_name=_("In stock"))
    limited_stock = models.BooleanField(default=False, verbose_name=_("Limited stock"))
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name=_("Category"))
    min_order_quantity = models.IntegerField(default=1, verbose_name=_("Minimum quantity"))

    active = models.BooleanField(default=True, verbose_name=_("Active"))
    min_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Minimum price"))
    max_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Maximum price"))
    
    quantity_sold = models.IntegerField(default=0, blank=True, verbose_name=_("Sold quantity"))
    last_sold_at = models.DateTimeField(null=True, blank=True, verbose_name=_("Last sold at"))
    bulk = models.BooleanField(default=False, verbose_name=_("Bulk"))
    
    image = models.ImageField(
        upload_to="products/%Y/%m/%d",
        blank=True,
        default="product_default.png",
        verbose_name=_("Image")
    )
    status_of_image_processing = models.CharField(
        max_length=10,
        choices=ImageStatus.choices,
        default=ImageStatus.PENDING,
        verbose_name=_("Status of image")
    )

    shipping_address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name='products', blank=True, null=True, verbose_name=_("Shipping address"))

    item_length = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Item length")) 
    item_height = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Item weight")) 
    item_width = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Item width")) 
    item_weight = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Item weight")) 

    dimensions_unit = models.CharField(default="cm", max_length=20, verbose_name=_("Dimension unit"))
    weight_unit = models.CharField(default="kg", max_length=20, verbose_name=_("Weight unit"))

    box_length = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("One box length")) 
    box_height = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("One box height")) 
    box_width = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("One box width")) 
    box_weight = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("One box weight")) 
    created = models.DateTimeField(verbose_name=_("Created"), auto_now_add=True)
    updated = models.DateTimeField(verbose_name=_("Updated"), auto_now=True)

    sell_in_containers = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        from .tasks import compress_product_image
        if not self.slug:
            self.slug = f"{slugify(self.name)}-{self.id}"

        if self.limited_stock and self.in_stock <= 0:
            self.active = False
        else:
            self.active = True

        if self.status_of_image_processing == ImageStatus.PENDING and self.image:
            self.status_of_image_processing = ImageStatus.PROCESSING
            super(Product, self).save(*args, **kwargs)
            compress_product_image.delay(self.id)
        else:
            super(Product, self).save(*args, **kwargs)

    class Meta:
        ordering = ['id']
        verbose_name=_("Product")
        verbose_name_plural=_('Products')

    
    def __str__(self):
        return f"{self.id} - {self.name}"
    
    @property
    def combined_description(self):
        return f"{self.name} {self.description}".lower().replace(r'[^\w\s]', '')

class ProductOptions(models.Model):
    category_option = models.ForeignKey(CategoryOption, on_delete=models.CASCADE, related_name='options', null=True, blank=True, verbose_name=_("Category option"))
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='options', verbose_name=_("Product"))
    value = models.CharField(max_length=255, verbose_name=_("Value"))
    name = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Name"))

    class Meta:
        verbose_name = _("Product option")
        verbose_name_plural = _("Product options")



class ProductFile(models.Model):
    class FileTypeChoices(models.TextChoices):
        IMAGE = 'IMAGE', _('Image')
        VIDEO = 'VIDEO', _('Video')

    product = models.ForeignKey(Product,  on_delete=models.CASCADE, related_name='files', verbose_name=_("Product"))
    file_type = models.CharField(max_length=255, choices=FileTypeChoices.choices, default=FileTypeChoices.IMAGE, verbose_name=_("File type"))
    file = models.FileField(upload_to='product_files/', verbose_name=_("File"))
    status_of_image_processing = models.CharField(
        max_length=10,
        choices=ImageStatus.choices,
        default=ImageStatus.PENDING,
        verbose_name=_("Status of image")
    )
    class Meta:
        verbose_name = "Product file"
        verbose_name_plural = "Product files"


    def save(self, *args, **kwargs):
        from .tasks import compress_product 
        super(ProductFile, self).save(*args, **kwargs)
        compress_product.delay(self.id)
        
    def __str__(self):
        return f"{self.id}"
    

class VariationCategory(models.Model):
    product = models.ForeignKey(Product, related_name='variation_categories', on_delete=models.CASCADE, verbose_name=_("Product"))
    name = models.CharField(max_length=255, verbose_name=_("Name"))  # e.g., Size, Color, Material
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name='Variation category'
        verbose_name_plural='Variation categories'

class Variation(models.Model):
    variation_category = models.ForeignKey(VariationCategory, related_name='variations', on_delete=models.CASCADE, verbose_name=_("Variation category"))
    name = models.CharField(max_length=255, verbose_name=_("Name"))  # e.g., Small, Medium, Large for Size; Red, Green, Blue for Color
    # related_images = models.ManyToManyField(ProductFile, related_name='variations', blank=True)

    class Meta:
        verbose_name = _("Product variation")
        verbose_name_plural = _("Product variations")

    def __str__(self):
        return self.name
    
class CrossVariationQuantityTable(models.Model):
    product = models.ForeignKey(Product, related_name='variation_quantities', on_delete=models.CASCADE, verbose_name=_("Product"))
    # variations = models.ManyToManyField(Variation, related_name="quantities")
    variations = models.TextField(verbose_name=_("Variations"))
    in_stock = models.IntegerField(blank=True, null=True, verbose_name=_("In stock"))

    def __str__(self):
        return f"{self.id}"
    
    class Meta:
        verbose_name=_("Variation quantity")
        verbose_name_plural=_("Variation quantities")

class BulkPurchasePolicy(models.Model):
    product = models.ForeignKey(Product,  on_delete=models.CASCADE, related_name='bulks', verbose_name=_("Product"))
    minimum_quantity = models.IntegerField(verbose_name=_("Minimum quantity"))
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Price"))
    min_lead_time = models.IntegerField(default=1, verbose_name=_("Lead time min:"))
    max_lead_time = models.IntegerField(default=1, verbose_name=_("Lead time max:"))
    
    container_name = models.CharField(max_length=255, blank=True, null=True)
    container_length = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Container length"), blank=True, null=True) 
    container_height = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Container height"), blank=True, null=True) 
    container_width = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Container width"), blank=True, null=True) 
    container_weight = models.DecimalField( 
                         max_digits = 5, 
                         decimal_places = 2, verbose_name=_("Container weight"), blank=True, null=True) 
    

    class Meta:
        verbose_name = _("Bulk purchase policy")
        verbose_name_plural = _("Bulk purchase policies")


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews', verbose_name=_("Product"))
    user = models.ForeignKey(UserAccount, on_delete=models.SET_NULL, related_name='reviews', null=True, blank=True, verbose_name=_("User"))
    rating = models.DecimalField(max_digits=3, decimal_places=2, verbose_name=_("Rating"))
    comment = models.TextField(verbose_name=_("Comment"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))
    order_item = models.OneToOneField("order.OrderItem", null=True, blank=True, on_delete=models.SET_NULL, related_name='review', verbose_name=_("Order item"))
    subject = models.CharField(max_length=255, verbose_name=_("Subject"))
    username= models.CharField(max_length=255, verbose_name=_("Username"))
    country = models.CharField(max_length=255, verbose_name=_("Country"))

    class Meta:
        verbose_name=_("Review")
        verbose_name_plural=_("Reviews")
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.rating} - {self.product}"
    


class ShippingOption(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    origin_countries = models.TextField(_("Origin countries: (only country codes with ',' split)"))
    delivery_countries = models.TextField(_("Delivery countries: (only country codes with ',' split)"))
    
    min_delivery_time = models.IntegerField(verbose_name=_("Minimum delivery time"))
    max_delivery_time = models.IntegerField(verbose_name=_("Maximum delivery time"))
    
    price_for_dimension = models.DecimalField(_("Meter cube price"), decimal_places=2, max_digits=5)
    price_for_weight = models.DecimalField(_("Kilogram price"), decimal_places=2, max_digits=5)

    # dimension_calculation = models.IntegerField("Cube dimension (meter)")
    # weight_calculation = models.IntegerField("Weight (kg)")

    max_weight = models.IntegerField(_("Max kilogram"))
    max_dimension = models.IntegerField(_("Max meter cube"))

    product_categories = models.ManyToManyField(Category, verbose_name=_("Categories"))

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name=_('Shipping')
        verbose_name_plural=_('YuuSell Shippings')

class SliderImage(models.Model):
    image = models.ImageField(
        upload_to="sliders/",
        blank=True,
        default="product_default.png",
        verbose_name=_("Image")
    )
    name=models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    link = models.TextField()
    is_mobile = models.BooleanField(default=True)

    class Meta:
        verbose_name=_("Slider Image")
        verbose_name_plural=_("Slider Images")

    def __str__(self):
        return self.name