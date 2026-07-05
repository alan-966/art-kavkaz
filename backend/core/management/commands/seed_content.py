import datetime as dt

from django.core.management.base import BaseCommand
from django.db import transaction

from about.models import AboutIndexPage, CouncilMember, CouncilPage, DocumentItem, DocumentsPage, HistoryPage
from core.models import SiteSettings
from events.models import EventCategory, EventPage, EventsIndexPage
from home.models import HomePage
from partners.models import FundPartnerDetail, FundPartnerLogo, MediaPartnerLogo, PartnersPage
from press.models import PressIndexPage, PressItem
from wagtail.models import Site


class Command(BaseCommand):
    help = "Populates the site with the placeholder content mirrored from the Claude Design mockup."

    @transaction.atomic
    def handle(self, *args, **options):
        home = HomePage.objects.get(slug="home")

        about_index = self._get_or_create_child(
            home,
            AboutIndexPage,
            title="О фонде",
            slug="o-fonde",
            eyebrow="Институция",
            intro_text=(
                "<p>История, документы и совет фонда «АРТ-Кавказ» — открытость и надёжность "
                "для партнёров, государственных структур и творческих сообществ.</p>"
            ),
        )
        history_page = self._get_or_create_child(
            about_index, HistoryPage, title="История фонда", slug="istoriya"
        )
        history_page.timeline = [
            ("entry", {
                "year": "2014", "title": "Основание фонда",
                "description": "Учреждён некоммерческий фонд поддержки культуры, искусства и архитектуры Кавказа.",
                "image": None,
            }),
            ("entry", {
                "year": "2017", "title": "Первая биеннале",
                "description": "Прошла первая биеннале современного искусства Кавказа с участием авторов из шести регионов.",
                "image": None,
            }),
            ("entry", {
                "year": "2020", "title": "Цифровой архив наследия",
                "description": "Запущена опись памятников архитектуры и башенных комплексов в открытом доступе.",
                "image": None,
            }),
            ("entry", {
                "year": "2024", "title": "Международные программы",
                "description": "Открыты арт-резиденции и партнёрства с культурными институциями за пределами региона.",
                "image": None,
            }),
        ]
        history_page.save()

        documents_page = self._get_or_create_child(
            about_index, DocumentsPage, title="Документы", slug="dokumenty"
        )
        for i, doc in enumerate([
            dict(title='Устав фонда «АРТ-Кавказ»', file_type_label="PDF", published_date=dt.date(2024, 1, 1), size_note="1.4 МБ", action_label="download"),
            dict(title="Свидетельство о регистрации", file_type_label="PDF", published_date=dt.date(2014, 1, 1), size_note="0.8 МБ", action_label="download"),
            dict(title="Годовой отчёт о деятельности", file_type_label="JPEG", published_date=dt.date(2025, 1, 1), size_note="3.2 МБ", action_label="view"),
            dict(title="Положение о грантовой программе", file_type_label="PDF", published_date=dt.date(2025, 1, 1), size_note="0.6 МБ", action_label="download"),
        ]):
            DocumentItem.objects.get_or_create(page=documents_page, sort_order=i, defaults=doc)

        council_page = self._get_or_create_child(
            about_index, CouncilPage, title="Совет фонда", slug="sovet"
        )
        for i, member in enumerate([
            dict(full_name="Председатель совета", role_title="Президент фонда", role_subtitle="", bio="Куратор и инициатор культурных программ Кавказа."),
            dict(full_name="Член совета", role_title="Архитектор", role_subtitle="", bio="Специалист по сохранению архитектурного наследия."),
            dict(full_name="Член совета", role_title="Искусствовед", role_subtitle="", bio="Куратор выставочных и образовательных проектов."),
            dict(full_name="Член совета", role_title="Директор программ", role_subtitle="", bio="Развитие партнёрств и международных инициатив."),
        ]):
            CouncilMember.objects.get_or_create(page=council_page, sort_order=i, defaults=member)

        events_index = self._get_or_create_child(
            home,
            EventsIndexPage,
            title="События",
            slug="sobytiya",
            eyebrow="Хроника фонда",
        )

        categories = {
            name: EventCategory.objects.get_or_create(slug=slug, defaults={"name": name})[0]
            for name, slug in [
                ("Выставка", "vystavka"),
                ("Лекторий", "lektoriy"),
                ("Наследие", "nasledie"),
                ("Музыка", "muzyka"),
                ("Форум", "forum"),
                ("Резиденция", "rezidentsiya"),
            ]
        }

        biennale = self._get_or_create_child(
            events_index,
            EventPage,
            title="III Биеннале современного искусства Кавказа",
            slug="biennale-iii",
            category=categories["Выставка"],
            date_start=dt.date(2026, 6, 12),
            date_end=dt.date(2026, 9, 30),
            excerpt=(
                "Масштабный смотр современного искусства региона: живопись, инсталляция, "
                "медиа и архитектурные исследования в диалоге с наследием."
            ),
            is_featured=True,
        )

        for slug, title, category, date_start, excerpt in [
            ("bashni-i-vremya", "«Башни и время»", "Выставка", dt.date(2026, 5, 14), "Фотопроект о башенной архитектуре горного Кавказа."),
            ("sovremennoe-iskusstvo-kavkaza", "Современное искусство Кавказа", "Лекторий", dt.date(2026, 4, 2), "Цикл публичных лекций с кураторами фонда."),
            ("restavratsiya-starogo-nalchika", "Реставрация старого Нальчика", "Наследие", dt.date(2026, 3, 18), "Запуск программы сохранения исторической застройки."),
            ("vecher-kavkazskoy-muzyki", "Вечер кавказской музыки", "Музыка", dt.date(2026, 2, 28), "Концерт традиционной и современной музыки."),
            ("arkhitektura-i-identichnost", "Архитектура и идентичность", "Форум", dt.date(2026, 2, 10), "Дискуссия о будущем городов Кавказа."),
            ("itogi-art-rezidentsii-2025", "Итоги арт-резиденции 2025", "Резиденция", dt.date(2026, 1, 20), "Выставка работ участников программы."),
        ]:
            self._get_or_create_child(
                events_index,
                EventPage,
                title=title,
                slug=slug,
                category=categories[category],
                date_start=date_start,
                excerpt=excerpt,
            )

        partners_page = self._get_or_create_child(
            home,
            PartnersPage,
            title="Партнёры",
            slug="partnery",
            eyebrow="Доверие и сотрудничество",
            intro_text=(
                "<p>Фонд работает с государственными институциями, культурными организациями "
                "и медиа, разделяющими ценность сохранения наследия Кавказа.</p>"
            ),
            cta_text='Станьте партнёром фонда «АРТ-Кавказ» и поддержите культуру Кавказа',
            cta_button_text="Связаться с фондом",
            cta_button_link="mailto:info@artkavkaz.ru",
        )
        for i in range(8):
            FundPartnerLogo.objects.get_or_create(page=partners_page, sort_order=i, defaults={"name": f"Партнёр {i + 1}"})
            MediaPartnerLogo.objects.get_or_create(page=partners_page, sort_order=i, defaults={"name": f"Медиапартнёр {i + 1}"})
        for i, detail in enumerate([
            dict(name="Министерство культуры", description="Поддержка выставочных и образовательных программ фонда на региональном уровне."),
            dict(name="Национальный музей", description="Совместные экспозиции и исследовательские проекты по наследию региона."),
        ]):
            FundPartnerDetail.objects.get_or_create(page=partners_page, sort_order=i, defaults=detail)

        press_index = self._get_or_create_child(
            home,
            PressIndexPage,
            title="СМИ о нас",
            slug="smi-o-nas",
            eyebrow="Публикации",
            intro_text=(
                "<p>Что пишут о фонде «АРТ-Кавказ» федеральные и региональные медиа — выставки, "
                "грантовые программы и сохранение наследия Кавказа.</p>"
            ),
        )
        for i, item in enumerate([
            dict(source_name="ТАСС", year=2025, title="Цифровой архив башенной архитектуры", excerpt='Фонд «АРТ-Кавказ» открыл публичную опись памятников горного Кавказа в открытом доступе.'),
            dict(source_name="РБК", year=2025, title="Частный фонд и искусство Кавказа", excerpt='Как «АРТ-Кавказ» формирует новую модель частной поддержки культуры в регионе.'),
            dict(source_name="The Art Newspaper", year=2024, title="Биеннале Кавказа", excerpt="Новая институция появилась на культурной карте региона и привлекла международное внимание."),
            dict(source_name="Коммерсантъ", year=2024, title="Грантовая программа фонда", excerpt="Поддержку получили 40 авторов из шести регионов Кавказа в рамках конкурса фонда."),
            dict(source_name="Афиша", year=2023, title="Резиденции в горах Кавказа", excerpt='Где и как работают художники программы арт-резиденций «АРТ-Кавказ».'),
            dict(source_name="15-й Регион", year=2023, title="Выставка из собрания фонда", excerpt='Во Владикавказе открылась экспозиция работ из коллекции фонда «АРТ-Кавказ».'),
        ]):
            PressItem.objects.get_or_create(page=press_index, sort_order=i, defaults=item)

        home.title = "Главная"
        home.seo_title = "АРТ-Кавказ — фонд поддержки культуры, искусства и архитектуры"
        home.search_description = (
            "Некоммерческий фонд поддержки культуры, искусства и архитектуры Кавказа. "
            "Выставки, биеннале, гранты и сохранение наследия."
        )
        home.eyebrow = "Институция"
        home.intro_heading = "О фонде"
        home.intro_text = (
            "<p>«АРТ-Кавказ» — некоммерческий фонд, работающий на стыке искусства, архитектуры "
            "и культурного наследия. Мы поддерживаем художников и архитекторов, организуем "
            "выставки и формируем устойчивый диалог между регионами Кавказа и международным "
            "культурным сообществом.</p>"
        )
        home.intro_quote = "Сохранение, развитие и популяризация культуры, искусства и архитектуры Кавказа."
        home.mission_eyebrow = "Зачем мы работаем"
        home.mission_heading = "Миссия фонда"
        home.mission_text = (
            "<p>Мы сохраняем и переосмысляем культурное наследие Кавказа, поддерживаем художников "
            "и архитекторов и выстраиваем устойчивый диалог между традицией и современностью.</p>"
        )
        home.stats_eyebrow = "Фонд в цифрах"
        home.stats_heading = "12 лет культурной работы на Кавказе"
        home.stats = [
            ("stat", {"value": "12", "label": "Лет работы фонда"}),
            ("stat", {"value": "150+", "label": "Мероприятий"}),
            ("stat", {"value": "60", "label": "Партнёров"}),
            ("stat", {"value": "85", "label": "Культурных проектов"}),
        ]
        home.hero_slides = [
            ("slide", {
                "image": None, "theme": "light", "title": "АРТ-Кавказ",
                "description": "Фонд поддержки культуры, искусства и архитектуры. Сохраняем наследие Кавказа и создаём пространство для современного творчества.",
                "button_text": "О фонде", "button_page": about_index,
            }),
            ("slide", {
                "image": None, "theme": "dark", "title": "III Биеннале современного искусства Кавказа",
                "description": "Масштабный смотр современного искусства региона: живопись, инсталляция, медиа и архитектурные исследования в диалоге с наследием.",
                "button_text": "Подробнее о событии", "button_page": biennale,
            }),
            ("slide", {
                "image": None, "theme": "light", "title": "«Башни и время»",
                "description": "Фотопроект о башенной архитектуре горного Кавказа — наследие, прочитанное через современный взгляд.",
                "button_text": "Смотреть события", "button_page": events_index,
            }),
            ("slide", {
                "image": None, "theme": "dark", "title": "Станьте партнёром «АРТ-Кавказ»",
                "description": "Поддержите культуру, искусство и архитектуру Кавказа — вместе с государственными институциями, музеями и медиа.",
                "button_text": "Стать партнёром", "button_page": partners_page,
            }),
        ]
        home.save()

        site = Site.objects.get(is_default_site=True)
        settings = SiteSettings.for_site(site)
        settings.phone = "+7 (8672) 40-00-00"
        settings.city = "Владикавказ"
        settings.region = "РСО-Алания"
        settings.address = "г. Владикавказ, РСО-Алания"
        settings.email = "info@artkavkaz.ru"
        settings.save()

        self.stdout.write(self.style.SUCCESS("Placeholder content seeded."))

    @staticmethod
    def _get_or_create_child(parent, model, *, title, slug, **fields):
        existing = model.objects.child_of(parent).filter(slug=slug).first()
        if existing:
            return existing
        page = model(title=title, slug=slug, live=True, **fields)
        parent.add_child(instance=page)
        return page
