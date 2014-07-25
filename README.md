# irevue-logs-cleaner

A simple script used to add spaces to badly formated irevue logs.

## Usage

```bash
npm install
zcat hippo.irevues.access.2014.07.22.log.gz | ./irevue-logs-cleaner.njs | gzip -9 > hippo.irevues.access.2014.07.22.log.ok.gz 
```