const CryptoJS = require("crypto-js");
const decrypt = (cipher) => {
  const randomKey = process.env.DECRYPT;
  const iv = randomKey ? randomKey.slice(0, 16) : "";
  const decrypted = CryptoJS.AES.decrypt(
    cipher,
    CryptoJS.enc.Utf8.parse(randomKey),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = decrypt;
