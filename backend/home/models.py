from django.db import models
from wagtail import blocks
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.api import APIField
from wagtail.fields import RichTextField, StreamField
from wagtail.images.api.fields import ImageRenditionField
from wagtail.models import Page

from core.blocks import APIImageChooserBlock, APIPageChooserBlock
from core.models import SeoPageMixin


class HeroSlideBlock(blocks.StructBlock):
    image = APIImageChooserBlock(required=False, help_text="Фоновое изображение баннера (плейсхолдер, если не задано)")
    theme = blocks.ChoiceBlock(
        choices=[("light", "Светлый (тёмный текст)"), ("dark", "Тёмный (белый текст)")],
        default="light",
        help_text="Определяет контраст текста и элементов управления слайдера поверх изображения",
    )
    title = blocks.CharBlock(max_length=200)
    description = blocks.TextBlock(required=False)
    button_text = blocks.CharBlock(max_length=60, required=False)
    button_page = APIPageChooserBlock(required=False, help_text="Куда ведёт кнопка баннера")

    class Meta:
        icon = "image"
        label = "Слайд"


class StatItemBlock(blocks.StructBlock):
    value = blocks.CharBlock(max_length=20, help_text="Например: 12 или 150+")
    label = blocks.CharBlock(max_length=100, help_text="Например: Лет работы фонда")

    class Meta:
        icon = "order"
        label = "Показатель"


class HomePage(SeoPageMixin, Page):
    max_count = 1
    parent_page_types = ["wagtailcore.Page"]
    subpage_types = ["about.AboutIndexPage", "events.EventsIndexPage", "partners.PartnersPage", "press.PressIndexPage"]

    eyebrow = models.CharField(max_length=100, default="Институция")
    intro_heading = models.CharField(max_length=200, default="О фонде")
    intro_text = RichTextField(
        blank=True,
        default=(
            "<p>«АРТ-Кавказ» — некоммерческий фонд, работающий на стыке искусства, "
            "архитектуры и культурного наследия. Мы поддерживаем художников и "
            "архитекторов, организуем выставки и формируем устойчивый диалог между "
            "регионами Кавказа и международным культурным сообществом.</p>"
        ),
    )
    intro_image = models.ForeignKey(
        "wagtailimages.Image", null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    intro_quote = models.CharField(
        max_length=300,
        blank=True,
        default="Сохранение, развитие и популяризация культуры, искусства и архитектуры Кавказа.",
    )

    mission_eyebrow = models.CharField(max_length=100, default="Зачем мы работаем")
    mission_heading = models.CharField(max_length=200, default="Миссия фонда")
    mission_text = RichTextField(
        blank=True,
        default=(
            "<p>Мы сохраняем и переосмысляем культурное наследие Кавказа, поддерживаем "
            "художников и архитекторов и выстраиваем устойчивый диалог между традицией "
            "и современностью.</p>"
        ),
    )

    stats_eyebrow = models.CharField(max_length=100, default="Фонд в цифрах")
    stats_heading = models.CharField(max_length=200, default="12 лет культурной работы на Кавказе")

    hero_slides = StreamField([("slide", HeroSlideBlock())], blank=True, use_json_field=True)
    stats = StreamField([("stat", StatItemBlock())], blank=True, use_json_field=True)

    content_panels = Page.content_panels + [
        FieldPanel("hero_slides"),
        MultiFieldPanel(
            [
                FieldPanel("eyebrow"),
                FieldPanel("intro_heading"),
                FieldPanel("intro_text"),
                FieldPanel("intro_image"),
                FieldPanel("intro_quote"),
            ],
            heading="О фонде (блок на главной)",
        ),
        MultiFieldPanel(
            [FieldPanel("mission_eyebrow"), FieldPanel("mission_heading"), FieldPanel("mission_text")],
            heading="Миссия фонда",
        ),
        MultiFieldPanel(
            [FieldPanel("stats_eyebrow"), FieldPanel("stats_heading"), FieldPanel("stats")],
            heading="Статистика",
        ),
    ]
    promote_panels = Page.promote_panels + [FieldPanel("og_image")]

    api_fields = SeoPageMixin.api_fields + [
        APIField("eyebrow"),
        APIField("intro_heading"),
        APIField("intro_text"),
        APIField("intro_image", serializer=ImageRenditionField("fill-1200x800")),
        APIField("intro_quote"),
        APIField("mission_eyebrow"),
        APIField("mission_heading"),
        APIField("mission_text"),
        APIField("stats_eyebrow"),
        APIField("stats_heading"),
        APIField("hero_slides"),
        APIField("stats"),
    ]

    class Meta:
        verbose_name = "Главная страница"
