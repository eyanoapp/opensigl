# Barcodes

Barcodes are an efficient mechanism to retrieve documents with minimal user input.  OpenSIGL generates barcodes for every receipt produced.  This document describes how barcodes work in OpenSIGL.

## Record Naming Conventions

_Note: this might be best put somewhere else_

Internally, OpenSIGL uses version 4 [universally unique identifiers (UUIDs)](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29) as the primary key for most records.  While they have many advantages, being humanly readable is not one of them.  In order to easily and meaningfully refer to documents, we developed a human-readable "reference" composed with the following syntax:

```
${type}.${project}.${integer}
```

where `${type}` is the two letter document type, `${project}` is the abbreviation of the project which created the document, and `${integer}` is monotonically increasing integer identifier.  Some examples of these references may be `IV.TPA.123`, `VO.XYZ.333`, and so on.

The following types are hard-coded into the system:

1. `IV` -> Invoice
2. `VO` -> Voucher
3. `CP` -> Cash Payment
4. `SM` -> Stock Movement
5. `PA` -> Patient Card

Thus, the reference `PA.NXR.3` is read as "the third patient of project NXR".  Similarly, `VO.UOU.39410` is the "39410th voucher of project UOU".

## Barcode Generation

Similar to the human readable references, the barcodes generated by the system have a specific syntax.  It is:

```
${type}${first 8 chars of UUID}
```

For example, a barcode might be `IVBBA182AF` which denotes the _invoice_ with the first 8 characters of the uuid as **BBA182AF**.  The code is found in [server/lib/barcode.js](https://github.com/Third-Culture-Software/opensigl/blob/master/server/lib/barcode.js).


Why use 8 characters?  Because barcodes are wide and we needed a format to fit on an 80mm thermal receipt while still being readable.  Despite their obfuscation, barcodes are an alphabet, read left to right.  More characters create a longer barcode "word".  Interestingly, QR codes do not have this problem - instead they increase the complexity of the QR code pattern.  But QR code readers are expensive whilst barcode readers are cheap.

## How barcodes are read in OpenSIGL

A barcode reader behaves like a keyboard.  OpenSIGL uses a barcode reading component (found in [client/src/modules/templates/bhBarcodeScanner.html](https://github.com/Third-Culture-Software/opensigl/blob/master/client/src/modules/templates/bhBarcodeScanner.html)) to do all the work of reading the barcode.  The barcode reader will return the `uuid` of the record scanned.  It is up to the module's controller to determine what needs to happen next (render a receipt, attach to an object, load the record from the database, etc).

Because a barcode reader behaves like a keyboard, you don't need a barcode reader to fake a barcode read.  Simply copying a string, opening the barcode reading component and pasting (C-V) will trigger the read with the content that you pasted.  This is quite useful during development when barcode readers are not handy.
