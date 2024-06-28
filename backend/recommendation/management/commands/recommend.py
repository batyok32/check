from django.core.management.base import BaseCommand
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from products.models import Product  

class Command(BaseCommand):
    help = 'Generate product recommendations based on content similarity'

    def handle(self, *args, **options):
        # Query all products and preprocess the data
        products = Product.objects.all()
        descriptions = [product.combined_description for product in products]

        # Convert text to features using CountVectorizer
        cnt_vec = CountVectorizer(stop_words='english')
        count_vector = cnt_vec.fit_transform(descriptions)

        # Calculate cosine similarity
        sim_matrix = cosine_similarity(count_vector)

        # Function to find similar products
        def find_similarity(index, n=10):
            result = list(enumerate(sim_matrix[index]))
            sorted_result = sorted(result, key=lambda x: x[1], reverse=True)[1:n + 1]
            similar_products = [{'value': products[x[0]].name, 'score': round(x[1], 2)} for x in sorted_result]
            return similar_products

        # Example: Get recommendations for the first product
        product_id = 0  # Change this to the ID of the product you want recommendations for
        recommendations = find_similarity(product_id)
        print(f"Recommendations for {products[product_id].name}:")
        for rec in recommendations:
            print(f"{rec['value']} - Score: {rec['score']}")
