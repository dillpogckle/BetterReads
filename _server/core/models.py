from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile (models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    to_read = models.ManyToManyField('Book', blank=True, related_name='to_read')
    reading = models.ManyToManyField('Book', blank=True, related_name='reading')
    read = models.ManyToManyField('Book', blank=True, related_name='read')


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    work_num = models.CharField(unique=True)
    cover_image = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)

