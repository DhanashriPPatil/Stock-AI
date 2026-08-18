import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# DeepSeek API Configuration
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

# =========================
# FILE PATHS FROM .ENV
# =========================

WEEKLY_WEALTH_REPORT = os.getenv("WEEKLY_WEALTH_REPORT")
WORLD_ECONOMY_REPORT = os.getenv("WORLD_ECONOMY_REPORT")
SECTOR_UPDATE_REPORT = os.getenv("SECTOR_UPDATE_REPORT")

# =========================
# PROMPT TEMPLATE
# =========================

PROMPT = """
Read the provided stock market research report carefully and create a concise research-style summary in formal English.

The summary should sound natural and human-written, as if prepared by a student or researcher, without using phrases like:
- "our research shows"
- "we found"
- "according to our analysis"

Focus on:
1. Overall market performance and sentiment
2. Key factors affecting the market
3. Sector-wise performance
4. Technical market outlook
5. Institutional investor activity
6. Overall conclusion and future outlook

Instructions:
- Write in a professional research format
- Use clear paragraphs and simple academic language
- Keep the tone informative, analytical, and indirect
- Avoid copying exact lines from the report
- Rewrite the information in an original way
"""

# =========================
# READ REPORT FILE
# =========================

def read_report(path):
    try:
        with open(path, "r", encoding="utf-8") as file:
            return file.read()
    except Exception as e:
        return f"Error reading file: {e}"

# =========================
# ANALYZE REPORT
# =========================

def analyze_report(report_name, report_path):
    print(f"\n==============================")
    print(f"Analyzing: {report_name}")
    print(f"==============================\n")

    report_content = read_report(report_path)

    final_prompt = f"""
    {PROMPT}

    REPORT CONTENT:
    -------------------------
    {report_content}
    """

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {
                "role": "system",
                "content": "You are a professional financial research analyst."
            },
            {
                "role": "user",
                "content": final_prompt
            }
        ],
        temperature=0.5,
        max_tokens=1500
    )

    summary = response.choices[0].message.content

    print(summary)
    print("\n")


# =========================
# MAIN EXECUTION
# =========================

if __name__ == "__main__":

    reports = {
        "Weekly Wealth Report": WEEKLY_WEALTH_REPORT,
        "World Economy Report": WORLD_ECONOMY_REPORT,
        "Sector Update Report": SECTOR_UPDATE_REPORT
    }

    for report_name, report_path in reports.items():

        if report_path and os.path.exists(report_path):
            analyze_report(report_name, report_path)

        else:
            print(f"\n❌ File not found for: {report_name}")
