import { createVerify } from 'node:crypto';

export async function verifyIapJwt(iapJwt: string, iapAudience: string): Promise<boolean> {
  try {
    const [header, payload, signature] = iapJwt.split('.');

    const result = await fetch('https://www.gstatic.com/iap/verify/public_key');
    const publicKeys = await result.json();
    const { kid } = JSON.parse(atob(header!));
    const { aud, exp, iss } = JSON.parse(atob(payload!));

    const isAudience = aud === iapAudience;
    const isNotExpired = Math.ceil(Date.now() / 1000) <= exp;
    const isIssuer = iss === 'https://cloud.google.com/iap';
    const isVerified = createVerify('sha256').update(`${header}.${payload}`).verify(
      {
        dsaEncoding: 'ieee-p1363',
        key: publicKeys[kid],
      },
      signature!,
      'base64',
    );

    return isAudience && isNotExpired && isIssuer && isVerified;
  } catch {
    return false;
  }
}
