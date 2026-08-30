-- ==========================================
-- SUPABASE SCHEMA - PERSONAL FINANCE MANAGER
-- ==========================================

-- 1. Create TRANSACTIONS Table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount NUMERIC NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL,
    currency TEXT DEFAULT 'IDR',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security) for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create Policies (User can only read/write their OWN transactions)
CREATE POLICY "Users can manage their own transactions" 
ON public.transactions 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);


-- 2. Create USER_PREFERENCES Table
CREATE TABLE public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    settings JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create Policies (User can only read/write their OWN preferences)
CREATE POLICY "Users can manage their own preferences" 
ON public.user_preferences 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);


-- Add phone_number for WhatsApp Integration
ALTER TABLE public.user_preferences ADD COLUMN phone_number TEXT UNIQUE;
