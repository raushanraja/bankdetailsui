import './App.css'
import { A, Route, Router, useLocation } from '@solidjs/router'
import BankDetail from './Components/BankDetail'
import TransactionManager from './Components/TransactionManager'
import { createEffect, createSignal, JSXElement } from 'solid-js'
import ImportBankDetails from './Components/ImportBankDetails'

const BASE_PATH = '/bankdetailsui/'

interface NavigationProps {
    children?: JSXElement
}

const Navigation = (props: NavigationProps) => {
    const location = useLocation()
    const [bankActive, setBankActive] = createSignal(true)

    createEffect(() => {
        setBankActive(location.pathname === `${BASE_PATH}new-bank-transactions`)
    })

    return (
        <>
            <nav class="navbar bg-gray-700 shadow-sm">
                <div class="flex-1">
                    <ImportBankDetails />
                    <span class="m-12 text-xl" />
                    <ul class="menu menu-horizontal rounded-box">
                        <li>
                            <A
                                href={`${BASE_PATH}/`}
                                class={bankActive() ? '' : 'menu-active'}
                            >
                                Bank Details
                            </A>
                        </li>
                        <li>
                            <A
                                href={`${BASE_PATH}new-bank-transactions`}
                                class={bankActive() ? 'menu-active' : ''}
                            >
                                New Bank Transactions
                            </A>
                        </li>
                    </ul>
                </div>
            </nav>
            {props.children}
        </>
    )
}
function App() {
    return (
        <Router root={Navigation}>
            <Route path={`/`} component={BankDetail} />
            <Route path={`${BASE_PATH}/`} component={BankDetail} />
            <Route
                path={`${BASE_PATH}/new-bank-transactions`}
                component={TransactionManager}
            />
        </Router>
    )
}

export default App
