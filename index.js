'use strict'

const express = require('express');
const { BasicTracerProvider, BatchSpanProcessor } = require('@opentelemetry/tracing')
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter')

const exporter = new TraceExporter();
const provider = new BasicTracerProvider();
provider.addSpanProcessor(new BatchSpanProcessor(exporter, {bufferTimeout: 1E100}));
const tracer = provider.getTracer();

const app = express();

app.get('/trace', (req, res) => {
    const span = tracer.startSpan('shutdown-parent');
    const childSpan = tracer.startSpan('shutdown-child', { parent: span });
    childSpan.end();
    span.end();
    res.send(`started trace but did not end`);
});

app.get('/shutdown', (req, res) => {
    process.kill(process.pid, 'SIGTERM')
    res.send(`sent kill signal`);
});

app.get('/', (req, res) => {
    res.send(`home`);
});

const port = 8080;
const host = '0.0.0.0'
app.listen(port, host);