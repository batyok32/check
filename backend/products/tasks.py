from celery import shared_task
from .models import Category, ImageStatus, Product, ProductFile
from PIL import Image
from io import BytesIO
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys
from uuid import uuid4
from django.core.files.storage import default_storage
from sorl.thumbnail import get_thumbnail


def compress_image_fn(uploaded_image, max_height, max_width):
    try:
        # Open the uploaded image
        image_temporary = Image.open(uploaded_image)
        SIZE = (max_width, max_height)
        # Generate a thumbnail with the desired dimensions and format   
        imageTemproaryResized = image_temporary.resize(SIZE)

        # image_temporary.thumbnail(SIZE, Image.LANCZOS)
        # Convert the thumbnail to RGB mode if it has an alpha channel
        if imageTemproaryResized.mode in ("RGBA", "P"):
            imageTemproaryResized = imageTemproaryResized.convert("RGBA")
            # Create a white background image with the same size
            background = Image.new('RGBA', imageTemproaryResized.size, (255, 255, 255))
            # Composite the original image onto the white background
            imageTemproaryResized = Image.alpha_composite(background, imageTemproaryResized)
            # Convert to RGB mode
            imageTemproaryResized = imageTemproaryResized.convert("RGB")

        # Create a BytesIO stream to hold the thumbnail data
        output_io_stream = BytesIO()

        # Save the thumbnail to the output stream with quality 80
        imageTemproaryResized.save(output_io_stream, format='JPEG', quality=80)

        # Seek to the beginning of the stream
        output_io_stream.seek(0)

        # Create a unique file name
        file_name = f"{uuid4()}.jpg"

        # Create an InMemoryUploadedFile instance
        compressed_image = InMemoryUploadedFile(
            output_io_stream,
            None,
            file_name,
            'image/jpeg',
            sys.getsizeof(output_io_stream),
            None
        )

        return compressed_image

    except Exception as e:
        print("ERROR", e)
        # Handle the exception (log it and/or send a notification)
        # You might want to re-raise the exception or set the image field to None
        return False


@shared_task
def compress_category(category_id):
    retry=0
    while True:
        if retry < 5:
            try:
                category = Category.objects.get(id=category_id)
                break
            except:
                print("Error")
            retry+=1
        else:
            break

    if category.status_of_image_processing == ImageStatus.PROCESSING:
        old_image = category.image
        formatted_image = compress_image_fn(old_image, 240, 240)
        if formatted_image:
            category.image = formatted_image
            category.status_of_image_processing = ImageStatus.SUCCESS
            default_storage.delete(old_image.name)
        else:
            category.status_of_image_processing = ImageStatus.ERROR
        category.save()
    

# @shared_task
# def compress_global_pickup(id):
#     item = GlobalPickups.objects.get(id=id)

#     if item.status_of_image_processing == ImageStatus.PROCESSING:
#         old_image = item.image
#         formatted_image = compress_image_fn(old_image, 240, 240)
#         if formatted_image:
#             item.image = formatted_image
#             item.status_of_image_processing = ImageStatus.SUCCESS
#             default_storage.delete(old_image.name)
#         else:
#             item.status_of_image_processing = ImageStatus.ERROR
#         item.save()


@shared_task
def compress_product(id):
    retry=0
    while True:
        if retry < 5:
            try:
                item = ProductFile.objects.get(id=id)
                break
            except:
                print("Error")
            retry+=1
        else:
            break

    if item.status_of_image_processing == ImageStatus.PROCESSING and item.file_type=="IMAGE":
        old_image = item.file
        formatted_image = compress_image_fn(old_image, 500, 600)
        if formatted_image:
            item.file = formatted_image
            item.status_of_image_processing = ImageStatus.SUCCESS
            default_storage.delete(old_image.name)
        else:
            item.status_of_image_processing = ImageStatus.ERROR
        item.save()

        

@shared_task
def compress_product_image(product_id):
    retry=0
    while True:
        if retry < 5:
            try:
                item = Product.objects.get(id=product_id)
                break
            except:
                print("Error")
            retry+=1
        else:
            break

    if item.status_of_image_processing == ImageStatus.PROCESSING:
        old_image = item.image
        formatted_image = compress_image_fn(old_image, 240, 240)
        if formatted_image:
            item.image = formatted_image
            item.status_of_image_processing = ImageStatus.SUCCESS
            default_storage.delete(old_image.name)
        else:
            item.status_of_image_processing = ImageStatus.ERROR
        item.save()