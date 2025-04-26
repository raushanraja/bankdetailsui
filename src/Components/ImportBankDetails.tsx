import bankDetailsPersistence from "../Services/BankDetailLoader"
import EditableInput from "./EditableInput"

const texts = {
    EN: {
        importBankDetails: 'Import Bank Details!',
        samitiName: 'Samiti Name',
        bankName: 'Bank Name',
        importBankFile: 'Import Bank Details File:',
        import: 'Import',
        noFileSelected: 'No file selected',
        importFailed: 'Failed to import bank details.',
    },
    HI: {
        importBankDetails: 'बैंक विवरण आयात करें!',
        samitiName: 'समिति का नाम',
        bankName: 'बैंक का नाम',
        importBankFile: 'बैंक विवरण फ़ाइल आयात करें:',
        import: 'आयात करें',
        noFileSelected: 'कोई फ़ाइल चयनित नहीं है',
        importFailed: 'बैंक विवरण आयात करने में विफल।',
    },
}

const language = (localStorage.getItem('language') as 'EN' | 'HI') || 'HI'

const ImportBankDetails = () => {
    const handleImport = async () => {
        const modal = document.getElementById(
            'import_modal',
        ) as HTMLDialogElement

        const fileInput = document.querySelector(
            'input[type="file"]',
        ) as HTMLInputElement

        const file = fileInput.files?.[0]
        if (!file) {
            console.error(texts[language].noFileSelected)
            return
        }
        const contents = await file.text()
        const isSavedSuccessfully = bankDetailsPersistence.saveBankDetails(contents)
        if (isSavedSuccessfully) {
            modal.close()
        } else {
            alert(texts[language].importFailed)
        }
    }

    return (
        <dialog id="import_modal" class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-2xl">{texts[language].importBankDetails}</h3>
                <div class="modal-action flex-col gap-8">
                    <div class="grid gap-2">

                        <EditableInput 
                        storageKey="samitiName" 
                        legendString={texts[language].samitiName} 
                        placeholder={texts[language].samitiName}
                        onValueChange={() => { }} />

                        <EditableInput 
                        storageKey="bankName" 
                        legendString={texts[language].bankName} 
                        placeholder={texts[language].bankName}
                        onValueChange={() => { }} />
                    </div>
                    <div>
                        <fieldset class="fieldset">
                            <legend class="fieldset-legend text-lg">{texts[language].importBankFile}</legend>
                        <input
                            name="imported_bank_details_json"
                            type="file"
                            class="file-input file-input-info w-full"
                        />
                        </fieldset>
                        <button class="btn btn-primary float-right my-4 w-30" onClick={handleImport} >
                            {texts[language].import}
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    )
}

export default ImportBankDetails