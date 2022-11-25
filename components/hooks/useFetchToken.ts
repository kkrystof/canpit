import { useEffect, useState } from "react";

export const useFetchToken = (userName: string, roomId: string) => {
    const [data, setData] = useState<object>();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
            fetch('/api/room',{ method: 'post', headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify({userName: userName, roomId: roomId})})
            .then(response => response.json())
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [userName]);

    return [ data, error, loading ];
};