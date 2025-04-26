import { createSignal, onMount, Component } from 'solid-js'

interface EditableInputProps {
    storageKey: string
    legendString?: string
    placeholder?: string
    onValueChange: (value: string) => void
}


const texts = {
    "EN": {save: 'Save', edit: 'Edit', placeholderPrefix: 'Enter value for'},
    "HI": {save: 'सहेजें', edit: 'संपादित करें', placeholderPrefix:'इनपुट करें' },
}
const language = (localStorage.getItem('language') as 'EN' | 'HI') || 'HI'

const EditableInput: Component<EditableInputProps> = (props) => {
    const [isEditing, setIsEditing] = createSignal(false)
    const [inputValue, setInputValue] = createSignal('')


    onMount(() => {
        const storedValue = localStorage.getItem(props.storageKey) || ''
        setInputValue(storedValue)
    })

    const handleInput = (event: Event) => {
        const target = event.currentTarget as HTMLInputElement
        const newValue = target.value
        setInputValue(newValue)
        props.onValueChange(newValue)
    }

    const toggleEdit = () => {
        const currentlyEditing = isEditing()
        if (currentlyEditing) {
            localStorage.setItem(props.storageKey, inputValue())
        }
        setIsEditing(!currentlyEditing)
    }

    return (
        <fieldset class="fieldset">
            <legend class="fieldset-legend text-lg">{props.legendString}</legend>
            <div class="flex items-center space-x-2">
                <input
                    type="text"
                    class="input w-full"
                    disabled={!isEditing()}
                    value={inputValue()}
                    onInput={handleInput}
                    placeholder={props.placeholder || `${texts[language].placeholderPrefix} ${props.storageKey}`}
                />
                <button class="btn btn-primary" onClick={toggleEdit}>
                    {isEditing() ? texts[language].save : texts[language].edit}
                </button>
            </div>
        </fieldset>
    )
}

export default EditableInput