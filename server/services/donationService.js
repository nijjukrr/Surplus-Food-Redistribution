const { supabase, isConfigured } = require('../config/supabase');
const aiService = require('./aiService');
const notificationService = require('./notificationService');

class DonationService {
  /**
   * Create a new food donation and trigger AI analysis
   */
  async createDonation(donationData, user) {
    const payload = {
      restaurant_id: user?.id || '11111111-1111-1111-1111-111111111111',
      restaurant_name: donationData.restaurant_name || 'Royal Spice Bistro',
      title: donationData.title,
      description: donationData.description || '',
      food_category: donationData.food_category || 'cooked_meal',
      food_type: donationData.food_type || 'veg',
      quantity_kg: Number(donationData.quantity_kg),
      cooked_time: donationData.cooked_time || new Date().toISOString(),
      expiry_time: donationData.expiry_time || new Date(Date.now() + 4 * 3600000).toISOString(),
      pickup_address: donationData.pickup_address,
      latitude: donationData.latitude || 12.9716,
      longitude: donationData.longitude || 77.5946,
      image_url: donationData.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      status: 'Created',
      created_at: new Date().toISOString()
    };

    let createdDonation = payload;

    if (isConfigured()) {
      const { data, error } = await supabase
        .from('food_donations')
        .insert(payload)
        .select()
        .single();
      if (error) throw new Error(error.message);
      createdDonation = data;
    } else {
      createdDonation.id = 'don-' + Date.now();
    }

    // Trigger AI Prediction asynchronously
    const aiPrediction = await aiService.evaluateDonation(createdDonation);
    createdDonation.ai_prediction = aiPrediction;
    createdDonation.status = 'AI Analysed';

    // Send notification
    await notificationService.createNotification({
      userId: user?.id,
      title: 'New Donation Created',
      message: `Donation "${createdDonation.title}" analyzed by AI as ${aiPrediction.priority} Priority (${aiPrediction.estimatedMeals} meals).`,
      type: 'ai_match'
    });

    return createdDonation;
  }

  /**
   * Fetch all donations with predictions & filtering
   */
  async getAllDonations(filters = {}) {
    if (isConfigured()) {
      let query = supabase
        .from('food_donations')
        .select('*, ai_predictions(*)')
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.restaurant_id) {
        query = query.eq('restaurant_id', filters.restaurant_id);
      }

      const { data, error } = await query;
      if (!error && data) return data;
    }

    // Fallback Mock Data for demo mode
    return this.getMockDonations(filters);
  }

  /**
   * Get single donation details with predictions and delivery info
   */
  async getDonationById(id) {
    if (isConfigured()) {
      const { data, error } = await supabase
        .from('food_donations')
        .select('*, ai_predictions(*), pickup_requests(*), deliveries(*)')
        .eq('id', id)
        .single();
      if (!error && data) return data;
    }

    const mock = this.getMockDonations({}).find(d => d.id === id || d.id === 'don-1');
    return mock || this.getMockDonations({})[0];
  }

  /**
   * Update donation status lifecycle
   */
  async updateStatus(id, newStatus, user) {
    const validStatuses = [
      'Created',
      'AI Analysed',
      'NGO Accepted',
      'Volunteer Assigned',
      'Picked Up',
      'Delivered',
      'Completed'
    ];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status transition: ${newStatus}`);
    }

    if (isConfigured()) {
      const { data, error } = await supabase
        .from('food_donations')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);

      await notificationService.createNotification({
        title: 'Donation Status Updated',
        message: `Donation status moved to "${newStatus}".`,
        type: 'status_update'
      });

      return data;
    }

    return { id, status: newStatus, updated_at: new Date().toISOString() };
  }

  /**
   * Mock donations supplier for seamless demo fallback
   */
  getMockDonations(filters = {}) {
    const mockList = [
      {
        id: 'don-101',
        restaurant_name: 'Royal Spice Bistro',
        title: 'Surplus Biryani & Curry Feast',
        description: 'Freshly prepared hyderabadi biryani and vegetable curry from dinner event.',
        food_category: 'cooked_meal',
        food_type: 'non_veg',
        quantity_kg: 25,
        cooked_time: new Date(Date.now() - 2 * 3600000).toISOString(),
        expiry_time: new Date(Date.now() + 3 * 3600000).toISOString(),
        pickup_address: '108 Grand Avenue, Downtown',
        latitude: 12.9716,
        longitude: 77.5946,
        image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        status: 'AI Analysed',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        ai_predictions: [
          {
            priority: 'High',
            urgency_score: 92,
            estimated_meals: 75,
            recommended_ngo_name: 'Care & Share Foundation',
            reason: 'High urgency: Food expires in 3 hours. Provides ~75 nutritious meals.'
          }
        ]
      },
      {
        id: 'don-102',
        restaurant_name: 'Artisan Bakery Hub',
        title: 'Assorted Bread & Pastries Box',
        description: 'Surplus whole wheat loaves, croissants, and fruit muffins.',
        food_category: 'bakery',
        food_type: 'veg',
        quantity_kg: 15,
        cooked_time: new Date(Date.now() - 5 * 3600000).toISOString(),
        expiry_time: new Date(Date.now() + 18 * 3600000).toISOString(),
        pickup_address: '45 Baker Street, West End',
        latitude: 12.9650,
        longitude: 77.5850,
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        status: 'Created',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        ai_predictions: [
          {
            priority: 'Medium',
            urgency_score: 55,
            estimated_meals: 45,
            recommended_ngo_name: 'Hope Food Bank',
            reason: 'Baked items with extended shelf life (18 hrs remaining).'
          }
        ]
      },
      {
        id: 'don-103',
        restaurant_name: 'Green Harvest Supermarket',
        title: 'Fresh Organic Produce & Fruits',
        description: 'Apples, oranges, carrots, and leafy greens suitable for soup kitchens.',
        food_category: 'raw_produce',
        food_type: 'vegan',
        quantity_kg: 40,
        cooked_time: new Date(Date.now() - 10 * 3600000).toISOString(),
        expiry_time: new Date(Date.now() + 36 * 3600000).toISOString(),
        pickup_address: '88 Market Road, North Sector',
        latitude: 12.9800,
        longitude: 77.6100,
        image_url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
        status: 'NGO Accepted',
        created_at: new Date(Date.now() - 14400000).toISOString(),
        ai_predictions: [
          {
            priority: 'Medium',
            urgency_score: 48,
            estimated_meals: 120,
            recommended_ngo_name: 'Care & Share Foundation',
            reason: 'High volume produce (40kg). Excellent for batch meal preparation.'
          }
        ]
      }
    ];

    if (filters.status) {
      return mockList.filter(d => d.status === filters.status);
    }
    return mockList;
  }
}

module.exports = new DonationService();
