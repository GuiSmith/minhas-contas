const apiUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1/api/";

const apiOptions = (method, body = null) => {
    const obj = {};

    obj.method = method;
    obj.headers = {
        'localtonet-skip-warning': 'true',
        'Content-Type': 'application/json',
    };
    obj.credentials = 'include';
    if(body !== null){
        obj.body = JSON.stringify(body)
    }

    return obj;
}

export { apiUrl, apiOptions };