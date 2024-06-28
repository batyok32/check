from functools import wraps
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework import status

def rate_limit(limit, period):
    def decorator(func):
        @wraps(func)
        def inner(self, request, *args, **kwargs):
            key = f"{request.user.id}-{request.path}"
            request_count = cache.get(key, 0)
            if request_count >= limit:
                return Response({'error': 'Rate limit exceeded'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
            else:
                cache.set(key, request_count + 1, period)
                return func(self, request, *args, **kwargs)
        return inner
    return decorator
