-- Esquema Integral para Walet (PWA de Finanzas y Hábitos)

-- Extensión para IDs únicos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categorías y Subcategorías (Jerárquicas)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'saving', 'investment')),
    icon TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Transacciones (Ingresos y Gastos)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12,2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    detail TEXT,
    image_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Inversiones y Ahorros (Metas)
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    target_amount DECIMAL(12,2),
    current_amount DECIMAL(12,2) DEFAULT 0,
    type TEXT CHECK (type IN ('saving', 'investment')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Presupuestos Mensuales (Proyectado vs Real)
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    projected_income DECIMAL(12,2) DEFAULT 0,
    projected_expense DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(month, year)
);

-- 5. Hábitos: Hidratación (Vasos de Agua)
CREATE TABLE IF NOT EXISTS public.water_intake (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intake_date DATE DEFAULT CURRENT_DATE NOT NULL,
    intake_time TIME DEFAULT CURRENT_TIME NOT NULL,
    is_completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar algunas categorías base
INSERT INTO public.categories (name, type) VALUES 
('Sueldo FDM', 'income'),
('Casa', 'expense'),
('Comida', 'expense'),
('Transporte', 'expense'),
('HAPI', 'investment');
