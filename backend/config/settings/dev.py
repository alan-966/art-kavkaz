from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-=g%cq3!_8=h1a(2yb1!5+6!ae-lu_irzr(uqq3=_iy45-152ww"

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = ["*"]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

WAGTAILADMIN_BASE_URL = "http://localhost:8000"


try:
    from .local import *
except ImportError:
    pass
