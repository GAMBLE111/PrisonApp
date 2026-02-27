"""
Parser for ABS Criminal Courts dataset.

The ABS Criminal Courts Excel file contains multiple sheets.
This parser reads data from relevant sheets and extracts structured records.

Note: ABS Excel file layouts change between releases. You may need to adjust
column indices and sheet names when new data is published. Always inspect the
downloaded file first to verify the structure.
"""

import openpyxl
from typing import List, Dict, Any


def parse(filepath: str) -> List[Dict[str, Any]]:
    """
    Parse the Criminal Courts Excel file into a list of records.

    Each record represents one row of data with fields:
    state, year, courtLevel, offenceCategory, sex, ageGroup, sentenceType, count
    """
    records: List[Dict[str, Any]] = []
    wb = openpyxl.load_workbook(filepath, read_only=True, data_only=True)

    # Try to find data sheets — ABS files vary in structure
    for sheet_name in wb.sheetnames:
        sheet = wb[sheet_name]
        rows = list(sheet.iter_rows(values_only=True))

        if len(rows) < 5:
            continue

        # Look for header row by scanning for common column names
        header_row = None
        header_idx = -1
        for i, row in enumerate(rows[:20]):
            row_str = " ".join(str(c).lower() for c in row if c)
            if "offence" in row_str or "sentence" in row_str:
                header_row = row
                header_idx = i
                break

        if header_row is None:
            continue

        # Map column indices
        col_map = _map_columns(header_row)
        if not col_map:
            continue

        # Parse data rows
        for row in rows[header_idx + 1:]:
            if not row or all(c is None for c in row):
                continue

            record = _parse_row(row, col_map, sheet_name)
            if record and record.get("count", 0) > 0:
                records.append(record)

    wb.close()
    print(f"  Parsed {len(records)} criminal courts records")
    return records


def _map_columns(header_row) -> Dict[str, int]:
    """Map column names to indices."""
    col_map = {}
    for i, cell in enumerate(header_row):
        if cell is None:
            continue
        name = str(cell).lower().strip()

        if "state" in name or "territory" in name:
            col_map["state"] = i
        elif "year" in name:
            col_map["year"] = i
        elif "court" in name and "level" in name:
            col_map["courtLevel"] = i
        elif "offence" in name:
            col_map["offenceCategory"] = i
        elif "sex" in name:
            col_map["sex"] = i
        elif "age" in name:
            col_map["ageGroup"] = i
        elif "sentence" in name and "type" in name:
            col_map["sentenceType"] = i
        elif "number" in name or "count" in name or name == "no.":
            col_map["count"] = i

    return col_map


def _parse_row(row, col_map: Dict[str, int], sheet_name: str) -> Dict[str, Any] | None:
    """Parse a single data row into a record dict."""

    def get(field: str, default="Unknown"):
        idx = col_map.get(field)
        if idx is None or idx >= len(row):
            return default
        val = row[idx]
        return str(val).strip() if val is not None else default

    count_val = get("count", "0")
    try:
        count = int(float(count_val))
    except (ValueError, TypeError):
        return None

    if count <= 0:
        return None

    return {
        "state": get("state"),
        "year": get("year"),
        "courtLevel": get("courtLevel"),
        "offenceCategory": get("offenceCategory"),
        "sex": get("sex"),
        "ageGroup": get("ageGroup"),
        "sentenceType": get("sentenceType"),
        "count": count,
    }
