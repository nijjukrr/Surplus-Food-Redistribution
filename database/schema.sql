-- =========================================================
-- FoodBridge AI Database Schema (Supabase PostgreSQL)
-- =========================================================

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('restaurant', 'ngo', 'volunteer', 'admin')),
    address TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Restaurants Table
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    license_number TEXT,
    fssai_id TEXT,
    address TEXT NOT NULL,
    city TEXT DEFAULT 'Metropolis',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. NGOs Table
CREATE TABLE IF NOT EXISTS public.ngos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    registration_number TEXT,
    capacity_people INTEGER DEFAULT 100,
    serving_areas TEXT DEFAULT 'All Areas',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Volunteers Table
CREATE TABLE IF NOT EXISTS public.volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vehicle_type TEXT DEFAULT 'Two Wheeler' CHECK (vehicle_type IN ('Two Wheeler', 'Four Wheeler', 'Bicycle', 'Van')),
    is_available BOOLEAN DEFAULT TRUE,
    active_deliveries_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Food Donations Table
CREATE TABLE IF NOT EXISTS public.food_donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL,
    restaurant_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    food_category TEXT DEFAULT 'cooked_meal' CHECK (food_category IN ('cooked_meal', 'packaged_food', 'bakery', 'raw_produce')),
    food_type TEXT DEFAULT 'veg' CHECK (food_type IN ('veg', 'non_veg', 'vegan')),
    quantity_kg NUMERIC(8, 2) NOT NULL,
    cooked_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_address TEXT NOT NULL,
    latitude NUMERIC(10, 7) DEFAULT 12.9716,
    longitude NUMERIC(10, 7) DEFAULT 77.5946,
    image_url TEXT,
    status TEXT DEFAULT 'Created' CHECK (status IN ('Created', 'AI Analysed', 'NGO Accepted', 'Volunteer Assigned', 'Picked Up', 'Delivered', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AI Predictions Table
CREATE TABLE IF NOT EXISTS public.ai_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID NOT NULL REFERENCES public.food_donations(id) ON DELETE CASCADE,
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
    urgency_score INTEGER DEFAULT 50 CHECK (urgency_score BETWEEN 0 AND 100),
    estimated_meals INTEGER DEFAULT 0,
    recommended_ngo_id UUID REFERENCES public.ngos(id) ON DELETE SET NULL,
    recommended_ngo_name TEXT,
    reason TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Pickup Requests Table
CREATE TABLE IF NOT EXISTS public.pickup_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID NOT NULL REFERENCES public.food_donations(id) ON DELETE CASCADE,
    ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
    ngo_name TEXT NOT NULL,
    status TEXT DEFAULT 'Requested' CHECK (status IN ('Requested', 'Accepted', 'Rejected', 'Fulfilled')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Deliveries Table
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID NOT NULL REFERENCES public.food_donations(id) ON DELETE CASCADE,
    volunteer_id UUID REFERENCES public.volunteers(id) ON DELETE SET NULL,
    volunteer_name TEXT,
    pickup_request_id UUID REFERENCES public.pickup_requests(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Assigned' CHECK (status IN ('Assigned', 'Picked Up', 'In Transit', 'Delivered')),
    pickup_time TIMESTAMP WITH TIME ZONE,
    delivery_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'status_update' CHECK (type IN ('donation_alert', 'status_update', 'assignment', 'ai_match')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- INDEXES FOR PERFORMANCE
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.food_donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_restaurant ON public.food_donations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_predictions_donation ON public.ai_predictions(donation_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_volunteer ON public.deliveries(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- =========================================================
-- SEED DATA (Demo & Testing)
-- =========================================================
INSERT INTO public.profiles (id, email, full_name, phone, role, address, latitude, longitude)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'restaurant@foodbridge.ai', 'Royal Spice Bistro', '+1 555-0192', 'restaurant', '108 Grand Avenue, Downtown', 12.9716, 77.5946),
    ('22222222-2222-2222-2222-222222222222', 'ngo@foodbridge.ai', 'Care & Share Foundation', '+1 555-0143', 'ngo', '42 Hope Street, East Ward', 12.9750, 77.6000),
    ('33333333-3333-3333-3333-333333333333', 'volunteer@foodbridge.ai', 'Alex Rivera', '+1 555-0188', 'volunteer', '21 Metro Plaza, Central', 12.9680, 77.5910),
    ('44444444-4444-4444-4444-444444444444', 'admin@foodbridge.ai', 'System Admin', '+1 555-0100', 'admin', 'Headquarters', 12.9716, 77.5946)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.restaurants (id, profile_id, business_name, license_number, fssai_id, address)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Royal Spice Bistro', 'LIC-998822', 'FSSAI-10029381', '108 Grand Avenue, Downtown')
ON CONFLICT DO NOTHING;

INSERT INTO public.ngos (id, profile_id, organization_name, registration_number, capacity_people, serving_areas)
VALUES 
    ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Care & Share Foundation', 'NGO-2024-88', 250, 'Downtown, East Ward')
ON CONFLICT DO NOTHING;

INSERT INTO public.volunteers (id, profile_id, vehicle_type, is_available)
VALUES 
    ('c3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Two Wheeler', TRUE)
ON CONFLICT DO NOTHING;
