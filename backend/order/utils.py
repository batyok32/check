import math
from .models import Wholestore


def haversine_distance(lat1, lon1, lat2, lon2):
    # Radius of the Earth in kilometers
    R = 6371.0

    # Convert degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    # Differences in coordinates
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    # Haversine formula
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return distance


def find_nearest_wholestore(seller_latitude, seller_longitude):
    wholestores = Wholestore.objects.all()
    min_distance = float('inf')
    nearest_wholestore = None
    for wholestore in wholestores:
        distance = haversine_distance(seller_latitude, seller_longitude, wholestore.latitude, wholestore.longitude)
        if distance < min_distance:
            min_distance = distance
            nearest_wholestore = wholestore
    return nearest_wholestore