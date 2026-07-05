from django.http import JsonResponse

from core.models import SiteSettings
from wagtail.models import Site


def _image_repr(image, spec="fill-1200x630"):
    if not image:
        return None
    rendition = image.get_rendition(spec)
    return {
        "id": image.id,
        "title": image.title,
        "url": rendition.url,
        "width": rendition.width,
        "height": rendition.height,
    }


def site_settings_view(request):
    site = Site.find_for_request(request) or Site.objects.get(is_default_site=True)
    settings = SiteSettings.for_site(site)
    return JsonResponse(
        {
            "logo": _image_repr(settings.logo, spec="max-320x120"),
            "phone": settings.phone,
            "city": settings.city,
            "region": settings.region,
            "address": settings.address,
            "email": settings.email,
            "org_legal_name": settings.org_legal_name,
            "footer_description": settings.footer_description,
            "telegram_url": settings.telegram_url,
            "vk_url": settings.vk_url,
            "max_messenger_url": settings.max_messenger_url,
            "rutube_url": settings.rutube_url,
            "default_og_image": _image_repr(settings.default_og_image),
        }
    )
