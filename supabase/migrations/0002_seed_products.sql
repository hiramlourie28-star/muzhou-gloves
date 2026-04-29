-- 把 src/data/products.ts 里的 17 个静态商品先搬到 DB
-- name/description 留空 jsonb，前端读不到时回落到 messages/{locale}.json 的 category 文案
insert into public.products (slug, category, images, featured, sort_order) values
  ('ski-gloves',                  'ski',        array['/images/products/滑雪手套.jpg'],                                          true,  10),
  ('leather-gloves',              'leather',    array['/images/products/真皮手套.jpg'],                                          true,  20),
  ('velvet-ladies-gloves',        'fabric',     array['/images/products/羊绒女式超柔里手套.jpg'],                                true,  30),
  ('deerskin-ladies-gloves',      'fabric',     array['/images/products/鹿皮绒女式手套.jpg'],                                    false, 31),
  ('fabric-sport-gloves',         'fabric',     array['/images/products/各种面料制作的带运动功能的手套.jpg'],                    false, 32),
  ('teddy-suede-splice-gloves',   'splice',     array['/images/products/手背泰迪毛，手心麂皮绒AB版女式手套.jpg'],                 true,  40),
  ('pu-suede-splice-gloves',      'splice',     array['/images/products/手背蛋白质Pu，手心麂皮绒AB版女式毛口手套.jpg'],           false, 41),
  ('otter-fur-mittens',           'mittens',    array['/images/products/仿獭兔毛女式北极绒里手闷.jpg'],                          true,  50),
  ('new-material-mittens',        'mittens',    array['/images/products/新材料女式北极绒里手闷.jpg'],                            false, 51),
  ('animal-shape-gloves',         'animals',    array['/images/products/动物造型的手套.jpg'],                                    true,  60),
  ('fingerless-gloves',           'fingerless', array['/images/products/半指时尚手套.jpg'],                                      true,  70),
  ('lace-sun-protection-1',       'lace',       array['/images/products/各类蕾丝面料做成的装饰防哂手套.jpg'],                     true,  80),
  ('lace-sun-protection-2',       'lace',       array['/images/products/各类蕾丝面料做成的装饰防哂手套1.jpg'],                    false, 81),
  ('lace-sun-protection-3',       'lace',       array['/images/products/各类蕾丝面料做成的装饰防哂手套2.jpg'],                    false, 82),
  ('sports-functional-gloves',    'sports',     array['/images/products/运动功能的手套.jpg'],                                    true,  90),
  ('cycling-gloves',              'sports',     array['/images/products/运动骑行手套.jpg'],                                      false, 91)
on conflict (slug) do nothing;
