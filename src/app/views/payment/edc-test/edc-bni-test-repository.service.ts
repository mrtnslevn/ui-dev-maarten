import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class EdcBniTestRepository {

  constructor() { }

  getMessage(amount: number, cardType: string) {
    let hexMessage = ""
    hexMessage += this.hexTransactionType()
    hexMessage += this.hexAmount(amount.toString())
    hexMessage += this.hexCardType(cardType)
    return this.generateMessage(hexMessage)
  }

  hexTransactionType() {
    return "01"
  }

  hexAmount(data: string) {
    data = data.replace(",", "");
    data = data.replace(".", "");
    data = data.replace(" ", "");


    let amount: string = `${data}00`;
    let amountHex: string = "";
    
    for (let i = 0; i < amount.length; i++) {
      amountHex += "3" + amount[i];
    }

    let amountHexPadding: string = `303030303030303030303030${amountHex}`;
    try
    {
        amountHexPadding = amountHexPadding.substr(amountHexPadding.length - 24, 24);
    }
    catch (err) {
      throw err;
    }
    return amountHexPadding;
  }

  hexCardType(cardType: string) {
    switch (cardType)
    {
        case "Credit Card":
            return "03";
        case "Debit Card":
            return "01";
        default:
            return "00";
    }
  }

  generateMessage(data: string): string {
    let hexData: string = `02424E49${data}0300`
    let byteData: Uint8Array = new Uint8Array(hexData.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)))
    let withLrc: Uint8Array = this.lrc(byteData)
    return this.toHexString(withLrc);
  }

  lrc(data: Uint8Array) {
    try {
        let len: number = data.length;

        let x = data[1];

        for (let i = 2; i <= len - 2; i++)
        {
            x ^= data[i];
        }
        data[len - 1] = x;
    }
    catch (err) {
      throw err
    }
    return data;
  }

  hexStringToByteArray(hexData: string) {
    return new Uint8Array(hexData.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
  }

  toHexString(arr: Uint8Array) {
    return Array.from(arr, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }

  parseHexString(str: string) {
    var result = [];
    while (str.length >= 8) { 
        result.push(parseInt(str.substring(0, 8), 16));

        str = str.substring(8, str.length);
    }
    return result;
  }

}