'use strict'

const express = require('express');
const { BasicTracerProvider, BatchSpanProcessor } = require('opetelemetry-js/opentelemetry-tracing')
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter')

const bufferConfig = {
    bufferSize: 1000,
    bufferTimeout: 999999999,
};

const exporter = new TraceExporter();
const provider = new BasicTracerProvider();
provider.addSpanProcessor(new BatchSpanProcessor(exporter, bufferConfig));
const tracer = provider.getTracer();

const app = express();

app.get('/trace', (req, res) => {
    const span = tracer.startSpan('shutdown-parent');
    const childSpan = tracer.startSpan('shutdown-child', { parent: span });
    childSpan.end();
    span.end();
    res.send(`created trace`);
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