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
ABS_URLS = {
    "criminal_courts": {
        "url": "https://www.abs.gov.au/statistics/people/crime-and-justice/criminal-courts-australia/latest-release/Table1.xlsx",
        "filename": "criminal_courts.xlsx",
        "description": "Criminal Courts, Australia",
    },
    "offenders": {
        "url": "https://www.abs.gov.au/statistics/people/crime-and-justice/recorded-crime-offenders/latest-release/Table1.xlsx",
        "filename": "offenders.xlsx",
        "description": "Recorded Crime - Offenders, Australia",
    },
    "prisoners": {
        "url": "https://www.abs.gov.au/statistics/people/crime-and-justice/prisoners-australia/latest-release/Table1.xlsx",
        "filename": "prisoners.xlsx",
        "description": "Prisoners in Australia",
    },
    "corrective_services": {
        "url": "https://www.abs.gov.au/statistics/people/crime-and-justice/corrective-services-australia/latest-release/Table1.xlsx",
        "filename": "corrective_services.xlsx",
        "description": "Corrective Services, Australia",
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
