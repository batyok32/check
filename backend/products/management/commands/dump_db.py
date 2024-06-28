from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
import os
from django.db import connections
from django.db.utils import OperationalError

class Command(BaseCommand):
    help = 'Dumps the database into a backup file'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database dump...'))

        db_settings = settings.DATABASES['default']
        db_name = db_settings['NAME']
        db_user = db_settings['USER']
        db_pass = db_settings['PASSWORD']
        db_host = db_settings['HOST']
        db_port = db_settings['PORT']

        dump_path = "/root/backend"
        os.makedirs(dump_path, exist_ok=True)
        dump_file_path = os.path.join(dump_path, f"{db_name}.dump")

        # Build the dump command
        dump_command = (
            f"PGPASSWORD={db_pass} pg_dump -U {db_user} -h {db_host} -p {db_port} "
            f"-F c -b -v -f {dump_file_path} {db_name}"
        )
        
        # Execute the command
        try:
            output = os.system(dump_command)
            if output == 0:
                self.stdout.write(self.style.SUCCESS('Database successfully dumped to %s' % dump_file_path))
            else:
                raise CommandError('pg_dump command failed')
        except Exception as e:
            raise CommandError(f'Error during dumping database: {str(e)}')

        self.stdout.write(self.style.SUCCESS('Finished database dump.'))
