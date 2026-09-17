"""
CareNest Platform - 24-Hour Scheduled Scraper with Modal
======================================================
This script runs automatically every 24 hours on Modal serverless cloud.

Usage:
1. Authenticate:
   modal setup
   (or enter token: modal token set --token-id <ID> --token-secret <SECRET>)

2. Test run once:
   modal run scraper_modal.py

3. Deploy for 24-hour recurring schedule:
   modal deploy scraper_modal.py
"""

import modal
from datetime import datetime

# Define Modal App
app = modal.App("carenest-scraper")

# Define container image with scraping dependencies
scraper_image = modal.Image.debian_slim(python_version="3.11").pip_install(
    "requests",
    "beautifulsoup4",
    "playwright",
    "pydantic"
)

@app.function(
    image=scraper_image,
    # Schedule to run automatically every 24 hours (Daily at midnight UTC)
    schedule=modal.Cron("0 0 * * *"),
    timeout=600  # 10 minutes timeout per execution
)
def run_daily_scraper():
    """Main scraper task triggered automatically every 24 hours."""
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"🚀 [CareNest Scraper] Starting 24-Hour scheduled scraper run at: {now}")

    # ==========================================
    # ใส่ logic การ Scrape หรือดึงข้อมูลที่ต้องการที่นี่
    # ==========================================
    results = {
        "status": "success",
        "timestamp": now,
        "message": "24-hour recurring scraper executed successfully on Modal."
    }

    print(f"✅ [CareNest Scraper] Job completed successfully: {results}")
    return results


@app.local_entrypoint()
def main():
    """Local test entrypoint triggered when running `modal run scraper_modal.py`"""
    print("Testing scraper on Modal cloud...")
    result = run_daily_scraper.remote()
    print("Execution result from Modal:", result)
