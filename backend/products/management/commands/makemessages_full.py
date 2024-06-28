from django.core.management import call_command
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Create message files and merge admin translations'

    def handle(self, *args, **options):
        # Run the makemessages command
        language = 'tk'

        call_command('makemessages', locale=[language])  # Specify your locale(s)

        # Path to your project's .po file and the admin .po file
        project_po_path = f'/home/batyr/projects/yuusell/backend/locale/{language}/LC_MESSAGES/django.po'
        admin_po_path = f'/home/batyr/projects/yuusell/backend/locale/{language}/LC_MESSAGES/admin-django.po'

        # Read the admin translations
        with open(admin_po_path, 'r') as admin_file:
            admin_translations = admin_file.readlines()

        # Merge the admin translations into your project's .po file
        with open(project_po_path, 'a') as project_file:
            project_file.writelines(admin_translations)

        # Output a message
        self.stdout.write(self.style.SUCCESS('Successfully merged admin translations'))
