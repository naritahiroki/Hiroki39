const API_BASE_PATH = 'yushi-nishimura'; // ここは変更しなくてよい
const API_BASE_URL = (isLocalHost()) ? `http://127.0.0.1:8000/${API_BASE_PATH}` : `https://gkng4il0w6.execute-api.ap-northeast-1.amazonaws.com/v1/${API_BASE_PATH}`;

function callApi(url, method, data = null) {
    return new Promise((resolve, reject) => {
        getCredentialsByIdentityPool()
            .then((credentials) => {
                // V4クラスのインスタンスを作成
                const req = new AWS.HttpRequest(url, AWS_REGION);
                req.method = method;
                req.headers.host = 'gkng4il0w6.execute-api.ap-northeast-1.amazonaws.com';
                req.body = data ? JSON.stringify(data) : null;

                // SigV4署名
                const signer = new AWS.Signers.V4(req, 'execute-api', true);
                signer.addAuthorization(credentials, AWS.util.date.getDate());

                const headers = req.headers;
                delete headers['host'];

                return axios({
                    url: req.endpoint.href,
                    method: method,
                    data: data,
                    headers: req.headers
                })
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                console.warn('Calling backend API failed.')
                console.error(error);
                reject(error.message)
            })
    });
}

function getDatetime() {
    const url = `${API_BASE_URL}/datetime`;

    callApi(url, 'GET')
        .then((res) => {
            document.getElementById('gotDatetime').innerText = '現在の時刻: ' + res.datetime
        })
}

