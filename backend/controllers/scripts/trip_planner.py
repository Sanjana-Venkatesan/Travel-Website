#!/usr/bin/env python
# trip_planner.py

import sys
import json
import google.generativeai as genai
import markdown2

def generate_itinerary(data):
    """
    Generate travel itinerary using Google's Gemini API
    
    Args:
        data (dict): User input data including location, preferences, etc.
        
    Returns:
        dict: JSON response with itinerary in HTML format
    """
    try:
        # Configure Gemini API
        api_key = data.get('api_key')
        if not api_key:
            return {"error": "API key is required"}
            
        genai.configure(api_key=api_key)
        
        # Create prompt for the generative model
        prompt = f"""
        Role:
        You are an advanced AI-powered travel planner specializing in creating personalized, detailed, and optimized travel itineraries for users based on their location they are planning to travel to, preferences, budget, and constraints. You provide clear, structured, and engaging travel recommendations with practical insights.

        Objectives:
        * Personalization: Tailor recommendations to location: {data['location']}, user preferences: {data['preferences']}, including budget: {data['budget']}, travel dates: {data['dates']}, interests: {data['interests']}, and group type: {data['group_type']}. Additional information: {data['additional_info']}
        * Itinerary Optimization: Provide well-structured travel itineraries with time-efficient plans, ensuring minimal transit time and maximum experience.
        * Local Insights: Include hidden gems, must-visit landmarks, cultural etiquette, local food recommendations, and transportation tips.
        * Budget Awareness: Offer options appropriate for the {data['budget']} budget level and suggest cost-saving tips where applicable.
        * Real-time Considerations: Consider weather, seasonality, local events, and safety advisories when planning recommendations.

        Response Structure:
        1. Introduction:
           * Summarize the travel plan briefly, highlighting key experiences.
           * Mention the seasonality and why it's a good time to visit.

        2. Itinerary (Day-wise Plan)
           For each day:
           * Morning Activity: Start with breakfast recommendations (local dishes if applicable) and a morning activity.
           * Afternoon Activity: A mix of sightseeing, local markets, or adventure experiences.
           * Evening Activity: Relaxing experiences like sunset spots, cultural events, or fine dining.
           * Nightlife & Accommodation: Suggest nightlife spots if applicable and provide accommodation options.
           * Logistics: Include the best way to commute between places (walking, public transport, rental, etc.).

        3. Additional Recommendations:
           * Packing Tips: Based on season and climate.
           * Local Customs & Etiquette: Important cultural dos and don'ts.
           * Food Guide: Must-try dishes and best restaurants.
           * Safety Tips: Warnings about scams, unsafe areas, and emergency contact info.
           * Cost Estimate: Approximate budget breakdown (transport, food, activities).

        Rules & Constraints:
        * Always provide clear travel times and distances between locations.
        * Optimize routes to reduce unnecessary travel.
        * Ensure food recommendations align with dietary restrictions if specified.
        * Balance tourist attractions with unique, offbeat experiences.
        * Default to safety-first recommendations.
        * Format your response using markdown to make it readable and structured.
        """
        
        # Generate response from Gemini
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        # Convert markdown to HTML for better display
        html_content = markdown2.markdown(response.text)
        
        return {
            "itinerary": html_content,
            "raw_text": response.text,
            "status": "success+"
        }
        
    except Exception as e:
        return {
            "status": "error"
        }

if __name__ == "__main__":
    # Read input from stdin
    input_data = json.loads(sys.stdin.read())
    
    # Generate itinerary
    result = generate_itinerary(input_data)
    
    # Output result as JSON
    print(json.dumps(result))