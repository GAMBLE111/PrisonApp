"""
ABS Data Source URLs and configuration.

The ABS publishes Excel (.xlsx) files for each dataset.
These URLs point to the latest available data.
Update URLs when new data is published.
"""

import os

# Firebase service account key path
SERVICE_ACCOUNT_KEY = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")

# Download directory for Excel files
DOWNLOAD_DIR = os.path.join(os.path.dirname(__file__), "data")

# ABS Dataset URLs (update these when new data is published)
# Note: ABS uses descriptive filenames that change each release.
# Check the release page for current file names.
ABS_URLS = {
    "criminal_courts": {
        "url": "https://www.abs.gov.au/statistics/people/crime-and-justice/criminal-courts-australia/2023-24/1.%20Defendants%20finalised%2C%20Australia%20%28Tables%201%20to%206%29.xlsx",
        "filename": "criminal_courts.xlsx",
        "description": "Criminal Courts, Australia (2023-24)",
    },
    "offenders": {
        "url": "https://www.abs.gov.au/statistics/people/crime-and-justice/recorded-crime-offenders/2023-24/1.%20Offenders%2C%20Australia.xlsx",
        "filename": "offenders.xlsx",
        "description": "Recorded Crime - Offenders, Australia (2023-24)",
    },
    "prisoners": {
        "url": "https://www.abs.gov.au/statistics/people/crime-and-justice/prisoners-australia/2025/1.%20Prisoner%20characteristics%2C%20Australia%20%28Tables%201%E2%80%9314%29.xlsx",
        "filename": "prisoners.xlsx",
        "description": "Prisoners in Australia (2025)",
    },
    "corrective_services": {
        "url": "https://www.abs.gov.au/statistics/people/crime-and-justice/corrective-services-australia/sep-quarter-2025/1.%20Corrective%20Services%2C%20Australia%20-%20September%20quarter%202025%20%28Tables%201%20to%2017%29.xlsx",
        "filename": "corrective_services.xlsx",
        "description": "Corrective Services, Australia (Sep Qtr 2025)",
    },
}

# Firestore collection names
COLLECTIONS = {
    "criminal_courts": "criminal_courts",
    "offenders": "offenders",
    "prisoners": "prisoners",
    "corrective_services": "corrective_services",
    "metadata": "metadata",
}
