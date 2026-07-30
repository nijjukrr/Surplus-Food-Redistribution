const { supabase, isConfigured } = require('../config/supabase');
const donationService = require('./donationService');
const notificationService = require('./notificationService');

class VolunteerService {
  /**
   * Volunteer claims delivery assignment for an NGO-accepted donation
   */
  async assignVolunteer(donationId, volunteerUser) {
    const volunteerName = volunteerUser?.profile?.full_name || volunteerUser?.full_name || 'Alex Rivera';
    const volunteerId = volunteerUser?.id || '33333333-3333-3333-3333-333333333333';

    let delivery = {
      id: 'del-' + Date.now(),
      donation_id: donationId,
      volunteer_id: volunteerId,
      volunteer_name: volunteerName,
      status: 'Assigned',
      created_at: new Date().toISOString()
    };

    if (isConfigured()) {
      const { data, error } = await supabase
        .from('deliveries')
        .insert({
          donation_id: donationId,
          volunteer_id: volunteerId,
          volunteer_name: volunteerName,
          status: 'Assigned'
        })
        .select()
        .single();
      if (!error && data) delivery = data;
    }

    // Update donation status to 'Volunteer Assigned'
    const updatedDonation = await donationService.updateStatus(donationId, 'Volunteer Assigned', volunteerUser);

    await notificationService.createNotification({
      title: 'Volunteer Assigned for Delivery',
      message: `Volunteer ${volunteerName} is en route to pick up food donation.`,
      type: 'assignment'
    });

    return { delivery, donation: updatedDonation };
  }

  /**
   * Update delivery step (Picked Up -> Delivered -> Completed)
   */
  async updateDeliveryStep(donationId, step, volunteerUser) {
    let nextStatus = 'Picked Up';
    if (step === 'picked_up' || step === 'Picked Up') nextStatus = 'Picked Up';
    else if (step === 'delivered' || step === 'Delivered') nextStatus = 'Delivered';
    else if (step === 'completed' || step === 'Completed') nextStatus = 'Completed';

    if (isConfigured()) {
      const updateData = { status: nextStatus };
      if (nextStatus === 'Picked Up') updateData.pickup_time = new Date().toISOString();
      if (nextStatus === 'Delivered' || nextStatus === 'Completed') updateData.delivery_time = new Date().toISOString();

      await supabase
        .from('deliveries')
        .update(updateData)
        .eq('donation_id', donationId);
    }

    const updatedDonation = await donationService.updateStatus(donationId, nextStatus, volunteerUser);

    await notificationService.createNotification({
      title: `Food Delivery Status: ${nextStatus}`,
      message: `Surplus food donation has been marked as ${nextStatus}!`,
      type: 'status_update'
    });

    return updatedDonation;
  }
}

module.exports = new VolunteerService();
