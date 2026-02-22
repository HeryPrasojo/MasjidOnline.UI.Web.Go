const moCookie = {};

(() =>
{
    const orientationKey = 'o';
    const userTypeKey = 'u.t';
    const applicationCultureKey = 'l';

    moCookie.getOrientation = () => getCookie(orientationKey);
    moCookie.setOrientation = (o) => setCookie(orientationKey, o);

    moCookie.getUserType = () => getCookie(userTypeKey);
    moCookie.removeUserType = () => removeCookie(userTypeKey);
    moCookie.setUserType = (t) => setCookie(userTypeKey, t);

    moCookie.setApplicationCulture = (c) => setCookie(applicationCultureKey, c);

    function getCookie(key)
    {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith(key + "="))
            ?.split("=")[1];
    }

    function setCookie(key, value, expire)
    {
        var cookie = `${key}=${value}; path=/`;

        if (expire) cookie += `; expires=${expire}`;

        document.cookie = cookie;
    }

    function removeCookie(key)
    {
        setCookie(key, '', 'Thu, 01 Jan 1970 00:00:00 UTC')
    }

})();
