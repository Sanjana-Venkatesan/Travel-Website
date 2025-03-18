import sys
import json
import google.generativeai as genai
import markdown2

def generate_ans(data):
    try:
        api_key = data.get("api_key")
        question = data.get("question")

        if not api_key:
            return {"status": "error", "message": "API key is required"}

        if not question:
            return {"status": "error", "message": "Question is required"}

        genai.configure(api_key=api_key)

        # Create prompt
        prompt = f"""
        You are an advanced AI-powered travel FAQ assistant. 
        Provide an informative, concise, and friendly response to: "{question}". 
        Keep it short and to the point.
        """

        # Generate response from Gemini
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        response = model.generate_content(prompt)

        # Extract response safely
        answer_text = response.text.strip() if response.text else "No response available."

        # Convert markdown to HTML
        html_content = markdown2.markdown(answer_text)

        return {
            "answer": html_content,  # Changed from "itinerary" to "answer"
            "raw_text": answer_text,
            "status": "success"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    # Read input from stdin
    input_data = json.loads(sys.stdin.read())

    # Generate response
    result = generate_ans(input_data)

    # Print JSON output
    print(json.dumps(result))
