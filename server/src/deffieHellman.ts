import crypto from "crypto";

export const generateKeyPair = () => {
  const dh = crypto.createDiffieHellman(2048);
  const publicKey = dh.generateKeys("base64");
  const privateKey = dh.getPrivateKey("base64");
  const prime = dh.getPrime("base64");
  const generator = dh.getGenerator("base64");

  return { dh, publicKey, privateKey, prime, generator };
};

export const computeSharedSecret = (
  dh: crypto.DiffieHellman,
  otherPublicKey: string
) => {
  return dh.computeSecret(otherPublicKey, "base64", "base64");
};
