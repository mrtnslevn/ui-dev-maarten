import { Md5 } from 'ts-md5/dist/md5';
import { createHash } from 'sha256-uint8array';
import { formatDate } from '@angular/common';

//const md5 = new Md5();
const tgl = formatDate(Date.now(), "yyyy-MM-ddTHH:mm:ss", "en-US");
const text = Md5.hashStr("angularui:2022-05-20T14:53:17");
const signature = createHash().update(text).digest("hex");

export default signature;
