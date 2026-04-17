-- Seed Data for Walet Categories - FULL LIST
-- Limpia y carga todas las categorías y subcategorías reales

-- 1. LIMPIAR DATOS EXISTENTES
TRUNCATE public.categories CASCADE;

-- 2. CATEGORÍAS PRINCIPALES (GASTOS)
INSERT INTO public.categories (id, name, type) VALUES 
('c1a00001-0000-0000-0000-000000000001', 'Colegio', 'expense'),
('c1a00001-0000-0000-0000-000000000002', 'Comida', 'expense'),
('c1a00001-0000-0000-0000-000000000003', 'Salidas', 'expense'),
('c1a00001-0000-0000-0000-000000000004', 'Transporte', 'expense'),
('c1a00001-0000-0000-0000-000000000005', 'Banco', 'expense'),
('c1a00001-0000-0000-0000-000000000006', 'Mercado', 'expense'),
('c1a00001-0000-0000-0000-000000000007', 'Vestimenta', 'expense'),
('c1a00001-0000-0000-0000-000000000008', 'Juego', 'expense'),
('c1a00001-0000-0000-0000-000000000009', 'Salud', 'expense'),
('c1a00001-0000-0000-0000-000000000010', 'Deporte', 'expense'),
('c1a00001-0000-0000-0000-000000000011', 'Personal', 'expense'),
('c1a00001-0000-0000-0000-000000000012', 'Regalos', 'expense'),
('c1a00001-0000-0000-0000-000000000013', 'Servicio', 'expense'),
('c1a00001-0000-0000-0000-000000000014', 'Casa', 'expense');

-- 3. CATEGORÍAS PRINCIPALES (INGRESOS)
INSERT INTO public.categories (id, name, type) VALUES 
('f1a00001-0000-0000-0000-000000000001', 'Ingreso', 'income');

-- 4. SUBCATEGORÍAS

-- Banco
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Plin', 'expense', 'c1a00001-0000-0000-0000-000000000005'),
('Yape', 'expense', 'c1a00001-0000-0000-0000-000000000005'),
('Transferencia', 'expense', 'c1a00001-0000-0000-0000-000000000005'),
('Prestamo', 'expense', 'c1a00001-0000-0000-0000-000000000005'),
('Tarjeta', 'expense', 'c1a00001-0000-0000-0000-000000000005');

-- Casa
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Limpieza', 'expense', 'c1a00001-0000-0000-0000-000000000014'),
('Articulos-varios', 'expense', 'c1a00001-0000-0000-0000-000000000014');

-- Colegio
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Universidad', 'expense', 'c1a00001-0000-0000-0000-000000000001'),
('Mensualidad', 'expense', 'c1a00001-0000-0000-0000-000000000001'),
('Eventos', 'expense', 'c1a00001-0000-0000-0000-000000000001'),
('Articulos', 'expense', 'c1a00001-0000-0000-0000-000000000001'),
('Otros-Col', 'expense', 'c1a00001-0000-0000-0000-000000000001'),
('Movilidad', 'expense', 'c1a00001-0000-0000-0000-000000000001');

-- Comida
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Desayuno', 'expense', 'c1a00001-0000-0000-0000-000000000002'),
('Almuerzo', 'expense', 'c1a00001-0000-0000-0000-000000000002'),
('Cena', 'expense', 'c1a00001-0000-0000-0000-000000000002'),
('Dulces', 'expense', 'c1a00001-0000-0000-0000-000000000002'),
('Antojo', 'expense', 'c1a00001-0000-0000-0000-000000000002'),
('Restaurante', 'expense', 'c1a00001-0000-0000-0000-000000000002'),
('Gaseosa', 'expense', 'c1a00001-0000-0000-0000-000000000002');

-- Deporte
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Cancha', 'expense', 'c1a00001-0000-0000-0000-000000000010'),
('Apuesta', 'expense', 'c1a00001-0000-0000-0000-000000000010'),
('Hidratacion', 'expense', 'c1a00001-0000-0000-0000-000000000010');

