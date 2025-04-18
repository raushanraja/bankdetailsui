import { createSignal } from 'solid-js'
import { ITransactionDetail } from '../Types/TransactionDetail'

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

    const fetchUserDetails = async (id: string) => {
        if (!manualEntry()) {
            // Simulate fetching user details from the backend
            const response = await fetch(`/api/user/${id}`)
            if (response.ok) {
                const data = await response.json()
                setName(data.name)
                setAccountNumber(data.accountNumber)
                setIfscCode(data.ifscCode)
            } else {
                alert('User not found')
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

    const handleSubmit = (e: Event) => {
        e.preventDefault()
        if (props.usedIds.has(id())) {
            alert('This ID has already been used for a transaction.')
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
        setName('')
        setAccountNumber('')
        setIfscCode('')
        setAmount('')
    }

    return (
        <div class="bg-base-300 w-150 rounded-lg px-5">
            <h2 class="mb-4 w-40 text-2xl font-semibold">Add</h2>
            <div class="p-5">
                <form class="space-y-4" onSubmit={handleSubmit}>
                    {/* Toggle Manual Entry */}
                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <span class="label-text">Manual Entry</span>
                            <input
                                type="checkbox"
                                class="toggle toggle-primary"
                                checked={manualEntry()}
                                onChange={() => setManualEntry(!manualEntry())}
                            />
                        </label>
                    </div>

                    {/* ID */}
                    <div class="form-control">
                        <label class="label" for="id">
                            <span class="label-text">ID:</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter ID"
                            class="input input-bordered w-full"
                            required
                            id="id"
                            value={id()}
                            onInput={(e) => setId(e.currentTarget.value)}
                            onBlur={() => fetchUserDetails(id())}
                        />
                    </div>

                    {/* Name */}
                    <div class="form-control">
                        <label class="label" for="name">
                            <span class="label-text">Name:</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Name"
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

                    {/* Account Number */}
                    <div class="form-control">
                        <label class="label" for="accountNumber">
                            <span class="label-text">Account Number:</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Account Number"
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

                    {/* IFSC Code */}
                    <div class="form-control">
                        <label class="label" for="ifscCode">
                            <span class="label-text">IFSC Code:</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter IFSC Code"
                            class="input input-bordered w-full"
                            required
                            id="ifscCode"
                            value={ifscCode()}
                            onInput={(e) => setIfscCode(e.currentTarget.value)}
                            onKeyDown={(e) => focusNextInput(e, 'amount')}
                            disabled={!manualEntry()}
                        />
                    </div>

                    {/* Amount */}
                    <div class="form-control">
                        <label class="label" for="amount">
                            <span class="label-text">Amount:</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter Amount"
                            class="input input-bordered w-full"
                            required
                            id="amount"
                            value={amount()}
                            onInput={(e) => setAmount(e.currentTarget.value)}
                            onKeyDown={(e) => focusNextInput(e, null)}
                        />
                    </div>

                    {/* Submit Button */}
                    <div class="form-control mt-6">
                        <button type="submit" class="btn btn-primary w-full">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TransactionForm
