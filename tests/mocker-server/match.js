const url = require('url');

module.exports = matcher = (routers, req) => {

    const result = Object.entries(routers).map(([urlMapped, handler]) => {
        const parsedUrl = url.parse(req.url, true)
        const pathUrlSanitize = parsedUrl.pathname.split("/").slice(1)
        const urlMappedSanitize = urlMapped.slice(1)

        const isUrlValid = pathUrlSanitize.some(v => urlMappedSanitize.split("/").length === pathUrlSanitize.length && urlMappedSanitize.split("/").includes(v))
        if(!isUrlValid) return

        if (!pathUrlSanitize.length || pathUrlSanitize.length === 1)
            return { params: {}, query: parsedUrl.query, handler}

        const getPathParams = pathUrlSanitize
            .reduce((acc, current, index, arr) => {
                if (index % 2 === 0) {
                    acc[current] = arr[index + 1];
                }
                return acc;
            }, {});

        return { params: getPathParams, query: parsedUrl.query, handler }
    }) || []

    const sanitaze = result.filter(Boolean)
    if (!sanitaze.length) {
        return { valid: false, handler: () => {}};
    }

    const [data] = sanitaze
    req.pathParam = data.params
    req.query = data.query

    return { valid: true, handler: data.handler }
};