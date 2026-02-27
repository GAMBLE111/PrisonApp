"""
Parser for ABS Recorded Crime - Offenders dataset.
"""

import openpyxl
from typing import List, Dict, Any


def parse(filepath: str) -> List[Dict[str, Any]]:
    """Parse the Offenders Excel file into a list of records."""
    records: List[Dict[str, Any]] = []
    wb = openpyxl.load_workbook(filepath, read_only=True, data_only=True)

    for sheet_name in wb.sheetnames:
        sheet = wb[sheet_name]
        rows = list(sheet.iter_rows(values_only=True))

        if len(rows) < 5:
            continue

        header_row = None
        header_idx = -1
        for i, row in enumerate(rows[:20]):
            row_str = " ".join(str(c).lower() for c in row if c)
            if "offence" in row_str or "offender" in row_str:
                header_row = row
                header_idx = i
                break

        if header_row is None:
            continue

        col_map = _map_columns(header_row)
        if not col_map:
            continue

        for row in rows[header_idx + 1:]:
            if not row or all(c is None for c in row):
                continue

            record = _parse_row(row, col_map)
            if record and record.get("count", 0) > 0:
                records.append(record)

    wb.close()
    print(f"  Parsed {len(records)} offender records")
    return records


def _map_columns(header_row) -> Dict[str, int]:
    col_map = {}
    for i, cell in enumerate(header_row):
        if cell is None:
            continue
        name = str(cell).lower().strip()

        if "state" in name or "territory" in name:
            col_map["state"] = i
        elif "year" in name:
            col_map["year"] = i
        elif "offence" in name:
            col_map["offenceCategory"] = i
        elif "sex" in name:
            col_map["sex"] = i
        elif "age" in name:
            col_map["ageGroup"] = i
        elif "indigenous" in name:
            col_map["indigenousStatus"] = i
        elif "number" in name or "count" in name or name == "no.":
            col_map["count"] = i

    return col_map


def _parse_row(row, col_map: Dict[str, int]) -> Dict[str, Any] | None:
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
        "offenceCategory": get("offenceCategory"),
        "sex": get("sex"),
        "ageGroup": get("ageGroup"),
        "indigenousStatus": get("indigenousStatus"),
        "count": count,
    }
