import logging

import requests
from django.conf import settings
from django.db.models.signals import post_save
from wagtail.signals import page_published, page_unpublished

logger = logging.getLogger(__name__)


def _notify_next(instance):
    """Ping the Next.js on-demand revalidation endpoint so the published
    (or unpublished) page is regenerated without a full rebuild/redeploy."""
    try:
        path = instance.get_url() or "/"
    except Exception:
        path = "/"

    try:
        requests.post(
            settings.NEXT_REVALIDATE_URL,
            json={"secret": settings.NEXT_REVALIDATE_SECRET, "path": path},
            timeout=3,
        )
    except requests.RequestException:
        logger.warning("Next.js revalidate webhook unreachable for %s", instance, exc_info=True)


def on_page_published(sender, instance, **kwargs):
    _notify_next(instance)


def on_page_unpublished(sender, instance, **kwargs):
    _notify_next(instance)


def on_site_settings_saved(sender, instance, **kwargs):
    """SiteSettings isn't a Page, so it never fires page_published — saving
    it in the admin (e.g. the header logo) needs its own revalidation hook."""
    _notify_next(instance)


def register_signal_handlers():
    from core.models import SiteSettings

    page_published.connect(on_page_published)
    page_unpublished.connect(on_page_unpublished)
    post_save.connect(on_site_settings_saved, sender=SiteSettings)
