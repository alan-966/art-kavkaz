export interface WagtailImage {
  id: number;
  title: string;
  url: string;
  width: number;
  height: number;
}

export interface WagtailPageLink {
  id: number;
  url: string;
  title: string;
}

export interface WagtailPageMeta {
  type: string;
  detail_url: string;
  html_url: string;
  slug: string;
  first_published_at: string | null;
  seo_title?: string;
  search_description?: string;
}

interface WithSeo {
  id: number;
  title: string;
  meta: WagtailPageMeta;
  og_image: WagtailImage | null;
}

export interface HeroSlide {
  image: WagtailImage | null;
  theme: "light" | "dark";
  title: string;
  description: string;
  button_text: string;
  button_page: WagtailPageLink | null;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface HomePage extends WithSeo {
  eyebrow: string;
  intro_heading: string;
  intro_text: string;
  intro_image: WagtailImage | null;
  intro_quote: string;
  mission_eyebrow: string;
  mission_heading: string;
  mission_text: string;
  stats_eyebrow: string;
  stats_heading: string;
  hero_slides: { type: "slide"; value: HeroSlide; id: string }[];
  stats: { type: "stat"; value: StatItem; id: string }[];
}

export interface AboutIndexPage extends WithSeo {
  eyebrow: string;
  intro_text: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  image: WagtailImage | null;
}

export interface HistoryPage extends WithSeo {
  timeline: { type: "entry"; value: TimelineEntry; id: string }[];
}

export interface DocumentItem {
  id: number;
  title: string;
  file_type_label: string;
  published_date: string | null;
  size_note: string;
  action_label: "download" | "view";
  file_url: string | null;
}

export interface DocumentsPage extends WithSeo {
  documents: DocumentItem[];
}

export interface CouncilMember {
  id: number;
  full_name: string;
  role_title: string;
  role_subtitle: string;
  bio: string;
  photo: WagtailImage | null;
}

export interface CouncilPage extends WithSeo {
  members: CouncilMember[];
}

export interface EventsIndexPage extends WithSeo {
  eyebrow: string;
  intro_text: string;
}

export interface EventSummary extends WithSeo {
  date_start: string;
  date_end: string | null;
  excerpt: string;
  is_featured: boolean;
  category_name: string | null;
  category_slug: string | null;
  cover_image: WagtailImage | null;
}

export interface EventDetail extends EventSummary {
  body: string;
}

export interface PartnerLogo {
  id: number;
  name: string;
  logo: WagtailImage | null;
}

export interface PartnerDetail {
  id: number;
  name: string;
  logo: WagtailImage | null;
  description: string;
}

export interface PartnersPage extends WithSeo {
  eyebrow: string;
  intro_text: string;
  fund_partners_heading: string;
  media_partners_heading: string;
  cta_text: string;
  cta_button_text: string;
  cta_button_link: string;
  fund_partners: PartnerLogo[];
  fund_partner_details: PartnerDetail[];
  media_partners: PartnerLogo[];
}

export interface PressItem {
  id: number;
  source_name: string;
  year: number;
  title: string;
  excerpt: string;
  external_url: string;
}

export interface PressIndexPage extends WithSeo {
  eyebrow: string;
  intro_text: string;
  press_items: PressItem[];
}

export interface SiteSettings {
  logo: WagtailImage | null;
  phone: string;
  city: string;
  region: string;
  address: string;
  email: string;
  org_legal_name: string;
  footer_description: string;
  telegram_url: string;
  vk_url: string;
  max_messenger_url: string;
  rutube_url: string;
  default_og_image: WagtailImage | null;
}
