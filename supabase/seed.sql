-- Seed reference data: 58 wilayas live as a static lookup in the app,
-- but categories and platform settings are seeded here so the app
-- works against a fresh Supabase instance.

insert into public.categories (slug, name_ar, name_fr, icon, sort_order) values
  ('traditional', 'حلويات تقليدية', 'Pâtisseries Traditionnelles', '🌙', 1),
  ('modern',      'حلويات عصرية',  'Pâtisseries Modernes',         '✨', 2),
  ('cakes',       'كيك ومناسبات',  'Gâteaux & Événements',         '🎂', 3),
  ('chocolate',   'شوكولاتة فاخرة', 'Chocolaterie Fine',           '🍫', 4),
  ('gluten-free', 'خالية من الغلوتين', 'Sans Gluten',              '🌾', 5),
  ('honey',       'حلويات بالعسل', 'Aux Miel',                     '🍯', 6)
on conflict (slug) do nothing;

update public.platform_settings set default_commission_bps = 1000 where id = 1;
