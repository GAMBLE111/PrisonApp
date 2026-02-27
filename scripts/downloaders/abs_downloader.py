"""
Downloads Excel files from ABS website.
"""

import os
import requests
from config import ABS_URLS, DOWNLOAD_DIR


def download_all():
    """Download all ABS Excel files."""
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)

    for dataset_name, info in ABS_URLS.items():
        filepath = os.path.join(DOWNLOAD_DIR, info["filename"])

        if os.path.exists(filepath):
            print(f"  [skip] {info['filename']} already exists")
            continue

        print(f"  Downloading {info['description']}...")
        try:
            response = requests.get(info["url"], timeout=60, allow_redirects=True)
            response.raise_for_status()

            with open(filepath, "wb") as f:
                f.write(response.content)

            size_kb = len(response.content) / 1024
            print(f"  [done] {info['filename']} ({size_kb:.0f} KB)")

        except requests.RequestException as e:
            print(f"  [error] Failed to download {dataset_name}: {e}")
            print(f"  You can manually download from: {info['url']}")
            print(f"  Save as: {filepath}")


def download_single(dataset_name: str):
    """Download a single dataset's Excel file."""
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)

    if dataset_name not in ABS_URLS:
        print(f"  [error] Unknown dataset: {dataset_name}")
        return None

    info = ABS_URLS[dataset_name]
    filepath = os.path.join(DOWNLOAD_DIR, info["filename"])

    print(f"  Downloading {info['description']}...")
    try:
        response = requests.get(info["url"], timeout=60, allow_redirects=True)
        response.raise_for_status()

        with open(filepath, "wb") as f:
            f.write(response.content)

        print(f"  [done] {info['filename']}")
        return filepath

    except requests.RequestException as e:
        print(f"  [error] Failed to download {dataset_name}: {e}")
        return None


if __name__ == "__main__":
    download_all()
