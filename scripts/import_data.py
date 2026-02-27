#!/usr/bin/env python3
"""
Main entry point for importing ABS data into Firestore.

Usage:
    python import_data.py                  # Import all datasets
    python import_data.py criminal_courts  # Import a single dataset
    python import_data.py --download-only  # Only download Excel files
    python import_data.py --skip-download  # Parse & upload without downloading
"""

import sys
import os

# Add scripts dir to path for imports
sys.path.insert(0, os.path.dirname(__file__))

from config import ABS_URLS, DOWNLOAD_DIR, SERVICE_ACCOUNT_KEY
from downloaders.abs_downloader import download_all, download_single
from uploaders.firestore_uploader import init_firebase, upload_records, update_metadata
from parsers import criminal_courts, offenders, prisoners, corrective_services

PARSERS = {
    "criminal_courts": criminal_courts.parse,
    "offenders": offenders.parse,
    "prisoners": prisoners.parse,
    "corrective_services": corrective_services.parse,
}


def import_dataset(db, dataset_name: str, skip_download: bool = False):
    """Import a single dataset: download, parse, upload."""
    print(f"\n{'='*50}")
    print(f"Importing: {dataset_name}")
    print(f"{'='*50}")

    info = ABS_URLS[dataset_name]
    filepath = os.path.join(DOWNLOAD_DIR, info["filename"])

    # Download
    if not skip_download:
        download_single(dataset_name)

    # Check file exists
    if not os.path.exists(filepath):
        print(f"  [error] File not found: {filepath}")
        print(f"  Download manually from: {info['url']}")
        return

    # Parse
    parser = PARSERS.get(dataset_name)
    if not parser:
        print(f"  [error] No parser for {dataset_name}")
        return

    records = parser(filepath)
    if not records:
        print(f"  [warn] No records parsed from {dataset_name}")
        return

    # Upload
    count = upload_records(db, dataset_name, records)
    update_metadata(db, dataset_name, count, info["url"])


def main():
    args = sys.argv[1:]

    download_only = "--download-only" in args
    skip_download = "--skip-download" in args
    args = [a for a in args if not a.startswith("--")]

    # Download only mode
    if download_only:
        print("Downloading ABS Excel files...")
        download_all()
        return

    # Check for service account key
    if not os.path.exists(SERVICE_ACCOUNT_KEY):
        print(f"[error] Firebase service account key not found: {SERVICE_ACCOUNT_KEY}")
        print("Download it from Firebase Console > Project Settings > Service Accounts")
        print(f"Save it as: {SERVICE_ACCOUNT_KEY}")
        sys.exit(1)

    # Init Firebase
    print("Initializing Firebase...")
    db = init_firebase(SERVICE_ACCOUNT_KEY)

    # Determine which datasets to import
    if args:
        datasets = [d for d in args if d in PARSERS]
        if not datasets:
            print(f"[error] Unknown dataset(s): {args}")
            print(f"Available: {list(PARSERS.keys())}")
            sys.exit(1)
    else:
        datasets = list(PARSERS.keys())

    # Import each dataset
    for ds in datasets:
        import_dataset(db, ds, skip_download=skip_download)

    print(f"\n{'='*50}")
    print("Import complete!")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
