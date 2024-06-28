from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class AdministrationConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "administration"
    verbose_name = _('Administration')  # Translatable app name

    def ready(self) :
        import administration.signals
        return super().ready()