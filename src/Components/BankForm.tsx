import { createSignal, createEffect } from 'solid-js'
import { IBankDetail } from '../Types/BankDetail'

const texts = {
    EN: {
        bankForm: 'Bank Form',
        idLabel: 'ID (Max 5 Digits):',
        idPlaceholder: 'Enter ID',
        nameLabel: 'Name:',
        namePlaceholder: 'Enter Name',
        accountNumberLabel: 'Account Number:',
        accountNumberPlaceholder: 'Enter Account Number',
        ifscCodeLabel: 'IFSC Code:',
        ifscCodePlaceholder: 'Enter IFSC Code',
        submit: 'Submit',
    },
    HI: {
        bankForm: 'बैंक फॉर्म',
        idLabel: 'आईडी (अधिकतम 5 अंक):',
        idPlaceholder: 'आईडी दर्ज करें',
        nameLabel: 'नाम:',
        namePlaceholder: 'नाम दर्ज करें',
        accountNumberLabel: 'खाता संख्या:',
        accountNumberPlaceholder: 'खाता संख्या दर्ज करें',
        ifscCodeLabel: 'आईएफएससी कोड:',
        ifscCodePlaceholder: 'आईएफएससी कोड दर्ज करें',
        submit: 'जोड़ें',
    },
}

const language = (localStorage.getItem('language') as 'EN' | 'HI') || 'HI'

const BankDetailsForm = (props: {
    addBankDetail: (detail: IBankDetail) => void
}) => {
    const [id, setId] = createSignal('')
    const [serialNumber, setSerialNumber] = createSignal(1)
    const [name, setName] = createSignal('')
    const [accountNumber, setAccountNumber] = createSignal('')
    const [ifscCode, setIfscCode] = createSignal('')
    const [formData, setFormData] = createSignal<IBankDetail>({
        serialNubmer: 1,
        id: '',
        name: '',
        accountNumber: '',
        ifscCode: '',
    })

    createEffect(() => {
        setFormData({
            serialNubmer: serialNumber(),
            id: id(),
            name: name(),
            accountNumber: accountNumber(),
            ifscCode: ifscCode(),
        })
    })

    const focusNextInput = (e: KeyboardEvent, nextInputId: string | null) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (nextInputId) {
                document.getElementById(nextInputId)?.focus()
            } else {
                ;(
                    document.querySelector(
                        'button[type="submit"]',
                    ) as HTMLButtonElement
                )?.focus()
            }
        }
    }

    const handleSubmit = (e: Event) => {
        e.preventDefault()
        props.addBankDetail(formData())
        setId('')
        setName('')
        setAccountNumber('')
        setIfscCode('')
        setSerialNumber((prev) => prev + 1)
    }

    return (
        <div class="bg-base-300 w-150 rounded-lg px-5">
            <h2 class="mb-4 w-40 text-2xl font-semibold">
                {texts[language].bankForm}
            </h2>
            <div class="p-5">
                <form class="space-y-4" onSubmit={handleSubmit}>
                    {/* ID */}
                    <div class="form-control">
                        <label class="label" for="id">
                            <span class="label-text">
                                {texts[language].idLabel}
                            </span>
                        </label>
                        <input
                            type="number"
                            placeholder={texts[language].idPlaceholder}
                            class="input input-bordered w-full"
                            maxLength="5"
                            min="1"
                            max="99999"
                            required
                            id="id"
                            value={id()}
                            onInput={(e) => setId(e.currentTarget.value)}
                            onKeyDown={(e) => focusNextInput(e, 'name')}
                        />
                    </div>

                    {/* Name */}
                    <div class="form-control">
                        <label class="label" for="name">
                            <span class="label-text">
                                {texts[language].nameLabel}
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={texts[language].namePlaceholder}
                            class="input input-bordered w-full"
                            required
                            id="name"
                            value={name()}
                            onInput={(e) => setName(e.currentTarget.value)}
                            onKeyDown={(e) =>
                                focusNextInput(e, 'accountNumber')
                            }
                        />
                    </div>

                    {/* Account Number */}
                    <div class="form-control">
                        <label class="label" for="accountNumber">
                            <span class="label-text">
                                {texts[language].accountNumberLabel}
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                texts[language].accountNumberPlaceholder
                            }
                            class="input input-bordered w-full"
                            required
                            id="accountNumber"
                            value={accountNumber()}
                            onInput={(e) =>
                                setAccountNumber(e.currentTarget.value)
                            }
                            onKeyDown={(e) => focusNextInput(e, 'ifscCode')}
                        />
                    </div>

                    {/* IFSC Code */}
                    <div class="form-control">
                        <label class="label" for="ifscCode">
                            <span class="label-text">
                                {texts[language].ifscCodeLabel}
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={texts[language].ifscCodePlaceholder}
                            class="input input-bordered w-full"
                            required
                            id="ifscCode"
                            value={ifscCode()}
                            onInput={(e) => setIfscCode(e.currentTarget.value)}
                            onKeyDown={(e) => focusNextInput(e, null)} // Update the last input field to focus the submit button
                        />
                    </div>

                    <button
                        class="btn btn-primary float-end w-full"
                        type="submit"
                    >
                        {texts[language].submit}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default BankDetailsForm