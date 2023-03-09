import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom, Observable } from "rxjs";
import { SerialOptions, SerialPort, SerialPortInfo } from "../_helpers/edc";
import { EdcList } from "../general/models/EdcList";
import { EdcGenerateMessageResponse } from "../general/models/response/EdcGenerateMessageResponse";
import { EdcParseMessageResponse } from "../general/models/response/EdcParseMessageResponse";
import { EdcParseMessageRequest } from "../general/models/request/EdcParseMessageReq";
import { EdcGenerateMessageRequest } from "../general/models/request/EdcGenerateMessageReq";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ALERT_DANGER } from "../_configs/app-config";
import { ModalAlertService } from "./modal-alert.service";

@Injectable({
  providedIn: 'root'
})

export class EdcService {
  constructor(private http: HttpClient, private alertService: ModalAlertService) { }
  bsModalShowAlert?: BsModalRef

  generateMessage(edc: EdcList, body: EdcGenerateMessageRequest): Observable<EdcGenerateMessageResponse> {
    return this.http.post<EdcGenerateMessageResponse>(edc.generate_message_url, body);
  }

  parseMessage(edc: EdcList, body: EdcParseMessageRequest): Observable<EdcParseMessageResponse> {
    return this.http.post<EdcParseMessageResponse>(edc.parse_message_url, body);
  }

  async triggerEdc(edc: EdcList, transaction_type: string, amount: number, cardType: string) {
    const body: EdcGenerateMessageRequest = {
      transaction_type: transaction_type,
      amount: amount,
      edc_id: edc.edc_id,
      card_type: cardType
    };
    let edcMessage: EdcGenerateMessageResponse = EdcGenerateMessageResponse.default();
    
    await firstValueFrom(this.generateMessage(edc, body)).then(
      data => {
        edcMessage = data;
      }
    );
    
    let result: EdcParseMessageRequest = await this.triggerSerial(edc, edcMessage);
    return firstValueFrom(this.parseMessage(edc, result));
  }

  async triggerSerial(edc: EdcList, edcMessage: EdcGenerateMessageResponse) {
    let edcResult: EdcParseMessageRequest = EdcParseMessageRequest.default();

    if (!("serial" in navigator)) {
      throw new Error(`The Web serial API doesn\'t seem to be enabled or supported in your browser. 
      Please use Chrome, Edge, or Opera browser.`);
    }
    
    let port: SerialPort | undefined
    
    try {
      // Get EDC Port
      
      port = await this.getEdcPort(edc);

      // Open EDC Port
      
      await this.openEdcPort(port, edc);

      // Write Message to EDC
      
      await this.writeMessageToEdc(port, edcMessage);
      
      // Read message from EDC
      
      edcResult = await this.readMessageFromEdc(port);

      // Close EDC Port
      
      await port.close();
    }
    catch (error) {
      if (port != undefined) port.close() 
      // this.alertService.showModalAlert('An error has occured, please contact administration',ALERT_DANGER);
      throw error
    }
    return edcResult;
  }

  async getEdcPort(edc: EdcList): Promise<SerialPort> {
    const ports: any = await navigator.serial.getPorts();
    const filtered = [...ports].filter(x => x.getInfo().usbProductId == edc.usb_product_id && x.getInfo().usbVendorId == edc.usb_vendor_id)[0];
    const port = filtered != null ? filtered : await navigator.serial.requestPort({});
    return port;
  }

  async openEdcPort(port: SerialPort, edc: EdcList) {
    await port.open({
      baudRate: edc.baudrate,
      dataBits: edc.databits,
      stopBits: edc.stopbits,
      parity: edc.parity
    });
  }

  async writeMessageToEdc(port: SerialPort, edcMessage: EdcGenerateMessageResponse) {
    const writer = port.writable.getWriter();
    const fromHexString = (hexString: string) => 
    new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
    // === EDC MESSAGE ===;
    await writer.write(fromHexString(edcMessage?.message!));
    writer.releaseLock();
  }

  async readMessageFromEdc(port: SerialPort) {
    // === START READING MESSAGE ===

    const edcResult: EdcParseMessageRequest = EdcParseMessageRequest.default();
    const reader = port.readable.getReader();

    let run: boolean = true
    let timeout: any
    let isTimeout: boolean = false

    while (run) {
      let { value } = await reader.read();

      // === BEFORE IF VALUE ===
      if (value) {
        let decodedValue: string = new TextDecoder("utf-8").decode(value);
        
        
        
        if (decodedValue.includes("\u0006") || decodedValue.includes("\u0015")) {
          edcResult.response_code += decodedValue;

          if (decodedValue.includes("\u0015")) {
            reader.releaseLock()
            clearTimeout(timeout)
            throw new Error("Invalid message to edc. Please contact administration")
          }
        } 
        
        if (decodedValue.includes("\u0002")) {
          edcResult.response_desc = decodedValue
        } else {
          edcResult.response_desc += decodedValue
        }

        if (decodedValue.includes("\u0003")) {
          reader.releaseLock()
          clearTimeout(timeout)
          break;
        }
        
        if (timeout == undefined) {
          timeout = setTimeout(() => {
            run = false
            isTimeout = true
            reader.cancel()
            reader.releaseLock()
          }, 120000);
        }
      }
    }

    if (isTimeout) throw new Error("Timeout. No response from EDC")
    return edcResult;
  }
}
