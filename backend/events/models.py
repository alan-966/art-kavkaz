from django.db import models
from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField
from wagtail.fields import RichTextField
from wagtail.images.api.fields import ImageRenditionField
from wagtail.models import Page
from wagtail.snippets.models import register_snippet

from core.models import SeoPageMixin


@register_snippet
class EventCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    panels = [FieldPanel("name"), FieldPanel("slug")]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Категория события"
        verbose_name_plural = "Категории событий"


class EventsIndexPage(SeoPageMixin, Page):
    max_count = 1
    parent_page_types = ["home.HomePage"]
    subpage_types = ["events.EventPage"]

    eyebrow = models.CharField(max_length=100, default="Хроника фонда")
    intro_text = RichTextField(blank=True)

    content_panels = Page.content_panels + [FieldPanel("eyebrow"), FieldPanel("intro_text")]
    promote_panels = Page.promote_panels + [FieldPanel("og_image")]
    api_fields = SeoPageMixin.api_fields + [APIField("eyebrow"), APIField("intro_text")]

    class Meta:
        verbose_name = "События (список)"


class EventPage(SeoPageMixin, Page):
    parent_page_types = ["events.EventsIndexPage"]
    subpage_types = []

    category = models.ForeignKey(
        EventCategory, null=True, blank=True, on_delete=models.SET_NULL, related_name="events"
    )
    date_start = models.DateField()
    date_end = models.DateField(null=True, blank=True)
    cover_image = models.ForeignKey(
        "wagtailimages.Image", null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    excerpt = models.CharField(max_length=300, blank=True)
    body = RichTextField(blank=True)
    is_featured = models.BooleanField(default=False, help_text="Показывать как главное событие на странице «События»")

    content_panels = Page.content_panels + [
        FieldPanel("category"),
        FieldPanel("date_start"),
        FieldPanel("date_end"),
        FieldPanel("cover_image"),
        FieldPanel("excerpt"),
        FieldPanel("body"),
        FieldPanel("is_featured"),
    ]
    promote_panels = Page.promote_panels + [FieldPanel("og_image")]

    api_fields = SeoPageMixin.api_fields + [
        APIField("date_start"),
        APIField("date_end"),
        APIField("excerpt"),
        APIField("body"),
        APIField("is_featured"),
        APIField("category_name"),
        APIField("category_slug"),
        APIField("cover_image", serializer=ImageRenditionField("fill-1200x800")),
    ]

    @property
    def category_name(self):
        return self.category.name if self.category_id else None

    @property
    def category_slug(self):
        return self.category.slug if self.category_id else None

    class Meta:
        verbose_name = "Событие"
