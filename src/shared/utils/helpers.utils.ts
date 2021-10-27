
import * as crypto from "crypto"


export  const concatinateDash = (text: string) : string=> {
    return text.split(' ').join('-')
}


export const encryptKeys = (hashKey: string, text: string): string => {
    const mykey = crypto.createCipher('aes-128-cbc', hashKey);
    let mystr = mykey.update(text, 'utf8', 'hex')
    mystr += mykey.final('hex');
    return mystr
}


export const generateString = (len: number) => {
    const randomString = crypto.randomBytes(len);
    return randomString.toString('hex')
}

export const decryptKeys = (hashKey: string, text: string) : string => {
    const mykey = crypto.createDecipher('aes-128-cbc', hashKey);
    let mystr = mykey.update(text, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr;
}



