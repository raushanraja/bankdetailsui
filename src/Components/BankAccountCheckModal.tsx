/* eslint-disable @typescript-eslint/no-explicit-any */
const texts = {
    EN: {
        modalTitle: 'Account / Check Number!',
        accountNumberLabel: 'Account Number:',
        accountNumberPlaceholder: 'Enter Account Number',
        checkNumberLabel: 'Check Number:',
        checkNumberPlaceholder: 'Enter Check Number',
        saveButton: 'Save',
    },
    HI: {
        modalTitle: 'खाता / चेक नंबर!',
        accountNumberLabel: 'खाता नंबर:',
        accountNumberPlaceholder: 'खाता नंबर दर्ज करें',
        checkNumberLabel: 'चेक नंबर:',
        checkNumberPlaceholder: 'चेक नंबर दर्ज करें',
        saveButton: 'सेव करें',
    },
}

const language = (localStorage.getItem('language') as 'EN' | 'HI') || 'HI'

const AccoundDetails = (props: {
    accountNumber: () => string
    setAccountNumber: (value: string) => void
    checkNumber: () => string
    setCheckNumber: (value: string) => void
}) => {
    const handleAccountNumberInput = (event: { currentTarget: { value: any } }) => {
        const value = event.currentTarget.value
        props.setAccountNumber(value)
    }

    const handleCheckNumberInput = (event: { currentTarget: { value: any } }) => {
        const value = event.currentTarget.value
        props.setCheckNumber(value)
    }

    const handleSaveButtonClick = () => {
        const modal = document.getElementById('account_modal') as HTMLDialogElement
        modal.close()
    }

    return (
        <dialog id="account_modal" class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-2xl">{texts[language].modalTitle}</h3>
                <div class="modal-action flex-col gap-8">
                    <div class="grid gap-2">
                        <fieldset class="fieldset">
                            <legend class="fieldset-legend text-lg">
                                {texts[language].accountNumberLabel}
                            </legend>
                            <input
                                type="text"
                                class="input w-full"
                                value={props.accountNumber()}
                                onInput={handleAccountNumberInput}
                                placeholder={texts[language].accountNumberPlaceholder}
                            />
                        </fieldset>

                        <fieldset class="fieldset">
                            <legend class="fieldset-legend text-lg">
                                {texts[language].checkNumberLabel}
                            </legend>
                            <input
                                type="text"
                                class="input w-full"
                                value={props.checkNumber()}
                                onInput={handleCheckNumberInput}
                                placeholder={texts[language].checkNumberPlaceholder}
                            />
                        </fieldset>
                        <div>
                            <button
                                class="btn btn-primary float-right my-4 w-30"
                                onClick={handleSaveButtonClick}
                            >
                                {texts[language].saveButton}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    )
}

export default AccoundDetails