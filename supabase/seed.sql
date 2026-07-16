-- =====================================================================
-- PC HUB — Sample Seed Data
-- Run AFTER schema.sql. Adjust category ids are generated dynamically
-- via the WITH clause below so this file is copy-paste runnable.
-- =====================================================================

-- ---------------- Categories ----------------
insert into categories (name, slug) values
  ('CPU', 'cpu'),
  ('Mainboard', 'mainboard'),
  ('RAM', 'ram'),
  ('GPU', 'gpu'),
  ('SSD', 'ssd'),
  ('PSU', 'psu'),
  ('Case', 'case')
on conflict (name) do nothing;

-- ---------------- Products ----------------
-- CPU
insert into products (category_id, name, description, price, stock_quantity, specs)
select id, 'AMD Ryzen 7 7800X3D', 'ซีพียูเกมมิ่งระดับท็อป ด้วยเทคโนโลยี 3D V-Cache', 12900, 25,
  '{"socket": "AM5", "cores": "8", "threads": "16", "boost_clock": "5.0 GHz", "tdp": "120W"}'::jsonb
from categories where name = 'CPU';

insert into products (category_id, name, description, price, stock_quantity, specs)
select id, 'Intel Core i5-14600K', 'ซีพียูสายกลางประสิทธิภาพสูง คุ้มค่าสำหรับเกมและงานทั่วไป', 10900, 40,
  '{"socket": "LGA1700", "cores": "14", "threads": "20", "boost_clock": "5.3 GHz", "tdp": "125W"}'::jsonb
from categories where name = 'CPU';

-- Mainboard
insert into products (category_id, name, description, price, stock_quantity, specs)
select id, 'ASUS ROG STRIX B650-A', 'เมนบอร์ด AM5 รองรับ PCIe 5.0 และ DDR5', 7900, 18,
  '{"socket": "AM5", "chipset": "B650", "ram_type": "DDR5", "form_factor": "ATX"}'::jsonb
from categories where name = 'Mainboard';

insert into products (category_id, name, description, price, stock_quantity, specs)
select id, 'MSI PRO Z790-P', 'เมนบอร์ดสาย Intel รุ่นคุ้มค่า รองรับ DDR5', 6500, 22,
  '{"socket": "LGA1700", "chipset": "Z790", "ram_type": "DDR5", "form_factor": "ATX"}'::jsonb
from categories where name = 'Mainboard';

-- RAM
insert into products (category_id, name, description, price, stock_quantity, specs)
select id, 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz', 'แรมเกมมิ่งความเร็วสูง เสถียรภาพสูง', 4200, 60,
  '{"capacity": "32GB (2x16GB)", "type": "DDR5", "speed": "6000MHz", "cas_latency": "CL30"}'::jsonb
from categories where name = 'RAM';

insert into products (category_id, name, description, price, stock_quantity, specs)
select id, 'Kingston FURY Beast 16GB (2x8GB) 3200MHz', 'แรม DDR4 คุ้มค่าสำหรับสายประกอบทั่วไป', 1590, 80,
  '{"capacity": "16GB (2x8GB)", "type": "DDR4", "speed": "3200MHz", "cas_latency": "CL16"}'::jsonb
from categories where name = 'RAM';

-- GPU
insert into products (category_id, name, description, price, stock_quantity, specs)
select id, 'NVIDIA GeForce RTX 4070 Super', 'การ์ดจอเกมมิ่งระดับกลาง-สูง เล่นเกม 1440p ลื่นไหล', 22900, 15,
  '{"vram": "12GB GDDR6X", "boost_clock": "2475 MHz", "power_connector": "1x 16-pin", "recommended_psu": "650W"}'::jsonb
from categories where name = 'GPU';

insert into products (category_id, name, description, price, stock_quantity, specs)
select id, 'AMD Radeon RX 7800 XT', 'การ์ดจอประสิทธิภาพสูง คุ้มค่าสำหรับเกม 1440p', 18900, 12,
  '{"vram": "16GB GDDR6", "boost_clock": "2430 MHz", "power_connector": "2x 8-pin", "recommended_psu": "700W"}'::jsonb
from categories where name = 'GPU';

-- SSD
insert into products (category_id, name, description, price, stock_quantity, specs)
select id, 'Samsung 990 PRO 1TB NVMe', 'SSD ความเร็วสูงสุด รองรับ PCIe 4.0', 3200, 45,
  '{"capacity": "1TB", "interface": "PCIe 4.0 NVMe", "read_speed": "7450 MB/s", "write_speed": "6900 MB/s"}'::jsonb
from categories where name = 'SSD';

insert into products (category_id, name, description, price, stock_quantity, specs)
select id, 'WD Blue SN580 500GB NVMe', 'SSD คุ้มค่าเหมาะสำหรับไดรฟ์ระบบ', 1290, 70,
  '{"capacity": "500GB", "interface": "PCIe 4.0 NVMe", "read_speed": "4150 MB/s", "write_speed": "3600 MB/s"}'::jsonb
from categories where name = 'SSD';

-- PSU
insert into products (category_id, name, description, price, stock_quantity, specs)
select id, 'Corsair RM750e 750W 80+ Gold', 'พาวเวอร์ซัพพลาย Full Modular เสถียรภาพสูง', 3490, 30,
  '{"wattage": "750W", "efficiency": "80+ Gold", "modular": "Full Modular"}'::jsonb
from categories where name = 'PSU';

-- Case
insert into products (category_id, name, description, price, stock_quantity, specs)
select id, 'Lian Li LANCOOL 216', 'เคสระบายอากาศดีเยี่ยม รองรับกระจกฝั่งข้าง', 2890, 20,
  '{"form_factor": "Mid Tower", "gpu_clearance": "384mm", "included_fans": "2x 160mm ARGB"}'::jsonb
from categories where name = 'Case';
