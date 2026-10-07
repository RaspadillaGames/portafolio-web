require('dotenv').config()
const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
  // Evitar solicitud de favicon.ico
  if (req.url === '/favicon.ico') {
    res.writeHead(204) // Respuesta exitosa sin contenido
    res.end()
    return
  }

  // Formulario de contacto: recibe los datos que envia fetch()
  if (req.method === 'POST' && req.url === '/contacto') {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      console.log('Mensaje recibido:', body)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true }))
    })
    return
  }

  // La raiz "/" muestra index.html
  const url = req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]

  // Obtén la ruta absoluta del archivo solicitado
  const filePath = path.join(__dirname, 'public', url)

  console.log('Ruta del archivo solicitado:', filePath) // Mensaje de depuración

  // No permitir salir de la carpeta public
  if (!filePath.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(403, { 'Content-Type': 'text/html' })
    res.end('Acceso denegado')
    return
  }

  // Lee el archivo solicitado y responde con su contenido
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error('Error al leer el archivo:', err.code)
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end('Archivo no encontrado')
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' })
        res.end('Error del servidor')
      }
    } else {
      const ext = path.extname(filePath)
      let contentType = 'text/html'
      switch (ext) {
        case '.js':
          contentType = 'text/javascript'
          break
        case '.css':
          contentType = 'text/css'
          break
        case '.json':
          contentType = 'application/json'
          break
        case '.png':
          contentType = 'image/png'
          break
        case '.jpg':
          contentType = 'image/jpeg'
          break
      }

      console.log('Sirviendo archivo:', filePath)

      // Archivo encontrado, envía el contenido como respuesta
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content)
    }
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`)
})
