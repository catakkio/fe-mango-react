import React, { useEffect, useState } from 'react'
import Range from '../components/Range'

export default function ExerciseOne() {
    const [minLimit, setMinLimit] = useState(0);
    const [maxLimit, setMaxLimit] = useState(0);

    const [limitRetrieved, setMaxLimitRetieved] = useState(false)

    useEffect(() => {
        /**
         * @returns range limits retrieved from session storage or from an API
         *          eg: {min:1, max:100}
         */
        const getRangeLimits = async () => {
            const sessionStorageRangeLimitsKey = "range_limits"

            let rangeLimits = sessionStorage.getItem(sessionStorageRangeLimitsKey);
            if (rangeLimits) return JSON.parse(rangeLimits)

            rangeLimits = await getRangeLimitsFromApi()
            if (!rangeLimits) return

            sessionStorage.setItem(sessionStorageRangeLimitsKey, JSON.stringify(rangeLimits))
            return rangeLimits
        }

        /**
         * 
         * @returns range limits retrieved from an API
         */
        const getRangeLimitsFromApi = async () => {
            const response = await fetch("https://demo2385945.mockable.io/range-limits");

            if (response.status != 200) {
                console.error('Error retrieving range limits from the server. Error handeling not implemented yet')
                return
            }

            return response.json();
        }


        const initComponent = async () => {
            const rangeLimits = await getRangeLimits();
            setMinLimit(rangeLimits.min);
            setMaxLimit(rangeLimits.max);
            setMaxLimitRetieved(true)
        }

        initComponent();
    }, []);

    return (
        <>
            {limitRetrieved ?
                <Range minLimit={minLimit} maxLimit={maxLimit} onlyPresetValuesSelectable={false} />
                : null
            }
        </>
    )
}
