const moCookie = {};

(() =>
{
    const applicationCultureKey = 'l';
    const orientationKey = 'o';
    const permissionAccountancyExpenditureAddKey = 'p.ae.ad';
    const permissionAccountancyExpenditureApproveKey = 'p.ae.ap';
    const permissionDonationStatusApproveKey = 'p.ii.ap';
    const permissionDonationStatusRequestKey = 'p.ii.re';
    const permissionUserInternalAddKey = 'p.ui.ad';
    const permissionUserInternalApproveKey = 'p.ui.ap';
    const permissionUserInternalPermissionUpdateKey = 'p.ui.pu';
    const personNameKey = 'pn.n';
    const userIdKey = 'u.i';
    const userTypeKey = 'u.t';

    moCookie.getApplicationCulture = () => getCookie(applicationCultureKey);
    moCookie.setApplicationCulture = (c) => setCookie(applicationCultureKey, c);

    moCookie.getOrientation = () => getCookie(orientationKey);
    moCookie.setOrientation = (o) => setCookie(orientationKey, o);

    moCookie.removePermission = () =>
    {
        removeCookie(permissionAccountancyExpenditureAddKey);
        removeCookie(permissionAccountancyExpenditureApproveKey);
        removeCookie(permissionDonationStatusApproveKey);
        removeCookie(permissionDonationStatusRequestKey);
        removeCookie(permissionUserInternalAddKey);
        removeCookie(permissionUserInternalApproveKey);
        removeCookie(permissionUserInternalPermissionUpdateKey);
    }
    moCookie.setPermission = (p) =>
    {
        if (p)
        {
            if (p.AccountancyExpenditureAdd) setCookie(permissionAccountancyExpenditureAddKey, 1);
            if (p.AccountancyExpenditureApprove) setCookie(permissionAccountancyExpenditureApproveKey, 1);
            if (p.DonationStatusApprove) setCookie(permissionDonationStatusApproveKey, 1);
            if (p.DonationStatusRequest) setCookie(permissionDonationStatusRequestKey, 1);
            if (p.UserInternalAdd) setCookie(permissionUserInternalAddKey, 1);
            if (p.UserInternalApprove) setCookie(permissionUserInternalApproveKey, 1);
            if (p.UserInternalPermissionUpdate) setCookie(permissionUserInternalPermissionUpdateKey, 1);
        }
    }

    moCookie.getPersonName = () => getCookie(personNameKey);
    moCookie.removePersonName = () => removeCookie(personNameKey);
    moCookie.setPersonName = (n) => setCookie(personNameKey, n);

    moCookie.getUserId = () => getCookie(userIdKey);
    moCookie.removeUserId = () => removeCookie(userIdKey);
    moCookie.setUserId = (i) => setCookie(userIdKey, i);

    moCookie.getUserType = () => getCookie(userTypeKey);
    moCookie.removeUserType = () => removeCookie(userTypeKey);
    moCookie.setUserType = (t) => setCookie(userTypeKey, t);

    moCookie.getIsLoggedIn = () =>
    {
        const userType = moCookie.getUserType();

        return (userType == 3) || (userType == 5);
    }


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
