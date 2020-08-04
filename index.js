'use strict'

const express = require('express');
const { BasicTracerProvider, BatchSpanProcessor } = require('opentelemetry-base/packages/opentelemetry-tracing')
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
//const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter')
const { MeterProvider } = require('opentelemetry-base/packages/opentelemetry-metrics');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

const pexporter = new PrometheusExporter(
  {
    startServer: true,
  },
  () => {
    console.log('prometheus scrape endpoint: http://localhost:9464/metrics');
  },
);

//Initialize the Meter to capture measurements in various ways.
const meter = new MeterProvider({exporter: pexporter, interval: 999999999, gracefulShutdown: true}).getMeter('your-meter-name');

const counter = meter.createUpDownCounter('metric_name', {
  description: 'Example of a UpDownCounter'
});

const labels = { pid: process.pid };

//Create a BoundInstrument associated with specified label values.
const boundCounter = counter.bind(labels);

const bufferConfig = {
    bufferSize: 1000,
    bufferTimeout: 999999999,
};

const exporter = new ZipkinExporter({'serviceName': 'demo'});
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

app.get('/metric', (req, res) => {
    boundCounter.add(1);
    res.send('made metric'); 
});  

app.get('/', (req, res) => {
    res.send(`home`);
});

const port = 8080;
const host = '0.0.0.0'
app.listen(port, host);