import { useState, useEffect } from 'react';

export default function QuestionTimer({ timeout, onTimeout}) {
    const [remainingTime, setRemainingTime] = useState(timeout);

    // ini dikasi use effect karena kalo setRemainingTime diubah,
    // , QuestionTimer reexecute, ntar setTimeout jalan lagi
    useEffect(() => {
        setTimeout(onTimeout, timeout);
    }, [timeout, onTimeout]);

    // setInterval ada perubahan state dan akan menyebabkan infinite loop, makanya dipakai useEffect
    useEffect(() => {
        setInterval(() => {
            setRemainingTime((prevRemainingTime) => prevRemainingTime - 100);
        }, 100);
    }, []);

    return <progress id="question-time" max={timeout} value={remainingTime}/>
}