import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class EdcCimbTestRepository {

  constructor() {
    this.generateTable()
  }

  getMessage(amount: number, cardType: string) {
    let hexMessage = ""
    hexMessage += this.hexTransactionType()
    hexMessage += this.hexUniqueId()
    hexMessage += this.hexAmount(amount)
    // hexMessage += this.hexCardType(cardType)
    return this.generateMessage(hexMessage)
  }

  hexTransactionType() {
    return "31"
  }

  hexUniqueId() {
    let tag: string = "41";
    let uniqueId: string = this.toHexString(this.stringToByteArray("16722166468312"));
    let len: string = this.toHexString(this.stringToByteArray((uniqueId.length / 2).toString()));
    return `${tag}${len}${uniqueId}`;
  }

  hexAmount(amount: number) {
    let tag: string = "42";
    let hexAmount: string = this.toHexString(this.stringToByteArray(amount.toString()));
    let hexAmountLength: string = this.toHexString(this.stringToByteArray(hexAmount.length.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping: false})));
    return `${tag}${hexAmountLength}${hexAmount}`;
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
    let crc16: string = this.crc16(data)
    
    let hexData: string = `02${data}03${crc16}`;
    return hexData
  }

  crc16(data: string): string {
    return this.computeChecksum(this.stringToByteArray(data)).toString()
  }

  // crctab16 = new Uint16Array([
	// 	0X0000, 0X1189, 0X2312, 0X329B, 0X4624, 0X57AD, 0X6536, 0X74BF,
	// 	0X8C48, 0X9DC1, 0XAF5A, 0XBED3, 0XCA6C, 0XDBE5, 0XE97E, 0XF8F7,
	// 	0X1081, 0X0108, 0X3393, 0X221A, 0X56A5, 0X472C, 0X75B7, 0X643E,
	// 	0X9CC9, 0X8D40, 0XBFDB, 0XAE52, 0XDAED, 0XCB64, 0XF9FF, 0XE876,
	// 	0X2102, 0X308B, 0X0210, 0X1399, 0X6726, 0X76AF, 0X4434, 0X55BD,
	// 	0XAD4A, 0XBCC3, 0X8E58, 0X9FD1, 0XEB6E, 0XFAE7, 0XC87C, 0XD9F5,
	// 	0X3183, 0X200A, 0X1291, 0X0318, 0X77A7, 0X662E, 0X54B5, 0X453C,
	// 	0XBDCB, 0XAC42, 0X9ED9, 0X8F50, 0XFBEF, 0XEA66, 0XD8FD, 0XC974,
	// 	0X4204, 0X538D, 0X6116, 0X709F, 0X0420, 0X15A9, 0X2732, 0X36BB,
	// 	0XCE4C, 0XDFC5, 0XED5E, 0XFCD7, 0X8868, 0X99E1, 0XAB7A, 0XBAF3,
	// 	0X5285, 0X430C, 0X7197, 0X601E, 0X14A1, 0X0528, 0X37B3, 0X263A,
	// 	0XDECD, 0XCF44, 0XFDDF, 0XEC56, 0X98E9, 0X8960, 0XBBFB, 0XAA72,
	// 	0X6306, 0X728F, 0X4014, 0X519D, 0X2522, 0X34AB, 0X0630, 0X17B9,
	// 	0XEF4E, 0XFEC7, 0XCC5C, 0XDDD5, 0XA96A, 0XB8E3, 0X8A78, 0X9BF1,
	// 	0X7387, 0X620E, 0X5095, 0X411C, 0X35A3, 0X242A, 0X16B1, 0X0738,
	// 	0XFFCF, 0XEE46, 0XDCDD, 0XCD54, 0XB9EB, 0XA862, 0X9AF9, 0X8B70,
	// 	0X8408, 0X9581, 0XA71A, 0XB693, 0XC22C, 0XD3A5, 0XE13E, 0XF0B7,
	// 	0X0840, 0X19C9, 0X2B52, 0X3ADB, 0X4E64, 0X5FED, 0X6D76, 0X7CFF,
	// 	0X9489, 0X8500, 0XB79B, 0XA612, 0XD2AD, 0XC324, 0XF1BF, 0XE036,
	// 	0X18C1, 0X0948, 0X3BD3, 0X2A5A, 0X5EE5, 0X4F6C, 0X7DF7, 0X6C7E,
	// 	0XA50A, 0XB483, 0X8618, 0X9791, 0XE32E, 0XF2A7, 0XC03C, 0XD1B5,
	// 	0X2942, 0X38CB, 0X0A50, 0X1BD9, 0X6F66, 0X7EEF, 0X4C74, 0X5DFD,
	// 	0XB58B, 0XA402, 0X9699, 0X8710, 0XF3AF, 0XE226, 0XD0BD, 0XC134,
	// 	0X39C3, 0X284A, 0X1AD1, 0X0B58, 0X7FE7, 0X6E6E, 0X5CF5, 0X4D7C,
	// 	0XC60C, 0XD785, 0XE51E, 0XF497, 0X8028, 0X91A1, 0XA33A, 0XB2B3,
	// 	0X4A44, 0X5BCD, 0X6956, 0X78DF, 0X0C60, 0X1DE9, 0X2F72, 0X3EFB,
	// 	0XD68D, 0XC704, 0XF59F, 0XE416, 0X90A9, 0X8120, 0XB3BB, 0XA232,
	// 	0X5AC5, 0X4B4C, 0X79D7, 0X685E, 0X1CE1, 0X0D68, 0X3FF3, 0X2E7A,
	// 	0XE70E, 0XF687, 0XC41C, 0XD595, 0XA12A, 0XB0A3, 0X8238, 0X93B1,
	// 	0X6B46, 0X7ACF, 0X4854, 0X59DD, 0X2D62, 0X3CEB, 0X0E70, 0X1FF9,
	// 	0XF78F, 0XE606, 0XD49D, 0XC514, 0XB1AB, 0XA022, 0X92B9, 0X8330,
	// 	0X7BC7, 0X6A4E, 0X58D5, 0X495C, 0X3DE3, 0X2C6A, 0X1EF1, 0X0F78,
	//   ]);;

  crctab16 = new Uint16Array(256)
  computeChecksum(bytes: Uint8Array): number {
    let crc: number = 0;
    // console.log(bytes.length)
    // for (let i = 0; i < bytes.length; ++i)
    // {
    //     let index = (crc ^ bytes[i]);
    //     crc = ((crc >> 8) ^ this.crctab16[index]);
    //     console.log
    // }
    // return crc;
    var res = 0x0ffff;

		for (let b of bytes) {
			res = ((res >> 8) & 0x0ff) ^ this.crctab16[(res ^ b) & 0xff];
		}

		return (~res) & 0x0ffff;
  }

  stringToByteArray(str: string): Uint8Array {
    let encoder = new TextEncoder()
    return encoder.encode(str)
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

  polynomial: number = 0xA001;

  generateTable() {
    let value;
    let temp;
    for (let i = 0; i < this.crc16.length; ++i)
    {
        value = 0;
        temp = i;
        for (let j = 0; j < 8; ++j)
        {
            if (((value ^ temp) & 0x0001) != 0)
            {
                value = ((value >> 1) ^ this.polynomial);
            }
            else
            {
                value >>= 1;
            }
            temp >>= 1;
        }
        this.crctab16[i] = value;
    }
  }

}