
import React, { useState, useEffect, handleEvent, useRef } from 'react'
import CurrencyInputAndLabelSwitcher from './CurrencyInputAndLabelSwitcher'

export default function Range(props) {
    const [selectedMin, setSelectedMin] = useState(props.minLimit);
    const [selectedMax, setSelectedMax] = useState(props.maxLimit);

    const [rangeValues, setRangeValues] = useState(props.rangeValues); // eg. [1,2,5,10]

    // references to dom objects
    const [sliderRef, setSliderRef] = useState(useRef(null))
    const [bulletMinRef, setBulletMinRef] = useState(useRef(null))
    const [bulletMaxRef, setBulletMaxRef] = useState(useRef(null))

    const [componentAlreadyLoaded, setComponentAlreadyLoaded] = useState(false);

    useEffect(() => {
        const initializeComponent = !componentAlreadyLoaded &&
            (props.maxLimit > 0 || (props.onlyPresetValuesSelectable && rangeValues?.length > 0))
            && sliderRef?.current

        const handleMinBullet = () => {
            const bulletMin = bulletMinRef.current;
            if (bulletMin) bulletMin.onmousedown = () => { handleBullet(bulletMin, true) }
        }

        const handleMaxBullet = () => {
            const bulletMax = bulletMaxRef.current;
            if (bulletMax) bulletMax.onmousedown = () => { handleBullet(bulletMax, false) }
        }

        if (initializeComponent) { initComponentValues() }
        handleMinBullet();
        handleMaxBullet();
    });

    /**
     * Set the values when the range component is loaded
     */
    const initComponentValues = () => {
        bulletMaxRef.current.style.left = sliderRef.current.offsetWidth + 'px';

        setSelectedMin(props.onlyPresetValuesSelectable ? rangeValues[0] : props.minLimit);
        setSelectedMax(props.onlyPresetValuesSelectable ? getMaxValueFromRangeValues() : props.maxLimit);

        setComponentAlreadyLoaded(true);
    }

    /**
     * Handle bullet and calculates his position on the page
     * 
     * @param bullet reference of the bullet to handle 
     * @param isMinBullet boolean used to differentiate min and max bullet
     */
    const handleBullet = (bullet, isMinBullet) => {

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Controls the bullet after the mouse has been clicked and while the mouse is moving
        function onMouseMove(event) {
            const bulletWidth = bullet.offsetWidth;
            const bulletRadius = bulletWidth / 2

            let newLeft = event.clientX - sliderRef.current.offsetLeft;
            if (newLeft < 0) { newLeft = 0; }  // the pointer is out of slider ? => set the bullet at the beginning
            if (!isMinBullet) {
                const leftEdge = parseInt(bulletMinRef.current.style.left.replace('px', ''))
                if (newLeft < leftEdge) { newLeft = leftEdge + bulletRadius; }
            }

            const rightEdge = getRightEdge(isMinBullet);
            if (newLeft > rightEdge) { newLeft = rightEdge - bulletRadius; }  // the pointer is out of slider? => set the bullet at the end

            let bulletValue = getBulletValueRelativeToHisCoordinatesInSlideBar(newLeft, bullet);
            if (bulletValue > props.maxLimit) { bulletValue = props.maxLimit }

            setBulletsBasedOnValue(bulletValue, isMinBullet);
            setBulletLeftStyle(bullet, newLeft);
        }

        // Remove events listener once the mouse is released
        function onMouseUp() {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        }
    }

    const setBulletLeftStyle = (bullet, leftNumericValue) => bullet.style.left = leftNumericValue + 'px';

    /**
     * Set bullets on the page based on their value
     * 
     * @param bulletValue the bullet value ( eg. 230 ) inside the range
     * @param isMinBullet boolean used to differentiate min and max bullet
     */
    const setBulletsBasedOnValue = (bulletValue, isMinBullet) => {
        if (props.onlyPresetValuesSelectable) {
            isMinBullet ? setSelectedMin(getClosestNumberInRangeValues(bulletValue, rangeValues)) : setSelectedMax(getClosestNumberInRangeValues(bulletValue, rangeValues))
        } else {
            isMinBullet ? setSelectedMin(bulletValue) : setSelectedMax(bulletValue);
        }
    }

    /**
     * 
     * @param goal the number of which find the closest value in the range
     * @param arr the array in which find the closest number
     * @returns 
     */
    const getClosestNumberInRangeValues = (goal, arr) => {
        return arr.reduce(function (prev, curr) {
            return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
        });
    }

    /**
     * 
     * @param isMinBullet boolean used to differentiate min and max bullet
     * @returns right edge value as number eg:200 
     */
    const getRightEdge = (isMinBullet) => {
        const sliderWidth = sliderRef.current.offsetWidth;
        return isMinBullet ?
            parseInt(bulletMaxRef.current.style.left.replace('px', '')) :
            sliderWidth;
    }

    /**
     * Calculate bullet value based on his coordinates in the slide bar
     * @param {*} newLeft 
     * @param bullet reference of the bullet of which to calculate the value
     * @returns 
     */
    const getBulletValueRelativeToHisCoordinatesInSlideBar = (newLeft, bullet) => {
        const sliderWidth = sliderRef.current.offsetWidth;
        const bulletWidth = bullet.offsetWidth;
        const maxLimit = props.onlyPresetValuesSelectable ? getMaxValueFromRangeValues() : props.maxLimit;

        return parseInt(newLeft / (sliderWidth - bulletWidth) * maxLimit);
    }

    /**
     * Set bullet position using his value
     * @param bullet reference of the bullet to set
     * @param value value of the bullet
     */
    const setBulletPositionBasedOnValue = (bullet, value) => {
        const sliderWidth = sliderRef.current.offsetWidth;
        const bulletWidth = bullet.offsetWidth

        const oneUnit = (sliderWidth - bulletWidth) / props.maxLimit;
        const newLeft = oneUnit * value

        setBulletLeftStyle(bullet, newLeft);
    }

    /**
     * @returns the max value inside the range.
     * Actually the max value is the last element of the range values.
     */
    const getMaxValueFromRangeValues = () => {
        return rangeValues[rangeValues.length - 1];
    }

    ////// Funciton used only for range with input currencies//////
    const handleInputMinChanged = (newMin) => {
        const newMinValid = newMin >= props.minLimit && newMin <= selectedMax;
        if (newMinValid) {
            setSelectedMin(newMin)
            setBulletPositionBasedOnValue(bulletMinRef.current, newMin)
        }
    }
    ////// Funciton used only for range with input currencies//////
    const handleInputMaxChanged = (newMax) => {
        const newMaxValid = newMax <= props.maxLimit && newMax >= selectedMin;
        if (newMaxValid) {
            setSelectedMax(newMax)
            setBulletPositionBasedOnValue(bulletMaxRef.current, newMax)
        }
    }

    return (
        <>
            <div className="range-container">
                {props.onlyPresetValuesSelectable ?
                    <span>{selectedMin}{props.currency}</span> :
                    <CurrencyInputAndLabelSwitcher number={selectedMin} currency={props.currency} handleInputValChanged={handleInputMinChanged} />
                }
                <div ref={sliderRef} id="slider" className="slider" >
                    <div ref={bulletMinRef} id="min-bullet" draggable="false" className={`bullet ${props.onlyPresetValuesSelectable ? '' : 'grabbable-bullet'}`} ></div>
                    <div ref={bulletMaxRef} id="max-bullet" draggable="false" className={`bullet bullet-higher-range ${props.onlyPresetValuesSelectable ? '' : 'grabbable-bullet'}`}></div>
                </div>
                {
                    props.onlyPresetValuesSelectable ?
                        <span style={{ marginLeft: '15px' }}>{selectedMax}{props.currency}</span> :
                        <CurrencyInputAndLabelSwitcher number={selectedMax} currency={props.currency} handleInputValChanged={handleInputMaxChanged} />
                }
            </div>
        </>
    )
}

