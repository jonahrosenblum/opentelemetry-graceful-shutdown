const express = require('express');
const {BasicTraceProvider, BatchSpanProcessor} = require('@opentelemetry/tracing')
const {StackdriverTraceExporter} = require('@opentelemtry/exporter-stackdriver-trace')

const exporter = StackdriverTraceExporter();
const processor = BatchSpanProcessor(exporter);
const provider = BasicTraceProvider();
provider.addSpanProcessor(processor)
const tracer = provider.getTracer();

const app = express();

app.get('/trace', (req, res) => {
    tracer.startSpan('foo');
    res.send(`started trace`);
});

const port = 8080;
const host = '0.0.0.0'
app.listen(port, host);