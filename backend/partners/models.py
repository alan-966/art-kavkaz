from django.db import models
from modelcluster.fields import ParentalKey
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.api import APIField
from wagtail.fields import RichTextField
from wagtail.images.api.fields import ImageRenditionField
from wagtail.models import Orderable, Page

from core.models import SeoPageMixin


class PartnersPage(SeoPageMixin, Page):
    max_count = 1
    parent_page_types = ["home.HomePage"]
    subpage_types = []

    eyebrow = models.CharField(max_length=100, default="Доверие и сотрудничество")
    intro_text = RichTextField(blank=True)

    fund_partners_heading = models.CharField(max_length=200, default="Партнёры фонда")
    media_partners_heading = models.CharField(max_length=200, default="Информационные партнёры")

    cta_text = models.CharField(
        max_length=300,
        blank=True,
        default='Станьте партнёром фонда «АРТ-Кавказ» и поддержите культуру Кавказа',
    )
    cta_button_text = models.CharField(max_length=60, blank=True, default="Связаться с фондом")
    cta_button_link = models.CharField(
        max_length=255, blank=True, help_text="Например: mailto:info@artkavkaz.ru"
    )

    content_panels = Page.content_panels + [
        FieldPanel("eyebrow"),
        FieldPanel("intro_text"),
        MultiFieldPanel(
            [FieldPanel("fund_partners_heading"), InlinePanel("fund_partners", label="Логотип партнёра")],
            heading="Партнёры фонда",
        ),
        InlinePanel("fund_partner_details", label="Карточка партнёра (с описанием)"),
        MultiFieldPanel(
            [FieldPanel("media_partners_heading"), InlinePanel("media_partners", label="Логотип инфопартнёра")],
            heading="Информационные партнёры",
        ),
        MultiFieldPanel(
            [FieldPanel("cta_text"), FieldPanel("cta_button_text"), FieldPanel("cta_button_link")],
            heading="Призыв стать партнёром",
        ),
    ]
    promote_panels = Page.promote_panels + [FieldPanel("og_image")]

    api_fields = SeoPageMixin.api_fields + [
        APIField("eyebrow"),
        APIField("intro_text"),
        APIField("fund_partners_heading"),
        APIField("media_partners_heading"),
        APIField("cta_text"),
        APIField("cta_button_text"),
        APIField("cta_button_link"),
        APIField("fund_partners"),
        APIField("fund_partner_details"),
        APIField("media_partners"),
    ]

    class Meta:
        verbose_name = "Партнёры"


class FundPartnerLogo(Orderable):
    page = ParentalKey(PartnersPage, on_delete=models.CASCADE, related_name="fund_partners")
    name = models.CharField(max_length=150)
    logo = models.ForeignKey("wagtailimages.Image", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")

    panels = [FieldPanel("name"), FieldPanel("logo")]
    api_fields = [
        APIField("name"),
        APIField("logo", serializer=ImageRenditionField("max-300x200")),
    ]


class FundPartnerDetail(Orderable):
    page = ParentalKey(PartnersPage, on_delete=models.CASCADE, related_name="fund_partner_details")
    name = models.CharField(max_length=150)
    logo = models.ForeignKey("wagtailimages.Image", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    description = models.TextField(blank=True)

    panels = [FieldPanel("name"), FieldPanel("logo"), FieldPanel("description")]
    api_fields = [
        APIField("name"),
        APIField("description"),
        APIField("logo", serializer=ImageRenditionField("max-160x160")),
    ]


class MediaPartnerLogo(Orderable):
    page = ParentalKey(PartnersPage, on_delete=models.CASCADE, related_name="media_partners")
    name = models.CharField(max_length=150)
    logo = models.ForeignKey("wagtailimages.Image", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")

    panels = [FieldPanel("name"), FieldPanel("logo")]
    api_fields = [
        APIField("name"),
        APIField("logo", serializer=ImageRenditionField("max-300x200")),
    ]
