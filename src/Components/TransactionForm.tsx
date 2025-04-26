import { createSignal } from 'solid-js'
import { ITransactionDetail } from '../Types/TransactionDetail'
import { getAllBankDetails, BankDetails } from '../Services/BankDetailLoader'

const texts = {
    EN: {
        manualEntry: 'Manual Entry',
        id: 'ID:',
        name: 'Name:',
        accountNumber: 'Account Number:',
        ifscCode: 'IFSC Code:',
        amount: 'Amount:',
        enterId: 'Enter ID',
        enterName: 'Enter Name',
        enterAccountNumber: 'Enter Account Number',
        enterIfscCode: 'Enter IFSC Code',
        enterAmount: 'Enter Amount',
        submit: 'Submit',
        idUsedAlert: 'This ID has already been used for a transaction.',
        addNewTransaction: 'Add New Transaction',
    },
    HI: {
        manualEntry: 'मैनुअल प्रविष्टि',
        id: 'आईडी:',
        name: 'नाम:',
        accountNumber: 'खाता संख्या:',
        ifscCode: 'आईएफएससी कोड:',
        amount: 'राशि:',
        enterId: 'आईडी दर्ज करें',
        enterName: 'नाम दर्ज करें',
        enterAccountNumber: 'खाता संख्या दर्ज करें',
        enterIfscCode: 'आईएफएससी कोड दर्ज करें',
        enterAmount: 'राशि दर्ज करें',
        submit: 'जोड़ें',
        idUsedAlert: 'यह आईडी पहले ही लेन-देन के लिए उपयोग की जा चुकी है।',
        addNewTransaction: 'नया लेन-देन जोड़ें',
    },
}

const language = (localStorage.getItem('language') as 'EN' | 'HI') || 'HI'

const TransactionForm = (props: {
    addTransaction: (detail: ITransactionDetail) => void
    usedIds: Set<string>
}) => {
    const [id, setId] = createSignal('')
    const [name, setName] = createSignal('')
    const [accountNumber, setAccountNumber] = createSignal('')
    const [ifscCode, setIfscCode] = createSignal('')
    const [amount, setAmount] = createSignal('')
    const [manualEntry, setManualEntry] = createSignal(false)
    const [bankDetails] = createSignal<Record<number, BankDetails>>(
        Object.fromEntries(getAllBankDetails().map((b) => [b.id, b])),
    )

    const clearForm = () => {
        setName('')
        setAccountNumber('')
        setIfscCode('')
    }

    const fetchUserDetails = async (id: string) => {
        if (!id) {
            return
        }

        const parsedId = parseInt(id)
        if (!manualEntry()) {
            const found = bankDetails()[parsedId]
            if (found) {
                setName(found.name)
                setAccountNumber(found.accountNumber)
                setIfscCode(found.ifscCode)
            } else {
                clearForm()
            }
        }
    }

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

    const showImportModal = () => {
        const modal = document.getElementById(
            'import_modal',
        ) as HTMLDialogElement
        modal.showModal()
    }

    const handleSubmit = (e: Event) => {
        e.preventDefault()
        if (props.usedIds.has(id())) {
            alert(texts[language].idUsedAlert)
            return
        }
        props.addTransaction({
            id: id(),
            name: name(),
            accountNumber: accountNumber(),
            ifscCode: ifscCode(),
            amount: amount(),
        })
        setId('')
        clearForm()
        setAmount('')
    }

    return (
        <div class="bg-base-300 w-150 rounded-lg px-5">
            <div class="flex justify-between">
                <h2 class="mb-4 w-40 text-2xl font-semibold">
                    {texts[language].addNewTransaction}
                </h2>
                <div class="cursor-pointer" onclick={() => showImportModal()}>
                    <svg
                        fill="none"
                        stroke-width="2"
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-package-import"
                        width="2em"
                        height="2em"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        style="overflow: visible; color: currentcolor;"
                    >
                        <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                        ></path>
                        <path d="M12 21l-8 -4.5v-9l8 -4.5l8 4.5v4.5"></path>
                        <path d="M12 12l8 -4.5"></path>
                        <path d="M12 12v9"></path>
                        <path d="M12 12l-8 -4.5"></path>
                        <path d="M22 18h-7"></path>
                        <path d="M18 15l-3 3l3 3"></path>
                    </svg>
                </div>
            </div>
            <div class="p-5">
                <form class="space-y-4" onSubmit={handleSubmit}>
                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <span class="label-text">
                                {texts[language].manualEntry}
                            </span>
                            <input
                                type="checkbox"
                                class="toggle toggle-primary"
                                checked={manualEntry()}
                                onChange={() => setManualEntry(!manualEntry())}
                            />
                        </label>
                    </div>

                    <div class="form-control">
                        <label class="label" for="id">
                            <span class="label-text">{texts[language].id}</span>
                        </label>
                        <input
                            type="text"
                            placeholder={texts[language].enterId}
                            class="input input-bordered w-full"
                            required
                            id="id"
                            value={id()}
                            onInput={(e) => setId(e.currentTarget.value)}
                            onBlur={() => fetchUserDetails(id())}
                        />
                    </div>

                    <div class="form-control">
                        <label class="label" for="name">
                            <span class="label-text">
                                {texts[language].name}
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={texts[language].enterName}
                            class="input input-bordered w-full"
                            required
                            id="name"
                            value={name()}
                            onInput={(e) => setName(e.currentTarget.value)}
                            onKeyDown={(e) =>
                                focusNextInput(e, 'accountNumber')
                            }
                            disabled={!manualEntry()}
                        />
                    </div>

                    <div class="form-control">
                        <label class="label" for="accountNumber">
                            <span class="label-text">
                                {texts[language].accountNumber}
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={texts[language].enterAccountNumber}
                            class="input input-bordered w-full"
                            required
                            id="accountNumber"
                            value={accountNumber()}
                            onInput={(e) =>
                                setAccountNumber(e.currentTarget.value)
                            }
                            onKeyDown={(e) => focusNextInput(e, 'ifscCode')}
                            disabled={!manualEntry()}
                        />
                    </div>

                    <div class="form-control">
                        <label class="label" for="ifscCode">
                            <span class="label-text">
                                {texts[language].ifscCode}
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={texts[language].enterIfscCode}
                            class="input input-bordered w-full"
                            required
                            id="ifscCode"
                            value={ifscCode()}
                            onInput={(e) => setIfscCode(e.currentTarget.value)}
                            onKeyDown={(e) => focusNextInput(e, 'amount')}
                            disabled={!manualEntry()}
                        />
                    </div>

                    <div class="form-control">
                        <label class="label" for="amount">
                            <span class="label-text">
                                {texts[language].amount}
                            </span>
                        </label>
                        <input
                            type="number"
                            placeholder={texts[language].enterAmount}
                            class="input input-bordered w-full"
                            required
                            id="amount"
                            value={amount()}
                            onInput={(e) => setAmount(e.currentTarget.value)}
                            onKeyDown={(e) => focusNextInput(e, null)}
                        />
                    </div>

                    <div class="form-control mt-6">
                        <button type="submit" class="btn btn-primary w-full">
                            {texts[language].submit}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TransactionForm

