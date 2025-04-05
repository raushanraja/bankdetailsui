import { Component } from 'solid-js'
import { IBankDetail } from '../Types/BankDetail'

type BankDetailsTableProps = {
    detailsList: IBankDetail[]
    saveBankDetails: () => void
}

const BankDetailsTable: Component<BankDetailsTableProps> = (props) => {
    return (
        <div class='container'>
            <div class="rounded-box border-base-content/5 bg-base-300 border h-[800px]">
                <h2 class="mb-4 text-2xl font-semibold">Bank Details List</h2>
                <table class="table-zebra table w-full">
                    <thead>
                        <tr>
                            <th>SNo.</th> {/* Ensure Serial No. column header is present */}
                            <th>Code</th>
                            <th>Name</th>
                            <th>Account Number</th>
                            <th>IFSC Code</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.detailsList.map((detail) => (
                            <tr>
                                <td>{detail.serialNubmer}</td> {/* Display Serial No. */}
                                <td>{detail.id}</td>
                                <td>{detail.name}</td>
                                <td>{detail.accountNumber}</td>
                                <td>{detail.ifscCode}</td>
                                <td>{detail.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button class="btn btn-primary float-end w-full" onclick={props.saveBankDetails}>
                Save
            </button>
        </div>
    )
}

export default BankDetailsTable
