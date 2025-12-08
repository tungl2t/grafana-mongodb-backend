function convertLegacyUUID(base64) {
  const buffer = Buffer.from(base64, "base64");
  if (buffer.length !== 16) {
    throw new Error("Invalid UUID buffer length");
  }
  const reordered = Buffer.alloc(16);
  reordered.writeUInt32LE(buffer.readUInt32BE(0), 0); // time_low
  reordered.writeUInt16LE(buffer.readUInt16BE(4), 4); // time_mid
  reordered.writeUInt16LE(buffer.readUInt16BE(6), 6); // time_hi_and_version
  buffer.copy(reordered, 8, 8, 16);
  const toHex = (start, end) =>
    reordered.subarray(start, end).toString("hex");
  return [
    toHex(0, 4),
    toHex(4, 6),
    toHex(6, 8),
    toHex(8, 10),
    toHex(10, 16),
  ].join("-");
}

function trimName(name) {
  if (!name) return "";
  if (name.length <= 20) return name;
  return name.substring(0, 20) + "...";
}

module.exports = { convertLegacyUUID, trimName };