from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

# Home route
@app.route("/")
def home():
    return "DocuMind Backend Running!"

# Generate documentation route
@app.route("/generate-docs", methods=["POST"])
def generate_docs():

    data = request.json

    code = data.get("code", "")

    prompt = f"""
    Analyze this code and generate:

    1. Project README
    2. Setup Instructions
    3. Function Explanations
    4. API Documentation if present

    Code:
    {code}
    """

    response = model.generate_content(prompt)

    return jsonify({
        "documentation": response.text
    })

# Run server
if __name__ == "__main__":
    app.run(debug=True)