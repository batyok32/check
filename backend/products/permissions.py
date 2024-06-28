from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    """
    Custom permission to only allow owners of an object to access it.
    """
    

    def has_object_permission(self, request, view, obj):
        # Assuming the model instance has an `owner` attribute.
        return obj.seller.user == request.user


class IsSeller(BasePermission):
    """
    Custom permission to only allow verified sellers to access a view.
    """

    def has_permission(self, request, view):
        # Assuming the User model has `is_seller` and `is_verified_seller` attributes.
        return request.user.is_authenticated and request.user.is_seller and request.user.is_verified_seller

class IsCustomer(BasePermission):
    """
    Custom permission to only allow owners of an object to access it.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Assuming the model instance has an `owner` attribute.
        return obj.order.customer == request.user

class IsSellerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_verified_seller or request.user.is_staff or request.user.is_superuser)
    
class IsCustomerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow access if the user is an admin (staff user)
        if request.user.is_staff or request.user.is_superuser:
            return True
        # Allow access if the user is the customer associated with the order
        return obj.order.customer == request.user
    
