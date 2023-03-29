const Fastify = require('fastify');
const fs = require('fs');
const fastifyCors = require('@fastify/cors');
const fastifyMultipart = require('@fastify/multipart');
const util = require('util');
const { pipeline } = require('stream');
const readPdf = require('./services/handlerPDFContent');


const pump = util.promisify(pipeline);

const fastify = Fastify({
    logger: true
})

fastify.register(fastifyCors, {
    origin: "*"
})

fastify.register(fastifyMultipart);

// Basic a route
fastify.get('/', function (request, reply) {
    reply.send({ hello: 'opa' })
})


fastify.post('/upload', async (req, reply) => {
    const data = await req.file()
    await pump(data.file, fs.createWriteStream(data.filename))
    const subjects = await readPdf(data.filename);

    reply.send({ subjects })
})

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})