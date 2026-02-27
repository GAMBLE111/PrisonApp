from __future__ import annotations

"""
Uploads parsed records to Firebase Firestore in batches.

Supports two auth modes:
  1. Service account key file (production)
  2. Firebase CLI access token (local development)
"""

import firebase_admin
from firebase_admin import credentials, firestore
from typing import List, Dict, Any
from datetime import datetime
import json
import subprocess

# Max batch size for Firestore
BATCH_SIZE = 500


def init_firebase(service_account_path: str = None, project_id: str = None):
    """Initialize Firebase Admin SDK.

    Tries service account key first, falls back to Firebase CLI token.
    """
    if firebase_admin._apps:
        return firestore.client()

    # Option 1: Service account key file
    if service_account_path:
        import os
        if os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            return firestore.client()

    # Option 2: Use Firebase CLI access token
    print("  No service account key found, using Firebase CLI credentials...")
    token = _get_firebase_cli_token()
    if token and project_id:
        from google.oauth2.credentials import Credentials as OAuth2Credentials
        from google.cloud.firestore import Client

        oauth_creds = OAuth2Credentials(token=token)
        return Client(project=project_id, credentials=oauth_creds)

    raise RuntimeError(
        "Could not authenticate. Provide a service account key or run 'firebase login'."
    )


def _get_firebase_cli_token() -> str | None:
    """Extract an access token from the Firebase CLI."""
    try:
        # firebase cli can print a fresh access token
        result = subprocess.run(
            ["firebase", "login:ci", "--no-localhost"],
            capture_output=True, text=True, timeout=5,
        )
    except Exception:
        pass

    # Fallback: read the stored token from Firebase CLI config
    import os, json
    config_path = os.path.expanduser("~/.config/configstore/firebase-tools.json")
    if os.path.exists(config_path):
        with open(config_path) as f:
            config = json.load(f)
        tokens = config.get("tokens", {})
        access_token = tokens.get("access_token")
        if access_token:
            return access_token
        # Try refresh token approach
        refresh_token = tokens.get("refresh_token")
        if refresh_token:
            return _refresh_access_token(refresh_token)

    return None


def _refresh_access_token(refresh_token: str) -> str | None:
    """Use a refresh token to get a fresh access token."""
    import requests
    try:
        resp = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "client_id": "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
                "client_secret": "j9iVZfS8kkCEFUPaAeJV0sAi",
            },
            timeout=10,
        )
        if resp.status_code == 200:
            return resp.json().get("access_token")
    except Exception as e:
        print(f"  [warn] Token refresh failed: {e}")
    return None


def upload_records(
    db,
    collection_name: str,
    records: List[Dict[str, Any]],
    clear_existing: bool = True,
):
    """
    Upload records to a Firestore collection in batches.

    Args:
        db: Firestore client
        collection_name: Target collection name
        records: List of record dicts to upload
        clear_existing: If True, delete existing documents first
    """
    col_ref = db.collection(collection_name)

    # Clear existing documents
    if clear_existing:
        print(f"  Clearing existing {collection_name} documents...")
        _delete_collection(db, col_ref)

    # Upload in batches
    now = datetime.utcnow()
    total = len(records)
    uploaded = 0

    for i in range(0, total, BATCH_SIZE):
        batch = db.batch()
        chunk = records[i : i + BATCH_SIZE]

        for record in chunk:
            doc_ref = col_ref.document()
            record["updatedAt"] = now
            batch.set(doc_ref, record)

        batch.commit()
        uploaded += len(chunk)
        print(f"  Uploaded {uploaded}/{total} to {collection_name}")

    print(f"  [done] {total} records uploaded to {collection_name}")
    return total


def update_metadata(db, dataset_name: str, record_count: int, source: str):
    """Update the metadata collection with import info."""
    meta_ref = db.collection("metadata").document(dataset_name)
    meta_ref.set(
        {
            "dataset": dataset_name,
            "lastImport": datetime.utcnow(),
            "recordCount": record_count,
            "source": source,
        }
    )
    print(f"  Updated metadata for {dataset_name}")


def _delete_collection(db, col_ref, batch_size: int = 500):
    """Delete all documents in a collection."""
    docs = col_ref.limit(batch_size).stream()
    deleted = 0

    while True:
        batch = db.batch()
        doc_list = list(docs)

        if not doc_list:
            break

        for doc in doc_list:
            batch.delete(doc.reference)
            deleted += 1

        batch.commit()
        docs = col_ref.limit(batch_size).stream()

    if deleted > 0:
        print(f"  Deleted {deleted} existing documents")
