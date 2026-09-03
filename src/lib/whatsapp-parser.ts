export function parseWhatsAppMessage(
  text: string,
  categories: any[],
  fallbackCatId: string,
  userId: string
) {
  const lines = text.split("\n");
  let currentDate = new Date().toISOString();
  const transactions: any[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for date header (e.g., 29 Aug 2026:)
    if (trimmed.match(/^[0-9]{1,2}\s+[A-Za-z]{3}\s+[0-9]{4}:?$/)) {
      currentDate = new Date(trimmed.replace(":", "")).toISOString();
      continue;
    }

    // Clean list numbers (e.g., "1. ")
    const cleanedLine = trimmed.replace(/^[0-9]+\.\s+/, "");
    if (!cleanedLine.startsWith("WDBUY") && !cleanedLine.startsWith("WEBUY")) continue;

    const restOfLine = cleanedLine.substring(6).trim();
    const parts = restOfLine.split(" ");

    let amount = 0;
    const descParts = [];

    for (const p of parts) {
      if (amount === 0 && p.match(/^\d+([.,]\d+)*[Kk]?$/)) {
        const numStr = p.toUpperCase().replace(/[.,]/g, "");
        if (numStr.endsWith("K")) amount = parseInt(numStr.replace("K", "")) * 1000;
        else amount = parseInt(numStr);
      } else {
        descParts.push(p);
      }
    }

    if (amount > 0) {
      const desc = descParts.join(" ");
      let catId = fallbackCatId;
      // Dumb partial match: if category name is in description
      const matchedCat = categories.find((c: any) =>
        desc.toLowerCase().includes(c.name.toLowerCase())
      );
      if (matchedCat) catId = matchedCat.id;

      // note: prevent duplicates in the same WA message payload
      const isDuplicate = transactions.some(
        (t) => t.amount === amount && t.description === desc && t.date === currentDate
      );
      if (!isDuplicate) {
        transactions.push({
          // DB automatically generates UUID if missing, but we supply it to be safe
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
  }
  return transactions;
}
