# WhatsApp Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow multiple users to input custom bulk expense transactions via WhatsApp (Twilio Sandbox) directly into their respective Supabase accounts.

**Architecture:** A Next.js API Route (`POST /api/wa`) will receive Twilio Webhooks. It looks up the user by WhatsApp number, uses a dedicated parser to extract data, and inserts rows into the Supabase `transactions` table using the Service Role Key (bypassing RLS). Returns TwiML XML to reply to the user.

**Tech Stack:** Next.js API Routes, Twilio API, Supabase JS (Service Role), Vitest (for parser tests).

**Spec:**

- Handle formats: `WDBUY 50K MINUM`, `WEBUY 50.600 MAINAN`.
- Handle bulk inputs with dates:
  ```text
  29 Aug 2026:
  1. WDBUY 138K MTIX
  ```

---

### Task 1: Database Migration (Phone Number)

**Files:**

- Modify: Supabase DB (run in SQL Editor)

- [ ] **Step 1: Add phone_number column**
  ```sql
  ALTER TABLE public.user_preferences ADD COLUMN phone_number TEXT UNIQUE;
  ```

---

### Task 2: Setup Supabase Admin Client

**Files:**

- Modify: `.env.local`
- Create: `src/lib/supabase-admin.ts`

- [ ] **Step 1: Add ENV Variables**

  ```env
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```

- [ ] **Step 2: Create Supabase Admin Client**
  ```typescript
  import { createClient } from "@supabase/supabase-js";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  ```

---

### Task 3: Create the Parser & Unit Tests (Antigravity's Approach)

**Files:**

- Create: `src/lib/whatsapp-parser.ts`
- Create: `src/lib/whatsapp-parser.test.ts`

- [ ] **Step 1: Write Parser Logic**
      Create `whatsapp-parser.ts` to parse the text cleanly.

  ```typescript
  export function parseWhatsAppMessage(
    text: string,
    categories: any[],
    fallbackCatId: string,
    userId: string
  ) {
    const lines = text.split("\n");
    let currentDate = new Date().toISOString();
    const transactions = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check for date header
      if (trimmed.match(/^[0-9]{1,2}\s+[A-Za-z]{3}\s+[0-9]{4}:?$/)) {
        currentDate = new Date(trimmed.replace(":", "")).toISOString();
        continue;
      }

      const cleanedLine = trimmed.replace(/^[0-9]+\.\s+/, "");
      if (!cleanedLine.startsWith("WDBUY") && !cleanedLine.startsWith("WEBUY")) continue;

      const restOfLine = cleanedLine.substring(6).trim();
      const parts = restOfLine.split(" ");

      let amount = 0;
      let descParts = [];

      for (const p of parts) {
        if (amount === 0 && (p.match(/^\d+[Kk]$/) || p.match(/^\d+([.,]\d+)?$/))) {
          let numStr = p.toUpperCase().replace(/[.,]/g, "");
          if (numStr.endsWith("K")) amount = parseInt(numStr.replace("K", "")) * 1000;
          else amount = parseInt(numStr);
        } else {
          descParts.push(p);
        }
      }

      if (amount > 0) {
        const desc = descParts.join(" ");
        let catId = fallbackCatId;
        const matchedCat = categories.find((c: any) =>
          desc.toLowerCase().includes(c.name.toLowerCase())
        );
        if (matchedCat) catId = matchedCat.id;

        transactions.push({
          id: crypto.randomUUID(),
          user_id: userId,
          type: "expense",
          amount,
          category: catId,
          description: desc,
          date: currentDate,
          currency: "IDR",
        });
      }
    }
    return transactions;
  }
  ```

- [ ] **Step 2: Add Vitest Unit Tests**
      Create `whatsapp-parser.test.ts` to verify the logic.
  ```typescript
  import { describe, it, expect } from "vitest";
  import { parseWhatsAppMessage } from "./whatsapp-parser";

  describe("WhatsApp Parser", () => {
    it("parses basic format correctly", () => {
      const result = parseWhatsAppMessage("WDBUY 50K MINUM", [], "default", "user-1");
      expect(result.length).toBe(1);
      expect(result[0].amount).toBe(50000);
      expect(result[0].description).toBe("MINUM");
    });
  });
  ```

---

### Task 4: Create the API Route (Webhook)

**Files:**

- Create: `src/app/api/wa/route.ts`

- [ ] **Step 1: Write Webhook Logic**
  ```typescript
  import { NextResponse } from "next/server";
  import { supabaseAdmin } from "@/lib/supabase-admin";
  import { parseWhatsAppMessage } from "@/lib/whatsapp-parser";

  const twimlResponse = (message: string) => {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  };

  export async function POST(req: Request) {
    const formData = await req.formData();
    const text = formData.get("Body")?.toString() || "";
    const sender = formData.get("From")?.toString() || "";

    if (!text) return twimlResponse("Pesan kosong.");

    const phoneNumber = sender.replace("whatsapp:", "");

    const { data: userPref } = await supabaseAdmin
      .from("user_preferences")
      .select("user_id, settings")
      .eq("phone_number", phoneNumber)
      .single();

    if (!userPref) return twimlResponse("Nomor belum terdaftar di aplikasi.");

    const categories = userPref.settings?.categories || [];
    const fallbackCat = categories.find((c: any) => c.name === "Other Expenses") || categories[0];
    const fallbackCatId = fallbackCat?.id || "whatsapp-expense";

    const transactions = parseWhatsAppMessage(text, categories, fallbackCatId, userPref.user_id);

    if (transactions.length > 0) {
      const { error } = await supabaseAdmin.from("transactions").insert(transactions);
      if (error) return twimlResponse("Gagal menyimpan ke database.");
      return twimlResponse(`Berhasil menyimpan ${transactions.length} transaksi!`);
    }

    return twimlResponse("Format tidak dikenali.");
  }
  ```

---

### Task 5: UI for Linking Phone Number

**Files:**

- Modify: `src/components/dashboard/Summary.tsx`

- [ ] **Step 1: Add a simple form to save phone number**
      Add a quick input in the UI that updates the user's `phone_number` in `user_preferences`.
