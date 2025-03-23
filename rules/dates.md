# Date Display Rules

## Date Specification Types
- Single dates (e.g., 251)
- Approximate dates (e.g., "ca. 362")
- Date ranges (e.g., "193-200")
- Approximate date ranges (e.g., "ca. 260-264")
- Birth dates only
- Death dates only

## Pin Positioning Rules
1. For a single approximate date:
   - Position pin at altitude corresponding to the specified date
   - Label format: "ca. 362"

2. For an approximate date range:
   - Position pin at altitude corresponding to the midpoint of the range
   - Example: for "ca. 260-264", position at year 262
   - Label format: "ca. 260-264"

3. For death date only:
   - Position pin at altitude corresponding to the death date
   - Label format: "d. 251"

4. For birth date only:
   - Position pin at altitude corresponding to the birth date
   - Label format: "b. 330"

5. For birth/death date ranges:
   - Position pin at altitude corresponding to the midpoint of the range
   - Label formats:
     - Birth range: "b. 193-200"
     - Death range: "d. 260-264"

## Examples
```
Single date:
- "251" -> "251"

Approximate date:
- "ca. 362" -> "ca. 362"

Date range:
- "193-200" -> "193-200"
- Pin positioned at year 197 (midpoint)

Approximate date range:
- "ca. 260-264" -> "ca. 260-264"
- Pin positioned at year 262 (midpoint)

Birth date only:
- "b. 330" -> "b. 330"
- Pin positioned at year 330

Death date only:
- "d. 251" -> "d. 251"
- Pin positioned at year 251

Birth range:
- "b. 193-200" -> "b. 193-200"
- Pin positioned at year 197 (midpoint)

Death range:
- "d. 260-264" -> "d. 260-264"
- Pin positioned at year 262 (midpoint)
``` 