from django.db import models
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.api import APIField
from wagtail.contrib.settings.models import BaseSiteSetting, register_setting
from wagtail.images.api.fields import ImageRenditionField


class SeoPageMixin(models.Model):
    """Adds an Open Graph image on top of Wagtail's built-in SEO fields
    (seo_title / search_description already live on Page's promote tab)."""

    og_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text=(
            "Изображение для соцсетей (Open Graph, рекомендуется 1200×630). "
            "Если не указано — используется изображение по умолчанию из настроек сайта."
        ),
    )

    api_fields = [
        APIField("seo_title"),
        APIField("search_description"),
        APIField("og_image", serializer=ImageRenditionField("fill-1200x630")),
    ]

    class Meta:
        abstract = True


@register_setting
class SiteSettings(BaseSiteSetting):
    logo = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Логотип в шапке сайта. Пока не задан — используется текстовый вордмарк.",
    )
    phone = models.CharField(max_length=32, default="+7 (8672) 40-00-00")
    city = models.CharField(max_length=100, default="Владикавказ")
    region = models.CharField(max_length=100, default="РСО-Алания")
    address = models.CharField(
        max_length=255, default="г. Владикавказ, РСО-Алания"
    )
    email = models.EmailField(default="info@artkavkaz.ru")
    org_legal_name = models.CharField(
        max_length=255, default='Некоммерческий фонд «АРТ-Кавказ»'
    )
    footer_description = models.TextField(
        default=(
            "Некоммерческий фонд поддержки культуры, искусства и архитектуры. "
            "Сохранение и развитие наследия Кавказа."
        )
    )
    telegram_url = models.URLField(blank=True)
    vk_url = models.URLField(blank=True)
    max_messenger_url = models.URLField(blank=True, help_text='Ссылка на канал в мессенджере "Макс"')
    rutube_url = models.URLField(blank=True)
    default_og_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Используется, если у страницы не задано своё og_image.",
    )

    panels = [
        FieldPanel("logo"),
        MultiFieldPanel(
            [
                FieldPanel("phone"),
                FieldPanel("city"),
                FieldPanel("region"),
                FieldPanel("address"),
                FieldPanel("email"),
            ],
            heading="Контакты",
        ),
        MultiFieldPanel(
            [FieldPanel("org_legal_name"), FieldPanel("footer_description")],
            heading="О фонде (для футера и структурированных данных)",
        ),
        MultiFieldPanel(
            [
                FieldPanel("telegram_url"),
                FieldPanel("vk_url"),
                FieldPanel("max_messenger_url"),
                FieldPanel("rutube_url"),
            ],
            heading="Соцсети",
        ),
        FieldPanel("default_og_image"),
    ]

    api_fields = [
        APIField("logo", serializer=ImageRenditionField("max-1200x450")),
        APIField("phone"),
        APIField("city"),
        APIField("region"),
        APIField("address"),
        APIField("email"),
        APIField("org_legal_name"),
        APIField("footer_description"),
        APIField("telegram_url"),
        APIField("vk_url"),
        APIField("max_messenger_url"),
        APIField("rutube_url"),
        APIField("default_og_image", serializer=ImageRenditionField("fill-1200x630")),
    ]

    class Meta:
        verbose_name = "Настройки сайта"
