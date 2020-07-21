'use strict'

const express = require('express');
const { BasicTracerProvider, BatchSpanProcessor } = require('@opentelemetry/tracing')
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter')

const exporter = new TraceExporter();
const provider = new BasicTracerProvider();
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
const tracer = provider.getTracer();

const app = express();

app.get('/trace', (req, res) => {
    tracer.startSpan('foo');
    res.send(`started trace`);
});

app.get('/', (req, res) => {
    res.send(`home`);
});

const port = 8080;
const host = '0.0.0.0'
app.listen(port, host);