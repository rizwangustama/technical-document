import { defineEventHandler, getRequestURL, getMethod } from 'h3'

export default defineEventHandler((event) => {
  const method = getMethod(event)
  const url = getRequestURL(event).pathname

  // Catat waktu mulai
  const startTime = Date.now()

  // Log Request
  console.log(`\n[API REQ] ➡️  ${method} ${url}`)

  // Menangkap payload response dengan melakukan monkey-patching pada res.write & res.end
  const originalWrite = event.node.res.write;
  const originalEnd = event.node.res.end;
  let responseBody = '';

  // @ts-ignore
  event.node.res.write = function (chunk, ...args) {
    if (chunk) responseBody += chunk.toString();
    return originalWrite.apply(event.node.res, [chunk, ...args]);
  };

  // @ts-ignore
  event.node.res.end = function (chunk, ...args) {
    if (chunk && typeof chunk !== 'function') {
      responseBody += chunk.toString();
    }
    
    const duration = Date.now() - startTime;
    const status = event.node.res.statusCode;
    const statusIcon = status >= 200 && status < 300 ? '✅' : status >= 400 ? '❌' : '⚠️';
    
    console.log(`[API RES] ${statusIcon} ${method} ${url} - Status: ${status} - ${duration}ms`);
    
    // Tampilkan data body jika ada (hanya untuk request API agar tidak log HTML yang panjang)
    if (url.startsWith('/api/') && responseBody) {
      try {
        // Coba parsing lalu stringify ke dalam 1 baris (tanpa spasi/enter) agar rapi
        const parsed = JSON.parse(responseBody);
        console.log(`[API DATA] 📦`, JSON.stringify(parsed));
      } catch {
        // Jika bukan JSON, jadikan satu baris string juga
        const compactString = responseBody.replace(/\r?\n|\r/g, '');
        console.log(`[API DATA] 📄`, compactString.length > 500 ? compactString.substring(0, 500) + '... (truncated)' : compactString);
      }
    }
    
    return originalEnd.apply(event.node.res, [chunk, ...args]);
  };
})
