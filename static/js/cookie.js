const moCookie = {};

(() =>
{
    const applicationCultureKey = 'l';
    const orientationKey = 'o';
    const permissionAccountancyExpenditureAddKey = 'p.ae.ad';
    const permissionAccountancyExpenditureApproveKey = 'p.ae.ap';
    const permissionInfaqStatusApproveKey = 'p.ii.ap';
    const permissionInfaqStatusRequestKey = 'p.ii.re';
    const permissionUserInternalAddKey = 'p.ui.ad';
    const permissionUserInternalApproveKey = 'p.ui.ap';
    const permissionUserInternalPermissionUpdateKey = 'p.ui.pu';
    const userTypeKey = 'u.t';

    moCookie.setApplicationCulture = (c) => setCookie(applicationCultureKey, c);

    moCookie.getOrientation = () => getCookie(orientationKey);
    moCookie.setOrientation = (o) => setCookie(orientationKey, o);

    moCookie.removePermission = () =>
    {
        removeCookie(permissionAccountancyExpenditureAddKey);
        removeCookie(permissionAccountancyExpenditureApproveKey);
        removeCookie(permissionInfaqStatusApproveKey);
        removeCookie(permissionInfaqStatusRequestKey);
        removeCookie(permissionUserInternalAddKey);
        removeCookie(permissionUserInternalApproveKey);
        removeCookie(permissionUserInternalPermissionUpdateKey);
    }
    moCookie.setPermission = (p) =>
    {
        if (p.AccountancyExpenditureAdd) setCookie(permissionAccountancyExpenditureAddKey, 1);
        if (p.AccountancyExpenditureApprove) setCookie(permissionAccountancyExpenditureApproveKey, 1);
        if (p.InfaqStatusApprove) setCookie(permissionInfaqStatusApproveKey, 1);
        if (p.InfaqStatusRequest) setCookie(permissionInfaqStatusRequestKey, 1);
        if (p.UserInternalAdd) setCookie(permissionUserInternalAddKey, 1);
        if (p.UserInternalApprove) setCookie(permissionUserInternalApproveKey, 1);
        if (p.UserInternalPermissionUpdate) setCookie(permissionUserInternalPermissionUpdateKey, 1);
    }

    moCookie.getUserType = () => getCookie(userTypeKey);
    moCookie.removeUserType = () => removeCookie(userTypeKey);
    moCookie.setUserType = (t) => setCookie(userTypeKey, t);

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
