from .base import *  # noqa

DEBUG = False
ALLOWED_HOSTS = ["*"]
DATABASES["default"]["NAME"] = "test_" + env("POSTGRES_DB")  # noqa
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]  # faster tests

