mo.getCookie = (key) =>
{
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(key + "="))
        ?.split("=")[1];
}

mo.checkCookieExists = (key) =>
{
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies)
    {
        if (cookie.startsWith(key + '=')) return true;
    }

    return false;
}

mo.getElementById = (id) => document.getElementById(id);
