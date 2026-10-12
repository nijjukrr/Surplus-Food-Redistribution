ALTER TABLE foodbridge.food_donations DROP CONSTRAINT food_donations_status_check;
ALTER TABLE foodbridge.food_donations ADD CONSTRAINT food_donations_status_check
CHECK (status IN ('Created', 'AI Analysed', 'Pending Admin Review', 'Approved', 'Rejected',
  'Reoffered to Next NGO', 'NGO Accepted', 'Volunteer Assigned', 'Picked Up', 'Delivered', 'Completed'));
