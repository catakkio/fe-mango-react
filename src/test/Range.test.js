import '@testing-library/jest-dom/extend-expect';

const { render, fireEvent } = require('@testing-library/react')
import Range from '../components/Range'

describe('<Range/> common behavior', () => {
    let component;

    let minLimit = 10;
    let maxLimit = 200;

    beforeEach(() => {
        component = render(<Range minLimit={minLimit} maxLimit={maxLimit} onlyPresetValuesSelectable={false} />)
    })


    test('min and max limit are properly displayed when the component is rendered', () => {
        expect(component.container).toHaveTextContent(minLimit)
        expect(component.container).toHaveTextContent(maxLimit)
    })

    test('min bullet has never higher value than max bullet value', async () => {

        let minbullet = document.querySelector('#min-bullet')
        const mouseMovements = [{ offsetX: 0 }, { offsetX: 200 }]

        fireEvent.mouseDown(minbullet, mouseMovements[0])
        fireEvent.mouseMove(minbullet, mouseMovements[1])
        fireEvent.mouseUp(minbullet)

        //unable to properly run this test. To complete
    })



    xtest('when min bullet is moved, the displayed value changes', () => { })
    xtest('when max bullet is moved, the displayed value changes', () => { })
    xtest('min does not overlap max bullet', () => { })
    xtest('max does not overlap max bullet', () => { })

    xtest('if onlyPresetValuesSelectable the only values displayed are the ones in the range values array', () => { })


})
