export function getHeaderConfig(contentType){
    if (contentType == null) {
        contentType = 'application/json';
    }
    let config = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem(import.meta.env.VITE_TOKEN_NAME),
            'content-type': contentType
        }
    }
    return config;
}