import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, applicationsTable } from "@workspace/db";
import type { Application } from "@workspace/db";
import {
  ListApplicationsResponse,
  CreateApplicationBody,
  GetApplicationResponse,
  UpdateApplicationBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(row: Application) {
  return {
    ...row,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : row.updatedAt,
  };
}

router.get("/applications", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(applicationsTable)
    .orderBy(desc(applicationsTable.createdAt));
  res.json(ListApplicationsResponse.parse(rows.map(serialize)));
});

router.post("/applications", async (req, res): Promise<void> => {
  const parsed = CreateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid create body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(applicationsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(GetApplicationResponse.parse(serialize(row)));
});

router.get("/applications/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const [row] = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.id, id));

  if (!row) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(GetApplicationResponse.parse(serialize(row)));
});

router.patch("/applications/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const parsed = UpdateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid update body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(applicationsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(applicationsTable.id, id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(GetApplicationResponse.parse(serialize(row)));
});

router.delete("/applications/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const [row] = await db
    .delete(applicationsTable)
    .where(eq(applicationsTable.id, id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
