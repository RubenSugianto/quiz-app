import { useState, useEffect } from 'react';

export default function QuestionTimer({ timeout, onTimeout}) {
    const [remainingTime, setRemainingTime] = useState(timeout);

    // ini dikasi use effect karena kalo setRemainingTime diubah,
    // QuestionTimer reexecute, ntar setTimeout jalan lagi
    // disini inget onTimeout menyebabkan error karena function yg di pass itu kan object
    // nah beda beda, makanya di app harus dipasangin useCallback function untuk handleSelectAnswer
    useEffect(() => {
        console.log('SETTING TIMEOUT');
        setTimeout(onTimeout, timeout);
    }, [timeout, onTimeout]);

    // setInterval ada perubahan state dan akan menyebabkan infinite loop, makanya dipakai useEffect
    useEffect(() => {
        console.log('SETTING INTERVAL');
        setInterval(() => {
            setRemainingTime((prevRemainingTime) => prevRemainingTime - 100);
        }, 100);
    }, []);

    return <progress id="question-time" max={timeout} value={remainingTime}/>
}