from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnlyForStaff(BasePermission):
    """
    A patient record is only writable by the user who created it.
    Staff/admin accounts get read access to everything (for audits/support)
    but cannot silently edit another practitioner's patient data.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS and request.user.is_staff:
            return True
        return obj.created_by_id == request.user.id
