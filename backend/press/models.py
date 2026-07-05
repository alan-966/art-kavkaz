from django.db import models
from modelcluster.fields import ParentalKey
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail.api import APIField
from wagtail.fields import RichTextField
from wagtail.models import Orderable, Page

from core.models import SeoPageMixin


class PressIndexPage(SeoPageMixin, Page):
    max_count = 1
    parent_page_types = ["home.HomePage"]
    subpage_types = []

    eyebrow = models.CharField(max_length=100, default="Публикации")
    intro_text = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("eyebrow"),
        FieldPanel("intro_text"),
        InlinePanel("press_items", label="Публикация"),
    ]
    promote_panels = Page.promote_panels + [FieldPanel("og_image")]
    api_fields = SeoPageMixin.api_fields + [
        APIField("eyebrow"),
        APIField("intro_text"),
        APIField("press_items"),
    ]

    class Meta:
        verbose_name = "СМИ о нас"


class PressItem(Orderable):
    page = ParentalKey(PressIndexPage, on_delete=models.CASCADE, related_name="press_items")
    source_name = models.CharField(max_length=150, help_text="Например: ТАСС")
    year = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    excerpt = models.TextField(blank=True)
    external_url = models.URLField(blank=True, help_text="Ссылка на материал")

    panels = [
        FieldPanel("source_name"),
        FieldPanel("year"),
        FieldPanel("title"),
        FieldPanel("excerpt"),
        FieldPanel("external_url"),
    ]

    api_fields = [
        APIField("source_name"),
        APIField("year"),
        APIField("title"),
        APIField("excerpt"),
        APIField("external_url"),
    ]
