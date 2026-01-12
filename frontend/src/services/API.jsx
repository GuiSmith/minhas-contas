const apiUrl = import.meta.env.VITE_API_URL ?? "http://beud3c6ko.localto.net/";

const apiOptions = (method, body = null) => {
    const obj = {};

    obj.method = method;
    obj.headers = {
        'Content-Type': 'application/json',
    };
    obj.credentials = 'include';
    if(body !== null){
        obj.body = JSON.stringify(body)
    }

    return obj;
}

export { apiUrl, apiOptions };