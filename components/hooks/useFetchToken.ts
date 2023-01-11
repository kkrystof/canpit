import { useEffect, useState } from "react";

type dataType = {
    token?: string,
    error?: string,
}

export const useFetchToken = (tokenQuery: string,userName: string | undefined, roomId: string | string[]) => {
    const [data, setData] = useState<dataType>();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if(tokenQuery){
            setData({token: tokenQuery});
            setLoading(false)

        }else if(userName !== '' || userName == undefined){

            setLoading(true);
            fetch('/api/room',{ method: 'post', headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify({userName: userName, roomId: roomId})})
            .then(response => response.json())
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
            
            
        }
            
    }, [userName]);

    return [ data, error, loading ];
};