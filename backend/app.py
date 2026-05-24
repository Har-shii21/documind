from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os
from dotenv import load_dotenv

# Load env
load_dotenv()

# Flask
app = Flask(__name__)
CORS(app)

# Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.route("/")
def home():
    return "DocuMind Backend Running!"

@app.route("/generate-docs", methods=["POST"])
def generate_docs():
    try:
        data = request.get_json()

        code = data.get("code")

        prompt = f"""
        Analyze this code and generate:

        1. README
        2. Setup Instructions
        3. Function Explanations
        4. API Documentation

        Code:
        {code}
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        return jsonify({
            "documentation": response.text
        })

    except Exception as e:
        print("ERROR:", str(e))

        return jsonify({
            "documentation": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)