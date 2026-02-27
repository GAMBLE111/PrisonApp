"""
Uploads parsed records to Firebase Firestore in batches.
"""

import firebase_admin
from firebase_admin import credentials, firestore
from typing import List, Dict, Any
from datetime import datetime

# Max batch size for Firestore
BATCH_SIZE = 500


def init_firebase(service_account_path: str):
    """Initialize Firebase Admin SDK."""
    if not firebase_admin._apps:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    return firestore.client()


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
