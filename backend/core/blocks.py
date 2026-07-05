from wagtail.blocks import PageChooserBlock
from wagtail.images.blocks import ImageChooserBlock

#: Wagtail's stock ImageChooserBlock/PageChooserBlock only serialize the PK
#: over the API. The Next.js frontend needs a ready-to-use rendition URL / page
#: URL, so every StreamField that carries one uses these blocks instead.
RENDITION_SPEC = "fill-1600x900"


class APIImageChooserBlock(ImageChooserBlock):
    def get_api_representation(self, value, context=None):
        if not value:
            return None
        rendition = value.get_rendition(RENDITION_SPEC)
        return {
            "id": value.id,
            "title": value.title,
            "url": rendition.url,
            "width": rendition.width,
            "height": rendition.height,
        }


class APIPageChooserBlock(PageChooserBlock):
    def get_api_representation(self, value, context=None):
        if not value:
            return None
        return {"id": value.id, "url": value.get_url(), "title": value.title}
