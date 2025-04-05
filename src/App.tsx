import './App.css'
import BankDetail from './Components/BankDetail'
import { BankDetailSaverFactory } from './Services/IBankDetailSaver'

function App() {
  const saver = BankDetailSaverFactory.create('both');
  return <BankDetail saver={saver} />
}

export default App
