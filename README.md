# irevue-logs-cleaner

A simple script used to add spaces to badly formated irevue logs.

## Usage

Log files one by one:

```bash
npm install
zcat hippo.irevues.access.2014.07.22.log.gz | ./irevue-logs-cleaner.njs | gzip -9 > hippo.irevues.access.2014.07.22.log.ok.gz 
```

With a batch:
```bash
./irevue-hippo-logs-batch
```
