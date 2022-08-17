import CurrencyInputAndLabelSwitcher from '../components/CurrencyInputAndLabelSwitcher'
const { render, fireEvent } = require('@testing-library/react')
import '@testing-library/jest-dom/extend-expect';

describe('<CurrencyInputAndLabelSwitcher/> input and span behavior', () => {

    let component;
    let mockHandler = jest.fn();

    const INPUT_ALT = 'switcher-input'
    const COMPONENT_CONTAINER_ID = 'switcherContainer'

    const switchSpanToInput = () => {
        const clickableDiv = component.getByTestId(COMPONENT_CONTAINER_ID)
        fireEvent.click(clickableDiv)
    }

    beforeEach(() => {
        component = render(<CurrencyInputAndLabelSwitcher number={10} currency={'$'} handleInputValChanged={mockHandler} />)
    })

    test('the component renders a span with number and currency by default', () => {
        expect(component.container).toHaveTextContent('10$')
    })


    test('the user can switch span to input clicking on the component', () => {
        switchSpanToInput();
        expect(component.container).not.toHaveTextContent('10$')
        expect(component.getByAltText(INPUT_ALT)).not.toBe(null)
    })

    test('emits the numbers changes to his parent', () => {
        const NEW_INPUT_VALUE = 55
        switchSpanToInput();
        const input = component.getByAltText(INPUT_ALT);
        fireEvent.change(input, { target: { value: NEW_INPUT_VALUE } })
        expect(mockHandler).toHaveBeenCalled()
        // The first arg of the last call to the mock function was 55
        expect(mockHandler.mock.calls[0][0]).toBe(NEW_INPUT_VALUE)
    })
})

