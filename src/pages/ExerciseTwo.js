import React, { useEffect, useState } from 'react'
import Range from '../components/Range'

export default function ExerciseTwo() {
    const [rangeValues, setRangeValues] = useState();
    useEffect(() => {

        /**
         * @returns range values retrieved from session storage or from an API 
         *          eg : [1,2,3,5,10] 
         */
        const getRangeValues = async () => {
            const sessionStorageRangeValuesKey = "range_values"

            let rangeValues = sessionStorage.getItem(sessionStorageRangeValuesKey);
            if (rangeValues) return JSON.parse(rangeValues)

            rangeValues = await getRangeValuesFromApi();
            if (!rangeValues) return

            sessionStorage.setItem(sessionStorageRangeValuesKey, JSON.stringify(rangeValues))

            return rangeValues
        }

        /**
         * 
         * @returns range values retrieved from an API
         */
        const getRangeValuesFromApi = async () => {
            const response = await fetch("http://demo3747022.mockable.io/range-values");

            if (response.status !== 200) {
                console.error('Error retrieving range values from the server')
                return
            }

            return (await response.json()).rangeValues
        }

        const initComponent = async () => {
            const rangeValues = await getRangeValues();
            setRangeValues(rangeValues)
        }

        initComponent();
    }, []);

    return (
        <>
            {rangeValues?.length > 0 ?
                <Range rangeValues={rangeValues} onlyPresetValuesSelectable={true} /> :
                null
            }
        </>
    )
}
