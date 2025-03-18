#!/usr/bin/env python
# trip_planner.py

import sys
import json
import google.generativeai as genai
import markdown2

def generate_recommendations(data):

    try:
        # Extract input data safely
        api_key = data.get("api_key")
        location = data.get("location", "").strip()  
        user_text = data.get("text", "").strip()

        if not api_key:
            return {"status": "error", "message": "API key is required"}
        
        if not location:
            return {"status": "error", "message": "Location is required"}

        if not user_text:
            return {"status": "error", "message": "User input text is required"}

        # Configure Gemini API
        genai.configure(api_key=api_key)

        # Enhanced Prompt for AI
        prompt = f"""
        You are an AI-powered travel assistant, specializing in **personalized travel recommendations** based on the user's **mood and tone**.

        **User's Location:** {location}  
        **User's Input:** "{user_text}"  

        ### Task:  
        - **Analyze the user's text to determine their mood** (e.g., adventurous, relaxed, curious, stressed, romantic).  
        - **Suggest at least 3 places in {location} that match their mood.**  
        - Provide recommendations across different categories:  
          - 🌿 **Nature & Relaxation** (e.g., parks, beaches, scenic spots)  
          - 🎢 **Adventure & Activities** (e.g., hiking, sports, unique experiences)  
          - 🎭 **Culture & History** (e.g., museums, historic sites)  
          - 🍽️ **Food & Dining** (if the mood suggests interest in food).  
        - Each place should have a **brief description** explaining why it's suitable for their mood.  

        ### Response Format:
        Return a **comma-separated list** of locations, each followed by a short reason. Example:  
        **"Elliot's Beach - Perfect for relaxation and sunset views, Guindy National Park - Great for nature walks, Dakshin Chitra - A cultural experience for history lovers."**  
        """

        # Generate AI response
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        response = model.generate_content(prompt)

        # Extract response safely
        if not response.text:
            return {"status": "error", "message": "No response from AI"}

        answer_text = response.text.strip()
        html_content = markdown2.markdown(answer_text)

        return {
            "status": "success",
            "message": html_content,
            "raw_text": answer_text
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    # Read input from stdin
    input_data = json.loads(sys.stdin.read())

    result = generate_recommendations(input_data)

    # Output result as JSON
    print(json.dumps(result))
