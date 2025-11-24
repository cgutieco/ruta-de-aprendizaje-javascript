function normalizeToString(value) {
    if (value === null || value === undefined) {
        return "";
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === "object") {
        const obj = value;

        if (obj && typeof obj.text === "string") {
            return obj.text;
        }

        if (obj && "richText" in obj && Array.isArray(obj.richText)) {
            return obj.richText.map((t) => (t && typeof t.text === "string") ? t.text : "").join("");
        }

        try {
            return JSON.stringify(value);
        } catch {
            return "";
        }
    }
    if (typeof value === "symbol" || typeof value === "bigint" || typeof value === "function") {
        try {
            return String(value);
        } catch {
            return "";
        }
    }
    return "";
}

export {normalizeToString};
