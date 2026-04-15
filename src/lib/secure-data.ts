import crypto from "crypto";

const PREFIX = "enc:v1:";

function getKey() {
  const secret = process.env.DATA_ENCRYPTION_SECRET;

  if (!secret || secret.length < 16) {
    return null;
  }

  return crypto.createHash("sha256").update(secret).digest();
}

export function isEncryptionEnabled() {
  return Boolean(getKey());
}

export function encryptText(value: string | null | undefined) {
  if (value === null || value === undefined) return null;

  const secretKey = getKey();
  if (!secretKey) return value;

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${PREFIX}${iv.toString("base64")}.${authTag.toString("base64")}.${encrypted.toString("base64")}`;
}

export function decryptText(value: string | null | undefined) {
  if (value === null || value === undefined) return value;

  const raw = String(value);
  if (!raw.startsWith(PREFIX)) return raw;

  const secretKey = getKey();
  if (!secretKey) return raw;

  try {
    const payload = raw.slice(PREFIX.length);
    const [ivBase64, authTagBase64, dataBase64] = payload.split(".");

    if (!ivBase64 || !authTagBase64 || !dataBase64) {
      return raw;
    }

    const iv = Buffer.from(ivBase64, "base64");
    const authTag = Buffer.from(authTagBase64, "base64");
    const encrypted = Buffer.from(dataBase64, "base64");

    const decipher = crypto.createDecipheriv("aes-256-gcm", secretKey, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
  } catch {
    return raw;
  }
}
