-- =========================================================
-- FoodBridge AI - Migration for Missing Tables Only
-- Target Tables: ai_predictions, pickup_requests, deliveries, notifications
-- =========================================================

-- Enable pgcrypto extension for UUID generation if not present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. AI Predictions Table
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

-- 2. Pickup Requests Table
CREATE TABLE IF NOT EXISTS public.pickup_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID NOT NULL REFERENCES public.food_donations(id) ON DELETE CASCADE,
    ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
    ngo_name TEXT NOT NULL,
    status TEXT DEFAULT 'Requested' CHECK (status IN ('Requested', 'Accepted', 'Rejected', 'Fulfilled')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Deliveries Table
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

-- 4. Notifications Table
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
CREATE INDEX IF NOT EXISTS idx_predictions_donation ON public.ai_predictions(donation_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_donation ON public.pickup_requests(donation_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_ngo ON public.pickup_requests(ngo_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_donation ON public.deliveries(donation_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_volunteer ON public.deliveries(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- =========================================================
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow read/write operations for API service role and authenticated app users
CREATE POLICY "Allow read access to ai_predictions" ON public.ai_predictions FOR SELECT USING (true);
CREATE POLICY "Allow insert to ai_predictions" ON public.ai_predictions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to ai_predictions" ON public.ai_predictions FOR UPDATE USING (true);

CREATE POLICY "Allow read access to pickup_requests" ON public.pickup_requests FOR SELECT USING (true);
CREATE POLICY "Allow insert to pickup_requests" ON public.pickup_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to pickup_requests" ON public.pickup_requests FOR UPDATE USING (true);

CREATE POLICY "Allow read access to deliveries" ON public.deliveries FOR SELECT USING (true);
CREATE POLICY "Allow insert to deliveries" ON public.deliveries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to deliveries" ON public.deliveries FOR UPDATE USING (true);

CREATE POLICY "Allow read access to notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow insert to notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to notifications" ON public.notifications FOR UPDATE USING (true);
