const { ai, isGeminiConfigured } = require('../config/gemini');
const { supabase, isConfigured } = require('../config/supabase');

/**
 * AI Service for Food Priority Prediction & Recommendation
 */
class AIService {
  /**
   * Evaluates a food donation and returns structured AI predictions
   */
  async evaluateDonation(donation, ngosList = []) {
    const hoursToExpiry = Math.max(
      0.5,
      (new Date(donation.expiry_time) - new Date()) / (1000 * 60 * 60)
    );

    let predictionResult = null;

    if (isGeminiConfigured()) {
      try {
        const ngoNames = ngosList.map((n) => n.organization_name).join(', ') || 'Care & Share Foundation, Hope Food Bank, Community Feast';
        
        const prompt = `
You are an expert AI Food Redistribution Logistics System.
Analyze the following surplus food donation and output a strict JSON object evaluating urgency, priority, impact, and NGO matching.

DONATION DETAILS:
- Title: ${donation.title}
- Description: ${donation.description || 'N/A'}
- Category: ${donation.food_category}
- Food Type: ${donation.food_type}
- Quantity (kg): ${donation.quantity_kg}
- Hours until expiry: ${hoursToExpiry.toFixed(1)} hours
- Pickup Address: ${donation.pickup_address}
- Available Nearby NGOs: ${ngoNames}

STRICT JSON OUTPUT REQUIRED:
{
  "priority": "High" | "Medium" | "Low",
  "urgencyScore": number (1 to 100),
  "estimatedMeals": number,
  "recommendedNGO": string,
  "reason": string
}

EVALUATION RULES:
1. If hours until expiry < 4 or food is hot cooked meal > 20kg: Priority MUST be "High", UrgencyScore > 80.
2. Estimated meals = quantity_kg * 3 (approx 300g per meal).
3. Recommended NGO should match available NGOs or pick the best fit.
4. Reason must be concise (1-2 sentences) explaining urgency and impact.

Return ONLY raw JSON, no markdown formatting or extra text.
`;

        const model = ai.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' }
        });

        const response = await model.generateContent(prompt);
        const rawText = response.response.text() || '';
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        predictionResult = JSON.parse(cleanedText);
      } catch (err) {
        console.warn('[AI Service Warning]: Gemini API call failed, switching to local heuristic model:', err.message);
      }
    }

    // Fallback Heuristic Rule Engine if Gemini is not configured or failed
    if (!predictionResult) {
      predictionResult = this.heuristicEvaluation(donation, hoursToExpiry, ngosList);
    }

    // Persist AI Prediction to Supabase Database
    if (isConfigured() && donation.id) {
      try {
        await supabase.from('ai_predictions').insert({
          donation_id: donation.id,
          priority: predictionResult.priority,
          urgency_score: predictionResult.urgencyScore,
          estimated_meals: predictionResult.estimatedMeals,
          recommended_ngo_name: predictionResult.recommendedNGO,
          reason: predictionResult.reason
        });

        // Update status of donation to 'AI Analysed'
        await supabase
          .from('food_donations')
          .update({ status: 'AI Analysed' })
          .eq('id', donation.id);
      } catch (dbErr) {
        console.error('[AI Service DB Error]: Failed to persist prediction:', dbErr.message);
      }
    }

    return predictionResult;
  }

  /**
   * Deterministic Heuristic Model for AI evaluation fallback
   */
  heuristicEvaluation(donation, hoursToExpiry, ngosList) {
    const quantity = Number(donation.quantity_kg) || 10;
    const estimatedMeals = Math.round(quantity * 3);
    
    let priority = 'Medium';
    let urgencyScore = 50;

    if (hoursToExpiry <= 4 || quantity >= 25) {
      priority = 'High';
      urgencyScore = Math.min(98, Math.round(85 + (25 / Math.max(1, hoursToExpiry))));
    } else if (hoursToExpiry > 12 && quantity < 10) {
      priority = 'Low';
      urgencyScore = Math.round(20 + hoursToExpiry);
    } else {
      priority = 'Medium';
      urgencyScore = 60;
    }

    const recommendedNGO = ngosList.length > 0 
      ? ngosList[0].organization_name 
      : 'Care & Share Foundation';

    const reason = priority === 'High'
      ? `Urgent: Food expires in ${hoursToExpiry.toFixed(1)} hrs. ${estimatedMeals} meals ready for immediate pickup.`
      : `Stable condition: Rescues ${quantity}kg (${estimatedMeals} meals) with sufficient buffer before expiry.`;

    return {
      priority,
      urgencyScore,
      estimatedMeals,
      recommendedNGO,
      reason
    };
  }
}

module.exports = new AIService();
