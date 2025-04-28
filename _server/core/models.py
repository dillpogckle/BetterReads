from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid


class UserProfile (models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    to_read = models.ManyToManyField('Book', blank=True, related_name='to_read')
    reading = models.ManyToManyField('Book', blank=True, related_name='reading')
    read = models.ManyToManyField('Book', blank=True, related_name='read')
    friend_key = models.CharField(max_length=255, blank=True, unique=True, related_name='friend_key')
    friends = models.ManyToManyField('self', blank=True, related_name='friends')

    def save(self, *args, **kwargs):
        if not self.friend_key:
            self.friend_key = str(uuid.uuid4())[:8]  # generate a short unique friend code
        super().save(*args, **kwargs)

    def add_friend_by_key(self, friend_key):
        try:
            friend_profile = UserProfile.objects.get(friend_key=friend_key)
            self.friends.add(friend_profile)
            friend_profile.friends.add(self)
            return True
        except UserProfile.DoesNotExist:
            return False


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


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    content = models.TextField()
    rating = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')
