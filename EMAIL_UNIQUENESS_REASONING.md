# Email Uniqueness — Reasoning and Implementation Rationale

This document explains where email uniqueness should be enforced in the vendor onboarding system, the trade-offs for each layer, and a recommended, practical approach with justification.

## Summary recommendation

Enforce uniqueness at three layers:

1. Frontend: fast, user-friendly pre-checks to reduce wasted requests and provide immediate feedback.
2. Backend/API: authoritative validation that returns a clear HTTP 409 Conflict when an email already exists.
3. Database: a UNIQUE constraint (and index) on the `email` column to guarantee data integrity.

This combination gives the best balance of user experience, security, and correctness.

---

## Layer-by-layer analysis

### 1) Frontend (UX layer)

What to do:

- Perform a quick, client-side check against the local vendor list (Pinia store) before sending a network request.
- Disable the submit control while the request is in-flight to prevent double-clicks/race conditions from the same client.
- Show an inline validation message if the email appears to already exist.

Pros:

- Instant feedback (no network latency), improving user experience.
- Reduces unnecessary backend calls (performance benefit).
- Can prevent obvious duplicates caused by accidental double-clicks or stale UI.

Cons / Limits:

- Can be bypassed by malicious clients or users (e.g., curl, modified client code).
- Not sufficient to guarantee global uniqueness under concurrent requests.

When to rely on it:

- For immediate UX validation only; never as the only enforcement.

### 2) Backend / API (Business logic layer)

What to do:

- Validate request payload server-side.
- Before inserting, either:
  - Check whether the email already exists and return `409 Conflict` if so, or
  - Rely on the database UNIQUE constraint and catch the constraint violation to return `409`.
- Return a clear error structure (message + error code), e.g.:
  ```json
  {
    "error": "A vendor with this email already exists.",
    "code": "EMAIL_DUPLICATE"
  }
  ```

Pros:

- Cannot be bypassed by modifying the frontend.
- Allows returning a proper HTTP-level error code for clients to react to.
- Protects against common race conditions when combined with database constraints.

Cons:

- If implemented as a naive existence check (SELECT then INSERT), it can still race under high concurrency. The DB constraint is needed for atomic safety.

Implementation notes:

- Prefer catching DB constraint errors where possible: insert then handle `SQLITE_CONSTRAINT` (or DB-specific error) and return `409`.
- If you check `EXISTS` before insert, still prepare to handle constraint errors on insert.

### 3) Database (Data integrity layer)

What to do:

- Add a `UNIQUE` constraint on the `email` column and create a unique index.

Example DDL (SQLite):

```sql
CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  partner_type TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_vendor_email ON vendors(email);
```

Pros:

- Guarantees uniqueness at the source of truth, regardless of application-layer bugs.
- Atomic and race-safe — the DB enforces constraint even under concurrent inserts.
- Index improves lookup performance for existence checks.

Cons:

- If you rely only on this layer, UX suffers (users only learn after request completes).
- Existing duplicate rows must be cleaned up before adding a constraint (migration step).

---

## Error handling and client UX

- Use a specific HTTP status for duplicate errors: `409 Conflict`.
- Include a short error code (e.g., `EMAIL_DUPLICATE`) to let the frontend make deterministic decisions.
- Frontend should:
  - Show inline error messages from backend (e.g., `vendorStore.error`).
  - Restore form values on error so users can correct entries without retyping everything.
  - Keep `isSubmitting` lock during in-flight requests and release on completion/error.

Example workflow for POST `/api/vendors`:

1. Frontend checks local cache for email; if found, show instant message and do not send request.
2. If not found, frontend disables submit and sends POST.
3. Backend attempts insert; if the DB rejects due to unique constraint, backend returns `409`.
4. Frontend receives 409, shows backend message, restores form values so the user can correct them.

---

## Concurrency and race conditions

- DB-level uniqueness is the only reliable protection against race conditions (two simultaneous requests that both pass a frontend or pre-insert check).
- If absolute sequential ids or special id allocation logic is used (e.g., server fills gaps), that allocation itself must be guarded (transactions/locking) or must handle collision/retry.

---

## Additional considerations

- Case sensitivity: SQLite's `UNIQUE` constraint is case-sensitive by default for `TEXT`. If you want case-insensitive uniqueness ("A@example.com" equals "a@example.com"), either:

  - Store + compare lowercased emails (normalize before insert and add constraint on lowercased email), or
  - Use a COLLATE NOCASE on the column (SQLite supports `COLLATE NOCASE`), e.g. `email TEXT NOT NULL COLLATE NOCASE UNIQUE`.

- Email normalization: trim whitespace and consider canonicalization (lowercase local and domain parts) before checking/insert.

- Migration: before adding a UNIQUE constraint to an existing DB, you must ensure no duplicate emails exist. Provide a migration script to find and resolve duplicates.

- Id strategy: If you implement server-side id allocation that fills gaps, be aware of concurrent allocation races — you must detect collisions and retry or prefer DB-generated ids to avoid complexity.

---

## Tests to cover

- Frontend: try to add the same email twice rapidly; UI should prevent duplicate request and show a message.
- Backend: simultaneous POST requests with same email — one succeeds, the other returns `409`.
- Database migration: script that verifies no duplicates before adding UNIQUE constraint.

---

## Conclusion

- Use all three layers together: frontend for UX, backend for authoritative validation and consistent HTTP errors, database for correctness. This ensures a good user experience while maintaining data integrity and protecting against malicious/accidental bypasses.
