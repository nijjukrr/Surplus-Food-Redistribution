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
      try {
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
      } catch (err) {
        console.warn('[NGO Accept DB Warning]:', err.message);
      }
    }

    // Update donation status
    const updatedDonation = await donationService.updateStatus(donationId, 'NGO Accepted', ngoUser);

    // Notify Restaurant and Volunteers
    await notificationService.createNotification({
      title: 'Donation Accepted by NGO!',
      message: `${ngoName} has accepted donation "${updatedDonation.title || 'Food Donation'}". Scheduled pickup requested!`,
      type: 'status_update'
    });

    return { pickupRequest, donation: updatedDonation };
  }

  /**
   * NGO Denies/Declines a donation
   */
  async denyDonation(donationId, ngoUser) {
    const ngoName = ngoUser?.profile?.organization_name || ngoUser?.organization_name || 'Care & Share Foundation';
    const updatedDonation = await donationService.updateStatus(donationId, 'NGO Declined', ngoUser);

    await notificationService.createNotification({
      title: 'Donation Declined by NGO',
      message: `${ngoName} declined donation "${updatedDonation.title || 'Food Donation'}". Available for other NGOs.`,
      type: 'status_update'
    });

    return updatedDonation;
  }

  async getNearbyDonations() {
    const all = await donationService.getAllDonations();
    // Exclude Pending Admin Review and Rejected items from general NGO feed
    return all.filter(d => d.status !== 'Pending Admin Review' && d.status !== 'Rejected' && d.status !== 'NGO Declined');
  }
}

module.exports = new NgoService();
