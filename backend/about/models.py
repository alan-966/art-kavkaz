from django.db import models
from modelcluster.fields import ParentalKey
from wagtail import blocks
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail.api import APIField
from wagtail.fields import RichTextField, StreamField
from wagtail.images.api.fields import ImageRenditionField
from wagtail.models import Orderable, Page

from core.blocks import APIImageChooserBlock
from core.models import SeoPageMixin


class TimelineEntryBlock(blocks.StructBlock):
    year = blocks.CharBlock(max_length=10)
    title = blocks.CharBlock(max_length=200)
    description = blocks.TextBlock(required=False)
    image = APIImageChooserBlock(required=False)

    class Meta:
        icon = "date"
        label = "Событие таймлайна"


class AboutIndexPage(SeoPageMixin, Page):
    max_count = 1
    parent_page_types = ["home.HomePage"]
    subpage_types = ["about.HistoryPage", "about.DocumentsPage", "about.CouncilPage"]

    eyebrow = models.CharField(max_length=100, default="Институция")
    intro_text = RichTextField(
        blank=True,
        default=(
            "<p>История, документы и совет фонда «АРТ-Кавказ» — открытость и надёжность "
            "для партнёров, государственных структур и творческих сообществ.</p>"
        ),
    )

    content_panels = Page.content_panels + [FieldPanel("eyebrow"), FieldPanel("intro_text")]
    promote_panels = Page.promote_panels + [FieldPanel("og_image")]
    api_fields = SeoPageMixin.api_fields + [APIField("eyebrow"), APIField("intro_text")]

    class Meta:
        verbose_name = "Раздел «О фонде»"


class HistoryPage(SeoPageMixin, Page):
    max_count = 1
    parent_page_types = ["about.AboutIndexPage"]
    subpage_types = []

    timeline = StreamField([("entry", TimelineEntryBlock())], blank=True, use_json_field=True)

    content_panels = Page.content_panels + [FieldPanel("timeline")]
    promote_panels = Page.promote_panels + [FieldPanel("og_image")]
    api_fields = SeoPageMixin.api_fields + [APIField("timeline")]

    class Meta:
        verbose_name = "История фонда"


class DocumentsPage(SeoPageMixin, Page):
    max_count = 1
    parent_page_types = ["about.AboutIndexPage"]
    subpage_types = []

    content_panels = Page.content_panels + [InlinePanel("documents", label="Документы")]
    promote_panels = Page.promote_panels + [FieldPanel("og_image")]
    api_fields = SeoPageMixin.api_fields + [APIField("documents")]

    class Meta:
        verbose_name = "Документы фонда"


class DocumentItem(Orderable):
    page = ParentalKey(DocumentsPage, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=255)
    file = models.ForeignKey("wagtaildocs.Document", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    file_type_label = models.CharField(
        max_length=10,
        choices=[("PDF", "PDF"), ("JPEG", "JPEG"), ("DOCX", "DOCX"), ("XLSX", "XLSX")],
        default="PDF",
    )
    published_date = models.DateField(null=True, blank=True)
    size_note = models.CharField(max_length=30, blank=True, help_text="Например: 1.4 МБ")
    action_label = models.CharField(
        max_length=20,
        choices=[("download", "Скачать ↓"), ("view", "Просмотр ↗")],
        default="download",
    )

    panels = [
        FieldPanel("title"),
        FieldPanel("file"),
        FieldPanel("file_type_label"),
        FieldPanel("published_date"),
        FieldPanel("size_note"),
        FieldPanel("action_label"),
    ]

    api_fields = [
        APIField("title"),
        APIField("file_type_label"),
        APIField("published_date"),
        APIField("size_note"),
        APIField("action_label"),
        APIField("file_url"),
    ]

    @property
    def file_url(self):
        return self.file.url if self.file else None


class CouncilPage(SeoPageMixin, Page):
    max_count = 1
    parent_page_types = ["about.AboutIndexPage"]
    subpage_types = []

    content_panels = Page.content_panels + [InlinePanel("members", label="Состав совета")]
    promote_panels = Page.promote_panels + [FieldPanel("og_image")]
    api_fields = SeoPageMixin.api_fields + [APIField("members")]

    class Meta:
        verbose_name = "Совет фонда"


class CouncilMember(Orderable):
    page = ParentalKey(CouncilPage, on_delete=models.CASCADE, related_name="members")
    photo = models.ForeignKey(
        "wagtailimages.Image", null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    full_name = models.CharField(max_length=200)
    role_title = models.CharField(max_length=200, help_text="Например: Президент фонда")
    role_subtitle = models.CharField(max_length=200, blank=True, help_text="Например: Архитектор")
    bio = models.TextField(blank=True)

    panels = [
        FieldPanel("photo"),
        FieldPanel("full_name"),
        FieldPanel("role_title"),
        FieldPanel("role_subtitle"),
        FieldPanel("bio"),
    ]

    api_fields = [
        APIField("full_name"),
        APIField("role_title"),
        APIField("role_subtitle"),
        APIField("bio"),
        APIField("photo", serializer=ImageRenditionField("fill-480x640")),
    ]
