import { ITransactionDetail } from '../Types/TransactionDetail'

interface TransactionPDFProps {
    transactionDetails: ITransactionDetail[]
    accountNumber: string
    checkNumber: string
    samitiName?: string
    bankName?: string
    heading?: string
    border?: boolean
}

const TransactionPDFPrint = (props: TransactionPDFProps) => {
    // Show a popup and ask for account number and check Number
    const { transactionDetails, accountNumber, checkNumber, samitiName, bankName } = props

    const win = window.open('', '_blank')
    if (!win) return

    // CSS using Flexbox structure
    const flexStyle = `
            *{
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body { font-family: sans-serif; }

            .main-header {
                text-align: right;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 2em; /* Space between header and table */
            }

            .pdf-container {
                display: flex;
                flex-direction: column;
                width: 90%; /* Adjust width as needed for screen */
                border: 1px solid #000;
                margin: 2em auto; /* Center container */
            }
            .pdf-row {
                display: flex;
                border: 1px solid #000;
                boder-bottom: 1px solid #000; /* Bottom border for each row */
            }
            .pdf-container > .pdf-row:last-child {
                border-bottom: none; /* Remove bottom border from last row */
            }
            .pdf-cell, .pdf-header-cell {
                flex: 1 1 0; /* Default: equal width */
                border-right: 1px solid #000;
                padding: 8px;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }
            .pdf-row > .pdf-cell:last-child,
            .pdf-row > .pdf-header-cell:last-child {
                border-right: none; /* Remove right border from last cell in row */
            }
            .pdf-header-row {
                font-weight: bold;
                border: 2px solid #000 !important;
                border-bottom: 1px solid #000 !important; /* Bottom border for header */
            }
            @media print {
                body {
                    width: 100%; /* Ensure body takes full width */
                    padding: 5mm; /* Add padding around the entire document */
                }
                .pdf-container {
                    width: 100%;
                    height: auto; /* Allow height to adjust */
                    border: 1px solid #000; /* Add border to container */
                    margin: 0;
                    padding: 0; /* Reset padding */
                    overflow: visible; /* Allow content to flow */
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                    background-color: white;
                }
                .pdf-row {
                    page-break-inside: avoid; /* Prevent rows from breaking */
                    border: 1px solid #000 !important; /* Ensure bottom border prints */
                    display: flex; /* Ensure flex display in print */
                    height:31px; /* Fixed row height */
                    box-sizing: border-box;
                    width: 100%;
                }
                 /* Header repetition is unreliable with flex, this won't work like thead */
                .pdf-header-row {
                   font-weight: bold;
                   -webkit-print-color-adjust: exact;
                   print-color-adjust: exact;
                   height: 31px; /* Fixed row height */
                   box-sizing: border-box;
                   width: 100%;
                   border: 2px solid #000 !important;
                   border-bottom: 1px solid #000 !important; /* Bottom border for header */
                   /* display: block; or display: flex; - no standard way to repeat */
                }
                 /* First Row Styling  */
                 .pdf-container > .pdf-row:first-child{
                  border-top: 0px solid #000 !important;
                 }

                /* Last Row Styling */
                .pdf-container > .pdf-row:last-child{
                    border: 1px solid #000 !important; /* Ensure bottom border prints */
                 }

                .pdf-cell, .pdf-header-cell {
                    border: none; /* Remove individual borders initially */
                    border-right: 1px solid #000 !important; /* Add back right border */
                    padding: 5px;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    vertical-align: top;
                    flex: 1 1 0; /* Ensure flex properties apply */
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    font-size: 9pt;
                    line-height: 1.2;
                     box-sizing: border-box;
                }

                 /* Remove right border for the last cell in any row */
                .pdf-row > .pdf-cell:last-child,
                .pdf-row > .pdf-header-cell:last-child {
                    border-right: none !important;
                }

                /* --- Set width for the first column (ID) --- */
                .pdf-header-cell:first-child,
                .pdf-cell:first-child {
                    flex: 0 0 8%; /* Fixed width, don't grow or shrink */
                    width: 8%; /* Explicit width */
                }
                h1 {
                    page-break-after: avoid;
                    margin: 0 0 1em 0;
                    font-size: 14pt;
                }

                .page-break {
                    page-break-before: always;
                }
            }
        `

    // HTML generation using div elements
    const headerRow = `
            <div class="pdf-row pdf-header-row">
                <div class="pdf-header-cell">ID</div>
                <div class="pdf-header-cell">Name</div>
                <div class="pdf-header-cell">Account Number</div>
                <div class="pdf-header-cell">IFSC Code</div>
                <div class="pdf-header-cell">Amount</div>
            </div>
        `

    const rowsPerPage = 21 // Adjust based on your A4 margins and row height

    let pageHeading = '<div class="main-header">'
    pageHeading += `<div>${bankName ?? '&nbsp;'}</div>`
    pageHeading += `<div>${samitiName ?? '&nbsp;'}</div>`
    pageHeading += ` <div>खाता संख्या : ${accountNumber?.trim() || '&nbsp;'.repeat(60)},  चेक संख्या : ${checkNumber?.trim() || '&nbsp;'.repeat(30)}</div> </div> `

    let dataRows = ''
    for (let i = 0; i < transactionDetails.length; i++) {
        if (i % rowsPerPage === 0) {
            if (dataRows !== '') {
                dataRows += `</div>` // Close previous page container
                dataRows += `<div class="page-break"></div>${pageHeading}${headerRow}` //insert header and heading again
                dataRows += `<div class="pdf-container">`
            } else {
                dataRows += `${pageHeading}${headerRow}` //insert header and heading again
                dataRows += `<div class="pdf-container">`
            }
        }
        const item = transactionDetails[i]
        dataRows += `
                <div class="pdf-row">
                    <div class="pdf-cell">${item.id}</div>
                    <div class="pdf-cell">${item.name}</div>
                    <div class="pdf-cell">${item.accountNumber}</div>
                    <div class="pdf-cell">${item.ifscCode}</div>
                    <div class="pdf-cell">${item.amount}</div>
                </div>
            `
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Transaction Details</title>
            <style>${flexStyle}</style>
        </head>
        <body>
            ${dataRows}
        </body>
        </html>
    `
    win.document.write(htmlContent)
    win.document.close()
    win.focus()
    return null
}

export default TransactionPDFPrint
