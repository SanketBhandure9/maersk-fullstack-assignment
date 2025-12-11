import { Router, Request, Response } from "express";
import db from "../db/database";
import { Vendor } from "../models/Vendor";

const router = Router();

// GET /vendors - List all vendors
router.get("/", (req: Request, res: Response) => {
  db.all("SELECT * FROM vendors", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /vendors - Register a new vendor
router.post("/", (req: Request, res: Response) => {
  const { name, contact_person, email, partner_type } = req.body as Vendor;

  if (!name || !contact_person || !email || !partner_type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (partner_type !== "Supplier" && partner_type !== "Partner") {
    return res
      .status(400)
      .json({ error: 'partner_type must be either "Supplier" or "Partner"' });
  }

  const computeNextId = (
    callback: (err: Error | null, nextId?: number) => void
  ) => {
    const q = `
      SELECT COALESCE(
        (SELECT t.id + 1 FROM vendors t
         LEFT JOIN vendors t2 ON t2.id = t.id + 1
         WHERE t2.id IS NULL
         ORDER BY t.id
         LIMIT 1),
        1
      ) as nextId
    `;
    db.get(q, [], (err, row: { nextId: number }) => {
      if (err) return callback(err);
      callback(null, row?.nextId ?? 1);
    });
  };

  const insertWithId = (id: number) => {
    const sql = `INSERT INTO vendors (id, name, contact_person, email, partner_type) 
                   VALUES (?, ?, ?, ?, ?)`;

    db.run(
      sql,
      [id, name, contact_person, email, partner_type],
      function (err) {
        if (err) {
          if (
            err.message &&
            err.message.includes("UNIQUE constraint failed: vendors.email")
          ) {
            return res.status(409).json({
              error:
                "A vendor with this email already exists. Please use a different email address.",
              code: "EMAIL_DUPLICATE",
            });
          }

          if (
            err.message &&
            err.message.includes("UNIQUE constraint failed: vendors.id")
          ) {
            computeNextId((computeErr, newId) => {
              if (computeErr)
                return res.status(500).json({ error: computeErr.message });
              if (newId === id)
                return res.status(500).json({ error: err.message });
              db.run(
                sql,
                [newId, name, contact_person, email, partner_type],
                function (err2) {
                  if (err2) {
                    return res.status(500).json({ error: err2.message });
                  }
                  return res.status(201).json({
                    id: newId,
                    name,
                    contact_person,
                    email,
                    partner_type,
                  });
                }
              );
            });
            return;
          }

          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          id: id,
          name,
          contact_person,
          email,
          partner_type,
        });
      }
    );
  };

  computeNextId((err, nextId) => {
    if (err) return res.status(500).json({ error: err.message });
    insertWithId(nextId!);
  });
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid vendor id" });
  }

  const sql = `DELETE FROM vendors WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.status(204).send();
  });
});

export default router;
