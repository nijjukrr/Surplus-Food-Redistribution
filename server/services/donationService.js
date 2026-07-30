const { supabase, isConfigured } = require('../config/supabase');
const aiService = require('./aiService');
const notificationService = require('./notificationService');

class DonationService {
  /**
   * Create a new food donation and trigger AI analysis
   */
  async createDonation(donationData, user) {
    const title = donationData.title || donationData.food_name || 'Surplus Food';
    const qty = Number(donationData.quantity_kg || donationData.quantity || 10);
    const cookedAt = donationData.cooked_time || donationData.cooked_at || new Date().toISOString();
    const expiryAt = donationData.expiry_time || donationData.expiry_at || new Date(Date.now() + 4 * 3600000).toISOString();

    const categoryImages = {
      cooked_meal: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      raw_produce: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
      packaged_food: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    };

    const category = donationData.food_category || 'cooked_meal';
    const defaultImage = categoryImages[category] || categoryImages.cooked_meal;
    const finalImage = (donationData.image_url && donationData.image_url !== 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80')
      ? donationData.image_url 
      : defaultImage;

    // Flexible payload matching both custom Supabase schema columns & standard schema columns
    const dbPayload = {
      restaurant_id: user?.id || '11111111-1111-1111-1111-111111111111',
      food_name: title,
      quantity: qty,
      unit: 'kg',
      food_category: category,
      cooked_at: cookedAt,
      expiry_at: expiryAt,
      pickup_address: donationData.pickup_address || 'Default Address',
      image_url: finalImage,
      status: 'Created',
      created_at: new Date().toISOString()
    };

    let createdDonation = {
      ...dbPayload,
      title,
      quantity_kg: qty,
      cooked_time: cookedAt,
      expiry_time: expiryAt,
      restaurant_name: donationData.restaurant_name || 'Royal Spice Bistro',
      food_type: donationData.food_type || 'veg',
      image_url: finalImage
    };

    if (isConfigured()) {
      try {
        const { data, error } = await supabase
          .from('food_donations')
          .insert(dbPayload)
          .select()
          .single();

        if (!error && data) {
          createdDonation = {
            ...createdDonation,
            ...data,
            title: data.food_name || title,
            quantity_kg: data.quantity || qty,
            cooked_time: data.cooked_at || cookedAt,
            expiry_time: data.expiry_at || expiryAt,
            image_url: data.image_url || finalImage
          };
        } else if (error) {
          console.warn('[Supabase Insert Warning]: Falling back to full schema payload:', error.message);
          // Fallback payload if schema differs
          const { data: fbData, error: fbErr } = await supabase
            .from('food_donations')
            .insert({
              restaurant_id: dbPayload.restaurant_id,
              restaurant_name: 'Royal Spice Bistro',
              title,
              food_category: dbPayload.food_category,
              quantity_kg: qty,
              pickup_address: dbPayload.pickup_address,
              image_url: finalImage,
              status: 'Created'
            })
            .select()
            .single();

          if (!fbErr && fbData) {
            createdDonation = { ...createdDonation, ...fbData };
          }
        }
      } catch (err) {
        console.error('[Donation Insert Exception]:', err.message);
      }
    } else {
      createdDonation.id = 'don-' + Date.now();
    }

    // Trigger AI Prediction asynchronously
    const aiPrediction = await aiService.evaluateDonation(createdDonation);
    createdDonation.ai_prediction = aiPrediction;
    createdDonation.ai_predictions = [aiPrediction];

    // Check if restaurant is verified (default verified for demo restaurant)
    const isRestaurantVerified = user?.is_verified ?? true;
    const isHighConfidence = (aiPrediction.confidenceScore || 90) >= 80;

    // Smart AI Approval Routing Logic
    let initialStatus = 'Pending Admin Review';
    if (isRestaurantVerified && isHighConfidence) {
      initialStatus = 'Approved';
    }

    createdDonation.status = initialStatus;

    if (isConfigured() && createdDonation.id) {
      try {
        await supabase
          .from('food_donations')
          .update({ status: initialStatus })
          .eq('id', createdDonation.id);
      } catch (err) {
        console.warn('[Donation Status Update Warning]:', err.message);
      }
    }

    // Send notification
    await notificationService.createNotification({
      userId: user?.id,
      title: initialStatus === 'Approved' ? 'Donation Auto-Approved by AI' : 'Donation Under Admin Review',
      message: initialStatus === 'Approved'
        ? `Donation "${title}" verified by AI (${aiPrediction.confidenceScore || 95}% confidence) & forwarded directly to NGOs!`
        : `Donation "${title}" placed in Admin Review queue for safety verification.`,
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

      const categoryImages = {
        cooked_meal: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        raw_produce: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
        packaged_food: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
      };
      const genericOld = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Map table column names to unified client format
        return data.map(d => {
          const cat = d.food_category || 'cooked_meal';
          const resolvedImg = (!d.image_url || d.image_url === genericOld)
            ? (categoryImages[cat] || categoryImages.cooked_meal)
            : d.image_url;

          return {
            ...d,
            title: d.title || d.food_name || 'Surplus Food',
            quantity_kg: d.quantity_kg || d.quantity || 10,
            cooked_time: d.cooked_time || d.cooked_at || d.created_at,
            expiry_time: d.expiry_time || d.expiry_at || new Date(Date.now() + 4 * 3600000).toISOString(),
            restaurant_name: d.restaurant_name || 'Royal Spice Bistro',
            image_url: resolvedImg
          };
        });
      }
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
      if (!error && data) {
        const categoryImages = {
          cooked_meal: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
          bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
          raw_produce: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
          packaged_food: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
        };
        const genericOld = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
        const cat = data.food_category || 'cooked_meal';
        const resolvedImg = (!data.image_url || data.image_url === genericOld)
          ? (categoryImages[cat] || categoryImages.cooked_meal)
          : data.image_url;

        return {
          ...data,
          title: data.title || data.food_name || 'Surplus Food',
          quantity_kg: data.quantity_kg || data.quantity || 10,
          cooked_time: data.cooked_time || data.cooked_at || data.created_at,
          expiry_time: data.expiry_time || data.expiry_at || new Date(Date.now() + 4 * 3600000).toISOString(),
          image_url: resolvedImg
        };
      }
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
      try {
        const { data, error } = await supabase
          .from('food_donations')
          .update({ status: newStatus })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          await notificationService.createNotification({
            title: 'Donation Status Updated',
            message: `Donation status moved to "${newStatus}".`,
            type: 'status_update'
          });
          return data;
        }
      } catch (err) {
        console.warn('[Update Status Exception]:', err.message);
      }
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
        food_name: 'Surplus Biryani & Curry Feast',
        description: 'Freshly prepared hyderabadi biryani and vegetable curry from dinner event.',
        food_category: 'cooked_meal',
        food_type: 'non_veg',
        quantity_kg: 25,
        quantity: 25,
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
        food_name: 'Assorted Bread & Pastries Box',
        description: 'Surplus whole wheat loaves, croissants, and fruit muffins.',
        food_category: 'bakery',
        food_type: 'veg',
        quantity_kg: 15,
        quantity: 15,
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
        food_name: 'Fresh Organic Produce & Fruits',
        description: 'Apples, oranges, carrots, and leafy greens suitable for soup kitchens.',
        food_category: 'raw_produce',
        food_type: 'vegan',
        quantity_kg: 40,
        quantity: 40,
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
