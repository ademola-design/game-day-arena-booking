
-- Add special_requests column to the bookings table
ALTER TABLE public.bookings 
ADD COLUMN special_requests TEXT;
