const { supabase, isConfigured } = require('../config/supabase');
const donationService = require('./donationService');
const notificationService = require('./notificationService');

class NgoService {
  /**
   * NGO Accepts a donation -> creates pickup_request and transitions status to 'NGO Accepted'
   */
  async acceptDonation(donationId, ngoUser) {
    const ngoName = ngoUser?.profile?.organization_name || ngoUser?.organization_name || 'Care & Share Foundation';
    const ngoId = ngoUser?.id || '22222222-2222-2222-2222-222222222222';

    let pickupRequest = {
      id: 'req-' + Date.now(),
      donation_id: donationId,
      ngo_id: ngoId,
      ngo_name: ngoName,
      status: 'Accepted',
      requested_at: new Date().toISOString()
    };

    if (isConfigured()) {
      const { data, error } = await supabase
        .from('pickup_requests')
        .insert({
          donation_id: donationId,
          ngo_id: ngoId,
          ngo_name: ngoName,
          status: 'Accepted'
        })
        .select()
        .single();

      if (!error && data) pickupRequest = data;
    }

    // Update donation status
    const updatedDonation = await donationService.updateStatus(donationId, 'NGO Accepted', ngoUser);

    // Notify Restaurant and Volunteers
    await notificationService.createNotification({
      title: 'Donation Accepted by NGO!',
      message: `${ngoName} has accepted donation "${updatedDonation.title || 'Food Donation'}". Volunteer requested!`,
      type: 'status_update'
    });

    return { pickupRequest, donation: updatedDonation };
  }

  async getNearbyDonations() {
    return await donationService.getAllDonations();
  }
}

module.exports = new NgoService();