-- Ingresos
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Sueldo FDM', 'income', 'f1a00001-0000-0000-0000-000000000001'),
('Sueldo Quince', 'income', 'f1a00001-0000-0000-0000-000000000001'),
('Gratificacion', 'income', 'f1a00001-0000-0000-0000-000000000001'),
('CTS', 'income', 'f1a00001-0000-0000-0000-000000000001'),
('Utilidades', 'income', 'f1a00001-0000-0000-0000-000000000001'),
('OtrosIngresos', 'income', 'f1a00001-0000-0000-0000-000000000001');

-- Juego
INSERT INTO public.categories (name, type, parent_id) VALUES 
('LoL', 'expense', 'c1a00001-0000-0000-0000-000000000008'),
('Apps', 'expense', 'c1a00001-0000-0000-0000-000000000008'),
('MV', 'expense', 'c1a00001-0000-0000-0000-000000000008');

-- Mercado
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Plaza Vea', 'expense', 'c1a00001-0000-0000-0000-000000000006'),
('Metro', 'expense', 'c1a00001-0000-0000-0000-000000000006'),
('Mercado', 'expense', 'c1a00001-0000-0000-0000-000000000006'),
('Totus', 'expense', 'c1a00001-0000-0000-0000-000000000006');

-- Personal
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Aseo Personal', 'expense', 'c1a00001-0000-0000-0000-000000000011'),
('Corte Cabello', 'expense', 'c1a00001-0000-0000-0000-000000000011');

-- Regalos
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Otros-Reg', 'expense', 'c1a00001-0000-0000-0000-000000000012'),
('Navidad', 'expense', 'c1a00001-0000-0000-0000-000000000012'),
('Cumpleaños', 'expense', 'c1a00001-0000-0000-0000-000000000012');

-- Salidas
INSERT INTO public.categories (name, type, parent_id) VALUES 
('HappyLand', 'expense', 'c1a00001-0000-0000-0000-000000000003'),
('MrJoy', 'expense', 'c1a00001-0000-0000-0000-000000000003'),
('DollarCity', 'expense', 'c1a00001-0000-0000-0000-000000000003'),
('Cine', 'expense', 'c1a00001-0000-0000-0000-000000000003'),
('Juegos', 'expense', 'c1a00001-0000-0000-0000-000000000003'),
('Parque', 'expense', 'c1a00001-0000-0000-0000-000000000003'),
('Fiestas', 'expense', 'c1a00001-0000-0000-0000-000000000003');

-- Salud
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Otros', 'expense', 'c1a00001-0000-0000-0000-000000000009'),
('Examenes', 'expense', 'c1a00001-0000-0000-0000-000000000009'),
('Medicinas', 'expense', 'c1a00001-0000-0000-0000-000000000009'),
('Aseo Personal', 'expense', 'c1a00001-0000-0000-0000-000000000009');

-- Servicio
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Agua', 'expense', 'c1a00001-0000-0000-0000-000000000013'),
('Celular', 'expense', 'c1a00001-0000-0000-0000-000000000013'),
('Otros', 'expense', 'c1a00001-0000-0000-0000-000000000013');

-- Transporte
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Pasaje', 'expense', 'c1a00001-0000-0000-0000-000000000004'),
('Metropolitano', 'expense', 'c1a00001-0000-0000-0000-000000000004'),
('Tren', 'expense', 'c1a00001-0000-0000-0000-000000000004'),
('Taxi', 'expense', 'c1a00001-0000-0000-0000-000000000004'),
('Colectivo', 'expense', 'c1a00001-0000-0000-0000-000000000004');

-- Vestimenta
INSERT INTO public.categories (name, type, parent_id) VALUES 
('Ropa-Jonathan', 'expense', 'c1a00001-0000-0000-0000-000000000007'),
('Ropa-Valentina', 'expense', 'c1a00001-0000-0000-0000-000000000007');
