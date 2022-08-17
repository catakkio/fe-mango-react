import React, { useEffect, useState } from 'react'

/**
 * Component that switch from span to input and viceversa and emit the change to his parent
*/
export default function CurrencyInputAndLabelSwitcher(props) {
    const [isInput, setIsInput] = useState(false);

    const switchElementType = () => {
        setIsInput(!isInput)
    }

    const handleInputValChanged = (e) => {
        props.handleInputValChanged(parseInt(e?.target?.value))
    }

    return (
        <>
            <div data-testid="switcherContainer" className='switcher-container' onClick={switchElementType}>
                {isInput ?
                    <input autoFocus className='switcher-input' type="number" value={props.number} onChange={e => handleInputValChanged(e)} alt="switcher-input" /> :
                    <span>{props.number}</span>
                }
                <span>{props.currency}</span>
            </div>
        </>
    )
}
